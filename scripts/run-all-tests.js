const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const ARTIFACT_DIR = "C:\\Users\\Samidha\\.gemini\\antigravity\\brain\\5212a90d-2b9f-4935-bd2c-16f4030306b1\\screenshots";
const PUBLIC_DIR = path.resolve(__dirname, "../public/test-screenshots");

if (!fs.existsSync(ARTIFACT_DIR)) fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });

async function saveScreenshot(page, filename, clip = null) {
  const artifactPath = path.join(ARTIFACT_DIR, filename);
  const publicPath = path.join(PUBLIC_DIR, filename);
  const options = { path: artifactPath };
  if (clip) options.clip = clip;
  await page.screenshot(options);
  fs.copyFileSync(artifactPath, publicPath);
  console.log(`📸 Screenshot saved: ${filename}`);
  return { artifactPath, publicPath };
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function loginAs(page, email, password, expectedPath) {
  await page.goto("http://localhost:3000/login", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#login-email-input");
  
  // Use demo button if available for instant react state setting, or type directly
  const roleName = email.includes("pilot") ? "Pilot" : email.includes("company") ? "Company" : "Admin";
  
  // Try clicking demo button
  const usedDemo = await page.evaluate((role) => {
    const demoToggle = Array.from(document.querySelectorAll("button")).find(b => b.innerText.includes("Use a demo account"));
    if (demoToggle) demoToggle.click();
    return !!demoToggle;
  }, roleName);

  if (usedDemo) {
    await sleep(300);
    await page.evaluate((role) => {
      const btn = Array.from(document.querySelectorAll("button")).find(b => b.innerText === role);
      if (btn) btn.click();
    }, roleName);
    await sleep(300);
  } else {
    await page.click("#login-email-input", { clickCount: 3 });
    await page.type("#login-email-input", email, { delay: 5 });
    await page.click("#login-password-input", { clickCount: 3 });
    await page.type("#login-password-input", password, { delay: 5 });
  }

  await page.click("#login-submit-btn");

  for (let i = 0; i < 12; i++) {
    await sleep(1000);
    if (page.url().includes(expectedPath)) break;
  }
}

async function signOut(page) {
  await page.waitForSelector("#user-profile-menu-btn", { timeout: 10000 });
  await page.evaluate(() => document.querySelector("#user-profile-menu-btn").click());
  await sleep(600);
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("header button"));
    const signOutBtn = buttons.find(b => b.innerText.includes("Sign Out"));
    if (signOutBtn) signOutBtn.click();
  });
  for (let i = 0; i < 8; i++) {
    await sleep(1000);
    if (page.url() === "http://localhost:3000/" || page.url() === "http://localhost:3000") break;
  }
}

