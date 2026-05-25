import { test as base, Page } from '@playwright/test';

async function waitForGeneXus(page: Page) {
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);
}

export const test = base.extend<{ gxPage: Page }>({
    gxPage: async ({ page }, use) => {
        await waitForGeneXus(page);
        await use(page);
    }
});

export { expect } from '@playwright/test';
export { waitForGeneXus };