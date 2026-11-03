import ArticleForm from "../components/ArticleForm.jsx";
import InventoryShell from "../components/InventoryShell.jsx";
import styles from "../components/Inventory.module.css";

export default function NewArticle() {
  return (
    <InventoryShell
      title="Ingresar artículo"
      description="Completa los datos del producto para agregarlo al inventario."
    >
      <div className={styles.registrationLayout}>
        <ArticleForm />
      </div>
    </InventoryShell>
  );
}
