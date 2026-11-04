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

  const result = await page.evaluate(() => {
    const btn = document.querySelector('#user-profile-menu-btn');
    if (!btn) return 'NO BTN';
    
    // Check react props
    const key = Object.keys(btn).find(k => k.startsWith('__reactProps') || k.startsWith('__reactEventHandlers'));
    const props = key ? btn[key] : null;
    
    return {
      hasReactProps: !!key,
      keyName: key,
      onClickType: typeof props?.onClick,
      ariaExpanded: btn.getAttribute('aria-expanded')
    };
  });
  console.log('Result before click:', result);

  // Call the react onClick directly in evaluate
  const directClickResult = await page.evaluate(() => {
    const btn = document.querySelector('#user-profile-menu-btn');
    const key = Object.keys(btn).find(k => k.startsWith('__reactProps') || k.startsWith('__reactEventHandlers'));
    if (btn[key]?.onClick) {
      btn[key].onClick({ preventDefault: () => {}, stopPropagation: () => {} });
      return 'CALLED ONCLICK';
    }
    return 'NO ONCLICK FOUND';
  });
  console.log('Direct click result:', directClickResult);

  await new Promise(r => setTimeout(r, 1000));

  const afterHtml = await page.evaluate(() => {
    return document.querySelector('#user-profile-menu-btn')?.parentElement?.outerHTML;
  });
  console.log('After HTML:\n', afterHtml);

  await browser.close();
})();
