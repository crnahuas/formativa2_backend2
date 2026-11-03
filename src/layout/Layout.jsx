import { useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { isInventoryPath } from "../config/navigation.js";
import Header from "../components/Header.jsx";
import InventoryNav from "../components/InventoryNav.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import useRouteEffects from "../hooks/useRouteEffects.js";
import styles from "./Layout.module.css";

export default function Layout() {
  const mainRef = useRef(null);
  const { pathname } = useLocation();
  const management = isInventoryPath(pathname);
  useRouteEffects(mainRef);

  return (
    <div className={styles.appShell}>
      <a className={styles.skipLink} href="#contenido">
        Saltar al contenido
      </a>
      <Header management={management} />
      {management && <InventoryNav />}
      <main
        ref={mainRef}
        id="contenido"
        className={styles.mainContent}
        tabIndex={-1}
      >
        <Outlet />
      </main>
      <SiteFooter compact={management} />
    </div>
  );
}
