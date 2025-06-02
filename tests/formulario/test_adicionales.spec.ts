import { test, expect } from '@playwright/test';
import { FormularioPage } from '../pages/formularioPage';
import { configurarMockAPI } from '../../mocks/mockServer';
import { fakeDatabase } from '../../mocks/dbMock';
import fs from 'fs';
import path from 'path';

// Casos de prueba adicionales que cubren escenarios extremos y validaciones específicas
// Complementa las pruebas principales con casos límite y verificaciones de accesibilidad
test.describe('Casos de prueba adicionales del formulario', () => {

  // Configuración inicial: resetea BD simulada y prepara mocks para cada test
  test.beforeEach(async ({ page }) => {
    fakeDatabase.length = 0; // Limpiar datos previos
    await configurarMockAPI(page); // Configurar interceptores de API
  });

  // Verifica que todos los campos obligatorios muestren error cuando están vacíos
  // Importante para UX: usuario debe saber exactamente qué campos faltan
  test('Envío con todos los campos vacíos', async ({ page }) => {
    const form = new FormularioPage(page);
    await form.goto();
    
    // Enviar formulario completamente vacío
    await form.completarFormulario({ 
      nombre: '', 
      email: '', 
      edad: '', 
      password: '', 
      repetir: '' 
    });
    
    await form.enviarFormulario();

    // Verificar que cada campo obligatorio muestre su error específico
    await form.verificarError('nombre', 'El nombre es obligatorio');
    await form.verificarError('email', 'El email es obligatorio');
    await form.verificarError('password', 'La contraseña es obligatoria');
    await form.verificarError('repetir', 'Debe confirmar la contraseña');
  });

  // Prueba validación de rango de edad: menor a mayoría de edad
  // Verifica que edades menores a 18 años sean rechazadas (mayoría de edad requerida)
  test('Edad menor a mayoría de edad o fuera de rango', async ({ page }) => {
    const form = new FormularioPage(page);
    await form.goto();

    await form.completarFormulario({
      nombre: 'Test Edad',
      email: 'testedad@empresa.com.ar',
      edad: '15', 
      password: 'Password123',
      repetir: 'Password123',
    });
    
    await form.enviarFormulario();
    await form.verificarError('edad', 'La edad debe ser un número entre 18 y 99 años');
  });

  // Verificación de navegación por teclado completa - orden de tabulación
  // Asegura que usuarios que no usan mouse puedan completar el formulario
  test('Navegación por teclado - orden de tabulación completo', async ({ page }) => {
    const form = new FormularioPage(page);
    await form.goto();
    
    // Simular respuesta exitosa del servidor
    await page.route('**/api/registro', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ mensaje: 'ok', nombre: 'Usuario Test' }),
      });
    });
    
    // Comenzar navegación desde el primer elemento
    await page.keyboard.press('Tab');
    
    // Verificar orden de tabulación esperado
    const elementosEsperados = [
      '#nombre',
      '#email', 
      '#edad',
      '#password',
      '#repetir',
      '#submitBtn'
    ];
    
    for (let i = 0; i < elementosEsperados.length; i++) {
      const elemento = page.locator(elementosEsperados[i]);
      await expect(elemento).toBeFocused();
      
      if (i < elementosEsperados.length - 1) {
        await page.keyboard.press('Tab');
      }
    }
    
    // Probar navegación hacia atrás con Shift+Tab
    await page.keyboard.press('Shift+Tab');
    await expect(page.locator('#repetir')).toBeFocused();
    
    // Llenar formulario usando solo teclado (navegando hacia atrás)
    await page.keyboard.type('Test123'); // repetir
    
    await page.keyboard.press('Shift+Tab'); // password
    await page.keyboard.type('Test123');
    
    await page.keyboard.press('Shift+Tab'); // edad
    await page.keyboard.type('25');
    
    await page.keyboard.press('Shift+Tab'); // email
    await page.keyboard.type('test@empresa.com.ar');
    
    await page.keyboard.press('Shift+Tab'); // nombre
    await page.keyboard.type('Usuario Test');
    
    // Navegar hasta el botón y enviar con Enter
    await page.keyboard.press('Tab'); // email
    await page.keyboard.press('Tab'); // edad
    await page.keyboard.press('Tab'); // password
    await page.keyboard.press('Tab'); // repetir
    await page.keyboard.press('Tab'); // submitBtn
    
    await expect(page.locator('#submitBtn')).toBeFocused();
    await page.keyboard.press('Enter');
    
    // Verificar que el formulario se envió correctamente
    await form.verificarMensajeExito('Usuario Test');
  });

  // Verificación de estructura ARIA y asociaciones label/input
  // Asegura que el formulario tenga la estructura semántica correcta
  test('Cumple con estructura ARIA y asociaciones label/input', async ({ page }) => {
    const form = new FormularioPage(page);
    await form.goto();
    
    // Verificar que el formulario cumple estándares de accesibilidad estructural
    await form.verificarAccesibilidadBasica();
  });

  // Verificar que errores de campos vacíos tienen atributos de accesibilidad
  // Asegura que lectores de pantalla puedan anunciar errores de campos obligatorios
  test('Errores de campos vacíos tienen atributos de accesibilidad', async ({ page }) => {
    const form = new FormularioPage(page);
    await form.goto();
    
    // Enviar formulario vacío para generar errores de campos obligatorios
    await form.enviarFormulario();
    
    // Verificar errores específicos de campos obligatorios
    const camposObligatorios = ['nombre', 'email', 'password', 'repetir'];
    
    for (const campo of camposObligatorios) {
      const errorElement = page.locator(`#error-${campo}`);
      
      // Verificar que el error es visible y tiene contenido
      await expect(errorElement).toBeVisible();
      await expect(errorElement).toHaveText(/.+/);
      
      // Verificar atributos de accesibilidad
      await expect(errorElement).toHaveAttribute('role', 'alert');
      
      // Verificar asociación con el input
      const relatedInput = page.locator(`[aria-describedby="error-${campo}"]`);
      await expect(relatedInput).toBeVisible();
    }
  });

  // Verificar que errores de validación tienen atributos de accesibilidad
  // Asegura que lectores de pantalla puedan anunciar errores de datos inválidos
  test('Errores de validación tienen atributos de accesibilidad', async ({ page }) => {
    const form = new FormularioPage(page);
    await form.goto();
    
    // Llenar formulario con datos que generarán errores de validación
    await form.completarFormulario({
      nombre: 'Test Usuario',
      email: 'test@empresa.com.ar',
      edad: '15', // Edad inválida - menor a 18
      password: 'Password123',
      repetir: 'Password123'
    });
    
    await form.enviarFormulario();
    
    // Verificar error específico de edad
    const errorEdad = page.locator('#error-edad');
    await expect(errorEdad).toBeVisible();
    await expect(errorEdad).toHaveText(/La edad debe ser un número entre 18 y 99 años/);
    await expect(errorEdad).toHaveAttribute('role', 'alert');
    
    // Verificar asociación con el input
    const inputEdad = page.locator('[aria-describedby="error-edad"]');
    await expect(inputEdad).toBeVisible();
  });

  // Prueba validación de longitud mínima de nombre
  // Verifica que nombres con menos de 2 caracteres sean rechazados
  test('Rechaza nombres menores a 2 caracteres', async ({ page }) => {
    const form = new FormularioPage(page);
    await form.goto();
    
    await form.completarFormulario({
      nombre: 'A', // Solo 1 carácter - debe fallar
      email: 'test@empresa.com.ar',
      edad: '25',
      password: 'Password123',
      repetir: 'Password123'
    });
    
    await form.enviarFormulario();
    await form.verificarError('nombre', 'El nombre debe tener al menos 2 caracteres');
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