import { matchPath } from "react-router-dom";

export const siteName = "Abasto";
const page = (path, label) => ({
  path,
  label,
  title: `${label} · ${siteName}`,
});

export const pages = {
  home: page("/", "Inicio"),
  stores: page("/nuestras-tiendas", "Nuestras tiendas"),
  faq: page("/preguntas-frecuentes", "Preguntas frecuentes"),
  inventory: page("/inventario", "Inventario"),
  newArticle: page("/inventario/nuevo", "Ingresar artículo"),
  notFound: page("*", "Página no encontrada"),
};

export const navigationItems = [pages.home, pages.stores, pages.faq];
export const inventoryNavigationItems = [pages.inventory, pages.newArticle];

export function getPageByPath(pathname) {
  return (
    [...navigationItems, ...inventoryNavigationItems].find(({ path }) =>
      matchPath({ path, end: true }, pathname),
    ) ?? pages.notFound
  );
}

export function isInventoryPath(pathname) {
  return Boolean(matchPath("/inventario/*", pathname));
}
