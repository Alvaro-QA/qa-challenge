import { fakeDatabase } from './dbMock';
import { Page } from '@playwright/test';

export async function configurarMockAPI(page: Page) {
  await page.route('**/api/registro', async (route, request) => {
    const data = await request.postDataJSON();

    // Validar datos incompletos
    if (!data || !data.nombre || !data.email || !data.password || !data.repetir) {
      return await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Datos incompletos' }),
      });
    }

    // Validar email duplicado
    if (fakeDatabase.some(user => user.email === data.email)) {
      return await route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'El email ya está registrado.' }),
      });
    }

    // Simular guardado exitoso
    fakeDatabase.push(data);

    return await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        mensaje: 'Registro exitoso',
        nombre: data.nombre  // ← agregado para el mensaje dinámico
      }),
    });
  });
}
