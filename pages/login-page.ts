import { Page, Locator } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        // Cambiar los selectores si son diferentes en tu aplicación GeneXus
        this.usernameInput = page.getByPlaceholder('Número de Documento');
        this.passwordInput = page.locator('input[name="vUSERPASSWORD"]');
        this.loginButton = page.getByRole('button', { name: 'Iniciar sesión' });
    }

    async login(user: string, pass: string) {
        await this.page.goto(process.env.BASE_URL!);
        await this.usernameInput.fill(user);
        await this.passwordInput.fill(pass);
        await this.loginButton.click();
    }

    async loginAsAdmin() {
        await this.login(process.env.ADMIN_USER!, process.env.ADMIN_PASSWORD!);
    }
}