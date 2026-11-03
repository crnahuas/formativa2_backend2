import { Link } from "react-router-dom";
import InventoryShell from "../components/InventoryShell.jsx";
import InventoryTable from "../components/InventoryTable.jsx";
import Icon from "../components/Icon.jsx";
import { useInventory } from "../context/InventoryContext.jsx";
import { pages } from "../config/navigation.js";
import styles from "../components/Inventory.module.css";

export default function Inventory() {
  const { articles } = useInventory();
  const typeCount = new Set(articles.map(({ type }) => type)).size;
  return (
    <InventoryShell
      title="Inventario"
      description="Consulta los artículos registrados, su marca y tipo de producto."
    >
      <div className={styles.summary}>
        <p>
          {articles.length}{" "}
          {articles.length === 1
            ? "artículo registrado"
            : "artículos registrados"}
        </p>
        <p>
          {typeCount}{" "}
          {typeCount === 1 ? "tipo de producto" : "tipos de producto"}
        </p>
      </div>
      <section
        className={styles.tableCard}
        aria-labelledby="article-list-title"
      >
        <div className={styles.tableToolbar}>
          <h2 id="article-list-title">Artículos</h2>
          {articles.length > 0 && (
            <Link to={pages.newArticle.path} className={styles.primaryButton}>
              <Icon name="plus" size={18} />
              Ingresar artículo
            </Link>
          )}
        </div>
        <InventoryTable articles={articles} />
        {articles.length > 0 && (
          <p className={styles.tableHint}>
            En pantallas pequeñas, desliza la tabla para ver todas las columnas.
          </p>
        )}
      </section>
    </InventoryShell>
  );
}
