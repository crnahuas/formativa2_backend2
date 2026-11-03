import { productTypes } from "./productTypes.js";

export function validateArticle(values) {
  const errors = {};
  for (const [key, label] of [
    ["name", "nombre"],
    ["brand", "marca"],
  ]) {
    const value = typeof values[key] === "string" ? values[key].trim() : "";
    if (!value)
      errors[key] =
        `Ingresa ${key === "brand" ? "la" : "el"} ${label} del artículo.`;
    else if (value.length > 100)
      errors[key] = `El campo ${label} admite hasta 100 caracteres.`;
  }
  if (!productTypes.includes(values.type))
    errors.type = "Selecciona un tipo de producto.";
  return errors;
}

export function normalizeArticle(values) {
  return {
    name: values.name.trim(),
    brand: values.brand.trim(),
    type: values.type,
  };
}
