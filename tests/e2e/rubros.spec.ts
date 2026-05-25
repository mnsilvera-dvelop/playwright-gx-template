import { test, expect, type Page } from '@playwright/test';

const BASE = process.env.BASE_URL!.replace(/\/com\.[^/]+$/, '');
const RUBROS_URL = `${BASE}/com.bigua.serviciosmedicos.rubroww`;

// ── Helper ────────────────────────────────────────────────────────
function getRubrosTable(page: Page) {
  return page.getByRole('table').nth(1);
}

// ── Suite ─────────────────────────────────────────────────────────
test.describe('Rubros', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    // Sin login — la sesión viene del seed via storageState
    await page.goto(RUBROS_URL, { waitUntil: 'domcontentloaded' });
    await expect(getRubrosTable(page)).toBeVisible({ timeout: 40000 });
  });

  test('Visualizar Listado de Rubros Existentes', async ({ page }) => {
    const table = getRubrosTable(page);
    await expect(table).toBeVisible();

    const columnas = ['Id', 'Nombre', 'Importe', 'Ultima Actualización', 'Activo'];
    for (const col of columnas) {
      await expect(page.getByRole('columnheader', { name: col })).toBeVisible();
    }

    const firstRow = table.locator('tbody tr').first();
    await expect(firstRow).toBeVisible();
    const nombre = await firstRow.locator('td').nth(2).textContent();
    expect(nombre?.trim()).toBeTruthy();
  });

  test('Buscar Rubro por Nombre', async ({ page }) => {
    const searchBox = page.getByRole('textbox', { name: 'Filter Full Text' });
    await expect(searchBox).toBeVisible();

    await searchBox.fill('CUOTA');
    await searchBox.press('Enter');

    await expect(page.getByText('CUOTA SOCIAL', { exact: true }).first()).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('CUOTA SOCIAL DEUDA').first()).toBeVisible();
    await expect(page.getByRole('row').filter({ hasText: 'CARNE SOCIAL' })).not.toBeVisible();
  });

  test('Limpiar Búsqueda de Rubros', async ({ page }) => {
    const searchBox = page.getByRole('textbox', { name: 'Filter Full Text' }).first();

    await searchBox.fill('test');
    await searchBox.fill('');

    await expect(searchBox).toHaveValue('');
  });
});