const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();

  // Test Company Login
  console.log('Testing Company Login...');
  await page.goto('http://localhost:3000/login');
  await page.waitForSelector('#login-email-input');
  await page.type('#login-email-input', 'company@example.com');
  await page.type('#login-password-input', 'company123');
  await page.click('#login-submit-btn');
  
  // Wait for URL to become /company/dashboard
  await page.waitForFunction(() => window.location.pathname.includes('/company/dashboard'), { timeout: 10000 });
  console.log('Company dashboard URL:', page.url());

  // Click profile dropdown
  await page.waitForSelector('#user-profile-menu-btn');
  await page.evaluate(() => document.querySelector('#user-profile-menu-btn').click());
  await new Promise(r => setTimeout(r, 500));

  const companyDropdown = await page.evaluate(() => {
    const dropdown = document.querySelector('#user-profile-menu-btn + div');
    if (!dropdown) return null;
    const links = Array.from(dropdown.querySelectorAll('a, button')).map(el => ({
      text: el.innerText.trim(),
      href: el.getAttribute('href') || null
    }));
    return { text: dropdown.innerText, links };
  });
  console.log('Company Dropdown:', companyDropdown);

  // Sign out
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('header button')).find(b => b.innerText.includes('Sign Out'));
    btn.click();
  });
  await page.waitForFunction(() => window.location.pathname === '/', { timeout: 10000 });
  console.log('Signed out from Company, URL:', page.url());

  // Test Admin Login
  console.log('Testing Admin Login...');
  await page.goto('http://localhost:3000/login');
  await page.waitForSelector('#login-email-input');
  await page.type('#login-email-input', 'admin@example.com');
  await page.type('#login-password-input', 'admin123');
  await page.click('#login-submit-btn');

  // Wait for URL to become /admin/dashboard
  await page.waitForFunction(() => window.location.pathname.includes('/admin/dashboard'), { timeout: 10000 });
  console.log('Admin dashboard URL:', page.url());

  // Click profile dropdown
  await page.waitForSelector('#user-profile-menu-btn');
  await page.evaluate(() => document.querySelector('#user-profile-menu-btn').click());
  await new Promise(r => setTimeout(r, 500));

  const adminDropdown = await page.evaluate(() => {
    const dropdown = document.querySelector('#user-profile-menu-btn + div');
    if (!dropdown) return null;
    const links = Array.from(dropdown.querySelectorAll('a, button')).map(el => ({
      text: el.innerText.trim(),
      href: el.getAttribute('href') || null
    }));
    return { text: dropdown.innerText, links };
  });
  console.log('Admin Dropdown:', adminDropdown);

  await browser.close();
})();
