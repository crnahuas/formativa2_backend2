import { Link, NavLink, useLocation } from "react-router-dom";
import { getPageByPath, navigationItems, pages } from "../config/navigation.js";
import SiteLogo from "./SiteLogo.jsx";
import styles from "./Header.module.css";

export default function Header({ management = false }) {
  const { pathname } = useLocation();
  const isNotFound = getPageByPath(pathname) === pages.notFound;
  return (
    <header className={styles.siteHeader}>
      <div className={styles.headerInner}>
        <SiteLogo />
        {management ? (
          <>
            <p className={styles.managementLabel}>Gestión de inventario</p>
            <Link className={styles.managementEntry} to={pages.home.path}>
              Ver sitio público →
            </Link>
          </>
        ) : (
          <div className={styles.headerActions}>
            <nav className={styles.topNav} aria-label="Navegación principal">
              {navigationItems.map(({ path, label }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === pages.home.path || isNotFound}
                  className={({ isActive }) =>
                    isActive ? styles.active : undefined
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
            <Link className={styles.managementEntry} to={pages.inventory.path}>
              Gestión de inventario →
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
