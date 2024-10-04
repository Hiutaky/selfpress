import { cwd } from "process";
import puppeteer from "puppeteer";

export const takeScreenshot = async (url: string, id: string) => {
  try {
    const browser = await puppeteer.launch({
      headless: true, // Runs Chrome in headless mode
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const relativePath = `/assets/screenshots/${id}.png`;

    const absolutePath = `${cwd()}/public${relativePath}`;

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    await page.screenshot({ path: absolutePath });

    console.log(`Screenshot saved at: ${absolutePath}`);
    await browser.close();
    return relativePath;
  } catch (e) {
    console.error(e);
  }
};
