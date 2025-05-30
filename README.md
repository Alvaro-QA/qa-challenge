# 🧪 QA Automation Challenge – Formulario de Registro

## 📋 Descripción del Desafío

Este proyecto automatiza los tests funcionales de un formulario de registro web, utilizando **Playwright**, bajo una estructura modular y escalable (Page Object Model). Se implementa validación de formularios, mocks de API, y cobertura de código usando **Istanbul (nyc)**.

---

## 📌 Requerimientos del Formulario

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

## ✅ Casos de prueba implementados

### 1. Casos obligatorios:

* ✅ Registro exitoso con datos válidos
* ✅ Fallo por email inválido (dominio incorrecto, sin dominio, sin arroba)
* ✅ Fallo por contraseñas no coincidentes

### 2. Casos adicionales:

* ⚠️ Envío con todos los campos vacíos (validación múltiple)
* ⚠️ Edad con valor negativo o texto
* ⚠️ Email duplicado (API mock responde como existente)
* ♿ Verificación de accesibilidad básica (`aria-*`, `label/for`)

### 3. Validaciones de negocio:

* 🔎 Email debe terminar en `@empresa.com.ar`
* 🔄 Edad positiva si se completa
* 🔒 Confirmación de contraseñas
* 🔧 Integración con mock API y "base de datos" simulada

---

## 🧠 Interpretación y criterios

* El formulario es accedido vía `http://localhost:3000/formulario.html`
* Se validan datos antes de enviar
* Se espera una respuesta mockeada desde `/api/registro`
* Se aplican validaciones semánticas y accesibilidad mínima (`aria-*`)

---

## 🧪 Automatización con Playwright

### 🔹 Herramientas

* [x] Playwright + TypeScript
* [x] Page Object Model
* [x] API Mock (`mockServer.ts` y `dbMock.ts`)
* [x] Cobertura con Istanbul (`nyc`)

### 🔹 Estructura del proyecto

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

## 🛠 Cómo preparar y ejecutar el entorno

### 1. Requisitos previos

Asegurate de tener instalado:

* Node.js 18 o superior
* npm

### 2. Inicializar y configurar el entorno

Si clonaste el repositorio:

```bash
npm install
```

Si estás empezando desde cero:

```bash
npm init -y
npm install -D @playwright/test
npx playwright install
npm install -D nyc @babel/core @babel/preset-env @babel/cli babel-plugin-istanbul
npm install -D serve
```

### 3. Ejecutar pruebas + coberturabash

npm install

````

### 2. Ejecutar pruebas + cobertura
```bash
npm run todo
````

### 3. Ejecutar pruebas con navegador visible

```bash
npx playwright test --headed
```

### 4. Ver reporte de cobertura

Abrir en navegador:

```
coverage/index.html
```

---

## 📜 Scripts disponibles (`package.json`)

```json
"scripts": {
  "instrumentar": "npx babel public/js/validaciones.js -o public/js-instrumented/validaciones.js",
  "test": "npx playwright test",
  "gui": "npx playwright test --headed",
  "coverage": "npx nyc report --reporter=html",
  "todo": "npm run instrumentar && npm run test && npm run coverage"
}
```

---

## 🧠 Decisiones tomadas

### Estructura

* Se usó POM para facilitar mantenimiento y reutilización
* Los mocks están desacoplados de los tests para claridad

### Herramientas

* **Playwright**: moderno, soporte para interceptar API, y excelente DX
* **Istanbul (nyc)** + Babel: cobertura real del JS del navegador
* **PowerShell** + scripts npm: ejecución sencilla del flujo de testing

### Supuestos

* La validación ocurre del lado del cliente
* `/api/registro` es simulado con `route.fulfill()`
* `window.__coverage__` es capturado y persistido en `.nyc_output`

---

## ✅ Preparado para entregar

```bash
git clone https://github.com/usuario/qa-challenge-playwright.git
cd qa-challenge-playwright
npm install
npm run todo
```
