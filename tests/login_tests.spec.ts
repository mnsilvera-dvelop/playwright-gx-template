import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';

test.describe('Pruebas de Login', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
    });

    test('Login exitoso con usuario admin', async ({ page }) => {
        await loginPage.loginAsAdmin();
        await expect(page).toHaveURL(/.*homeserviciosmedicos/);
    });

    test('Error con usuario incorrecto', async ({ page }) => {
        await loginPage.loginWithWrongUser();

        const errorMsg = page.locator('#TABLELOGINERROR');
        await expect(errorMsg).toContainText('El usuario o la contraseña no es correcta.');
    });

    test('Error con contraseña incorrecta', async ({ page }) => {
        await loginPage.loginWithWrongPassword();

        const errorMsg = page.locator('#TABLELOGINERROR');
        await expect(errorMsg).toContainText('El usuario o la contraseña no es correcta.');
    });
});