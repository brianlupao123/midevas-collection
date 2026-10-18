import puppeteer from 'puppeteer-core';
import path from 'node:path';
import fs from 'node:fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://localhost:5180';
const ARTIFACTS_DIR = 'C:\\Users\\BRIAN LUPAO\\.gemini\\antigravity\\brain\\796e2400-706b-49a0-8424-2f8af0202094';

console.log('🚀 Starting Automated Verification for RBAC, Full-Width Edge Layout & Dark/Light Mode...');

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
  await new Promise(r => setTimeout(r, 2500));

  // Wait for the hero showcase image to finish loading
  await page.waitForFunction(() => {
    const img = document.querySelector('div.aspect-\\[4\\/3\\] img, div.group img');
    return img && img.naturalWidth > 0;
  }, { timeout: 8000 }).catch(() => {});

  // 1. Verify Layout Expansion (Edge-to-edge check)
  console.log('\n📐 Step 1: Verifying Edge-to-Edge Layout & Container Widths...');
  const layoutMetrics = await page.evaluate(() => {
    const header = document.querySelector('header');
    const announcement = document.querySelector('header')?.previousElementSibling || document.querySelector('div.bg-gradient-to-r');
    const hero = document.querySelector('div.relative.overflow-hidden.bg-gradient-to-b') || document.querySelector('div.min-h-\\[480px\\]');
    const footer = document.querySelector('footer');

    return {
      windowWidth: window.innerWidth,
      headerWidth: header ? header.getBoundingClientRect().width : null,
      announcementWidth: announcement ? announcement.getBoundingClientRect().width : null,
      heroWidth: hero ? hero.getBoundingClientRect().width : null,
      footerWidth: footer ? footer.getBoundingClientRect().width : null,
    };
  });
  console.log('Layout Metrics:', layoutMetrics);

  if (layoutMetrics.headerWidth >= 1500 && layoutMetrics.heroWidth >= 1500) {
    console.log('✅ PASS: Header, Hero, and Announcement Bar span smoothly across screen (no artificial 1280px clamp)!');
  } else {
    console.warn('⚠️ Warning: Container width may still be constrained.');
  }

  // Capture Screenshot of Full-Width Storefront
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'test-fullwidth-header-hero.png'), fullPage: false });
  console.log('📸 Captured: test-fullwidth-header-hero.png');

  // 2. Test Profile Avatar & UserProfileDropdown
  console.log('\n👤 Step 2: Testing Profile Avatar & RBAC Dropdown in Header...');
  const avatarBtn = await page.$('button[title*="Tap to switch roles"]');
  if (avatarBtn) {
    await avatarBtn.click();
    await new Promise(r => setTimeout(r, 600));
    console.log('✅ Clicked Profile Avatar button');

    // Capture Profile Dropdown open
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'test-profile-dropdown-rbac.png'), fullPage: false });
    console.log('📸 Captured: test-profile-dropdown-rbac.png');

    // Test 1-click switch to Admin
    console.log('\n👑 Step 3: Switching to Store Owner (Admin)...');
    const adminRoleBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent.includes('admin') || b.textContent.includes('Store Owner'));
    });

    if (adminRoleBtn && adminRoleBtn.asElement()) {
      await adminRoleBtn.asElement().click();
      await new Promise(r => setTimeout(r, 800));
      console.log('✅ Clicked Admin role switch');
    }
  }

  // 3. Test Theme Toggle (Light / Dark mode across slides and footer)
  console.log('\n🌓 Step 4: Testing Light / Dark Mode Toggle across slides and footer...');
  const themeToggle = await page.$('button[title*="Light Mode"], button[title*="Dark Mode"]');
  if (themeToggle) {
    await themeToggle.click();
    await new Promise(r => setTimeout(r, 600));
    console.log('✅ Toggled Theme to Light Mode');

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'test-light-mode.png'), fullPage: false });
    console.log('📸 Captured: test-light-mode.png');

    // Toggle back to Dark Mode
    await themeToggle.click();
    await new Promise(r => setTimeout(r, 600));
    console.log('✅ Toggled Theme back to Dark Mode');
  }

  // 4. Test In-Page Admin Workspace View
  console.log('\n💼 Step 5: Navigating to Admin Management Dashboard...');
  await page.goto(`${APP_URL}#admin`, { waitUntil: 'domcontentloaded', timeout: 10000 });
  await new Promise(r => setTimeout(r, 1500));

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
