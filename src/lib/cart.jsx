import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cart_v1") ?? "[]"); } catch { return []; }
  });
  useEffect(() => localStorage.setItem("cart_v1", JSON.stringify(items)), [items]);

  const addItem = (item) =>
    setItems(prev => [...prev, { id: (crypto?.randomUUID?.() ?? Date.now().toString()) + Math.random(), ...item }]);
  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id));
  const clear = () => setItems([]);

  const total = useMemo(() => items.reduce((s, i) => s + (i.total ?? 0), 0), [items]);
  const count = items.length;

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clear, total, count }}>
      {children}
    </CartContext.Provider>
  );
}
export const useCart = () => useContext(CartContext);
