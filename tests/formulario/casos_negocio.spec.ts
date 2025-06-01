import { test, expect } from '@playwright/test';
import { FormularioPage } from '../pages/formularioPage';
import fs from 'fs';
import path from 'path';


test.describe('Validación de email en el formulario de registro', () => {
 
 // Verifica que emails de dominios públicos (gmail) sean rechazados
 // Importante para mantener seguridad corporativa y evitar registros no autorizados
 test('No se permite registrar con email fuera del dominio @empresa.com.ar', async ({ page }) => {
   const form = new FormularioPage(page);
   await form.goto();

   // Intentar registrarse con email de dominio público (caso que debe fallar)
   await form.completarFormulario({
     nombre: 'Carlos',
     email: 'carlos@gmail.com', // Dominio externo no permitido
     edad: '32',
     password: 'claveSegura1',
     repetir: 'claveSegura1',
   });

   await form.enviarFormulario();

   // Verificar que aparece error específico sobre dominio requerido
   const errorLocator = page.locator('#error-email');
   await expect(errorLocator).toBeVisible();
   await expect(errorLocator).toHaveText(/El email debe pertenecer al dominio @empresa\.com\.ar/);
 });

 // Valida que emails con formato incompleto (sin .com.ar) sean detectados como inválidos
 // Previene registros con emails malformados que causarían problemas de comunicación
 test('No se permite registrar con email sin dominio', async ({ page }) => {
   const form = new FormularioPage(page);
   await form.goto();

   // Probar con email que parece corporativo pero está incompleto
   await form.completarFormulario({
     nombre: 'Ana',
     email: 'ana@empresa', // Falta extensión .com.ar completa
     edad: '28',
     password: 'claveSegura2',
     repetir: 'claveSegura2',
   });

   await form.enviarFormulario();

   // Verificar que se detecta el formato incompleto
   const errorLocator = page.locator('#error-email');
   await expect(errorLocator).toBeVisible();
   await expect(errorLocator).toHaveText(/Formato de email inválido/);
 });

 // Verifica que email sin  @ sea detectado como formato inválido
 test('No se permite registrar con email sin arroba', async ({ page }) => {
   const form = new FormularioPage(page);
   await form.goto();

   // Probar con texto que tiene dominio correcto pero sin @
   await form.completarFormulario({
     nombre: 'Luis',
     email: 'luisempresa.com.ar', // Sin @ requerido para separar usuario y dominio
     edad: '40',
     password: 'claveSegura3',
     repetir: 'claveSegura3',
   });

   await form.enviarFormulario();

   // Verificar que se detecta la ausencia del símbolo requerido
   const errorLocator = page.locator('#error-email');
   await expect(errorLocator).toBeVisible();
   await expect(errorLocator).toHaveText(/Formato de email inválido/);
 });
});

// Cobertura específica para este archivo
test.afterEach(async ({ page }, testInfo) => {
  const coverage = await page.evaluate(() => (window as any).__coverage__);
  if (coverage) {
    fs.mkdirSync('.nyc_output', { recursive: true });
    const timestamp = Date.now();
    const filename = testInfo.title.replace(/\W+/g, '_') + `_${timestamp}.json`;
    fs.writeFileSync(path.join('.nyc_output', filename), JSON.stringify(coverage));
  }
});