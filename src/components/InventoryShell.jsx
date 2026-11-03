import Container from "./Container.jsx";
import { useInventory } from "../context/InventoryContext.jsx";
import styles from "./Inventory.module.css";

export default function InventoryShell({ title, description, children }) {
  const { storageError } = useInventory();
  return (
    <section className={styles.shell} aria-labelledby="inventory-title">
      <Container>
        <header className={styles.pageHeading}>
          <h1 id="inventory-title">{title}</h1>
          <p className={styles.description}>{description}</p>
        </header>
        {storageError && (
          <p role="alert" className={styles.storageAlert}>
            No se pudo guardar en este navegador. Tus artículos seguirán
            disponibles mientras mantengas abierta la aplicación, pero podrían
            perderse al recargar.
          </p>
        )}
        <div className="mt-8 sm:mt-10">{children}</div>
      </Container>
    </section>
  );
}
