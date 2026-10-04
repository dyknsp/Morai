"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function FeedbackForm() {
  const [notice, setNotice] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const message = [
      "Здравствуйте! Пишу с сайта MORAI AROMA.",
      `Имя: ${String(values.get("name") ?? "")}`,
      `Для ответа: ${String(values.get("replyTo") || "предпочитаю Telegram")}`,
      `Сообщение: ${String(values.get("message") ?? "")}`,
    ].join("\n");

    window.open(`https://t.me/morai_aroma?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    setNotice("Telegram откроется с готовым сообщением. Проверьте его и нажмите «Отправить».");
  }

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <h2>Написать нам</h2>
      <p>Расскажите, какой аромат или вопрос вас интересует. Сообщение откроется в Telegram — отправку можно будет подтвердить там.</p>
      <label htmlFor="feedback-name">Как к вам обращаться</label>
      <Input id="feedback-name" name="name" autoComplete="name" placeholder="Ваше имя" required />
      <label htmlFor="feedback-reply">Контакт для ответа <span>(необязательно)</span></label>
      <Input id="feedback-reply" name="replyTo" placeholder="Телефон или e-mail" />
      <label htmlFor="feedback-message">Ваш вопрос</label>
      <Textarea id="feedback-message" name="message" placeholder="Например, помогите выбрать аромат…" required />
      <Button type="submit">Продолжить в Telegram <ArrowUpRight size={16} /></Button>
      <p className="feedback-notice" aria-live="polite">{notice}</p>
    </form>
  );
}
