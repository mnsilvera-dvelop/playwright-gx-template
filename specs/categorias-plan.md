# 📋 Plan de Pruebas - Categorías

## Descripción General
Casos de prueba para la funcionalidad de gestión de Categorías en el módulo de Servicios Médicos.  Se cubren los flujos críticos de visualización, búsqueda y gestión de rubros.

**Seed:** `tests/seed.spec.ts`

---

### 1. Visualizar Listado de Categorías Existentes

**Tipo:** Happy Path  
**Etiqueta:** `@smoke`

**Precondiciones:**
- Usuario autenticado en el sistema
- Acceso al módulo de Servicios Médicos con permisos para ver Categorías
- Base de datos contiene al menos 3 rubros registrados (LICENCIA con costo, PLENA > DE 30, EMPLEADO, etc.)

**Pasos:**
1. Navegar a la sección de Categorías desde el menú principal
2. Verificar que se cargue la lista de Categorías

**Resultado esperado:**
- Se muestra el grid/tabla con columnas: Id, Nombre, Es Colonia, Última Actualización, Activo
- Se visualizan todas las Categorías registradas en el sistema
- La paginación está disponible ("Página X de 8")
- Los datos se muestran de forma clara y legible

**Criterio de éxito:** El listado de Categorías carga correctamente con todas las columnas y datos visibles

**Criterio de fallo:** El listado no carga, faltan columnas, o no se muestran las Categorías

---

### 2. Buscar Categorías por Nombre

**Tipo:** Happy Path  
**Etiqueta:** `@regression`

**Precondiciones:**
- Usuario autenticado en el sistema
- En la vista del listado de Categorías
- Existe una categoría con nombre contiendo "AUXILIAR" (ej: AUXILIAR CATEGORÍA 2, AUXILIAR CATEGORÍA 4, AUXILIAR CATEGORÍA 5, ETC)

**Pasos:**
1. Localizar el campo de búsqueda con placeholder "Buscar"
2. Ingresar "AUXILIAR" en el campo
3. Presionar Enter o esperar el filtrado automático

**Resultado esperado:**
- El listado se filtra mostrando solo Categorías que contengan "AUXILIAR"
- Se muestran AUXILIAR CATEGORÍA 2, AUXILIAR CATEGORÍA 4 y AUXILIAR CATEGORÍA 5 en los resultados
- Otras Categorías se filtran correctamente (no aparecen EMPLEADO, LICENCIA sin costo, etc.)

**Criterio de éxito:** El filtro de búsqueda funciona correctamente en búsqueda full-text

**Criterio de fallo:** El filtro no funciona, muestra todas las Categorías, o no muestra resultados esperados

---

### 3. Limpiar Búsqueda de Categorías

**Tipo:** Validación  
**Etiqueta:** `@regression`

**Precondiciones:**
- Usuario autenticado en el sistema
- En el listado de Categorías con una búsqueda aplicada (ej: "AUXILIAR")
- El campo de búsqueda contiene texto

**Pasos:**
1. Eliminar el texto del campo de búsqueda
2. Presionar Enter o aguardar el cambio automático
3. Verificar que el listado complete se restaura

**Resultado esperado:**
- Se vacía el campo de búsqueda
- El listado vuelve a mostrar todas las Categorías sin filtrar
- Se visualizan nuevamente los 8 registros completos (según la paginación)

**Criterio de éxito:** La limpieza de búsqueda restaura el listado completo

**Criterio de fallo:** Persiste el filtro o los datos no se restauran completamente

---

## Notas Técnicas

### Selectores para GeneXus
- Usar `getByRole('table')` para el grid de rubros
- Usar `getByPlaceholder('Buscar')` para el campo de búsqueda
- Usar `getByText('Limpiar búsqueda')` para el botón de limpieza
- No usar IDs generados automáticamente (evitar selectores como `#gxEv_123`)

### Consideraciones de la Aplicación
- GeneXus puede mostrar overlays de carga durante postbacks
- Los tiempos de respuesta pueden variar, usar waits implícitos
- El texto de labels y botones está en español
- El grid tiene paginación: "Página 1 de 31"

---

## Cobertura del Plan
- ✅ Flujo smoke: Visualización del listado  
- ✅ Flujo regression: Búsqueda y filtrado  
- ✅ Validación: Limpieza de filtros

**Total de escenarios:** 3  
**Etiquetas:** @smoke (1), @regression (2)