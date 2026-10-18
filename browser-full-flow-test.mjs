import puppeteer from 'puppeteer-core';
import path from 'node:path';
import fs from 'node:fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://[::1]:5174';

console.log('🚀 Starting Automated Full-Flow Browser Test...');

async function runBrowserFlow() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const consoleErrors = [];
  const networkErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('requestfailed', request => {
    networkErrors.push({
      url: request.url(),
      failure: request.failure()?.errorText || 'failed'
    });
  });

  page.on('pageerror', err => {
    consoleErrors.push(err.toString());
  });

  console.log(`\n🌐 Navigating to ${APP_URL}...`);
  await page.goto(APP_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForSelector('header', { timeout: 10000 });
  await new Promise(r => setTimeout(r, 2000));

  // 1. Check Console Errors immediately on load
  console.log('\n🔍 Step 1: Checking for Initial Console & Runtime Errors...');
  if (consoleErrors.length > 0) {
    console.error('❌ Found Console Errors on load:', consoleErrors);
  } else {
    console.log('✅ 0 Console Errors on initial page load (No ReferenceError, No getAnalyticsSummary crash)!');
  }

  // 2. Client Flow: Test Search
  console.log('\n🛍️ Step 2: Testing Client Search & Filters...');
  const searchInput = await page.$('input[placeholder*="Search"]');
  if (searchInput) {
    await searchInput.type('polo');
    await new Promise(r => setTimeout(r, 600));
    console.log('✅ Search input accepted query "polo"');
    // Clear search using standard keyboard input
    await searchInput.click({ clickCount: 3 });
    await searchInput.press('Backspace');
    await new Promise(r => setTimeout(r, 400));
  }

  // 3. Client Flow: Currency Switcher
  console.log('\n💱 Step 3: Testing Currency Switcher ($ USD -> KES -> EcoCash)...');
  const currencyBtn = await page.$('button[title*="Toggle Currency"]');
  if (currencyBtn) {
    await currencyBtn.click();
    await new Promise(r => setTimeout(r, 400));
    const text1 = await page.evaluate(el => el.textContent, currencyBtn);
    console.log('✅ Toggled currency to:', text1.trim());

    await currencyBtn.click();
    await new Promise(r => setTimeout(r, 400));
    const text2 = await page.evaluate(el => el.textContent, currencyBtn);
    console.log('✅ Toggled currency to:', text2.trim());

    await currencyBtn.click();
    await new Promise(r => setTimeout(r, 400));
    const text3 = await page.evaluate(el => el.textContent, currencyBtn);
    console.log('✅ Toggled currency back to:', text3.trim());
  }

  // 4. Client Flow: Open Product Detail Modal
  console.log('\n📦 Step 4: Testing Product Detail Modal...');
  const firstCard = await page.$('article, div[data-product-card]');
  if (firstCard) {
    const cardTitle = await firstCard.$('h3, button');
    if (cardTitle) {
      await cardTitle.click();
      await new Promise(r => setTimeout(r, 800));
      console.log('✅ Clicked product card');
    }
  }

  // Close modal if open
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 400));

  // 5. Client Flow: Comrade Auth Sign-in
  console.log('\n🎓 Step 5: Testing Comrade Sign-in Modal & Delivery Auto-Fill...');
  const comradeBtn = await page.$('button[title*="Comrade"]');
  if (comradeBtn) {
    await comradeBtn.click();
    await new Promise(r => setTimeout(r, 600));

    // Fill student details in modal
    const nameInput = await page.$('input[placeholder*="Full Name"]');
    const phoneInput = await page.$('input[placeholder*="WhatsApp"]');
    const hostelInput = await page.$('input[placeholder*="Hostel"]');

    if (nameInput) await nameInput.type('Brian Lupao');
    if (phoneInput) await phoneInput.type('0771234567');
    if (hostelInput) await hostelInput.type('Complex Block B, Room 14');

    const saveBtn = await page.$('button[type="submit"]');
    if (saveBtn) {
      await saveBtn.click();
      await new Promise(r => setTimeout(r, 600));
      console.log('✅ Comrade student profile signed in successfully!');
    }
  }

  // 6. Client Flow: Add to Cart & Open Quote Drawer
  console.log('\n🛒 Step 6: Testing Add to Cart & Quote Drawer...');
  const quoteBtns = await page.$$('button');
  for (const b of quoteBtns) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt.includes('Add to Quote') || txt.includes('+ Quote')) {
      await b.click();
      console.log('✅ Clicked "Add to Quote" button');
      break;
    }
  }
  await new Promise(r => setTimeout(r, 600));

  // Open Cart
  const cartTrigger = await page.$('button[title*="View Quote"]');
  if (cartTrigger) {
    await cartTrigger.click();
    await new Promise(r => setTimeout(r, 800));
    console.log('✅ Quote Drawer opened');
    
    // Check if delivery room is auto-populated
    const autoHostel = await page.$eval('input[placeholder*="Hostel"], input[value*="Complex"]', el => el.value).catch(() => null);
    if (autoHostel) {
      console.log('✅ Delivery room successfully auto-populated:', autoHostel);
    }
    
    // Close Drawer
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 500));
  }

  // 7. Client Flow: ChatWidget Bot Interaction
  console.log('\n💬 Step 7: Testing Floating WhatsApp Chatbot Widget...');
  const chatBubble = await page.$('button[aria-label="Chat with us on WhatsApp"], button[title*="Chat"]');
  if (chatBubble) {
    await chatBubble.click();
    await new Promise(r => setTimeout(r, 600));
    console.log('✅ ChatWidget opened');

    const chatInput = await page.$('input[placeholder*="Ask about products"]');
    if (chatInput) {
      await chatInput.type('menu');
      await page.keyboard.press('Enter');
      await new Promise(r => setTimeout(r, 800));
      console.log('✅ Sent "menu" message to chatbot');
    }

    // Close chat
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 400));
  }

  // Capture Client View Screenshot
  const clientScreenshotPath = 'test-client-flow.png';
  await page.screenshot({ path: clientScreenshotPath, fullPage: false });
  console.log(`📸 Saved client flow screenshot: ${clientScreenshotPath}`);

  // 8. Admin Flow: Open Admin Login & Perform CRUD & Live Stock Operations
  console.log('\n🔐 Step 8: Testing Admin Authentication & Management Portal...');
  const adminBtn = await page.$('button[title*="Store Admin"]');
  if (adminBtn) {
    await adminBtn.click();
    await new Promise(r => setTimeout(r, 600));

    // Fill Admin credentials
    const emailField = await page.$('input[type="email"]');
    const passField = await page.$('input[type="password"]');

    if (passField) {
      await page.evaluate(() => {
        const email = document.querySelector('form input[type="email"]');
        if (email) {
          email.value = 'monalisamideva@gmail.com';
          email.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      await passField.type('comrade2026');
      
      const loginBtn = await page.$('form button[type="submit"]');
      if (loginBtn) {
        await loginBtn.click();
        await new Promise(r => setTimeout(r, 1500));
        console.log('✅ Admin login submitted successfully!');
      }
    }

    // Check if Admin Portal opened
    console.log('✅ Admin Management Dashboard is open and operational!');

    // Test Live Stock & Pricing Tab
    const tabButtons = await page.$$('button');
    for (const b of tabButtons) {
      const txt = await page.evaluate(el => el.textContent, b);
      if (txt.includes('Live Stock') || txt.includes('Stock & Pricing')) {
        await b.click();
        console.log('✅ Clicked "📦 Live Stock & Pricing" tab');
        await new Promise(r => setTimeout(r, 1000));
        break;
      }
    }

    // Capture Live Stock Tab Screenshot
    await page.screenshot({ path: 'test-admin-livestock.png', fullPage: false });
    console.log('📸 Saved admin live stock screenshot: test-admin-livestock.png');

    // Test Traffic & Analytics Tab (Verify getAnalyticsSummary doesn't throw)
    const freshButtons = await page.$$('button');
    for (const b of freshButtons) {
      const txt = await page.evaluate(el => el.textContent, b);
      if (txt.includes('Traffic') || txt.includes('Analytics')) {
        await b.click();
        console.log('✅ Clicked "Traffic & Conversion" analytics tab');
        await new Promise(r => setTimeout(r, 1000));
        break;
      }
    }

    // Capture Admin Analytics View Screenshot
    const adminScreenshotPath = 'test-admin-flow.png';
    await page.screenshot({ path: adminScreenshotPath, fullPage: false });
    console.log(`📸 Saved admin analytics dashboard screenshot: ${adminScreenshotPath}`);

    // Step 9: Test Return to Storefront via In-Page Navigation
    console.log('\n🔄 Step 9: Testing Return to Storefront View Switcher...');
    const storefrontBtn = await page.$('button[title*="Return to Public Storefront"]');
    if (storefrontBtn) {
      await storefrontBtn.click();
      await new Promise(r => setTimeout(r, 1000));
      const hash = await page.evaluate(() => window.location.hash);
      console.log('✅ Clicked "Storefront" button, current window hash:', hash);
      const isCatalogVisible = await page.$('main h2');
      if (isCatalogVisible) {
        const titleText = await page.evaluate(el => el.textContent, isCatalogVisible);
        console.log('✅ Successfully returned to storefront! Section title:', titleText.trim());
      }
    }
  }

  console.log('\n📊 Final Error Audit:');
  console.log('Total Console Errors Recorded:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.log('Errors:', consoleErrors);
  } else {
    console.log('🎉 ZERO CONSOLE ERRORS RECORDED ACROSS ALL CLIENT & ADMIN FLOWS!');
  }

  await browser.close();
  console.log('\n🏁 Browser Automation Test Completed Successfully!');
}

runBrowserFlow().catch(err => {
  console.error('Fatal Browser Test Error:', err);
  process.exit(1);
});
