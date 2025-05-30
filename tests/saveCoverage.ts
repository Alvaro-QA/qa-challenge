import fs from 'fs';
import { Page } from '@playwright/test';

export async function saveCoverage(page: Page) {
  const coverage = await page.evaluate(() => (window as any).__coverage__);
  if (coverage) {
    fs.mkdirSync('./.nyc_output', { recursive: true });
    fs.writeFileSync('./.nyc_output/out.json', JSON.stringify(coverage));
  }
}
