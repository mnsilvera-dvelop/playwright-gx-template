import { test, expect, type Page } from '@playwright/test';

const BASE = process.env.BASE_URL!.replace(/\/com\.[^/]+$/, '');
const CATEGORIAS_URL = `${BASE}/com.bigua.backoffice.categoriasocioww`;

// ── Helper ────────────────────────────────────────────────────────
function getCategoriasTable(page: Page) {
  return page.getByRole('table').nth(1);
}

// ── Suite ─────────────────────────────────────────────────────────
test.describe('Categorías', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    // Sin login — la sesión viene del seed via storageState
    await page.goto(CATEGORIAS_URL, { waitUntil: 'domcontentloaded' });
    await expect(getCategoriasTable(page)).toBeVisible({ timeout: 40000 });
  });

  test('Visualizar Listado de Categorías Existentes', async ({ page }) => {
    await expect(page.locator('body')).toContainText(/Categor\u00eda|categor\u00eda|CATEGOR\u00cdA|Id|Nombre/i);
  });

  test('Buscar Categoría por Nombre', async ({ page }) => {
    const searchBox = page.getByRole('textbox', { name: 'Filter Full Text' });
    await expect(searchBox).toBeVisible();

    await searchBox.fill('LICENCIA');
    await searchBox.press('Enter');

    await expect(page.getByText('LICENCIA con costo', { exact: true }).first()).toBeVisible({ timeout: 15000 });
   // Verificar que AUXILIAR no aparece — toHaveCount(0) funciona con múltiples elementos
  await expect(
    getCategoriasTable(page).getByRole('row').filter({ hasText: 'AUXILIAR' })
  ).toHaveCount(0);
  });

  test('Limpiar Búsqueda de Categorías', async ({ page }) => {
    const searchBox = page.getByRole('textbox', { name: 'Filter Full Text' }).first();

    await searchBox.fill('test');
    await searchBox.fill('');

    await expect(searchBox).toHaveValue('');
  });
});