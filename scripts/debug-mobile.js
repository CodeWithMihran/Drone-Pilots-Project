const puppeteer = require('puppeteer-core');
(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });

  await page.goto('http://localhost:3000');
  await new Promise(r => setTimeout(r, 1000));

  // Hamburger button
  const hamburger = await page.$("header button[aria-label='Toggle navigation']");
  console.log('Hamburger found:', !!hamburger);
  await page.evaluate(() => document.querySelector("header button[aria-label='Toggle navigation']").click());
  await new Promise(r => setTimeout(r, 600));

  const mobileDetails = await page.evaluate(() => {
    const drawer = document.querySelector('header div.md\\:hidden.border-b');
    const getStarted = drawer?.querySelector("a[href='/register']");
    const signIn = drawer?.querySelector("a[href='/login']");
    if (!drawer || !getStarted || !signIn) return null;

    const gsStyle = window.getComputedStyle(getStarted);
    const siStyle = window.getComputedStyle(signIn);
    const gsRect = getStarted.getBoundingClientRect();
    const siRect = signIn.getBoundingClientRect();
    const drawerRect = drawer.getBoundingClientRect();

    return {
      drawerWidth: drawerRect.width,
      getStarted: {
        text: getStarted.innerText,
        width: gsRect.width,
        paddingTop: gsStyle.paddingTop,
        paddingBottom: gsStyle.paddingBottom,
        paddingLeft: gsStyle.paddingLeft,
        paddingRight: gsStyle.paddingRight,
        backgroundColor: gsStyle.backgroundColor,
        borderRadius: gsStyle.borderRadius,
        color: gsStyle.color,
        fontWeight: gsStyle.fontWeight,
        textAlign: gsStyle.textAlign
      },
      signIn: {
        text: signIn.innerText,
        width: siRect.width,
        paddingTop: siStyle.paddingTop,
        paddingBottom: siStyle.paddingBottom,
        paddingLeft: siStyle.paddingLeft,
        paddingRight: siStyle.paddingRight,
        backgroundColor: siStyle.backgroundColor,
        borderRadius: siStyle.borderRadius,
        color: siStyle.color,
        fontWeight: siStyle.fontWeight,
        textAlign: siStyle.textAlign
      }
    };
  });
  console.log('Mobile Drawer Details:', mobileDetails);

  await browser.close();
})();
