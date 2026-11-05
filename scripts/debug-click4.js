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
  await page.type('#login-email-input', 'pilot@example.com');
  await page.type('#login-password-input', 'pilot123');
  await page.click('#login-submit-btn');
  await new Promise(r => setTimeout(r, 3000));

  // Reload page like in test 3
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));

  // Try element.click() in page evaluate
  await page.evaluate(() => {
    document.querySelector('#user-profile-menu-btn').click();
  });
  await new Promise(r => setTimeout(r, 500));

  const isOpen = await page.evaluate(() => {
    return !!document.querySelector('#user-profile-menu-btn + div');
  });
  console.log('Is dropdown open with document.querySelector.click():', isOpen);

  // Now test Sign Out
  const signOutClicked = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('header button')).find(b => b.innerText.includes('Sign Out'));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Sign out clicked:', signOutClicked);

  await new Promise(r => setTimeout(r, 3000));
  console.log('Url after sign out:', page.url());

  const authButtons = await page.evaluate(() => {
    return {
      signIn: !!document.querySelector("header a[href='/login']"),
      getStarted: !!document.querySelector("header a[href='/register']"),
      profilePill: !!document.querySelector("#user-profile-menu-btn")
    };
  });
  console.log('Navbar after sign out:', authButtons);

  await browser.close();
})();
