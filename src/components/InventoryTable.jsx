import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";
import { pages } from "../config/navigation.js";
import styles from "./Inventory.module.css";

export default function InventoryTable({ articles }) {
  return (
    <div
      className={styles.tableScroll}
      role="region"
      aria-label="Tabla de inventario"
      tabIndex={0}
    >
      <table
        className={`w-full border-collapse text-left text-sm ${articles.length ? styles.populatedTable : ""}`}
      >
        <caption className="sr-only">
          Artículos disponibles en el inventario de Abasto
        </caption>
        <thead>
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Marca</th>
            <th scope="col">Tipo de producto</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article.id}>
              <th scope="row">
                <span className={styles.articleName}>{article.name}</span>
              </th>
              <td>{article.brand}</td>
              <td>{article.type}</td>
            </tr>
          ))}
          {articles.length === 0 && (
            <tr>
              <td colSpan={3} className={styles.emptyState}>
                <span className={styles.emptySymbol}>
                  <Icon name="box" size={28} />
                </span>
                <h3>Aún no hay artículos</h3>
                <p>Agrega un producto con su nombre, marca y tipo.</p>
                <Link
                  to={pages.newArticle.path}
                  className={styles.primaryButton}
                >
                  <Icon name="plus" size={18} />
                  Agregar primer artículo
                </Link>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
