const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  // Launch a headless browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport size to match the banner dimensions
  await page.setViewport({
    width: 1200,
    height: 630,
    deviceScaleFactor: 1,
  });
  
  // Load the HTML file
  const htmlPath = path.join(__dirname, 'banner.html');
  await page.goto(`file://${htmlPath}`);
  
  // Wait for any animations or resources to load
  await page.waitForTimeout(1000);
  
  // Create the images directory if it doesn't exist
  const imagesDir = path.join(__dirname, '..', 'images');
  const fs = require('fs');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  
  // Take a screenshot and save it as PNG
  await page.screenshot({
    path: path.join(imagesDir, 'banner.png'),
    fullPage: true
  });
  
  console.log('Banner image created successfully!');
  console.log(`Saved to: ${path.join(imagesDir, 'banner.png')}`);
  
  // Also save a copy for the marketing website
  const websiteImagesDir = path.join(__dirname, '..', '..', 'Website', 'images');
  if (!fs.existsSync(websiteImagesDir)) {
    fs.mkdirSync(websiteImagesDir, { recursive: true });
  }
  
  await page.screenshot({
    path: path.join(websiteImagesDir, 'baseball-stats-dashboard.jpg'),
    fullPage: true,
    type: 'jpeg',
    quality: 90
  });
  
  console.log('Marketing website image created successfully!');
  console.log(`Saved to: ${path.join(websiteImagesDir, 'baseball-stats-dashboard.jpg')}`);
  
  await browser.close();
})();
