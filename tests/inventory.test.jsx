import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../src/App.jsx";
import { INVENTORY_STORAGE_KEY } from "../src/context/InventoryContext.jsx";

function openPage(path = "/inventario") {
  return render(
    <MemoryRouter
      initialEntries={[path]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <App />
    </MemoryRouter>,
  );
}

function fillArticle(name, brand, type) {
  fireEvent.change(screen.getByLabelText("Nombre del artículo"), {
    target: { value: name },
  });
  fireEvent.change(screen.getByLabelText("Marca"), {
    target: { value: brand },
  });
  fireEvent.change(screen.getByLabelText("Tipo de producto"), {
    target: { value: type },
  });
  fireEvent.click(screen.getByRole("button", { name: "Guardar artículo" }));
}

describe("Gestión de inventario", () => {
  it.each([
    ["/inventario/", "Inventario (0)", "Inventario · Abasto"],
    ["/inventario/nuevo/", "Ingresar artículo", "Ingresar artículo · Abasto"],
  ])("conserva el enlace activo al abrir %s", (path, label, title) => {
    openPage(path);
    const menu = within(
      screen.getByRole("navigation", { name: "Gestión de inventario" }),
    );
    expect(
      menu.getByRole("link", { name: label }).getAttribute("aria-current"),
    ).toBe("page");
    expect(document.title).toBe(title);
  });
  it("abre la tabla vacía y permite entrar al formulario desde el nuevo menú", () => {
    openPage();
    expect(screen.getByRole("table")).toBeTruthy();
    expect(screen.getByText(/Aún no hay artículos/)).toBeTruthy();
    const menu = within(
      screen.getByRole("navigation", { name: "Gestión de inventario" }),
    );
    expect(
      menu
        .getByRole("link", { name: "Inventario (0)" })
        .getAttribute("aria-current"),
    ).toBe("page");
    fireEvent.click(menu.getByRole("link", { name: "Ingresar artículo" }));
    expect(document.title).toBe("Ingresar artículo · Abasto");
    expect(
      menu
        .getByRole("link", { name: "Ingresar artículo" })
        .getAttribute("aria-current"),
    ).toBe("page");
    expect(
      menu
        .getByRole("link", { name: "Inventario (0)" })
        .getAttribute("aria-current"),
    ).toBe(null);
    expect(document.activeElement).toBe(screen.getByRole("main"));
  });

  it("rechaza campos vacíos y espacios, informa los errores y enfoca el primer campo", () => {
    openPage("/inventario/nuevo");
    fireEvent.click(screen.getByRole("button", { name: "Guardar artículo" }));
    expect(screen.getAllByRole("alert")).toHaveLength(3);
    expect(document.activeElement).toBe(
      screen.getByLabelText("Nombre del artículo"),
    );
    fillArticle("   ", "   ", "Lácteos");
    expect(screen.getAllByRole("alert")).toHaveLength(2);
    expect(JSON.parse(localStorage.getItem(INVENTORY_STORAGE_KEY))).toEqual([]);
  });

  it("comparte artículos entre páginas, limpia el formulario y conserva los datos tras remontar la aplicación", () => {
    const view = openPage("/inventario/nuevo");
    fillArticle("  Arroz grano largo  ", "  Tucapel  ", "Abarrotes");
    expect(screen.getByRole("status").textContent).toContain(
      "Arroz grano largo",
    );
    expect(screen.getByLabelText("Nombre del artículo").value).toBe("");
    expect(screen.getByLabelText("Marca").value).toBe("");
    expect(screen.getByLabelText("Tipo de producto").value).toBe("");
    fillArticle("Leche entera", "Colun", "Lácteos");
    fireEvent.click(screen.getByRole("link", { name: "Ver inventario →" }));
    const table = within(screen.getByRole("table"));
    expect(
      table.getAllByRole("columnheader").map((cell) => cell.textContent),
    ).toEqual(["Nombre", "Marca", "Tipo de producto"]);
    expect(table.getAllByRole("row")).toHaveLength(3);
    expect(
      table.getByRole("rowheader", { name: "Arroz grano largo" }),
    ).toBeTruthy();
    expect(table.getByRole("rowheader", { name: "Leche entera" })).toBeTruthy();
    const milkRow = table
      .getByRole("rowheader", { name: "Leche entera" })
      .closest("tr");
    expect(within(milkRow).getByRole("cell", { name: "Colun" })).toBeTruthy();
    expect(within(milkRow).getByRole("cell", { name: "Lácteos" })).toBeTruthy();
    expect(document.title).toBe("Inventario · Abasto");
    fireEvent.click(screen.getByRole("link", { name: "Ver sitio público →" }));
    fireEvent.click(
      screen.getByRole("link", { name: "Gestión de inventario →" }),
    );
    expect(screen.getByText("2 artículos registrados")).toBeTruthy();
    view.unmount();
    openPage();
    expect(within(screen.getByRole("table")).getAllByRole("row")).toHaveLength(
      3,
    );
    const saved = JSON.parse(localStorage.getItem(INVENTORY_STORAGE_KEY));
    expect(
      saved.map(({ name, brand, type }) => ({ name, brand, type })),
    ).toEqual([
      { name: "Arroz grano largo", brand: "Tucapel", type: "Abarrotes" },
      { name: "Leche entera", brand: "Colun", type: "Lácteos" },
    ]);
    expect(new Set(saved.map(({ id }) => id)).size).toBe(2);
  });

  it.each([
    "{archivo dañado",
    '{"articulos":[]}',
    '[null,{"id":"a","name":"","brand":"x","type":"Lácteos"}]',
  ])(
    "permite iniciar aunque el almacenamiento contenga datos inválidos: %s",
    (value) => {
      localStorage.setItem(INVENTORY_STORAGE_KEY, value);
      openPage();
      expect(screen.getByText("0 artículos registrados")).toBeTruthy();
    },
  );

  it("mantiene el inventario en memoria e informa cuando el navegador no permite persistir", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Acceso bloqueado");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Cuota agotada");
    });
    openPage("/inventario/nuevo");
    expect(screen.getByRole("alert").textContent).toContain(
      "No se pudo guardar",
    );
    fillArticle("Pan integral", "Ideal", "Panadería");
    fireEvent.click(screen.getByRole("link", { name: "Ver inventario →" }));
    expect(
      screen.getByRole("rowheader", { name: "Pan integral" }),
    ).toBeTruthy();
  });
});
