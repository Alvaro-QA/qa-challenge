import { test, expect } from '@playwright/test';
import { FormularioPage } from '../pages/formularioPage';

test.describe('Validación de email en el formulario de registro', () => {
  test('No se permite registrar con email fuera del dominio @empresa.com.ar', async ({ page }) => {
    const form = new FormularioPage(page);
    await form.goto();

    await form.completarFormulario({
      nombre: 'Carlos',
      email: 'carlos@gmail.com',
      edad: '32',
      password: 'claveSegura1',
      repetir: 'claveSegura1',
    });

    await form.enviarFormulario();

    const errorLocator = page.locator('#error-email');
    await expect(errorLocator).toBeVisible();
    await expect(errorLocator).toHaveText(/El email debe pertenecer al dominio @empresa\.com\.ar/);
  });

  test('No se permite registrar con email sin dominio', async ({ page }) => {
    const form = new FormularioPage(page);
    await form.goto();

    await form.completarFormulario({
      nombre: 'Ana',
      email: 'ana@empresa',
      edad: '28',
      password: 'claveSegura2',
      repetir: 'claveSegura2',
    });

    await form.enviarFormulario();

    const errorLocator = page.locator('#error-email');
    await expect(errorLocator).toBeVisible();
    await expect(errorLocator).toHaveText(/Formato de email inválido/);
  });

  test('No se permite registrar con email sin arroba', async ({ page }) => {
    const form = new FormularioPage(page);
    await form.goto();

    await form.completarFormulario({
      nombre: 'Luis',
      email: 'luisempresa.com.ar',
      edad: '40',
      password: 'claveSegura3',
      repetir: 'claveSegura3',
    });

    await form.enviarFormulario();

    const errorLocator = page.locator('#error-email');
    await expect(errorLocator).toBeVisible();
    await expect(errorLocator).toHaveText(/Formato de email inválido/);
  });
});
