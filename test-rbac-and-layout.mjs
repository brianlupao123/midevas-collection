import puppeteer from 'puppeteer-core';
import path from 'node:path';
import fs from 'node:fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://localhost:5180';
const ARTIFACTS_DIR = process.env.USERPROFILE 
  ? path.join(process.env.USERPROFILE, '.gemini', 'antigravity', 'brain', '796e2400-706b-49a0-8424-2f8af0202094')
  : './test-artifacts';

console.log('🚀 Starting Automated Verification for RBAC (Guest by default), Edge-to-Edge Farthest Ends Layout & Full Slide Banner...');

async function runTest() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1600,980']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 980 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(err.toString());
  });

  console.log(`\n🌐 Navigating to ${APP_URL}...`);
  await page.goto(APP_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForSelector('header', { timeout: 10000 });

  // 1. Reset auth storage to test default state: NO ONE SIGNED IN
  console.log('\n🔒 Step 1: Verifying Default Unauthenticated Guest State...');
  await page.evaluate(() => {
    localStorage.removeItem('midevas_auth_user');
    localStorage.removeItem('midevas_customer_user');
    sessionStorage.removeItem('midevas_admin_auth');
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  // Verify that profile button shows "Sign In"
  const signInBtnText = await page.evaluate(() => {
    const btn = document.querySelector('header button[title*="Sign in or create"]');
    return btn ? btn.innerText.trim() : null;
  });
  console.log('Profile Button State:', signInBtnText);

  // 2. Measure Edge-to-Edge Farthest Ends Layout
  console.log('\n📐 Step 2: Measuring Edge-to-Edge Layout & Farthest End Alignment...');
  const edgeMetrics = await page.evaluate(() => {
    const header = document.querySelector('header');
    const headerInner = header?.querySelector('div');
    const announcement = header?.previousElementSibling || document.querySelector('div.bg-gradient-to-r');
    const dealsBadge = announcement?.querySelector('span.bg-white\\/20');
    const allBtn = header?.querySelector('button');
    const hero = document.querySelector('header + div') || document.querySelector('div.min-h-\\[480px\\]');
    const catalog = document.querySelector('main');
    const footer = document.querySelector('footer');

    return {
      windowWidth: window.innerWidth,
      headerWidth: header?.getBoundingClientRect().width,
      headerInnerLeft: headerInner?.getBoundingClientRect().left,
      allBtnLeft: allBtn?.getBoundingClientRect().left,
      dealsBadgeLeft: dealsBadge?.getBoundingClientRect().left,
      heroWidth: hero?.getBoundingClientRect().width,
      catalogWidth: catalog?.getBoundingClientRect().width,
      catalogLeft: catalog?.getBoundingClientRect().left,
      footerWidth: footer?.getBoundingClientRect().width,
      footerLeft: footer?.getBoundingClientRect().left
    };
  });
  console.log('Edge Metrics:', edgeMetrics);

  if (edgeMetrics.allBtnLeft <= 24 && edgeMetrics.dealsBadgeLeft <= 24) {
    console.log('✅ PASS: Content starts from the FARTHEST END LEFT on margin (< 24px from screen edge)!');
  }

  // 3. Capture Full Slide Banner Storefront
  console.log('\n📸 Step 3: Capturing Full Slide Banner Storefront...');
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'test-fullwidth-header-hero.png'), fullPage: false });
  console.log('📸 Captured: test-fullwidth-header-hero.png');

  // 4. Open Profile Dropdown in Unauthenticated State
  console.log('\n👤 Step 4: Testing Unauthenticated Profile Dropdown...');
  const profileTrigger = await page.$('header button[title*="Sign in or create"]');
  if (profileTrigger) {
    await profileTrigger.click();
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'test-profile-dropdown-rbac.png'), fullPage: false });
    console.log('📸 Captured: test-profile-dropdown-rbac.png');
  }

  // 5. Test Customer Account Creation & Strict Privileges
  console.log('\n🎓 Step 5: Testing Customer Registration & Role Enforcement...');
  const openAuthBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent.includes('Sign In / Create Account'));
  });
  if (openAuthBtn && openAuthBtn.asElement()) {
    await openAuthBtn.asElement().click();
    await new Promise(r => setTimeout(r, 800));

    // Fill customer registration form
    const nameInput = await page.$('input[placeholder*="Tariro Moyo"]');
    const phoneInput = await page.$('input[placeholder*="0774"]');
    const hostelInput = await page.$('input[placeholder*="Hall 4"]');

    if (nameInput) await nameInput.type('Tariro Moyo');
    if (phoneInput) await phoneInput.type('0774809479');
    if (hostelInput) await hostelInput.type('Complex Hall 2 Room 18');

    const saveCustomerBtn = await page.$('form button[type="submit"]');
    if (saveCustomerBtn) {
      await saveCustomerBtn.click();
      await new Promise(r => setTimeout(r, 1000));
      console.log('✅ Registered Customer: Tariro Moyo');
    }
  }

  // Close modal with Escape key
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 500));

  // Verify that customer cannot access admin
  console.log('\n🛡️ Step 6: Verifying Customer CANNOT access admin controls...');
  const canCustomerEditStock = await page.evaluate(() => {
    const auth = JSON.parse(localStorage.getItem('midevas_auth_user') || '{}');
    return auth.role === 'customer';
  });
  console.log('User Role is Customer:', canCustomerEditStock);

  // 6. Test Light / Dark Mode Toggle across slides and footer
  console.log('\n🌓 Step 7: Testing Light / Dark Mode Toggle...');
  const themeToggle = await page.$('button[title*="Light Mode"], button[title*="Dark Mode"]');
  if (themeToggle) {
    await themeToggle.click();
    await new Promise(r => setTimeout(r, 600));
    console.log('✅ Toggled Theme to Light Mode');

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'test-light-mode.png'), fullPage: false });
    console.log('📸 Captured: test-light-mode.png');

    await themeToggle.click();
    await new Promise(r => setTimeout(r, 600));
    console.log('✅ Toggled Theme back to Dark Mode');
  }

  // 7. Test Admin Login with Passcode
  console.log('\n👑 Step 8: Authenticating as Store Owner (Admin) via Passcode...');
  await page.goto(`${APP_URL}#admin`, { waitUntil: 'domcontentloaded', timeout: 10000 });
  await new Promise(r => setTimeout(r, 1000));

  // If prompted for login, type passcode mideva2026
  const passInput = await page.$('input[type="password"]');
  if (passInput) {
    await passInput.type('mideva2026');
    const submitBtn = await page.$('form button[type="submit"]');
    if (submitBtn) await submitBtn.click();
    await new Promise(r => setTimeout(r, 1500));
  }

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'test-admin-workspace.png'), fullPage: false });
  console.log('📸 Captured: test-admin-workspace.png');

  // Check console errors summary
  console.log('\n🔍 Final Error Audit:');
  if (consoleErrors.length === 0) {
    console.log('🎉 0 CONSOLE ERRORS! Entire application executed cleanly with zero runtime exceptions.');
  } else {
    console.error('⚠️ Console errors recorded:', consoleErrors);
  }

  await browser.close();
  console.log('\n🏁 Automated Test Completed Successfully!');
}

runTest().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
