import { expect, Page } from '@playwright/test';

export class FormularioPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/formulario.html?test');
}   

  async completarFormulario(datos: any) {
    await this.page.fill('#nombre', datos.nombre);
    await this.page.fill('#email', datos.email);
    await this.page.fill('#edad', datos.edad || '');
    await this.page.fill('#password', datos.password);
    await this.page.fill('#repetir', datos.repetir);
  }

  async enviarFormulario() {
    await this.page.click('button[type="submit"]');
  }

  async verificarMensajeExito(nombre: string) {
    const mensajeLocator = this.page.locator('#mensajeExito');
    await mensajeLocator.waitFor({ state: 'visible', timeout: 5000 });
    await expect(mensajeLocator).toHaveText(`Registro exitoso. Bienvenido/a, ${nombre}!`);
  }

  async verificarError(campo: string, mensajeEsperado: string) {
    const errorLocator = this.page.locator(`#error-${campo}`);
    await expect(errorLocator).toBeVisible({ timeout: 3000 });
    await expect(errorLocator).toHaveText(mensajeEsperado);
  }

  async verificarAccesibilidadBasica() {
    await expect(this.page.locator('form')).toHaveAttribute('aria-labelledby', /.+/);
    const labels = await this.page.locator('label').all();
    for (const label of labels) {
      await expect(label).toHaveAttribute('for', /.+/);
    }
  }
}
