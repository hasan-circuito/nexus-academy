const puppeteer = require('puppeteer');

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));
  
  console.log("Navigating to step 5...");
  await page.goto('http://localhost:3000/mission/mission-002/step/4', { waitUntil: 'networkidle0', timeout: 30000 });
  
  console.log("Page loaded. Checking for Next button...");
  
  // Try to find the Next button
  const nextBtn = await page.$('footer button:last-child');
  if (nextBtn) {
    const text = await page.evaluate(el => el.textContent, nextBtn);
    console.log("Next button text:", text);
    
    // Check if the page is responsive
    const isResponsive = await page.evaluate(() => {
      return new Promise(resolve => {
        setTimeout(() => resolve(true), 100);
      });
    });
    
    console.log("Page is responsive:", isResponsive);
  } else {
    console.log("Next button not found!");
  }
  
  await browser.close();
  console.log("Done.");
})().catch(err => {
  console.error("Puppeteer Script Error:", err);
  process.exit(1);
});
