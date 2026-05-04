import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';

// SEED TEST
// Este test es el punto de arranque para los Playwright Agents (Planner).
// Su objetivo es autenticar al usuario y dejar la aplicación en un estado "listo"
// para que el agente explore los módulos (ej. Gestión de Lesiones, Reservas, etc.).
test('seed', async ({ page }) => {
  // 1. Instanciar el Page Object del Login
  const loginPage = new LoginPage(page);

  // 2. Autenticarse usando las credenciales del entorno (process.env.ADMIN_USER)
  // El método internamente ya hace el page.goto(process.env.BASE_URL)
  await loginPage.loginAsAdmin();

  // 3. Esperar a que la navegación post-login se complete.
  // Esto es CRÍTICO para el Planner: le asegura que la pantalla principal 
  // terminó de cargar antes de que empiece a inspeccionar el DOM.
   const postLoginRegex = new RegExp(`.*${process.env.POST_LOGIN_URL}`);
    await expect(page).toHaveURL(postLoginRegex);
});