async function runTestSuite() {
  console.log("==================================================");
  console.log("🚀 STARTING AEROLINK 9-TEST COMPREHENSIVE SUITE");
  console.log("==================================================\n");

  const results = {
    test1: { id: "TEST 1", name: "Logged-out Header & 'Get started' Button Inspection", status: "PENDING", checks: [] },
    test2: { id: "TEST 2", name: "Pilot Login & Dashboard Navbar Verification", status: "PENDING", checks: [] },
    test3: { id: "TEST 3", name: "Page Refresh Authentication & Navbar Stability", status: "PENDING", checks: [] },
    test4: { id: "TEST 4", name: "Pilot Profile Dropdown Verification", status: "PENDING", checks: [] },
    test5: { id: "TEST 5", name: "Sign Out & Redirection Verification", status: "PENDING", checks: [] },
    test6: { id: "TEST 6", name: "Company Login & Role-Specific Dropdown Links", status: "PENDING", checks: [] },
    test7: { id: "TEST 7", name: "Admin Login & Role-Specific Dropdown Links", status: "PENDING", checks: [] },
    test8: { id: "TEST 8", name: "Mobile Viewport (375x667) Header Display", status: "PENDING", checks: [] },
    test9: { id: "TEST 9", name: "Mobile Drawer Full-Width Buttons & Styling", status: "PENDING", checks: [] },
  };

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--window-size=1280,800"
    ],
    defaultViewport: { width: 1280, height: 800 }
  });

  try {
    const page = await browser.newPage();

    // -------------------------------------------------------------
    // TEST 1
    // -------------------------------------------------------------
    console.log("--------------------------------------------------");
    console.log("TEST 1: Logged-out Landing Page & Header Verification");
    console.log("--------------------------------------------------");
    
    // Clear cookies/storage
    const client = await page.target().createCDPSession();
    await client.send("Network.clearBrowserCookies");
    await client.send("Network.clearBrowserCache");

    await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("header");
    await sleep(1000);

    const t1SignInBtn = await page.$("header a[href='/login']");
    const t1GetStartedBtn = await page.$("header a[href='/register']");

    const t1SignInVisible = t1SignInBtn !== null && (await t1SignInBtn.isIntersectingViewport());
    const t1GetStartedVisible = t1GetStartedBtn !== null && (await t1GetStartedBtn.isIntersectingViewport());

    results.test1.checks.push({ label: "'Sign in' button visible", pass: t1SignInVisible });
    results.test1.checks.push({ label: "'Get started' button visible", pass: t1GetStartedVisible });

    // Inspect "Get started" button styles
    const gsInfo = await page.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        paddingLeft: computed.paddingLeft,
        paddingRight: computed.paddingRight,
        paddingTop: computed.paddingTop,
        paddingBottom: computed.paddingBottom,
        backgroundColor: computed.backgroundColor,
        borderRadius: computed.borderRadius,
        textAlign: computed.textAlign,
        display: computed.display,
        justifyContent: computed.justifyContent,
        alignItems: computed.alignItems,
        color: computed.color,
        fontWeight: computed.fontWeight,
        left: rect.left,
        right: rect.right
      };
    }, t1GetStartedBtn);

    const siRect = await page.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return { left: rect.left, right: rect.right };
    }, t1SignInBtn);

    const spacingFromSignIn = Math.round(gsInfo.left - siRect.right);

    const hasGenerousPadding = parseInt(gsInfo.paddingLeft) >= 24 && parseInt(gsInfo.paddingRight) >= 24;
    const isYellowBg = gsInfo.backgroundColor.includes("250, 191, 40");
    const isPillShape = parseFloat(gsInfo.borderRadius) >= 20;
    const isTextCentered = gsInfo.justifyContent === "center" && gsInfo.alignItems === "center";
    const hasComfortableSpacing = spacingFromSignIn >= 12;

    results.test1.checks.push({ label: `Generous horizontal padding (L: ${gsInfo.paddingLeft}, R: ${gsInfo.paddingRight} >= 24px/px-6)`, pass: hasGenerousPadding });
    results.test1.checks.push({ label: `Yellow/golden background (#fabf28 / rgb(250, 191, 40)): ${gsInfo.backgroundColor}`, pass: isYellowBg });
    results.test1.checks.push({ label: `Centered text in button (display: ${gsInfo.display}, justify: ${gsInfo.justifyContent})`, pass: isTextCentered });
    results.test1.checks.push({ label: `Rounded pill shape (border-radius: ${gsInfo.borderRadius})`, pass: isPillShape });
    results.test1.checks.push({ label: `Comfortable spacing from 'Sign in' (${spacingFromSignIn}px)`, pass: hasComfortableSpacing });

    const headerBox = await (await page.$("header")).boundingBox();
    await saveScreenshot(page, "test1_header_logged_out.png", {
      x: 0,
      y: 0,
      width: 1280,
      height: Math.ceil(headerBox.height + 20)
    });
    await saveScreenshot(page, "test1_full_landing_page.png");

    results.test1.status = results.test1.checks.every(c => c.pass) ? "PASSED" : "FAILED";
    console.log(`Result: ${results.test1.status}\n`);

    // -------------------------------------------------------------
    // TEST 2
    // -------------------------------------------------------------
    console.log("--------------------------------------------------");
    console.log("TEST 2: Pilot Login & Dashboard Navbar Verification");
    console.log("--------------------------------------------------");

    await loginAs(page, "pilot@example.com", "pilot123", "/pilot/dashboard");
    await page.waitForSelector("header");
    await page.waitForSelector("#user-profile-menu-btn", { timeout: 10000 });
    await sleep(1000);

    const pilotUrl = page.url();
    const navigatedPilotDash = pilotUrl.includes("/pilot/dashboard");
    results.test2.checks.push({ label: `Navigated to http://localhost:3000/pilot/dashboard (Actual: ${pilotUrl})`, pass: navigatedPilotDash });

    const t2SignIn = await page.$("header a[href='/login']");
    const t2GetStarted = await page.$("header a[href='/register']");
    const authButtonsGone = t2SignIn === null && t2GetStarted === null;
    results.test2.checks.push({ label: "'Sign in' and 'Get started' are GONE from navbar", pass: authButtonsGone });

    const bellExists = (await page.$("header button svg.lucide-bell")) !== null;
    results.test2.checks.push({ label: "Notification Bell is visible in navbar", pass: bellExists });

    const profilePillBtn = await page.$("#user-profile-menu-btn");
    const profilePillVisible = profilePillBtn !== null && (await profilePillBtn.isIntersectingViewport());
    results.test2.checks.push({ label: "Pilot User Profile / Avatar pill is visible", pass: profilePillVisible });

    let pillNameText = "";
    let hasAvatarCircle = false;
    let hasDropdownArrow = false;
    if (profilePillBtn) {
      const pillDetails = await page.evaluate(el => {
        return {
          text: el.innerText.trim(),
          hasAvatar: !!(el.querySelector("img") || el.querySelector(".rounded-full")),
          hasArrow: !!el.querySelector("svg.lucide-chevron-down")
        };
      }, profilePillBtn);
      pillNameText = pillDetails.text;
      hasAvatarCircle = pillDetails.hasAvatar;
      hasDropdownArrow = pillDetails.hasArrow;
    }

    const nameDisplayed = pillNameText.includes("Alex Rivera (Verified Pilot)");
    results.test2.checks.push({ label: `Displays Pilot's name ("Alex Rivera (Verified Pilot)"): "${pillNameText.replace(/\n/g, ' ')}"`, pass: nameDisplayed });
    results.test2.checks.push({ label: "Displays Avatar initial/image", pass: hasAvatarCircle });
    results.test2.checks.push({ label: "Displays dropdown chevron arrow", pass: hasDropdownArrow });

    const headerBoxPilot = await (await page.$("header")).boundingBox();
    await saveScreenshot(page, "test2_pilot_dashboard_header.png", {
      x: 0,
      y: 0,
      width: 1280,
      height: Math.ceil(headerBoxPilot.height + 40)
    });
    await saveScreenshot(page, "test2_pilot_dashboard_full.png");

    results.test2.status = results.test2.checks.every(c => c.pass) ? "PASSED" : "FAILED";
    console.log(`Result: ${results.test2.status}\n`);

    // -------------------------------------------------------------
    // TEST 3
    // -------------------------------------------------------------
    console.log("--------------------------------------------------");
    console.log("TEST 3: Refresh at http://localhost:3000/pilot/dashboard");
    console.log("--------------------------------------------------");

    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForSelector("header");
    
    // Check for flash of auth buttons immediately
    const immediateFlashCheck = await page.evaluate(() => {
      const si = document.querySelector("header a[href='/login']");
      const gs = document.querySelector("header a[href='/register']");
      return !si && !gs;
    });

    // Wait for session to resolve (profile button to appear)
    for (let i = 0; i < 10; i++) {
      await sleep(1000);
      const btn = await page.$("#user-profile-menu-btn");
      if (btn) break;
    }

    const refreshedUrl = page.url();
    const urlMatches = refreshedUrl.includes("/pilot/dashboard");
    results.test3.checks.push({ label: `URL preserved after refresh (${refreshedUrl})`, pass: urlMatches });

    const refreshedProfileBtn = await page.$("#user-profile-menu-btn");
    const refreshedProfileVisible = refreshedProfileBtn !== null && (await refreshedProfileBtn.isIntersectingViewport());
    results.test3.checks.push({ label: "Authentication preserved: Profile pill visible", pass: refreshedProfileVisible });

    const refreshedSignIn = await page.$("header a[href='/login']");
    const refreshedGetStarted = await page.$("header a[href='/register']");
    const refreshedNoAuthButtons = refreshedSignIn === null && refreshedGetStarted === null;
    results.test3.checks.push({ label: "No flash/presence of 'Sign in' or 'Get started'", pass: refreshedNoAuthButtons && immediateFlashCheck });

    await saveScreenshot(page, "test3_pilot_dashboard_after_refresh.png");

    results.test3.status = results.test3.checks.every(c => c.pass) ? "PASSED" : "FAILED";
    console.log(`Result: ${results.test3.status}\n`);

    // -------------------------------------------------------------
    // TEST 4
    // -------------------------------------------------------------
    console.log("--------------------------------------------------");
    console.log("TEST 4: Open Pilot Profile Dropdown & Inspect Items");
    console.log("--------------------------------------------------");

    // Open dropdown via evaluate click
    await page.evaluate(() => document.querySelector("#user-profile-menu-btn").click());
    await sleep(600);

    const pilotDropdownData = await page.evaluate(() => {
      const dropdown = document.querySelector("#user-profile-menu-btn + div");
      if (!dropdown) return null;
      const text = dropdown.innerText;
      const links = Array.from(dropdown.querySelectorAll("a, button")).map(el => ({
        tag: el.tagName,
        text: el.innerText.trim(),
        href: el.getAttribute("href") || null
      }));
      return { text, links };
    });

    const dName = pilotDropdownData && pilotDropdownData.text.includes("Alex Rivera (Verified Pilot)");
    const dEmail = pilotDropdownData && pilotDropdownData.text.includes("pilot@example.com");
    const dRole = pilotDropdownData && pilotDropdownData.text.includes("Commercial Pilot");
    const dDashboard = pilotDropdownData && pilotDropdownData.links.some(l => l.href === "/pilot/dashboard" && l.text.includes("Dashboard"));
    const dProfile = pilotDropdownData && pilotDropdownData.links.some(l => l.href === "/pilot/profile" && l.text.includes("Pilot Profile"));
    const dCert = pilotDropdownData && pilotDropdownData.links.some(l => l.href === "/pilot/certification" && l.text.includes("FAA Certifications"));
    const dSettings = pilotDropdownData && pilotDropdownData.links.some(l => l.href === "/pilot/settings" && l.text.includes("Settings"));
    const dSignOut = pilotDropdownData && pilotDropdownData.links.some(l => l.text.includes("Sign Out"));

    results.test4.checks.push({ label: `User's Name ("Alex Rivera (Verified Pilot)")`, pass: dName });
    results.test4.checks.push({ label: `Email ("pilot@example.com")`, pass: dEmail });
    results.test4.checks.push({ label: `Role badge ("Commercial Pilot")`, pass: dRole });
    results.test4.checks.push({ label: "Dashboard link (/pilot/dashboard)", pass: dDashboard });
    results.test4.checks.push({ label: "Pilot Profile link (/pilot/profile)", pass: dProfile });
    results.test4.checks.push({ label: "FAA Certifications link (/pilot/certification)", pass: dCert });
    results.test4.checks.push({ label: "Settings link (/pilot/settings)", pass: dSettings });
    results.test4.checks.push({ label: "Sign Out button present", pass: dSignOut });

    await saveScreenshot(page, "test4_pilot_dropdown_open.png");

    results.test4.status = results.test4.checks.every(c => c.pass) ? "PASSED" : "FAILED";
    console.log(`Result: ${results.test4.status}\n`);

    // -------------------------------------------------------------
    // TEST 5
    // -------------------------------------------------------------
    console.log("--------------------------------------------------");
    console.log("TEST 5: Click 'Sign Out' & Verify Redirect");
    console.log("--------------------------------------------------");

    await signOut(page);
    await sleep(2000);

    const postSignOutUrl = page.url();
    const redirectedHome = postSignOutUrl === "http://localhost:3000/" || postSignOutUrl === "http://localhost:3000";
    results.test5.checks.push({ label: `Redirects to http://localhost:3000/ (Actual: ${postSignOutUrl})`, pass: redirectedHome });

    const postSignIn = await page.$("header a[href='/login']");
    const postGetStarted = await page.$("header a[href='/register']");
    const postProfilePill = await page.$("#user-profile-menu-btn");

    const authButtonsRestored = postSignIn !== null && postGetStarted !== null;
    const profilePillRemoved = postProfilePill === null;

    results.test5.checks.push({ label: "'Sign in' and 'Get started' displayed again in navbar", pass: authButtonsRestored });
    results.test5.checks.push({ label: "User profile pill is gone", pass: profilePillRemoved });

    await saveScreenshot(page, "test5_after_sign_out.png");

    results.test5.status = results.test5.checks.every(c => c.pass) ? "PASSED" : "FAILED";
    console.log(`Result: ${results.test5.status}\n`);

    // -------------------------------------------------------------
    // TEST 6
    // -------------------------------------------------------------
    console.log("--------------------------------------------------");
    console.log("TEST 6: Company Login & Dropdown Links Verification");
    console.log("--------------------------------------------------");

    await loginAs(page, "company@example.com", "company123", "/company/dashboard");
    await page.waitForSelector("header");
    await page.waitForSelector("#user-profile-menu-btn", { timeout: 10000 });
    await sleep(1000);

    const companyUrl = page.url();
    const navigatedCompanyDash = companyUrl.includes("/company/dashboard");
    results.test6.checks.push({ label: `Navigates to http://localhost:3000/company/dashboard (Actual: ${companyUrl})`, pass: navigatedCompanyDash });

    const headerBoxComp = await (await page.$("header")).boundingBox();
    await saveScreenshot(page, "test6_company_dashboard_header.png", {
      x: 0,
      y: 0,
      width: 1280,
      height: Math.ceil(headerBoxComp.height + 40)
    });

    // Open company dropdown
    await page.evaluate(() => document.querySelector("#user-profile-menu-btn").click());
    await sleep(500);

    const companyDropdownData = await page.evaluate(() => {
      const dropdown = document.querySelector("#user-profile-menu-btn + div");
      if (!dropdown) return null;
      const text = dropdown.innerText;
      const links = Array.from(dropdown.querySelectorAll("a, button")).map(el => ({
        tag: el.tagName,
        text: el.innerText.trim(),
        href: el.getAttribute("href") || null
      }));
      return { text, links };
    });

    const cDash = companyDropdownData && companyDropdownData.links.some(l => l.href === "/company/dashboard" && l.text.includes("Dashboard"));
    const cProf = companyDropdownData && companyDropdownData.links.some(l => l.href === "/company/profile" && l.text.includes("Company Profile"));
    const cJobs = companyDropdownData && companyDropdownData.links.some(l => l.href === "/company/jobs" && l.text.includes("My Jobs"));
    const cSett = companyDropdownData && companyDropdownData.links.some(l => l.href === "/company/settings" && l.text.includes("Settings"));
    const cSignOut = companyDropdownData && companyDropdownData.links.some(l => l.text.includes("Sign Out"));

    results.test6.checks.push({ label: "Dashboard link (/company/dashboard)", pass: cDash });
    results.test6.checks.push({ label: "Company Profile link (/company/profile)", pass: cProf });
    results.test6.checks.push({ label: "My Jobs link (/company/jobs)", pass: cJobs });
    results.test6.checks.push({ label: "Settings link (/company/settings)", pass: cSett });
    results.test6.checks.push({ label: "Sign Out button present", pass: cSignOut });

    await saveScreenshot(page, "test6_company_dropdown_open.png");

    // Sign out from Company
    await signOut(page);
    await sleep(2000);

    results.test6.status = results.test6.checks.every(c => c.pass) ? "PASSED" : "FAILED";
    console.log(`Result: ${results.test6.status}\n`);

    // -------------------------------------------------------------
    // TEST 7
    // -------------------------------------------------------------
    console.log("--------------------------------------------------");
    console.log("TEST 7: Admin Login & Dropdown Links Verification");
    console.log("--------------------------------------------------");

    await loginAs(page, "admin@example.com", "admin123", "/admin/dashboard");
    await page.waitForSelector("header");
    await page.waitForSelector("#user-profile-menu-btn", { timeout: 10000 });
    await sleep(1000);

    const adminUrl = page.url();
    const navigatedAdminDash = adminUrl.includes("/admin/dashboard");
    results.test7.checks.push({ label: `Navigates to http://localhost:3000/admin/dashboard (Actual: ${adminUrl})`, pass: navigatedAdminDash });

    const headerBoxAdmin = await (await page.$("header")).boundingBox();
    await saveScreenshot(page, "test7_admin_dashboard_header.png", {
      x: 0,
      y: 0,
      width: 1280,
      height: Math.ceil(headerBoxAdmin.height + 40)
    });

    // Open admin dropdown
    await page.evaluate(() => document.querySelector("#user-profile-menu-btn").click());
    await sleep(500);

    const adminDropdownData = await page.evaluate(() => {
      const dropdown = document.querySelector("#user-profile-menu-btn + div");
      if (!dropdown) return null;
      const text = dropdown.innerText;
      const links = Array.from(dropdown.querySelectorAll("a, button")).map(el => ({
        tag: el.tagName,
        text: el.innerText.trim(),
        href: el.getAttribute("href") || null
      }));
      return { text, links };
    });

    const aDash = adminDropdownData && adminDropdownData.links.some(l => l.href === "/admin/dashboard" && l.text.includes("Admin Dashboard"));
    const aUsers = adminDropdownData && adminDropdownData.links.some(l => l.href === "/admin/users" && l.text.includes("User Management"));
    const aSett = adminDropdownData && adminDropdownData.links.some(l => l.href === "/admin/settings" && l.text.includes("Settings"));
    const aSignOut = adminDropdownData && adminDropdownData.links.some(l => l.text.includes("Sign Out"));

    results.test7.checks.push({ label: "Admin Dashboard link (/admin/dashboard)", pass: aDash });
    results.test7.checks.push({ label: "User Management link (/admin/users)", pass: aUsers });
    results.test7.checks.push({ label: "Settings link (/admin/settings)", pass: aSett });
    results.test7.checks.push({ label: "Sign Out button present", pass: aSignOut });

    await saveScreenshot(page, "test7_admin_dropdown_open.png");

    // Sign out from Admin
    await signOut(page);
    await sleep(2000);

    results.test7.status = results.test7.checks.every(c => c.pass) ? "PASSED" : "FAILED";
    console.log(`Result: ${results.test7.status}\n`);

    // -------------------------------------------------------------
    // TEST 8 & 9
    // -------------------------------------------------------------
    console.log("--------------------------------------------------");
    console.log("TEST 8: Mobile Viewport (375x667) Header Display");
    console.log("--------------------------------------------------");

    // Set mobile viewport 375x667
    await page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });
    await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("header");
    await sleep(800);

    const logoVisible = (await page.$("header a[href='/']")) !== null;
    const themeToggleMobile = (await page.$("header div.md\\:hidden button[aria-label*='theme' i], header div.md\\:hidden button")) !== null;
    const hamburgerBtn = await page.$("header button[aria-label='Toggle navigation']");
    const hamburgerVisible = hamburgerBtn !== null && (await hamburgerBtn.isIntersectingViewport());

    results.test8.checks.push({ label: "AeroLink Brand Logo visible on mobile header", pass: logoVisible });
    results.test8.checks.push({ label: "Mobile actions (Theme toggle) present", pass: themeToggleMobile });
    results.test8.checks.push({ label: "Mobile hamburger menu button visible", pass: hamburgerVisible });

    await saveScreenshot(page, "test8_mobile_header_closed.png");
    results.test8.status = results.test8.checks.every(c => c.pass) ? "PASSED" : "FAILED";
    console.log(`Result: ${results.test8.status}\n`);

    console.log("--------------------------------------------------");
    console.log("TEST 9: Mobile Menu Drawer & Full-Width Buttons Verification");
    console.log("--------------------------------------------------");

    // Open mobile menu drawer
    await page.evaluate(() => document.querySelector("header button[aria-label='Toggle navigation']").click());
    await sleep(600);

    const mobileButtons = await page.evaluate(() => {
      const drawer = document.querySelector("header div.md\\:hidden.border-b");
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
          text: getStarted.innerText.trim(),
          width: Math.round(gsRect.width),
          containerWidth: Math.round(drawerRect.width - 32), // 16px left + 16px right padding
          isFullWidth: Math.abs(gsRect.width - (drawerRect.width - 32)) <= 2,
          paddingLeft: gsStyle.paddingLeft,
          paddingRight: gsStyle.paddingRight,
          paddingTop: gsStyle.paddingTop,
          paddingBottom: gsStyle.paddingBottom,
          backgroundColor: gsStyle.backgroundColor,
          borderRadius: gsStyle.borderRadius,
          textAlign: gsStyle.textAlign,
          fontWeight: gsStyle.fontWeight
        },
        signIn: {
          text: signIn.innerText.trim(),
          width: Math.round(siRect.width),
          containerWidth: Math.round(drawerRect.width - 32),
          isFullWidth: Math.abs(siRect.width - (drawerRect.width - 32)) <= 2,
          paddingLeft: siStyle.paddingLeft,
          paddingRight: siStyle.paddingRight,
          paddingTop: siStyle.paddingTop,
          paddingBottom: siStyle.paddingBottom,
          backgroundColor: siStyle.backgroundColor,
          borderRadius: siStyle.borderRadius,
          textAlign: siStyle.textAlign,
          fontWeight: siStyle.fontWeight
        }
      };
    });

    const gsFullWidth = mobileButtons && mobileButtons.getStarted.isFullWidth;
    const gsYellowBg = mobileButtons && mobileButtons.getStarted.backgroundColor.includes("250, 191, 40");
    const gsPillShape = mobileButtons && parseFloat(mobileButtons.getStarted.borderRadius) >= 20;
    const gsGenerousPad = mobileButtons && parseInt(mobileButtons.getStarted.paddingLeft) >= 24;

    const siFullWidth = mobileButtons && mobileButtons.signIn.isFullWidth;
    const siPillShape = mobileButtons && parseFloat(mobileButtons.signIn.borderRadius) >= 20;
    const siGenerousPad = mobileButtons && parseInt(mobileButtons.signIn.paddingLeft) >= 24;

    results.test9.checks.push({ label: `Mobile Drawer 'Get started' is full-width (${mobileButtons?.getStarted.width}px / ${mobileButtons?.getStarted.containerWidth}px)`, pass: gsFullWidth });
    results.test9.checks.push({ label: `Mobile Drawer 'Get started' has yellow bg (#fabf28 / ${mobileButtons?.getStarted.backgroundColor})`, pass: gsYellowBg });
    results.test9.checks.push({ label: `Mobile Drawer 'Get started' has rounded pill shape (${mobileButtons?.getStarted.borderRadius})`, pass: gsPillShape });
    results.test9.checks.push({ label: `Mobile Drawer 'Get started' has generous padding (${mobileButtons?.getStarted.paddingLeft} L/R, ${mobileButtons?.getStarted.paddingTop} T/B)`, pass: gsGenerousPad });
    results.test9.checks.push({ label: `Mobile Drawer 'Sign in' is full-width (${mobileButtons?.signIn.width}px / ${mobileButtons?.signIn.containerWidth}px)`, pass: siFullWidth });
    results.test9.checks.push({ label: `Mobile Drawer 'Sign in' has rounded pill shape (${mobileButtons?.signIn.borderRadius})`, pass: siPillShape });
    results.test9.checks.push({ label: `Mobile Drawer 'Sign in' has generous padding (${mobileButtons?.signIn.paddingLeft} L/R, ${mobileButtons?.signIn.paddingTop} T/B)`, pass: siGenerousPad });

    await saveScreenshot(page, "test9_mobile_drawer_open.png");
    results.test9.status = results.test9.checks.every(c => c.pass) ? "PASSED" : "FAILED";
    console.log(`Result: ${results.test9.status}\n`);

  } catch (err) {
    console.error("❌ Exception during test suite run:", err);
  } finally {
    await browser.close();
  }

  console.log("==================================================");
  console.log("📊 FINAL AUTOMATION TEST RESULTS SUMMARY");
  console.log("==================================================");
  let totalPass = 0;
  let totalTests = 0;
  for (const [key, t] of Object.entries(results)) {
    totalTests++;
    if (t.status === "PASSED") totalPass++;
    console.log(`\n[${t.status}] ${t.id}: ${t.name}`);
    t.checks.forEach(c => console.log(`   ${c.pass ? '✅' : '❌'} ${c.label}`));
  }

  console.log(`\n==================================================`);
  console.log(`OVERALL SCORE: ${totalPass} / ${totalTests} TESTS PASSED`);
  console.log(`==================================================\n`);

  fs.writeFileSync(path.join(ARTIFACT_DIR, "final-test-report.json"), JSON.stringify(results, null, 2));
}

runTestSuite();
