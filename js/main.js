/* ==========================================================================
   MORAI AROMA — интерактив
   Слайдер баннера, мобильное меню, избранное, корзина, отзывы, подписка
   ========================================================================== */
(function () {
  'use strict';

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     Уведомления
     ------------------------------------------------------------------ */
  var toastEl = $('[data-toast]');
  var toastTimer = null;

  function toast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toastEl.classList.remove('is-visible');
    }, 2800);
  }

  /* ------------------------------------------------------------------
     Шапка: фон при прокрутке
     ------------------------------------------------------------------ */
  var header = $('#header');

  function syncHeader() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  }

  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  /* ------------------------------------------------------------------
     Мобильное меню
     ------------------------------------------------------------------ */
  var burger = $('[data-burger]');
  var nav = $('#nav');

  function setNav(open) {
    if (!nav || !burger) return;
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  }

  if (burger) {
    burger.addEventListener('click', function () {
      setNav(!nav.classList.contains('is-open'));
    });
  }

  if (nav) {
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setNav(false);
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') setNav(false);
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 940) setNav(false);
  });

  /* ------------------------------------------------------------------
     Слайдер главного баннера
     ------------------------------------------------------------------ */
  var slider = $('[data-slider]');

  if (slider) {
    var slides = $$('[data-slide]', slider);
    var indexEls = [$('[data-slide-current]', slider), $('[data-slide-current-2]', slider)];
    var totalEl = $('[data-slide-total]', slider);
    var progressEl = $('[data-slide-progress]', slider);
    var current = 0;
    var timer = null;
    var DELAY = 7000;

    var pad = function (n) { return String(n).padStart(2, '0'); };

    if (totalEl) totalEl.textContent = pad(slides.length);

    function show(next) {
      if (!slides.length) return;
      current = (next + slides.length) % slides.length;

      slides.forEach(function (slide, i) {
        var active = i === current;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
      });

      indexEls.forEach(function (el) {
        if (el) el.textContent = pad(current + 1);
      });

      if (progressEl) {
        progressEl.style.setProperty('--progress', (((current + 1) / slides.length) * 100).toFixed(2) + '%');
      }
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    function start() {
      stop();
      if (reducedMotion || slides.length < 2) return;
      timer = window.setInterval(function () { show(current + 1); }, DELAY);
    }

    var prevBtn = $('[data-slide-prev]', slider);
    var nextBtn = $('[data-slide-next]', slider);

    if (prevBtn) prevBtn.addEventListener('click', function () { show(current - 1); start(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { show(current + 1); start(); });

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    slider.addEventListener('focusin', stop);
    slider.addEventListener('focusout', start);

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      var box = slider.getBoundingClientRect();
      var visible = box.bottom > 0 && box.top < window.innerHeight;
      if (!visible) return;
      show(event.key === 'ArrowRight' ? current + 1 : current - 1);
      start();
    });

    /* Свайп на тач-устройствах */
    var startX = 0;
    var startY = 0;
    var tracking = false;

    slider.addEventListener('pointerdown', function (event) {
      if (event.pointerType === 'mouse') return;
      if (event.target.closest('a, button')) return;
      tracking = true;
      startX = event.clientX;
      startY = event.clientY;
    });

    slider.addEventListener('pointerup', function (event) {
      if (!tracking) return;
      tracking = false;
      var dx = event.clientX - startX;
      var dy = event.clientY - startY;
      if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy)) return;
      show(dx < 0 ? current + 1 : current - 1);
      start();
    });

    slider.addEventListener('pointercancel', function () { tracking = false; });

    show(0);
    start();
  }

  /* ------------------------------------------------------------------
     Избранное
     ------------------------------------------------------------------ */
  var wishButtons = $$('[data-wish]');
  var wishBadge = $('[data-wishlist-badge]');

  function syncWishBadge() {
    if (!wishBadge) return;
    var count = wishButtons.filter(function (btn) {
      return btn.getAttribute('aria-pressed') === 'true';
    }).length;
    wishBadge.textContent = String(count);
  }

  wishButtons.forEach(function (btn, i) {
    if (i < 2) btn.setAttribute('aria-pressed', 'true');

    btn.addEventListener('click', function () {
      var pressed = btn.getAttribute('aria-pressed') === 'true';
      btn.setAttribute('aria-pressed', String(!pressed));
      syncWishBadge();
      toast(pressed ? 'Удалено из избранного' : 'Добавлено в избранное');
    });
  });

  syncWishBadge();

  /* ------------------------------------------------------------------
     Корзина
     ------------------------------------------------------------------ */
  var cartBadge = $('[data-cart-badge]');
  var cartCount = 0;

  function syncCartBadge() {
    if (cartBadge) cartBadge.textContent = String(cartCount);
  }

  $$('[data-add-to-cart]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      cartCount += 1;
      syncCartBadge();
      toast('«' + (btn.getAttribute('data-product') || 'Товар') + '» добавлен в корзину');
    });
  });

  var cartBtn = $('[data-open-cart]');
  if (cartBtn) {
    cartBtn.addEventListener('click', function () {
      toast(cartCount > 0
        ? 'В корзине ' + cartCount + ' ' + plural(cartCount, 'товар', 'товара', 'товаров')
        : 'Корзина пока пуста');
    });
  }

  var searchBtn = $('[data-open-search]');
  if (searchBtn) {
    searchBtn.addEventListener('click', function () {
      toast('Поиск по каталогу скоро появится');
    });
  }

  function plural(n, one, few, many) {
    var mod10 = n % 10;
    var mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
    return many;
  }

  /* ------------------------------------------------------------------
     Отзывы: прокрутка вперёд
     ------------------------------------------------------------------ */
  var reviewsTrack = $('[data-reviews]');
  var reviewsNext = $('[data-reviews-next]');

  if (reviewsTrack && reviewsNext) {
    reviewsNext.addEventListener('click', function () {
      var card = reviewsTrack.firstElementChild;
      var step = card ? card.getBoundingClientRect().width + 22 : reviewsTrack.clientWidth;
      var atEnd = reviewsTrack.scrollLeft + reviewsTrack.clientWidth >= reviewsTrack.scrollWidth - 8;
      reviewsTrack.scrollTo({
        left: atEnd ? 0 : reviewsTrack.scrollLeft + step,
        behavior: reducedMotion ? 'auto' : 'smooth'
      });
    });
  }

  /* ------------------------------------------------------------------
     Подписка
     ------------------------------------------------------------------ */
  var subscribe = $('[data-subscribe]');

  if (subscribe) {
    var input = $('.subscribe__input', subscribe);

    subscribe.addEventListener('submit', function (event) {
      event.preventDefault();
      var value = (input && input.value ? input.value : '').trim();
      var valid = /^[^\s@]+@[^\s@]+\.[a-zA-Zа-яА-Я]{2,}$/.test(value);

      subscribe.classList.toggle('is-error', !valid);

      if (!valid) {
        toast('Введите корректный e-mail');
        if (input) input.focus();
        return;
      }

      toast('Спасибо! Мы отправили подтверждение на ' + value);
      if (input) input.value = '';
    });

    if (input) {
      input.addEventListener('input', function () {
        subscribe.classList.remove('is-error');
      });
    }
  }

  /* ------------------------------------------------------------------
     Появление блоков при прокрутке
     ------------------------------------------------------------------ */
  var revealItems = $$('.reveal');

  if (!revealItems.length) return;

  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var siblings = Array.prototype.slice.call(el.parentElement.children);
      var order = siblings.indexOf(el);
      el.style.transitionDelay = Math.min(order, 6) * 70 + 'ms';
      el.classList.add('is-visible');
      observer.unobserve(el);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealItems.forEach(function (el) { observer.observe(el); });
})();
