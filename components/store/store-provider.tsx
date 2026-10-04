"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type Cart = Record<string, number>;
type StoreValue = {
  cart: Cart;
  favorites: string[];
  cartCount: number;
  addToCart: (slug: string) => void;
  removeFromCart: (slug: string) => void;
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
};

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setCart(JSON.parse(localStorage.getItem("morai-cart") ?? "{}") as Cart);
      setFavorites(JSON.parse(localStorage.getItem("morai-favorites") ?? "[]") as string[]);
    } catch {
      localStorage.removeItem("morai-cart");
      localStorage.removeItem("morai-favorites");
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem("morai-cart", JSON.stringify(cart));
  }, [cart, ready]);

  useEffect(() => {
    if (ready) localStorage.setItem("morai-favorites", JSON.stringify(favorites));
  }, [favorites, ready]);

  const value = useMemo<StoreValue>(
    () => ({
      cart,
      favorites,
      cartCount: Object.values(cart).reduce((total, count) => total + count, 0),
      addToCart: (slug) => setCart((current) => ({ ...current, [slug]: (current[slug] ?? 0) + 1 })),
      removeFromCart: (slug) =>
        setCart((current) => {
          const next = { ...current };
          delete next[slug];
          return next;
        }),
      toggleFavorite: (slug) =>
        setFavorites((current) =>
          current.includes(slug) ? current.filter((favorite) => favorite !== slug) : [...current, slug],
        ),
      isFavorite: (slug) => favorites.includes(slug),
    }),
    [cart, favorites],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside StoreProvider");
  return context;
}
