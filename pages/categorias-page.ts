import { Page, Locator, expect } from '@playwright/test';

export class CategoriasPage {
    readonly page: Page;
    readonly categoriasModuleCard: Locator;
    readonly tableHeader: Locator;
    readonly dataTable: Locator;
    readonly columnId: Locator;
    readonly columnNombre: Locator;
    readonly columnColonia: Locator;
    readonly columnUltimaActualizacion: Locator;
    readonly columnActivo: Locator;

    constructor(page: Page) {
        this.page = page;
        this.categoriasModuleCard = page.locator('#HOMEMODULESBIG_TITLE_0005');
        
        this.tableHeader = page.locator('#TABLERIGHTHEADER');
        this.dataTable = page.locator('table').filter({
            has: page.locator('th', { hasText: 'Id' })
        });

        this.columnId = page.getByRole('columnheader', { name: 'Id' });
        this.columnNombre = page.getByRole('columnheader', { name: 'Nombre' });
        this.columnColonia = page.getByRole('columnheader', { name: 'Es Colonia' });
        this.columnUltimaActualizacion = page.getByRole('columnheader', { name: /Ultima Actualización/i });
        this.columnActivo = page.getByRole('columnheader', { name: 'Activo' });
    }

    async navegarAModulo() {
        await this.categoriasModuleCard.click();
        // GeneXus usa polling continuo, domcontentloaded es más seguro que networkidle
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);
        await expect(this.page).toHaveURL(/.*categorias/);
    }

    async verificarEstructuraGrilla() {
        await expect(this.tableHeader).toBeVisible({ timeout: 15000 });
        await expect(this.dataTable).toBeVisible({ timeout: 15000 });
        await expect(this.columnId).toBeVisible({ timeout: 10000 });
        await expect(this.columnNombre).toBeVisible({ timeout: 10000 });
        await expect(this.columnColonia).toBeVisible({ timeout: 10000 });
        await expect(this.columnUltimaActualizacion).toBeVisible({ timeout: 10000 });
        await expect(this.columnActivo).toBeVisible({ timeout: 10000 });
    }

    async validarFormatosPrimerFila() {
        // Esperar a que haya datos antes de validar
        await this.dataTable.locator('tbody tr').first().waitFor({ 
            state: 'visible', 
            timeout: 15000 
        });

        const firstRowCells = this.dataTable.locator('tbody tr').first().locator('td');
        
        const idText = await firstRowCells.nth(1).textContent();
        expect(idText?.trim()).toMatch(/^\d+$/);

        const coloniaText = await firstRowCells.nth(3).textContent();
        expect(coloniaText?.trim()).toMatch(/^(Sí|No)$/);

        const fechaText = await firstRowCells.nth(4).textContent();
        expect(fechaText?.trim()).toMatch(/\d{2}\/\d{2}\/\d{2}\s\d{2}:\d{2}/);

        const activoCheckbox = firstRowCells.nth(5).locator('input[type="checkbox"]');
        await expect(activoCheckbox).toBeChecked({ timeout: 10000 });
    }
}