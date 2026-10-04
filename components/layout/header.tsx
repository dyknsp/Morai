"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, Menu, ShoppingBag, X } from "lucide-react";
import navigation from "@/content/navigation.json";
import { useStore } from "@/components/store/store-provider";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function Header() {
  const [open, setOpen] = useState(false);
  const { cartCount, favorites } = useStore();

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand-mark" href="/" aria-label="MORAI AROMA — на главную">
          <span>MORAI</span>
          <small>AROMA</small>
        </Link>
        <nav className={open ? "main-nav is-open" : "main-nav"} aria-label="Основная навигация">
          {navigation.primary.map((item) => (
            <Link href={item.href} key={item.label} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <Link href="/blog" onClick={() => setOpen(false)}>Журнал</Link>
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <Link className="icon-link" href="/favorites" aria-label={"Избранное, товаров: " + favorites.length}>
            <Heart size={18} />
            {favorites.length > 0 && <span className="count-badge">{favorites.length}</span>}
          </Link>
          <Link className="icon-link" href="/cart" aria-label={"Корзина, товаров: " + cartCount}>
            <ShoppingBag size={18} />
            {cartCount > 0 && <span className="count-badge">{cartCount}</span>}
          </Link>
          <button className="menu-toggle" type="button" aria-label={open ? "Закрыть меню" : "Открыть меню"} onClick={() => setOpen(!open)}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
