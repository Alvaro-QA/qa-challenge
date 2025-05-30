import { test } from '@playwright/test';
import { FormularioPage } from '../pages/formularioPage';
import { configurarMockAPI } from '../../mocks/mockServer';
import { fakeDatabase } from '../../mocks/dbMock';


test.describe('Casos de prueba adicionales del formulario', () => {
  test.beforeEach(async ({ page }) => {
    fakeDatabase.length = 0;
    await configurarMockAPI(page);
  });

  test('Registro exitoso con datos válidos', async ({ page }) => {
    const form = new FormularioPage(page);
    await form.goto();

    await form.completarFormulario({
      nombre: 'Valentina Test',
      email: 'valentina@empresa.com.ar',
      edad: '30',
      password: 'Password123',
      repetir: 'Password123',
    }); 
    await form.enviarFormulario();
    await form.verificarMensajeExito('Valentina Test');
  });

  test('Fallo por email inválido', async ({ page }) => {
    const form = new FormularioPage(page);
    await form.goto();
    await form.completarFormulario({
      nombre: 'Test User',
      email: 'correo_invalido',
      edad: '25',
      password: 'Password123',
      repetir: 'Password123',
    });
    await form.enviarFormulario();
    await form.verificarError('email', 'Formato de email inválido');
  });

  test('Envío con todos los campos vacíos', async ({ page }) => {
    const form = new FormularioPage(page);
    await form.goto();
    await form.completarFormulario({ nombre: '', email: '', edad: '', password: '', repetir: '' });
    await form.enviarFormulario();

    await form.verificarError('nombre', 'El nombre es obligatorio');
    await form.verificarError('email', 'El email es obligatorio');
    await form.verificarError('password', 'La contraseña es obligatoria');
    await form.verificarError('repetir', 'Debe confirmar la contraseña');
  });

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
  });
  
  test('Cumple con atributos aria y vínculos label/for', async ({ page }) => {
    const form = new FormularioPage(page);
    await form.goto();
    await form.verificarAccesibilidadBasica();
  });
