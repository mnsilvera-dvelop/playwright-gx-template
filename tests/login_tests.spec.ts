import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';

test.describe('Autenticación - Sistema GeneXus', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
  });

  test('Login exitoso con usuario admin', async ({ page }) => {
    // 1. Navegar e ingresar credenciales válidas
    await loginPage.loginAsAdmin();
    
    // 2. Verificar redirección al dashboard/inicio (POST_LOGIN_URL)
    const postLoginRegex = new RegExp(`.*${process.env.POST_LOGIN_URL}`);
    await expect(page).toHaveURL(postLoginRegex);
  });

  test('Validación de error con credenciales incorrectas', async ({ page }) => {
    // 1. Navegar e ingresar credenciales incorrectas
    await loginPage.login(process.env.WRONG_USER!, 'wrong_pass');
    
    // Selector configurable para el control de errores de GeneXus
    const errorContainer = page.locator(process.env.LOGIN_ERROR_SELECTOR || '#TABLELOGINERROR');
    await expect(errorContainer).toBeVisible();
    await expect(errorContainer).toContainText(process.env.LOGIN_ERROR_TEXT!);
  });
});