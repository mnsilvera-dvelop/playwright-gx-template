import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login-page';
import path from 'path';

export const AUTH_FILE = path.join(__dirname, '../../.auth/session.json');

test('seed', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.loginAsAdmin();

  await expect(page).toHaveURL(/.*aks\.dvelopsoftware\.net.*serviciosmedicos/);
  await expect(page.locator('body')).toBeVisible({ timeout: 10000 });

  // ── Guardar sesión para reutilizar en otros tests ──
  await page.context().storageState({ path: AUTH_FILE });
});