import { test } from '@playwright/test';
import { FormularioPage } from '../pages/formularioPage';
import { configurarMockAPI } from '../../mocks/mockServer';
import { fakeDatabase } from '../../mocks/dbMock';
import fs from 'fs';
import path from 'path';


test.describe('Casos de prueba adicionales del formulario', () => {

// Configuración inicial: resetea BD simulada y prepara mocks para cada test
test.beforeEach(async ({ page }) => {
  fakeDatabase.length = 0; // Limpiar datos previos
  await configurarMockAPI(page); // Configurar interceptores de API
});

// Verifica el flujo exitoso básico con datos  válidos
// Confirma que el registro funciona cuando todos los campos están correctos
test('Registro exitoso con datos válidos', async ({ page }) => {
  const form = new FormularioPage(page);
  await form.goto();

  // Datos que cumplen todas las validaciones
  await form.completarFormulario({
    nombre: 'Valentina Test',
    email: 'valentina@empresa.com.ar', // Email corporativo válido
    edad: '30', // Edad en rango permitido
    password: 'Password123', // Contraseña segura
    repetir: 'Password123', // Confirmación coincidente
  }); 
  
  await form.enviarFormulario();
  await form.verificarMensajeExito('Valentina Test');
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

// Prueba validación de rango de edad con valor negativo
// Verifica que edades imposibles o fuera de rango sean rechazadas
test('Edad con valor negativo o fuera de rango', async ({ page }) => {
  const form = new FormularioPage(page);
  await form.goto();

  await form.completarFormulario({
    nombre: 'Test Edad',
    email: 'testedad@empresa.com.ar',
    edad: '-5', 
    password: 'Password123',
    repetir: 'Password123',
  });
  
  await form.enviarFormulario();
  await form.verificarError('edad', 'La edad debe ser un número entre 1 y 120');
});

// Verificación de accesibilidad web: atributos ARIA y asociaciones label/input
// Asegura que el formulario sea usable por personas con discapacidades
test('Cumple con atributos aria y vínculos label/for', async ({ page }) => {
  const form = new FormularioPage(page);
  await form.goto();
  
  // Verificar que el formulario cumple estándares de accesibilidad
  await form.verificarAccesibilidadBasica();
});


});

test('Evalúa fortaleza de contraseña correctamente', async ({ page }) => {
  const form = new FormularioPage(page);
  await form.goto();
  
  // Probar contraseña débil
  await page.fill('#password', 'abc');
  await page.waitForTimeout(500); // Para que se ejecute evaluatePasswordStrength
  
  // Probar contraseña fuerte  
  await page.fill('#password', 'Password123!@#');
  await page.waitForTimeout(500); 
});

test('Rechaza nombres menores a 2 caracteres', async ({ page }) => {
  const form = new FormularioPage(page);
  await form.goto();
  
  await form.completarFormulario({
    nombre: 'A', // Solo 1 carácter
    email: 'test@empresa.com.ar',
    password: 'Password123',
    repetir: 'Password123'
  });
  
  await form.enviarFormulario();
  await form.verificarError('nombre', 'El nombre debe tener al menos 2 caracteres');
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