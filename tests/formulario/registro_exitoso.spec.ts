import { test, expect } from '@playwright/test';
import { FormularioPage } from '../pages/formularioPage';
import fs from 'fs';
import path from 'path';

// Pruebas básicas del formulario de registro que verifican flujos principales
// Cubre casos exitosos y validaciones de errores más comunes
test.describe('Formulario de Registro', () => {
 
 // Verifica el flujo completo de registro exitoso con datos válidos
 // Simula respuesta exitosa del servidor para confirmar integración
 test('Envía el formulario exitosamente con datos válidos', async ({ page }) => {
   // Mock de API para simular registro exitoso
   await page.route('**/api/registro', async (route) => {
     await route.fulfill({
       status: 200,
       contentType: 'application/json',
       body: JSON.stringify({ mensaje: 'ok' }),
     });
   });

   const formulario = new FormularioPage(page);
   await formulario.goto();

   // Datos que cumplen todas las validaciones
   const datos = {
     nombre: 'Ana Pérez',
     email: 'ana@empresa.com.ar', // Email corporativo válido
     edad: '28',
     password: 'Segura123!',
     repetir: 'Segura123!',
   };

   await formulario.completarFormulario(datos);
   await formulario.enviarFormulario();
   await formulario.verificarMensajeExito(datos.nombre);
 });

 // Prueba validación de formato de email con texto completamente inválido
  // Verifica que emails sin @ ni dominio sean detectados correctamente
  test('Fallo por email inválido', async ({ page }) => {
    const form = new FormularioPage(page);
    await form.goto();
    
    await form.completarFormulario({
      nombre: 'Test User',
      email: 'correo_invalido', // Texto sin formato de email válido
      edad: '25',
      password: 'Password123',
      repetir: 'Password123',
    });
    
    await form.enviarFormulario();
    await form.verificarError('email', 'Formato de email inválido');
  });

 // Verifica validación de confirmación de contraseña
 // Previene errores de tipeo en contraseñas y asegura que el usuario confirme
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