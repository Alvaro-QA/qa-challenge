# QA Automation Challenge - Formulario de Registro

## Descripción del Desafío

Este proyecto automatiza los tests funcionales de un formulario de registro web, utilizando **Playwright**, bajo una estructura modular y escalable (Page Object Model). Se implementa validación de formularios, mocks de API, y cobertura de código usando **Istanbul (nyc)**.

---

## Requerimientos del Formulario

El formulario debe contener:

* **Nombre completo** (obligatorio)
* **Email** (obligatorio, válido, dominio `@empresa.com.ar`)
* **Edad** (opcional, pero debe ser un número positivo si se completa)
* **Contraseña** (obligatoria, mínimo 6 caracteres)
* **Repetir contraseña** (debe coincidir con la anterior)
* **Botón Enviar**

Mensajes de error se muestran junto a los campos si hay errores. Si el formulario es válido, se muestra:

```
Registro exitoso. Bienvenido/a, [Nombre]!
```

---

## Interpretación de Requerimientos y Decisiones de Testing

### a. Interpretación de los requerimientos del formulario

**Campos obligatorios:**
- Interpreté que "nombre completo" debe tener al menos 6 caracteres para ser considerado válido
- El email debe seguir formato estándar  pero con restricción específica de dominio corporativo
- La contraseña debe tener mínimo 6 caracteres como medida de seguridad básica

**Campos opcionales:**
- La edad, si se proporciona, debe estar en un rango lógico (18-99 años)
- Valores negativos o superiores a 99 se consideran inválidos

**Validaciones de negocio:**
- Email corporativo obligatorio (`@empresa.com.ar`) para restringir acceso solo a empleados
- Confirmación de contraseña para prevenir errores de tipeo
- Validación en tiempo real para mejorar experiencia de usuario

### b. Justificación de casos de prueba elegidos

**Casos básicos obligatorios:**
1. **Registro exitoso** - Valida el flujo principal de negocio
2. **Email inválido** - Prueba la validación más crítica del sistema
3. **Contraseñas no coincidentes** - Previene errores comunes de usuario

**Casos adicionales estratégicos:**
4. **Campos vacíos** - Verifica que todas las validaciones obligatorias funcionen simultáneamente
5. **Edad negativa** - Prueba validación de rangos y tipos de datos
6. **Email duplicado** - Simula restricción de base de datos realista
7. **Accesibilidad** - Garantiza usabilidad para personas con discapacidades

### c. Criterios de negocio aplicados

**Seguridad:**
- Solo emails corporativos (`@empresa.com.ar`) pueden registrarse
- Contraseñas mínimas de 6 caracteres
- Confirmación obligatoria de contraseña

**Experiencia de usuario:**
- Validaciones completas antes del envío
- Mensajes de error específicos y claros  
- Indicadores visuales de fortaleza de contraseña

**Integridad de datos:**
- Prevención de emails duplicados
- Validación de tipos de datos (edad numérica)
- Rangos lógicos para campos numéricos (1-120 años)

**Accesibilidad:**
- Etiquetas ARIA para lectores de pantalla
- Asociación correcta de labels con inputs
- Navegación por teclado funcional

---

## Casos de prueba implementados

### 1. Casos obligatorios:
* Registro exitoso con datos válidos
* Fallo por email inválido (dominio incorrecto, sin dominio, sin arroba)
* Fallo por contraseñas no coincidentes

### 2. Casos adicionales:
* Envío con todos los campos vacíos (validación múltiple)
* Edad con valor negativo o texto
* Email duplicado (API mock responde como existente)
* Verificación de accesibilidad básica (`aria-*`, `label/for`)

### 3. Validaciones de negocio:
* Email debe terminar en `@empresa.com.ar`
* Edad positiva si se completa
* Confirmación de contraseñas
* Integración con mock API y "base de datos" simulada

---

## Automatización con Playwright

### Herramientas
* Playwright + TypeScript
* Page Object Model
* API Mock (`mockServer.ts` y `dbMock.ts`)
* Cobertura con Istanbul (`nyc`)

### Estructura del proyecto

```
qa-challenge/
├── public/                 # HTML + JS original/instrumentado
│   ├── formulario.html
│   ├── js/
│   └── js-instrumented/
├── mocks/                 # API y base de datos simulada
│   ├── dbMock.ts
│   └── mockServer.ts
├── tests/                 # Casos de prueba automatizados
│   ├── formulario/
│   └── pages/
├── saveCoverage.ts        # Captura de window.__coverage__
├── .nyc_output/           # Datos crudos de cobertura
├── coverage/              # Reportes HTML generados
├── babel.config.js
├── playwright.config.ts
├── package.json
```

