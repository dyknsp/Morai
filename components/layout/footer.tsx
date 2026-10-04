import Link from "next/link";
import navigation from "@/content/navigation.json";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <Link className="brand-mark" href="/">
            <span>MORAI</span>
            <small>AROMA</small>
          </Link>
          <p className="footer-tagline">Ароматы, которые вдохновляют.</p>
        </div>
        <nav className="footer-nav" aria-label="Каталог">
          <span className="eyebrow">Магазин</span>
          <Link href="/catalog">Каталог</Link>
          <Link href="/#collections">Коллекции</Link>
          <Link href="/blog">Журнал</Link>
        </nav>
        <nav className="footer-nav" aria-label="Информация">
          <span className="eyebrow">Информация</span>
          <Link href="/about">О бренде</Link>
          <Link href="/delivery">Доставка и оплата</Link>
          <Link href="/contacts">Контакты</Link>
        </nav>
        <div className="footer-nav">
          <span className="eyebrow">Мы на связи</span>
          {navigation.social.map((item) => (
            <a href={item.href} key={item.label} target="_blank" rel="noreferrer">
              {item.label}
            </a>
          ))}
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} MORAI AROMA</span>
        <span>Селективная парфюмерия</span>
      </div>
    </footer>
  );
}
