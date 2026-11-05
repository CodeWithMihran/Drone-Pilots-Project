const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();

  await page.goto('http://localhost:3000/login');
  await page.waitForSelector('#login-email-input');
  await page.type('#login-email-input', 'company@example.com');
  await page.type('#login-password-input', 'company123');
  await page.click('#login-submit-btn');

  await new Promise(r => setTimeout(r, 4000));
  console.log('Current URL after 4s:', page.url());

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

  await browser.close();
})();
