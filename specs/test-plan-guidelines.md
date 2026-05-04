# 📋 Lineamientos para Generación de Test Plans

> Este archivo define las reglas que el Planner Agent debe seguir al generar
> planes de prueba. Debe ser referenciado en cada prompt del Planner.

---

## ✅ Qué incluir

- Cubrir únicamente los flujos **críticos y de alto valor** para el negocio.
- Por cada funcionalidad, incluir:
  - **1 escenario happy path** (flujo exitoso con datos válidos).
  - **1 escenario de error esperado** (el más probable o definido en los requisitos).
  - **1 escenario de validación** (campo obligatorio vacío o formato inválido), solo si aplica.
- Incluir precondiciones claras para cada escenario (estado de la app, datos previos necesarios, usuario requerido).
- Incluir criterios de éxito y de fallo concretos y verificables.
- Referenciar siempre el seed test correspondiente.

---

## ❌ Qué no incluir

- No generar más de **3 escenarios por funcionalidad** salvo que los requisitos lo justifiquen explícitamente.
- No generar escenarios para casos extremos no definidos en los requisitos (ej: campos con 10.000 caracteres, caracteres especiales exóticos, etc.).
- No duplicar escenarios que ya existen en otros planes del proyecto.
- No incluir pruebas de performance, carga o concurrencia.
- No incluir pruebas de compatibilidad de navegadores (eso se configura en `playwright.config.ts`).
- No generar escenarios de seguridad avanzada (SQL injection, XSS) salvo que se indique explícitamente.
- No asumir flujos que no estén visibles en la aplicación o descritos en los requisitos.

---

## 📐 Formato de cada escenario

Cada escenario debe seguir esta estructura exacta:

```
### [Número]. [Nombre del escenario]

**Tipo:** Happy Path | Error esperado | Validación

**Precondiciones:**
- (listar condiciones necesarias antes de ejecutar el test)

**Pasos:**
1. (acción concreta)
2. (acción concreta)
...

**Resultado esperado:**
- (qué debe ocurrir en pantalla)

**Criterio de éxito:** (condición verificable que indica que el test pasó)
**Criterio de fallo:** (condición verificable que indica que el test falló)
```

---

## 🏷️ Etiquetado obligatorio

Cada escenario debe ser etiquetado con una de estas categorías:

| Etiqueta | Cuándo usarla |
|---|---|
| `@smoke` | Flujo crítico que debe pasar en cada build. Máximo 2 por módulo. |
| `@regression` | Flujo importante pero no crítico. Se ejecuta en builds de staging. |
| `@wip` | Escenario en revisión. No se ejecuta en CI hasta que se apruebe. |

---

## 🌐 Consideraciones para aplicaciones GeneXus

- Los selectores deben basarse en `aria-label`, `getByRole()` o `getByLabel()`. Nunca usar IDs generados automáticamente por GeneXus.
- Tener en cuenta que GeneXus puede mostrar overlays de carga durante postbacks: los pasos deben contemplar esperas implícitas.
- Los botones en GeneXus suelen tener texto en español: usar el texto visible exacto en el plan.
- Los grids de GeneXus se identifican con la clase `.gx-grid`: los escenarios de búsqueda deben verificar filas en ese elemento.

---

## 📏 Límites de tamaño del plan

- Máximo **10 escenarios por archivo de plan**.
- Si una funcionalidad requiere más de 10 escenarios, dividir en múltiples archivos por submódulo.
- El plan completo no debe superar **300 líneas**.

---

## 💬 Prompt de ejemplo para invocar el Planner con estos lineamientos

```
Generate a test plan for the [nombre del módulo] module.
Follow the guidelines defined in docs/test-plan-guidelines.md.
Use tests/seed.spec.ts as seed.
Focus only on the flows described in the following requirements:
[pegar aquí el contenido de la tarjeta de Redmine o del documento de requisitos]
```

---

## 📁 Convención de nombres para los archivos de plan

```
specs/[modulo]-[submodulo]-plan.md

Ejemplos:
specs/login-plan.md
specs/clientes-alta-plan.md
specs/clientes-busqueda-plan.md
specs/facturacion-emision-plan.md
```

---

