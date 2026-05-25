import { Page, Locator, expect } from '@playwright/test';
import { waitForGeneXus } from '../fixtures/gx-page';

export class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.getByPlaceholder('Número de Documento');
        this.passwordInput = page.locator('input[id*="USERPASSWORD"], input[name="vUSERPASSWORD"]');
        this.loginButton = page.getByRole('button', { name: 'Iniciar sesión' });
    }

    private async clearSession(): Promise<void> {
        await this.page.context().clearCookies();
        await this.page.evaluate(() => {
            sessionStorage.clear();
            Object.keys(localStorage)
                .filter(k => /session|token|gx/i.test(k))
                .forEach(k => localStorage.removeItem(k));
        }).catch(() => {});
    }

    async login(user: string, pass: string): Promise<void> {
        await this.clearSession();
        await this.page.goto(process.env.BASE_URL!, { waitUntil: 'domcontentloaded' });
        await waitForGeneXus(this.page);

        await expect(this.usernameInput).toBeVisible({ timeout: 15000 });
        await this.usernameInput.click({ clickCount: 3 });
        await this.usernameInput.fill(user);
        await this.usernameInput.press('Tab');
        await waitForGeneXus(this.page);

        await expect(this.passwordInput).toBeVisible({ timeout: 10000 });
        await this.passwordInput.click({ clickCount: 3 });
        await this.passwordInput.fill(pass);
        await this.passwordInput.press('Tab');
        await waitForGeneXus(this.page);

        await expect(this.loginButton).toBeEnabled({ timeout: 10000 });
        await this.loginButton.click({ delay: 150 });
        await waitForGeneXus(this.page);
    }

    async loginAsAdmin(): Promise<void> {
        await this.login(process.env.ADMIN_USER!, process.env.ADMIN_PASSWORD!);
    }
}