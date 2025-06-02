# QA Automation Challenge - Formulario de Registro

## Descripcion del Desafio

Este proyecto automatiza los tests funcionales de un formulario de registro web, utilizando **Playwright**, bajo una estructura modular y escalable (Page Object Model). Se implementa validacion de formularios, mocks de API, y cobertura de codigo usando **Istanbul (nyc)**.

---

## Requerimientos del Formulario

El formulario debe contener:

* **Nombre completo** (obligatorio)
* **Email** (obligatorio, valido, dominio `@empresa.com.ar`)
* **Edad** (opcional, pero debe ser un numero positivo si se completa)
* **Contrasena** (obligatoria, minimo 6 caracteres)
* **Repetir contrasena** (debe coincidir con la anterior)
* **Boton Enviar**

Mensajes de error se muestran junto a los campos si hay errores. Si el formulario es valido, se muestra:

```
Registro exitoso. Bienvenido/a, [Nombre]!
```

---

## Interpretacion de Requerimientos y Decisiones de Testing

### a. Interpretacion de los requerimientos del formulario

**Campos obligatorios:**
- Interprete que "nombre completo" debe tener al menos 2 caracteres para ser considerado valido
- El email debe seguir formato estandar pero con restriccion especifica de dominio corporativo
- La contrasena debe tener minimo 6 caracteres como medida de seguridad basica

**Campos opcionales:**
- La edad, si se proporciona, debe estar en un rango logico (18-99 años)
- Valores menores a 18 o superiores a 99 se consideran invalidos (mayoria de edad requerida)

**Validaciones de negocio:**
- Email corporativo obligatorio (`@empresa.com.ar`) para restringir acceso solo a empleados
- Confirmacion de contraseña para prevenir errores de tipeo
- Validaciones especificas para mejorar experiencia de usuario

### b. Justificacion de casos de prueba elegidos

**Casos basicos obligatorios:**
1. **Registro exitoso** - Valida el flujo principal de negocio
2. **Email invalido** - Prueba la validacion mas critica del sistema
3. **Contrasenas no coincidentes** - Previene errores comunes de usuario

**Casos adicionales estrategicos:**
4. **Campos vacios** - Verifica que todas las validaciones obligatorias funcionen simultaneamente
5. **Edad menor a mayoria de edad** - Prueba validacion de rangos y tipos de datos
6. **Email duplicado** - Simula restriccion de base de datos realista
7. **Accesibilidad** - Garantiza usabilidad
8. **Validaciones especificas** - Prueba casos extremos y formatos

### c. Criterios de negocio aplicados

**Seguridad:**
- Solo emails corporativos (`@empresa.com.ar`) pueden registrarse
- Contrasenas minimas de 6 caracteres
- Confirmacion obligatoria de contrasena

**Experiencia de usuario:**
- Validaciones antes del envio del formulario
- Mensajes de error especificos y claros
- Indicadores visuales de fortaleza de contrasena

**Integridad de datos:**
- Prevencion de emails duplicados
- Validacion de tipos de datos (edad numerica)
- Rangos logicos para campos numericos (18-99 anos para mayoria de edad)

**Accesibilidad:**
- Etiquetas ARIA para lectores de pantalla
- Asociacion correcta de labels con inputs
- Navegacion por teclado funcional

---

## Casos de prueba implementados

### 1. Casos obligatorios:
* Registro exitoso con datos validos
* Fallo por email invalido (dominio incorrecto, sin dominio, sin arroba)
* Fallo por contrasenas no coincidentes

### 2. Casos adicionales:
* Envio con todos los campos vacios (validacion multiple)
* Edad menor a mayoria de edad o fuera de rango
* Email duplicado (API mock responde como existente)
* Verificacion de accesibilidad basica (`aria-*`, `label/for`)

### 3. Validaciones de negocio:
* Email debe terminar en `@empresa.com.ar`
* Edad positiva si se completa
* Confirmacion de contrasenas
* Integracion con mock API y "base de datos" simulada

