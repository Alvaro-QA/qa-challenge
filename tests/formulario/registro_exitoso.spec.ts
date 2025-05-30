import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { FormularioPage } from '../pages/formularioPage';

test.describe('Formulario de Registro', () => {
  test('Envía el formulario exitosamente con datos válidos', async ({ page }) => {
    await page.route('**/api/registro', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ mensaje: 'ok' }),
      });
    });

    const formulario = new FormularioPage(page);
    await formulario.goto();

    const datos = {
      nombre: 'Ana Pérez',
      email: 'ana@empresa.com.ar',
      edad: '28',
      password: 'Segura123!',
      repetir: 'Segura123!',
    };

    await formulario.completarFormulario(datos);
    await formulario.enviarFormulario();
    await formulario.verificarMensajeExito(datos.nombre);
  });

  test('Muestra error si el email es inválido', async ({ page }) => {
    const formulario = new FormularioPage(page);
    await formulario.goto();

    const datos = {
      nombre: 'Luis Gómez',
      email: 'luis@gmail.com',
      edad: '30',
      password: 'Segura123!',
      repetir: 'Segura123!',
    };

    await formulario.completarFormulario(datos);
    await formulario.enviarFormulario();
    await formulario.verificarError('email', 'El email debe pertenecer al dominio @empresa.com.ar');
  });

  test('Muestra error si las contraseñas no coinciden', async ({ page }) => {
    const formulario = new FormularioPage(page);
    await formulario.goto();

    const datos = {
      nombre: 'Carla Ruiz',
      email: 'carla@empresa.com.ar',
      edad: '25',
      password: 'Clave123!',
      repetir: 'Otra123!',
    };

    await formulario.completarFormulario(datos);
    await formulario.enviarFormulario();
    await formulario.verificarError('repetir', 'Las contraseñas no coinciden');
  });

  // 🧪 Guardar cobertura tras cada test
  test.afterEach(async ({ page }, testInfo) => {
    const coverage = await page.evaluate(() => (window as any).__coverage__);
    if (coverage) {
      fs.mkdirSync('./.nyc_output', { recursive: true });

      const filename = crypto
        .createHash('md5')
        .update(testInfo.title + Date.now().toString())
        .digest('hex');

      fs.writeFileSync(
        path.join('./.nyc_output', `out-${filename}.json`),
        JSON.stringify(coverage)
      );
    }
  });
});
