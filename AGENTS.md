# Память проекта MORAI

## Назначение и текущее состояние
Интернет-магазин парфюмерии MORAI AROMA на Next.js App Router. Магазин получает серверное оформление заказов и админ-панель; динамические заказы записываются в JSON-файл на VPS, база данных не используется. Для запуска нужны VPS, домен и GitHub Actions variables/secrets.

## Стек
- Next.js App Router, React, TypeScript; последние стабильные версии на момент начала реализации.
- Серверные компоненты по умолчанию, клиентские только для нужной интерактивности.
- Tailwind CSS, shadcn/ui; элементы интерфейса брать из shadcn/ui.
- Статьи блога — отдельные MDX-файлы в content/blog/ с front matter: title, description, publishedAt, featuredImage, categories.
- Списочные данные — JSON-файлы в content/. Базу данных не подключать.
- next-themes для тёмной темы, next/font для шрифтов, только лёгкие анимации.
- Не предлагать Vue, Svelte, Astro, WordPress или иные альтернативы Next.js.

## Бренд и тон
- Имя: MORAI AROMA.
- Специализация: селективная парфюмерия; ориентироваться на ассортимент и формулировки текущего сайта.
- Палитра: тёмная лесная, с золотыми акцентами и крупной антиквой — сохранять.
- Главная: слайдер/hero, преимущества, коллекции, бестселлеры, о бренде, отзывы, подписка и футер — сохранять порядок и смысловые секции текущей витрины.
- Тон: атмосферный, сдержанный и премиальный; писать понятно и конкретно, не обещать неподтверждённые свойства.

## Дизайн
Не придумывать дизайн с нуля. Интерфейсные компоненты брать из shadcn/ui. Секции hero, преимущества, цены, отзывы, CTA, FAQ, футер искать в открытых коллекциях Tailark, Magic UI, shadcn.io. Если подходящего блока нет — собирать из shadcn-компонентов, сохраняя их стиль и визуальный язык MORAI AROMA.

## SEO и изображения
- app/sitemap.ts, app/robots.ts.
- Каждая страница: уникальные title, description, OG-картинка, canonical URL через Metadata API / generateMetadata.
- JSON-LD: Organization или Person на главной, BlogPosting для статей, Review для отзывов, BreadcrumbList для навигации.
- Изображения через next/image, lazy loading там, где уместно; VPS позволяет использовать серверную оптимизацию Next.js Image.
- После деплоя отправлять в IndexNow список обновлённых URL для Bing и Яндекса.

## Деплой
- Для заказов и админ-панели Next.js работает в standalone режиме на VPS через Docker Compose за Nginx с HTTPS.
- Первичная настройка Ubuntu LTS: `sudo bash deploy/setup-vps.sh`. Скрипт настраивает Docker, deploy-пользователя, SSH-доступ, сертификат Let's Encrypt, `.env` и приложение.
- GitHub Actions проверяет main и деплоит через SSH, когда заданы repo variables `VPS_HOST`, `VPS_USER`, `VPS_APP_PATH`, `NEXT_PUBLIC_SITE_URL` и secrets `VPS_SSH_KEY`, `VPS_KNOWN_HOSTS`.
- Текущая статическая публикация GitHub Pages не поддерживает API заказов; VPS пока необходимо привязать к реальному домену и настроить GitHub Actions для работы динамической версии.
- Docker volume `orders_data` хранит `/app/data/orders.json` при обновлении контейнеров. Не коммитить и не пересылать файл с заказами.
- Вход `/admin` закрыт подписанной HttpOnly/Secure/SameSite cookie; пароль, логин и HMAC-секрет брать только из переменных `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`.
- Для IndexNow хранить ключ только в GitHub Actions Secret `INDEXNOW_KEY`.

## Черновая структура (сверить при проектировании)
```
app/
  layout.tsx, page.tsx, globals.css, sitemap.ts, robots.ts
  catalog/page.tsx
  catalog/[slug]/page.tsx
  collections/[slug]/page.tsx
  about/page.tsx
  blog/page.tsx
  blog/[slug]/page.tsx
  contacts/page.tsx
  delivery/page.tsx
  api/orders/route.ts
  api/admin/session/route.ts
  api/admin/orders/route.ts
  admin/page.tsx, admin/login/page.tsx
components/
  ui/                 # shadcn/ui
  layout/             # шапка, навигация, футер, хлебные крошки
  sections/           # секции главной и общие блоки
  products/           # карточки и витрины
content/
  products.json
  collections.json
  reviews.json
  navigation.json
  blog/               # статьи MDX
lib/                  # чтение контента, SEO, auth админки, JSON-хранилище заказов
components/admin/     # вход и панель заказов
data/orders.json      # локальные заказы; исключён из Git, на VPS путь в Docker volume
public/images/
scripts/               # IndexNow и инфраструктурные утилиты
deploy/nginx/default.conf.template
deploy/docker-compose.yml
deploy/setup-vps.sh
Dockerfile
.github/workflows/deploy.yml
AGENTS.md
```
Заказы принимаются серверным `POST /api/orders`, цены и имена продуктов сверяются по `content/products.json`. Заказы и статусы хранятся в JSON; не подключать базу данных.

## Рабочий процесс
- Перед большой задачей сначала выдать план с файлами и зависимостями. Ждать явную команду «делай».
- Работать небольшими итерациями, показывая результат для просмотра.
- После изменений запускать npm run dev и проверять сайт; ошибки исправлять самостоятельно.
- Перед коммитом просматривать diff, убирать мусор и закомментированный код.
- Короткие осмысленные коммиты по одной задаче.
- Самостоятельно дополнять этот файл новыми устойчивыми договорённостями.
- До «делай» не начинать большую миграцию или реализацию.

## Подтверждено пользователем
Пользователь подтвердил предложенные бренд MORAI AROMA, специализацию (селективная парфюмерия), тёмную лесную палитру с золотыми акцентами, секции главной из текущей витрины и сдержанный премиальный тон. См. раздел «Бренд и тон».

## Магазин, заказы и обратная связь
- Канал связи и заказов — ВКонтакте: `https://vk.ru/morai_aroma`, сообщения — `https://vk.me/morai_aroma`.
- На странице контактов форма открывает VK чат и копирует черновик сообщения с именем, контактом и вопросом; посетитель сам вставляет и отправляет его.
- Заказ оформляется в корзине по фамилии, имени и телефону. API пересчитывает позиции на сервере, затем сохраняет заказ в `orders.json`.
- В `app/admin` менеджер видит время создания, контакты, состав и сумму заказа и может обновить статус (новый, в работе, завершён).
- Для локального запуска админки задайте `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `ORDERS_FILE`. Docker Compose подключает named volume, не используйте локальный ephemeral filesystem продакшена.
- Сервисы не выполняют онлайн-оплату; клиенту отдельно подтверждаются наличие, доставка и итоговые детали заказа.
- Реальные новые товары и ценовые варианты не добавлять по догадке. Перед расширением каталога запросить названия, форматы, объёмы, цены, описания/ноты, наличие и фотографии.

## Публикация — незавершённые требования
- Перед запуском настроить домен A-записью на VPS и выполнить `deploy/setup-vps.sh`.
- Настроить Actions variables и secrets по `README.md`. До этого workflow выполняет проверку, а деплой пропускает.
- Добавить `INDEXNOW_KEY` в GitHub Actions Secrets (необязательно).