---

## Instalación y Ejecución

### 1. Requisitos previos
Asegurate de tener instalado:
* Node.js 18 o superior
* npm

### 2. Inicializar proyecto
```bash
git clone https://github.com/usuario/qa-challenge-playwright.git
cd qa-challenge-playwright
npm install
```

### 3. Ejecutar pruebas + cobertura
```bash
npm run todo
```

### 4. Ejecutar pruebas con navegador visible
```bash
npx playwright test --headed
```

### 5. Ver reporte de cobertura
Abrir en navegador: `coverage/index.html`

---

## Scripts disponibles

```json
"scripts": {
  "clean": "if exist public\\js-instrumented rmdir /s /q public\\js-instrumented && if exist .nyc_output rmdir /s /q .nyc_output && if exist coverage rmdir /s /q coverage",
  "instrumentar": "npx babel public/js --out-dir public/js-instrumented --source-maps",
  "test": "npx playwright test",
  "merge": "npx nyc merge .nyc_output coverage/coverage-final.json",
  "coverage": "npx nyc report --report-dir=coverage --reporter=html --reporter=text",
  "todo": "npm run clean && npm run instrumentar && npm run test && npm run merge && npm run coverage"
}
```

---

## Decisiones técnicas

### Estructura
* Se usó Page Object Model para facilitar mantenimiento y reutilización
* Los mocks están desacoplados de los tests para claridad

### Herramientas
* **Playwright**: moderno, soporte para interceptar API, y excelente DX
* **Istanbul (nyc)** + Babel: cobertura real del JS del navegador
* **TypeScript**: tipado fuerte para mayor robustez

### Supuestos
* La validación ocurre del lado del cliente
* `/api/registro` es simulado con `route.fulfill()`
* `window.__coverage__` es capturado y persistido en `.nyc_output`
* El formulario es accedido vía `http://localhost:3000/formulario.html?test`

---

## Resultados de Cobertura

El proyecto mantiene una cobertura de código superior al 60%, cubriendo:
* Validaciones de formulario
* Manejo de errores
* Funciones de interfaz de usuario
* Integración con API simulada# QA Automation Challenge - Formulario de Registro

## Descripción del Desafío

Este proyecto automatiza los tests funcionales de un formulario de registro web, utilizando **Playwright**, bajo una estructura modular y escalable (Page Object Model). Se implementa validación de formularios, mocks de API, y cobertura de código usando **Istanbul (nyc)**.

---

## Requerimientos del Formulario

El formulario debe contener:

* **Nombre completo** (obligatorio)
* **Email** (obligatorio, válido, dominio `@empresa.com.ar`)
* **Edad** (opcional, pero debe ser un número positivo si se completa)
* **Contraseña** (obligatoria, mínimo 6 caracteres)
* **Repetir contraseña** (debe coincidir con la anterior)
* **Botón Enviar**

Mensajes de error se muestran junto a los campos si hay errores. Si el formulario es válido, se muestra:

```
Registro exitoso. Bienvenido/a, [Nombre]!
```

---

## Interpretación de Requerimientos y Decisiones de Testing

### a. Interpretación de los requerimientos del formulario

**Campos obligatorios:**
- Interpreté que "nombre completo" debe tener al menos 2 caracteres para ser considerado válido
- El email debe seguir formato estándar RFC pero con restricción específica de dominio corporativo
- La contraseña debe tener mínimo 6 caracteres como medida de seguridad básica

**Campos opcionales:**
- La edad, si se proporciona, debe estar en un rango lógico (1-120 años)
- Valores negativos o superiores a 120 se consideran inválidos

**Validaciones de negocio:**
- Email corporativo obligatorio (`@empresa.com.ar`) para restringir acceso solo a empleados
- Confirmación de contraseña para prevenir errores de tipeo
- Validación en tiempo real para mejorar experiencia de usuario

### b. Justificación de casos de prueba elegidos

**Casos básicos obligatorios:**
1. **Registro exitoso** - Valida el flujo principal de negocio
2. **Email inválido** - Prueba la validación más crítica del sistema
3. **Contraseñas no coincidentes** - Previene errores comunes de usuario

**Casos adicionales estratégicos:**
4. **Campos vacíos** - Verifica que todas las validaciones obligatorias funcionen simultáneamente
5. **Edad negativa** - Prueba validación de rangos y tipos de datos
6. **Email duplicado** - Simula restricción de base de datos realista
7. **Accesibilidad** - Garantiza usabilidad para personas con discapacidades
8. **Validación en tiempo real** - Prueba retroalimentación inmediata al usuario

