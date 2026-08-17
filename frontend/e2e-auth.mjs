import { chromium } from "playwright-core";

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE = "http://localhost:5175";
const ADMIN_BASE = "http://127.0.0.1:8001";

const results = [];
const errors = [];
function log(name, ok, detail = "") {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"} | ${name}${detail ? " | " + detail : ""}`);
}

const browser = await chromium.launch({ executablePath: EDGE, headless: true });

// ---------------- Regular user login flow ----------------
let ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
let page = await ctx.newPage();
page.on("pageerror", (err) => errors.push(`[${page.url()}] ${err.message}`));

await page.goto(BASE + "/login", { waitUntil: "domcontentloaded" });
await page.waitForSelector("#lg-username", { timeout: 15000 });
log("login page renders", await page.getByText("Hisobga kirish").isVisible());

await page.fill("#lg-username", "testuser1");
await page.fill("#lg-password", "testpass123");
await page.getByRole("button", { name: "Kirish" }).click();
await page.waitForURL((url) => url.pathname === "/", { timeout: 15000 });
log("regular user logged in -> redirected home", page.url().endsWith("/"));
log("navbar shows logged-in state", (await page.getByTitle("Chiqish").count()) > 0);

await page.goto(BASE + "/login", { waitUntil: "domcontentloaded" });
await page.waitForURL((url) => url.pathname === "/", { timeout: 15000 });
log("logged-in user redirected away from /login", page.url().endsWith("/"));

await page.getByTitle("Chiqish").click();
await page.waitForTimeout(700);
log("navbar shows Kirish after logout", (await page.getByRole("link", { name: "Kirish" }).count()) > 0);
await ctx.close();

// ---------------- Register flow ----------------
ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
page = await ctx.newPage();
page.on("pageerror", (err) => errors.push(`[${page.url()}] ${err.message}`));

await page.goto(BASE + "/register", { waitUntil: "domcontentloaded" });
await page.waitForSelector("#rg-username", { timeout: 15000 });
await page.fill("#rg-username", "pytest_" + Date.now().toString().slice(-6));
await page.fill("#rg-password", "secret123");
await page.fill("#rg-confirm", "secret123");
await page.getByRole("button", { name: "Ro'yxatdan o'tish" }).click();
await page.waitForURL((url) => url.pathname === "/", { timeout: 15000 });
log("register -> redirected home", page.url().endsWith("/"));
log("register toast shown", (await page.getByText("Ro'yxatdan o'tdingiz!").count()) > 0);
await ctx.close();

// ---------------- Admin login flow ----------------
ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
page = await ctx.newPage();
page.on("pageerror", (err) => errors.push(`[${page.url()}] ${err.message}`));

await page.goto(BASE + "/login", { waitUntil: "domcontentloaded" });
await page.waitForSelector("#lg-username", { timeout: 15000 });
await page.fill("#lg-username", "admin");
await page.fill("#lg-password", "admin12345");
await page.getByRole("button", { name: "Kirish" }).click();
await page.waitForURL((url) => url.pathname.startsWith("/admin/"), { timeout: 20000 });
log(
  "admin login redirects to Django admin",
  page.url().startsWith(ADMIN_BASE + "/admin/"),
  "url=" + page.url()
);
log("admin panel content loads", (await page.getByText("Xush kelibsiz, admin.").count()) > 0);
await ctx.close();

await browser.close();

console.log("---- page errors ----");
if (errors.length === 0) console.log("(none)");
else errors.forEach((e) => console.log(e));

const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);
