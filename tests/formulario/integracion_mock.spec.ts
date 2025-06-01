import { test, expect } from '@playwright/test';
import { configurarMockAPI } from '../../mocks/mockServer';
import { fakeDatabase } from '../../mocks/dbMock';
import { FormularioPage } from '../pages/formularioPage';
import fs from 'fs';
import path from 'path';

// Pruebas de integración que validan el flujo completo formulario → API → base de datos
// Simula el comportamiento real del backend usando mocks para asegurar confiabilidad
test.describe('Test de integración con API mock y base de datos simulada', () => {
 
 // Configuración antes de cada test: limpia la BD simulada y configura mocks
 test.beforeEach(async ({ page }) => {
   fakeDatabase.length = 0; // Resetear BD simulada
   await configurarMockAPI(page); // Configurar interceptores de API
 });

 // Verifica el flujo exitoso completo: validación → envío → almacenamiento
 // Confirma que datos válidos se procesan y guardan correctamente en la BD
 test('Guarda correctamente un usuario válido', async ({ page }) => {
   const form = new FormularioPage(page);
   await form.goto();

   // Llenar formulario con datos completamente válidos
   await form.completarFormulario({
     nombre: 'Valentina Test',
     email: 'valentina@empresa.com.ar', // Email corporativo válido
     edad: '30',
     password: 'prueba123',
     repetir: 'prueba123',
   });

   await form.enviarFormulario();
   await form.verificarMensajeExito('Valentina Test');

   // Verificar que el usuario se guardó correctamente en la BD simulada
   expect(fakeDatabase.length).toBe(1);
   expect(fakeDatabase[0].email).toBe('valentina@empresa.com.ar');
   expect(fakeDatabase[0].nombre).toBe('Valentina Test');
   expect(fakeDatabase[0].edad).toBe('30');
 });

 // Prueba el manejo de errores del servidor: email duplicado (código 409)
 // Verifica que el sistema maneje correctamente conflictos de datos existentes
 test('No permite registrar un email ya existente (mock)', async ({ page }) => {
   // Simular respuesta de servidor cuando email ya existe
   await page.route('**/api/registro', async (route, request) => {
     const postData = await request.postDataJSON();
     if (postData.email === 'valentina@empresa.com.ar') {
       // Simular error 409 Conflict del servidor
       await route.fulfill({
         status: 409,
         contentType: 'application/json',
         body: JSON.stringify({ error: 'El email ya está registrado' }),
       });
     } else {
       await route.continue();
     }
   });

   const form = new FormularioPage(page);
   await form.goto();

   // Intentar registrar email que ya existe (según mock)
   await form.completarFormulario({
     nombre: 'Valentina Test',
     email: 'valentina@empresa.com.ar', // Email que simula estar duplicado
     edad: '30',
     password: 'Password123',
     repetir: 'Password123',
   });

   await form.enviarFormulario();

   // Verificar que se muestra el error de email duplicado al usuario
   await form.verificarError('email', 'El email ya está registrado');
 });
});

test('Muestra indicador de carga durante envío', async ({ page }) => {
  // Simular respuesta lenta
  await page.route('**/api/registro', async (route) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 segundo de demora
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ mensaje: 'ok' }),
    });
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