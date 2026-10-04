# MORAI AROMA

Интернет-магазин парфюмерии на Next.js App Router, React и TypeScript. Контент магазина хранится в `content/*.json`, статьи — в `content/blog/*.mdx`.

## Локальная разработка

Требуются Node.js 24 и pnpm 11.25.0.

```powershell
pnpm install
pnpm dev
```

Проверки:

```powershell
pnpm test
pnpm typecheck
pnpm build
```

Для локальной админки задайте переменные окружения `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` и `ORDERS_FILE`. Адрес панели — `/admin`; если переменные входа отсутствуют, авторизация закрыта.

## Заказы и админ-панель

Покупатель оформляет заказ из корзины, указывая фамилию, имя и телефон. Сервер перепроверяет товары и цены по каталогу и добавляет заказ в JSON-файл. Заказы доступны после входа в `/admin`; в панели можно открыть номер телефона, проверить состав и менять статус заказа.

База данных не используется. На VPS JSON-файл хранится в постоянном Docker volume `orders_data`, поэтому он сохраняется после обновления контейнера. Не публикуйте и не коммитьте данные из заказов.

## VPS и деплой

Приложению нужен сервер Node.js: GitHub Pages поддерживает только статическую раздачу и не может принимать заказы или обслуживать админ-панель. GitHub Actions проверяет контент, типы и production-сборку при каждом push в `main`. Деплой пропускается до заполнения VPS variables и secrets.

Для первичной настройки используйте Ubuntu LTS, настройте DNS A-запись домена на IP сервера и создайте SSH-ключ Ed25519 для GitHub Actions (`ssh-keygen -t ed25519 -C morai-github-deploy`). Передайте скрипту содержимое публичного файла `.pub`; приватный ключ останется у вас и будет сохранён в GitHub Actions secret. Запустите из корня проекта:

```bash
sudo bash deploy/setup-vps.sh
```

Скрипт установит Docker Engine и Compose, настроит пользователя деплоя, получит Let's Encrypt сертификат, создаст защищённый `.env` и запустит приложение. Он запросит домен, email для сертификата, публичную часть SSH-ключа и логин/пароль админки.

Задайте в GitHub → Settings → Secrets and variables → Actions:

Repository variables:

- `VPS_HOST` — домен или IP сервера.
- `VPS_USER` — `morai-deploy`.
- `VPS_APP_PATH` — `/opt/morai`.
- `NEXT_PUBLIC_SITE_URL` — публичный HTTPS адрес сайта.

Repository secrets:

- `VPS_SSH_KEY` — соответствующий приватный SSH-ключ.
- `VPS_KNOWN_HOSTS` — проверенный вывод `ssh-keyscan -H <VPS_HOST>`.
- `INDEXNOW_KEY` — необязательно, 32 шестнадцатеричных символа.

Сверьте SSH host-key fingerprint с данными провайдера VPS перед тем, как сохранять вывод `ssh-keyscan`.

После настройки secrets и variables push в `main` проверит проект и обновит контейнер на сервере. Проверка доступности сайта выполняется после перезапуска.

> Пока VPS и GitHub Actions variables/secrets не настроены, этот workflow не публикует динамическое приложение на GitHub Pages. Последняя статическая версия Pages останется доступна по прежней ссылке, но приём заказов и админка там работать не будут.

## Данные магазина

- `content/products.json` — каталог товаров.
- `content/collections.json` — коллекции.
- `content/reviews.json` — отзывы.
- `content/brand.json` — описание бренда и доставки.
- `content/blog/*.mdx` — статьи с front matter.
- `data/orders.json` — файл заказов при локальной разработке; исключён из Git.

## Основные папки

```text
app/                    страницы, API-маршруты и SEO
components/             интерфейсные компоненты и секции
content/                товары, коллекции, отзывы и статьи
lib/                    контент, SEO, аутентификация, хранение заказов
public/images/          изображения сайта
deploy/                 Docker Compose, Nginx и настройка VPS
scripts/                утилиты IndexNow
.github/workflows/      проверка и деплой на VPS
AGENTS.md               долговременные договорённости по проекту
```