### c. Criterios de negocio aplicados

**Seguridad:**
- Solo emails corporativos (`@empresa.com.ar`) pueden registrarse
- Contraseñas mínimas de 6 caracteres
- Confirmación obligatoria de contraseña

**Experiencia de usuario:**
- Validaciones en tiempo real para feedback inmediato
- Mensajes de error específicos y claros
- Indicadores visuales de fortaleza de contraseña

**Integridad de datos:**
- Prevención de emails duplicados
- Validación de tipos de datos (edad numérica)
- Rangos lógicos para campos numéricos (1-120 años)

**Accesibilidad:**
- Etiquetas ARIA para lectores de pantalla
- Asociación correcta de labels con inputs
- Navegación por teclado funcional

---

## Casos de prueba implementados

### 1. Casos obligatorios:
* Registro exitoso con datos válidos
* Fallo por email inválido (dominio incorrecto, sin dominio, sin arroba)
* Fallo por contraseñas no coincidentes

### 2. Casos adicionales:
* Envío con todos los campos vacíos (validación múltiple)
* Edad con valor negativo o texto
* Email duplicado (API mock responde como existente)
* Verificación de accesibilidad básica (`aria-*`, `label/for`)

### 3. Validaciones de negocio:
* Email debe terminar en `@empresa.com.ar`
* Edad positiva si se completa
* Confirmación de contraseñas
* Integración con mock API y "base de datos" simulada

---

## Automatización con Playwright

### Herramientas
* Playwright + TypeScript
* Page Object Model
* API Mock (`mockServer.ts` y `dbMock.ts`)
* Cobertura con Istanbul (`nyc`)

### Estructura del proyecto

```
qa-challenge/
├── public/                 # HTML + JS original/instrumentado
│   ├── formulario.html
│   ├── js/
│   └── js-instrumented/
├── mocks/                 # API y base de datos simulada
│   ├── dbMock.ts
│   └── mockServer.ts
├── tests/                 # Casos de prueba automatizados
│   ├── formulario/
│   └── pages/
├── saveCoverage.ts        # Captura de window.__coverage__
├── .nyc_output/           # Datos crudos de cobertura
├── coverage/              # Reportes HTML generados
├── babel.config.js
├── playwright.config.ts
├── package.json
```

---

## Instalación y Ejecución

### 1. Requisitos previos
Asegurate de tener instalado:
* Node.js 18 o superior
* npm

### 2. Inicializar proyecto
```bash
git clone https://github.com/usuario/qa-challenge-playwright.git
cd qa-challenge-playwright
npm install
```

### 3. Ejecutar pruebas + cobertura
```bash
npm run todo
```

### 4. Ejecutar pruebas con navegador visible
```bash
npx playwright test --headed
```

### 5. Ver reporte de cobertura
Abrir en navegador: `coverage/index.html`

---

## Scripts disponibles

```json
"scripts": {
  "clean": "if exist public\\js-instrumented rmdir /s /q public\\js-instrumented && if exist .nyc_output rmdir /s /q .nyc_output && if exist coverage rmdir /s /q coverage",
  "instrumentar": "npx babel public/js --out-dir public/js-instrumented --source-maps",
  "test": "npx playwright test",
  "merge": "npx nyc merge .nyc_output coverage/coverage-final.json",
  "coverage": "npx nyc report --report-dir=coverage --reporter=html --reporter=text",
  "todo": "npm run clean && npm run instrumentar && npm run test && npm run merge && npm run coverage"
}
```

---

## Decisiones técnicas

### Estructura
* Se usó Page Object Model para facilitar mantenimiento y reutilización
* Los mocks están desacoplados de los tests para claridad

### Herramientas
* **Playwright**: moderno, soporte para interceptar API, y excelente DX
* **Istanbul (nyc)** + Babel: cobertura real del JS del navegador
* **TypeScript**: tipado fuerte para mayor robustez

### Supuestos
* La validación ocurre del lado del cliente
* `/api/registro` es simulado con `route.fulfill()`
* `window.__coverage__` es capturado y persistido en `.nyc_output`
* El formulario es accedido vía `http://localhost:3000/formulario.html?test`

---

## Resultados de Cobertura

El proyecto mantiene una cobertura de código superior al 60%, cubriendo:
* Validaciones de formulario
* Manejo de errores
* Funciones de interfaz de usuario
* Integración con API simulada