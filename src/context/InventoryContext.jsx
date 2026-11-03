import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import {
  normalizeArticle,
  validateArticle,
} from "../data/articleValidation.js";

export const INVENTORY_STORAGE_KEY = "abasto.inventory.v1";
const InventoryContext = createContext(null);

function isValidArticle(article) {
  return (
    article &&
    typeof article.id === "string" &&
    article.id.length > 0 &&
    Object.keys(validateArticle(article)).length === 0
  );
}

function loadArticles() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(INVENTORY_STORAGE_KEY) ?? "[]",
    );
    return Array.isArray(saved) ? saved.filter(isValidArticle) : [];
  } catch {
    return [];
  }
}

function inventoryReducer(articles, action) {
  switch (action.type) {
    case "article/added":
      return [...articles, action.article];
    default:
      throw new Error(`Acción de inventario desconocida: ${action.type}`);
  }
}

export function InventoryProvider({ children }) {
  const [articles, dispatch] = useReducer(
    inventoryReducer,
    undefined,
    loadArticles,
  );
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(articles));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [articles]);

  function addArticle(values) {
    if (Object.keys(validateArticle(values)).length) {
      throw new Error(
        "Completa el nombre, la marca y un tipo de producto válido.",
      );
    }
    const article = { id: crypto.randomUUID(), ...normalizeArticle(values) };
    dispatch({ type: "article/added", article });
    return article;
  }

  return (
    <InventoryContext.Provider
      value={{
        articles,
        addArticle,
        storageError,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) throw new Error("useInventory requiere InventoryProvider.");
  return context;
}
