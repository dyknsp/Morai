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

## GitHub Pages

Сайт публикуется на `https://dyknsp.github.io/Morai/` из ветки `main` с помощью `.github/workflows/deploy.yml`. Workflow собирает Next.js в статический экспорт с `basePath: /Morai`, загружает содержимое `out/` в GitHub Pages и проверяет главную страницу после публикации.

Перед первым запуском в настройках репозитория откройте **Settings → Pages → Build and deployment → Source** и выберите **GitHub Actions**. Push в `main` запускает публикацию; повторный запуск доступен через GitHub Actions → Build and publish MORAI AROMA to GitHub Pages → Run workflow.

Для IndexNow можно добавить repository secret `INDEXNOW_KEY` (32 шестнадцатеричных символа). Workflow положит в статический сайт файл подтверждения и отправит обновлённые URL после деплоя.

GitHub Pages раздаёт статические файлы, поэтому изображения обслуживаются исходными файлами без динамической оптимизации Next.js. Корзина и избранное работают в браузере; обратная связь и заказ открывают черновики в Telegram. Серверной обработки заказов и онлайн-оплаты нет.

## Данные магазина

- `content/products.json` — каталог товаров.
- `content/collections.json` — коллекции.
- `content/reviews.json` — отзывы.
- `content/brand.json` — описание бренда и доставки.
- `content/blog/*.mdx` — статьи с front matter.

## Основные папки

```text
app/                    страницы, маршруты и SEO
components/             интерфейсные компоненты и секции
content/                товары, коллекции, отзывы и статьи
public/images/          изображения сайта
deploy/                 Docker Compose и Nginx для VPS-сценария
scripts/                утилиты настройки сервера и IndexNow
.github/workflows/      CI и публикация на GitHub Pages
AGENTS.md               долговременные договорённости по проекту
```
