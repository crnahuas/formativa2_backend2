import { NavLink, useLocation } from "react-router-dom";
import {
  getPageByPath,
  inventoryNavigationItems,
} from "../config/navigation.js";
import Container from "./Container.jsx";
import { useInventory } from "../context/InventoryContext.jsx";
import styles from "./Inventory.module.css";

export default function InventoryNav() {
  const { articles } = useInventory();
  const { pathname } = useLocation();
  const currentPage = getPageByPath(pathname);
  return (
    <div className={styles.navBar}>
      <Container>
        <div className={styles.navInner}>
          <nav aria-label="Gestión de inventario" className={styles.navLinks}>
            {inventoryNavigationItems.map(({ path, label }, index) => (
              <NavLink
                key={path}
                to={path}
                end={currentPage.path !== path}
                aria-label={
                  index === 0 ? `${label} (${articles.length})` : label
                }
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.navActive : ""}`
                }
              >
                {label}
                {index === 0 && (
                  <span className={styles.navCount}> ({articles.length})</span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </Container>
    </div>
  );
}
