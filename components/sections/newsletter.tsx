"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import home from "@/content/home.json";
import navigation from "@/content/navigation.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  const [message, setMessage] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Форма рассылки пока настраивается. Напишите нам в Telegram.");
  }

  return (
    <section className="newsletter-section">
      <div className="shell newsletter-inner">
        <h2>{home.newsletterTitle}</h2>
        <form className="newsletter-form" onSubmit={onSubmit}>
          <Input aria-label="Ваш e-mail" type="email" placeholder="Ваш e-mail" required />
          <Button type="submit" size="icon" aria-label="Подписаться"><ArrowRight size={17} /></Button>
          <p className="form-message" aria-live="polite">{message}</p>
        </form>
        <div className="social-links">
          <span className="eyebrow">Мы в соцсетях</span>
          {navigation.social.map((item) => (
            <a href={item.href} key={item.label} target="_blank" rel="noreferrer">{item.label}</a>
          ))}
        </div>
      </div>
    </section>
  );
}
