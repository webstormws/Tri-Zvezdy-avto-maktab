import { chromium } from "playwright-core";

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE = "http://localhost:5175";

const widths = [320, 375, 390, 430, 768, 1024, 1280, 1440];
const routes = ["/", "/courses", "/branches", "/lessons", "/results", "/news", "/about", "/contact", "/courses/b-toifa", "/news/yangi-c-toifa-guruhi-ochildi"];

const browser = await chromium.launch({ executablePath: EDGE, headless: true });
let failed = 0;
let total = 0;

for (const w of widths) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  for (const route of routes) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    total++;
    if (overflow) {
      failed++;
      console.log(`OVERFLOW | ${w}px | ${route} | scrollWidth=${sw}px`);
    }
  }
  await page.close();
}

console.log(`\n${total - failed}/${total} viewport+route combos have no horizontal overflow`);
process.exit(failed ? 1 : 0);

