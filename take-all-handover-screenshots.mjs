import puppeteer from 'puppeteer-core';
import path from 'node:path';
import fs from 'node:fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://localhost:5180';
const ARTIFACTS_DIR = process.env.USERPROFILE 
  ? path.join(process.env.USERPROFILE, '.gemini', 'antigravity', 'brain', '796e2400-706b-49a0-8424-2f8af0202094')
  : './test-artifacts';

if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

console.log('📸 Resuming Handover Screenshot Suite for All Users...');

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1600,980']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 980 });

  try {
    await page.goto(APP_URL, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    // Step 4: Product Detail Modal
    try {
      await page.evaluate(() => {
        // find product card image or title and click it
        const card = document.querySelector('div.cursor-pointer, [data-testid="product-card"], .group h3');
        if (card) card.click();
      });
      await new Promise(r => setTimeout(r, 1000));
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'handover-04-product-detail.png'), fullPage: false });
      console.log('✅ Captured handover-04-product-detail.png');
      await page.keyboard.press('Escape');
      await new Promise(r => setTimeout(r, 600));
    } catch (e) {
      console.error('Failed step 4:', e.message);
    }

    // Step 9 & 10: Auth Modal
    try {
      await page.evaluate(() => window.scrollTo(0, 0));
      await new Promise(r => setTimeout(r, 400));
      // Click sign in button
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('header button'));
        const signBtn = btns.find(b => b.textContent.includes('Sign In') || b.title.includes('Sign in') || b.title.includes('student account'));
        if (signBtn) signBtn.click();
      });
      await new Promise(r => setTimeout(r, 600));

      // Click "Sign In / Create Account"
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('div.absolute button'));
        const authBtn = btns.find(b => b.textContent.includes('Create Account') || b.textContent.includes('Sign In'));
        if (authBtn) authBtn.click();
      });
      await new Promise(r => setTimeout(r, 1000));
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'handover-10-auth-modal.png'), fullPage: false });
      console.log('✅ Captured handover-10-auth-modal.png');
      await page.keyboard.press('Escape');
      await new Promise(r => setTimeout(r, 600));
    } catch (e) {
      console.error('Failed step 10:', e.message);
    }

    // Step 11: Customer Logged In View
    try {
      await page.evaluate(() => {
        const customerData = {
          id: 'comrade_test_01',
          name: 'Tariro Moyo',
          email: 'tariro.moyo@student.ac.ke',
          phone: '+254 748 094 795',
          hostel: 'Hall 4 Room 204',
          campus: 'Main Campus',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
        };
        localStorage.setItem('midevas_customer_user', JSON.stringify(customerData));
        localStorage.setItem('midevas_auth_user', JSON.stringify({
          ...customerData,
          role: 'customer',
          title: 'Comrade Shopper'
        }));
        window.dispatchEvent(new CustomEvent('midevas-auth-updated', { detail: { ...customerData, role: 'customer' } }));
      });
      await new Promise(r => setTimeout(r, 800));
      // Open customer profile dropdown
      await page.evaluate(() => {
        const btn = document.querySelector('header button[title*="Tariro"], header button[title*="Comrade"]');
        if (btn) btn.click();
      });
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'handover-11-customer-logged-in.png'), fullPage: false });
      console.log('✅ Captured handover-11-customer-logged-in.png');
    } catch (e) {
      console.error('Failed step 11:', e.message);
    }

    // Step 12: Seller Workspace View
    try {
      await page.evaluate(() => {
        const seller = {
          role: 'seller',
          name: 'Campus Reseller Staff',
          email: 'seller@midevas.co.ke',
          title: 'Campus Reseller & Fulfillment',
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
          hostel: 'Storefront Desk',
          phone: '+254 748 094 795',
          passcode: 'seller123',
          key: 'seller'
        };
        localStorage.setItem('midevas_auth_user', JSON.stringify(seller));
        sessionStorage.setItem('midevas_admin_auth', 'true');
        window.location.hash = '#admin';
      });
      await page.reload({ waitUntil: 'networkidle0' });
      await new Promise(r => setTimeout(r, 1200));
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'handover-12-seller-workspace.png'), fullPage: false });
      console.log('✅ Captured handover-12-seller-workspace.png');
    } catch (e) {
      console.error('Failed step 12:', e.message);
    }

    // Step 13: Admin Sign-In Screen
    try {
      await page.evaluate(() => {
        sessionStorage.removeItem('midevas_admin_auth');
        localStorage.removeItem('midevas_auth_user');
        window.location.hash = '#admin';
      });
      await page.reload({ waitUntil: 'networkidle0' });
      await new Promise(r => setTimeout(r, 1200));
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'handover-13-admin-signin.png'), fullPage: false });
      console.log('✅ Captured handover-13-admin-signin.png');
    } catch (e) {
      console.error('Failed step 13:', e.message);
    }

    // Step 14: Admin Master Dashboard Overview
    try {
      await page.evaluate(() => {
        const admin = {
          role: 'admin',
          name: 'Mona Lisa Mideva',
          email: 'monalisamideva@gmail.com',
          title: 'Store Owner & System Lead',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
          hostel: 'Admin HQ',
          phone: '+254 748 094 795',
          passcode: 'mideva2026',
          key: 'admin'
        };
        localStorage.setItem('midevas_auth_user', JSON.stringify(admin));
        sessionStorage.setItem('midevas_admin_auth', 'true');
        window.location.hash = '#admin';
      });
      await page.reload({ waitUntil: 'networkidle0' });
      await new Promise(r => setTimeout(r, 1500));
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'handover-14-admin-dashboard.png'), fullPage: false });
      console.log('✅ Captured handover-14-admin-dashboard.png');
    } catch (e) {
      console.error('Failed step 14:', e.message);
    }

    // Step 15: Admin Live Stock Tab
    try {
      await page.evaluate(() => {
        const tabs = Array.from(document.querySelectorAll('button'));
        const stockTab = tabs.find(t => t.textContent.includes('Live Stock') || t.textContent.includes('Stock & Pricing'));
        if (stockTab) stockTab.click();
      });
      await new Promise(r => setTimeout(r, 1000));
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'handover-15-admin-livestock.png'), fullPage: false });
      console.log('✅ Captured handover-15-admin-livestock.png');
    } catch (e) {
      console.error('Failed step 15:', e.message);
    }

    // Step 16: Admin Orders Tab
    try {
      await page.evaluate(() => {
        const tabs = Array.from(document.querySelectorAll('button'));
        const ordersTab = tabs.find(t => t.textContent.includes('Orders') || t.textContent.includes('Quotes'));
        if (ordersTab) ordersTab.click();
      });
      await new Promise(r => setTimeout(r, 1000));
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'handover-16-admin-orders.png'), fullPage: false });
      console.log('✅ Captured handover-16-admin-orders.png');
    } catch (e) {
      console.error('Failed step 16:', e.message);
    }

    // Step 17: Admin CMS Tab
    try {
      await page.evaluate(() => {
        const tabs = Array.from(document.querySelectorAll('button'));
        const cmsTab = tabs.find(t => t.textContent.includes('CMS') || t.textContent.includes('Page Content'));
        if (cmsTab) cmsTab.click();
      });
      await new Promise(r => setTimeout(r, 1000));
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'handover-17-admin-cms.png'), fullPage: false });
      console.log('✅ Captured handover-17-admin-cms.png');
    } catch (e) {
      console.error('Failed step 17:', e.message);
    }

    // Reset clean guest state
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
      window.location.hash = '#store';
    });
    await page.reload({ waitUntil: 'networkidle0' });

    console.log('\n🎉 COMPLETED ALL SCREENSHOT STEPS!');
  } catch (err) {
    console.error('Unexpected error:', err);
  } finally {
    await browser.close();
  }
}

run();
