import { Route, Routes } from "react-router-dom";
import { pages } from "../config/navigation.js";
import Layout from "../layout/Layout.jsx";
import Home from "../pages/Home.jsx";
import Stores from "../pages/Stores.jsx";
import Faq from "../pages/Faq.jsx";
import NotFound from "../pages/NotFound.jsx";
import Inventory from "../pages/Inventory.jsx";
import NewArticle from "../pages/NewArticle.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={pages.home.path} element={<Home />} />
        <Route path={pages.stores.path} element={<Stores />} />
        <Route path={pages.faq.path} element={<Faq />} />
        <Route path={pages.inventory.path} element={<Inventory />} />
        <Route path={pages.newArticle.path} element={<NewArticle />} />
        <Route path={pages.notFound.path} element={<NotFound />} />
      </Route>
    </Routes>
  );
}
