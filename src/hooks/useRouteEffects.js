import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { getPageByPath } from "../config/navigation.js";

export default function useRouteEffects(mainRef) {
  const { pathname } = useLocation();
  const previousPath = useRef(pathname);

  useEffect(() => {
    document.title = getPageByPath(pathname).title;
    if (previousPath.current !== pathname) {
      window.scrollTo(0, 0);
      mainRef.current?.focus({ preventScroll: true });
      previousPath.current = pathname;
    }
  }, [pathname, mainRef]);
}