---

## Automatizacion con Playwright

### Herramientas
* Playwright + TypeScript
* Page Object Model
* API Mock (`mockServer.ts` y `dbMock.ts`)
* Cobertura con Istanbul (`nyc`)
* Reportes HTML de pruebas y cobertura

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
├── test-results/          # Reportes HTML de pruebas
├── coverage/              # Reportes HTML de cobertura
├── .nyc_output/           # Datos crudos de cobertura
├── babel.config.js
├── playwright.config.ts
├── package.json
```

---

## Instalacion y Ejecucion

### 1. Requisitos previos
Asegurate de tener instalado:
* Node.js 18 o superior
* npm

### 2. Inicializar proyecto
```bash
git clone https://github.com/Alvaro-QA/qa-challenge.git
cd qa-challenge
npm install
```

### 3. Instalar Playwright (si no lo tienes)
```bash
# Instalar Playwright
npm install -D @playwright/test

# Instalar navegadores
npx playwright install

# Verificar instalacion
npx playwright --version
```

### 4. Comandos rápidos
```bash
# Ejecutar test + cobertura
npm run todo

# Solo pruebas con interfaz
npx playwright test --headed

# Ver reportes
npm run test-report
```

### 5. Ver reportes generados
* **Reporte de pruebas:** `test-results/index.html`
* **Reporte de cobertura:** `coverage/index.html`

```bash
# Verificar archivos generados
npm run check-reports
```

---

## Scripts disponibles

```json
"scripts": {
  "clean": "if exist public\\js-instrumented rmdir /s /q public\\js-instrumented && if exist .nyc_output rmdir /s /q .nyc_output && if exist coverage rmdir /s /q coverage && if exist test-results rmdir /s /q test-results",
  "instrumentar": "npx babel public/js --out-dir public/js-instrumented --source-maps",
  "test": "npx playwright test",
  "merge": "npx nyc merge .nyc_output coverage/coverage-final.json",
  "coverage": "npx nyc report --report-dir=coverage --reporter=html --reporter=text",
  "test-report": "npx playwright show-report",
  "todo": "npm run clean && npm run instrumentar && npm run test && npm run merge && npm run coverage && echo \"Reportes generados: coverage/index.html y test-results/index.html\"",
  "check-reports": "dir test-results && dir coverage"
}
```

---

## Troubleshooting Común

**Error: Playwright no encontrado**
```bash
npx playwright install
```

**Error: Puerto ocupado**
- Cambiar puerto en playwright.config.ts

**Error: No se generan reportes**
```bash
# Limpiar y ejecutar todo desde cero
npm run clean
npm run todo
```

---

## Decisiones Tecnicas

### Eleccion de Herramientas

**Playwright sobre Cypress/Selenium:**
- **Ventaja tecnica**: Soporte nativo para multiples navegadores sin configuracion adicional
- **API moderna**: Manejo asincrono nativo y mejor rendimiento
- **Interceptacion de red**: Capacidad robusta para mockear APIs sin herramientas externas
- **Estabilidad**: Menor flakiness comparado con Selenium, mejor debugging que Cypress

### Arquitectura y Estructura

**Page Object Model (POM):**
- **Beneficios**: Reduce duplicacion de codigo, facilita mantenimiento, mejora legibilidad
- **Implementacion**: FormularioPage encapsula toda la interaccion con el DOM

**Separacion de responsabilidades:**
- **Tests**: Solo logica de casos de prueba
- **Pages**: Interacciones con UI
- **Mocks**: Simulacion de backend desacoplada

### Interpretacion de Requerimientos Ambiguos

**Casos no especificados que interprete:**

1. **Nombre minimo 2 caracteres**:
   - **Razonamiento**: Evitamos valores vacíos o entradas inválidas como una sola letra (ej. "A", "Z"), que no suelen representar un nombre real.
   - **Decision**: Establecer un mínimo de 2 caracteres para asegurar un input mínimamente válido y evitar errores de carga o abuso.

2. **Campo "Edad" – Reglas de validación:**

   - **Rango permitido: 18 a 99 años (inclusive)**.
   - **Razonamiento**: Se trata de un formulario interno orientado a empleados o usuarios adultos. Se asume que menores no deben registrarse y que valores extremos (ej. 120 años) no son representativos en este contexto

3. **Email corporativo obligatorio**:
   - *Razonamiento*: El challenge sugiere "@empresa.com.ar" como ejemplo
   - *Decision*: Convertir sugerencia en regla de negocio estricta

4. **Validaciones ambiguas implementadas**:
   - Edad negativa (-5 → 15 años, menor de edad)
   - Texto en lugar de numero para edad
   - Nombres de 1 caracter
   - Emails sin @ o dominio incompleto

### Estrategia de Testing

**Casos obligatorios + casos extremos:**
- **Cobertura completa**: No solo casos felices, sino edge cases
- **Validaciones simultaneas**: Formulario vacio para probar multiples errores
- **Integracion real**: API mock + base de datos simulada

**Criterios de aceptacion interpretados:**
- **UX**: Mensajes de error claros y especificos
- **Seguridad**: Solo emails corporativos
- **Accesibilidad**: ARIA labels y navegacion por teclado
- **Performance**: Validaciones eficientes

### Configuracion Tecnica

**Cobertura de codigo (Istanbul + NYC):**
- **Implementacion**: Instrumentacion manual con Babel para capturar window.__coverage__
- **Ventaja**: Cobertura real del JavaScript ejecutado en el navegador

**API Mocking:**
- **Enfoque**: route.fulfill() de Playwright vs herramientas externas
- **Beneficio**: Sin dependencias adicionales, control total sobre respuestas
- **Casos cubiertos**: Registro exitoso, email duplicado, errores de servidor

### Supuestos y Limitaciones

**Supuestos tomados:**
1. **Validacion client-side**: El JavaScript maneja validaciones antes del envio
2. **Entorno local**: Servidor estatico con npx serve
3. **Navegador target**: Chromium como navegador principal
4. **Datos persistentes**: Mock database simula persistencia entre requests

**Limitaciones aceptadas:**
1. **Un solo navegador**: Chromium solamente (vs cross-browser)
2. **Sin backend real**: Simulacion completa con mocks
3. **Cobertura manual**: Sin integracion automatica con CI/CD

### Decisiones de Negocio Aplicadas

**Politicas empresariales simuladas:**
- **Email corporativo**: Solo @empresa.com.ar permitido
- **Mayoria de edad**: 18-99 años para empleados
- **Seguridad**: Minimo 6 caracteres en contraseñas
- **Prevencion duplicados**: Un email = un usuario

**Criterios de calidad:**
- **>60% cobertura**: Objetivo realista para proyecto de testing
- **Tests descriptivos**: Nombres claros sobre que valida cada test
- **Documentacion completa**: README como especificacion funcional

---

## Resultados de Cobertura

El proyecto mantiene una cobertura de codigo superior al 60%, cubriendo:
* Validaciones de formulario
* Manejo de errores
* Funciones de interfaz de usuario
* Integracion con API simulada

## Reportes Generados

Despues de ejecutar `npm run todo`, se generan dos reportes HTML:

1. **Reporte de Pruebas** (`test-results/index.html`):
   - Estado de cada test (paso/fallo)
   - Tiempos de ejecucion
   - Screenshots y videos en caso de fallos
   - Trazas detalladas de ejecucion

2. **Reporte de Cobertura** (`coverage/index.html`):
   - Porcentaje de lineas cubiertas
   - Funciones ejecutadas vs no ejecutadas
   - Ramas de codigo cubiertas
   - Navegacion interactiva por archivos