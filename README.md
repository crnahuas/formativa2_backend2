# Supermercado Abasto

Aplicación web de un supermercado con páginas informativas y un módulo para registrar y consultar artículos del inventario. Cada artículo contiene nombre, marca y tipo de producto.

El sitio está desarrollado con React 18, React Router 6 y Vite. El diseño utiliza Tailwind CSS 4 y CSS Modules.

## Instalación y ejecución

Requiere Node.js 24.15 o superior en la rama 24 y npm.

Desde la carpeta del proyecto:

```bash
npm ci
npm run dev
```

Abre la dirección que muestra la terminal, normalmente `http://127.0.0.1:5173`. También puedes iniciar la aplicación con `npm start`.

## Páginas del sitio

| Ruta | Contenido |
| --- | --- |
| `/` | Inicio: presentación del supermercado y sus secciones. |
| `/nuestras-tiendas` | Direcciones, horarios y servicios de las tiendas. |
| `/preguntas-frecuentes` | Preguntas y respuestas en un acordeón. |
| `/inventario` | Tabla con todos los artículos registrados. |
| `/inventario/nuevo` | Formulario para ingresar un artículo. |

Las rutas inexistentes muestran una página con un enlace para volver al inicio.

## Cómo usar el inventario

1. Abre **Gestión de inventario** desde la cabecera del sitio.
2. Selecciona **Ingresar artículo** y completa nombre, marca y tipo de producto.
3. Presiona **Guardar artículo**. La aplicación valida los campos, confirma el registro y limpia el formulario para ingresar otro producto.
4. Abre **Inventario** para consultar los artículos en la tabla.

Todos los campos son obligatorios. Nombre y marca admiten hasta 100 caracteres. Los errores aparecen junto al campo correspondiente y los valores compuestos solo por espacios no se aceptan.

La sección de inventario tiene su propio menú y un pie compacto. El enlace **Ver sitio público** permite volver al inicio.

## Estado y almacenamiento

`InventoryProvider`, definido en `src/context/InventoryContext.jsx`, mantiene la lista de artículos mediante Context y `useReducer`. Envuelve las rutas de la aplicación para que los datos se conserven al cambiar de página.

El formulario `ArticleForm` controla sus campos con `useState`. Al enviar datos válidos, llama a `addArticle`, que asigna un identificador, normaliza los espacios de nombre y marca y agrega el artículo al estado global. `InventoryTable` muestra esa lista y `InventoryNav` refleja la cantidad de registros.

Los cambios se guardan en `localStorage` con la clave `abasto.inventory.v1`. Al abrir o recargar la aplicación, se recuperan los artículos guardados. Los datos pertenecen al navegador utilizado y no se sincronizan entre dispositivos. Si el navegador bloquea el almacenamiento, la aplicación muestra un aviso y conserva los artículos en memoria mientras permanece abierta.

## Organización del proyecto

```text
public/
  images/                      Fotografías del sitio
src/
  index.jsx                    Montaje de React y BrowserRouter
  App.jsx                      Proveedor de inventario y rutas
  components/                  Cabecera, pie, formulario, tabla y otros bloques reutilizables
  pages/                       Inicio, tiendas, preguntas, inventario, ingreso y página 404
  config/navigation.js         Rutas, etiquetas y títulos de las páginas
  context/InventoryContext.jsx Estado global y almacenamiento del inventario
  data/                        Contenido del sitio, tipos de producto y validación
  hooks/useRouteEffects.js     Título del navegador, desplazamiento y foco al navegar
  layout/Layout.jsx           Estructura común de las páginas públicas y del inventario
  routes/AppRoutes.jsx         Asociación de cada ruta con su página
  styles/                      Estilos globales, paleta y configuración de Tailwind
tests/                        Pruebas de navegación e inventario
```

Los archivos `.module.css` mantienen los estilos asociados a cada componente. Tailwind complementa el diseño con utilidades de tipografía, espaciado y distribución adaptable. La paleta se define en `src/styles/global.css`.

## Pruebas y compilación

```bash
npm test
npm run build
npm run preview
```

Las pruebas utilizan Vitest y Testing Library para comprobar navegación, registro de artículos, validación, actualización de la tabla y persistencia de los datos.

`npm run build` genera la versión de producción en `dist/`. `npm run preview` permite revisarla localmente. Al desplegar la aplicación, el servidor debe redirigir las rutas a `index.html` para permitir el acceso directo a cada página.
