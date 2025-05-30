import { test, expect } from '@playwright/test';
import { configurarMockAPI } from '../../mocks/mockServer';
import { fakeDatabase } from '../../mocks/dbMock';
import { FormularioPage } from '../pages/formularioPage';

test.describe('Test de integración con API mock y base de datos simulada', () => {
  test.beforeEach(async ({ page }) => {
    fakeDatabase.length = 0;
    await configurarMockAPI(page);
  });

  test('Guarda correctamente un usuario válido', async ({ page }) => {
    const form = new FormularioPage(page);
    await form.goto();

    await form.completarFormulario({
      nombre: 'Valentina Test',
      email: 'valentina@empresa.com.ar',
      edad: '30',
      password: 'prueba123',
      repetir: 'prueba123',
    });

    await form.enviarFormulario();
    await form.verificarMensajeExito('Valentina Test');

    expect(fakeDatabase.length).toBe(1);
    expect(fakeDatabase[0].email).toBe('valentina@empresa.com.ar');
    expect(fakeDatabase[0].nombre).toBe('Valentina Test');
    expect(fakeDatabase[0].edad).toBe('30');
  });

  test('No permite registrar un email ya existente (mock)', async ({ page }) => {
    // Interceptamos la API y simulamos error 409 si el email ya está registrado
    await page.route('**/api/registro', async (route, request) => {
      const postData = await request.postDataJSON();
      if (postData.email === 'valentina@empresa.com.ar') {
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

    await form.completarFormulario({
      nombre: 'Valentina Test',
      email: 'valentina@empresa.com.ar',
      edad: '30',
      password: 'Password123',
      repetir: 'Password123',
    });

    await form.enviarFormulario();

    // Validamos que se muestre el error esperado
    await form.verificarError('email', 'El email ya está registrado');
  });
});
