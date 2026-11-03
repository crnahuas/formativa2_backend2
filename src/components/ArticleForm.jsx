import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { pages } from "../config/navigation.js";
import { productTypes } from "../data/productTypes.js";
import { validateArticle } from "../data/articleValidation.js";
import { useInventory } from "../context/InventoryContext.jsx";
import Icon from "./Icon.jsx";
import styles from "./Inventory.module.css";

const emptyValues = { name: "", brand: "", type: "" };
const fields = [
  {
    key: "name",
    label: "Nombre del artículo",
    placeholder: "Ej.: Arroz grano largo",
  },
  { key: "brand", label: "Marca", placeholder: "Ej.: Tucapel" },
  { key: "type", label: "Tipo de producto" },
];

export default function ArticleForm() {
  const { addArticle } = useInventory();
  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState({});
  const [savedName, setSavedName] = useState("");
  const formRef = useRef(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setSavedName("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateArticle(values);
    setErrors(nextErrors);
    setSavedName("");
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      formRef.current.elements.namedItem(firstError)?.focus();
      return;
    }
    const saved = addArticle(values);
    setSavedName(saved.name);
    setValues(emptyValues);
    formRef.current.elements.namedItem("name")?.focus();
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className={styles.formCard}
    >
      <div className={styles.formHeading}>
        <h2>Datos del artículo</h2>
      </div>
      <p id="article-help" className={styles.formHelp}>
        * Campo obligatorio. Nombre y marca admiten hasta 100 caracteres.
      </p>
      <div className="mt-7 grid gap-6 sm:grid-cols-2">
        {fields.map(({ key, label, placeholder }) => {
          const props = {
            id: `article-${key}`,
            name: key,
            value: values[key],
            onChange: handleChange,
            onBlur: () =>
              setErrors((current) => ({
                ...current,
                [key]: validateArticle(values)[key],
              })),
            required: true,
            "aria-invalid": Boolean(errors[key]),
            "aria-describedby": errors[key]
              ? `article-help ${key}-error`
              : "article-help",
            className: styles.field,
          };
          return (
            <div
              key={key}
              className={key === "type" ? "sm:col-span-2" : undefined}
            >
              <label
                htmlFor={props.id}
                className="text-sm font-semibold text-ink"
              >
                {label}
              </label>
              <span aria-hidden="true" className={styles.requiredMark}>
                {" "}
                *
              </span>
              {key === "type" ? (
                <select {...props}>
                  <option value="" disabled>
                    Selecciona una categoría
                  </option>
                  {productTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  {...props}
                  type="text"
                  maxLength={100}
                  placeholder={placeholder}
                />
              )}
              {errors[key] && (
                <p
                  id={`${key}-error`}
                  role="alert"
                  className="mt-2 text-xs leading-5 text-danger"
                >
                  {errors[key]}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <div className={styles.formActions}>
        <button type="submit" className={styles.primaryButton}>
          <Icon name="plus" size={18} />
          Guardar artículo
        </button>
        <Link to={pages.inventory.path} className={styles.secondaryLink}>
          Ver inventario →
        </Link>
      </div>
      {savedName && (
        <p role="status" className={styles.success}>
          <Icon name="check" size={18} />
          <span>
            Se agregó «{savedName}» al inventario. Puedes ingresar otro artículo
            o consultar la tabla.
          </span>
        </p>
      )}
    </form>
  );
}
