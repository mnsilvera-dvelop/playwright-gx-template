import { Page, Locator } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.getByRole('textbox', { name: 'Usuario Documento Nro Str' });
        this.passwordInput = page.getByRole('textbox', { name: 'User Password' });
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

    async loginWithWrongUser() {
        await this.login(process.env.WRONG_USER!, process.env.ADMIN_PASSWORD!);
    }

    async loginWithWrongPassword() {
        await this.login(process.env.ADMIN_USER!, process.env.WRONG_PASSWORD!);
    }
}