# KoMart Customer — Shell Contract (Agent A → Agents B/C/D)

This is the **binding contract** for the 21 page HTML files. Every page must use the shared
shell (`shell.css`, `state.js`, `shell.js`) and conform to the body skeleton below. The shell
provides: status bar, dynamic-island, home-indicator, optional tab bar, scroll surface,
toasts, tap states, page enter animation, cart badge, fav state, add-to-cart wiring,
splash auto-advance, back-button handler, and a postMessage highlight overlay.

Targeting **iPhone 17 Pro**: logical viewport **402 × 874 CSS px**. The frame in
`index.html` enforces this size for laptop demo; on a real iPhone, the body fills the
viewport.

---

## 1. Required `<head>` block (verbatim)

```html
<meta charset="utf-8">
<meta name="viewport" content="width=402, initial-scale=1, viewport-fit=cover">
<title>KoMart · <Page Russian title></title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="shell.css">
<script defer src="state.js"></script>
<script defer src="shell.js"></script>
```

No additional `<style>` block is required, but pages MAY include one for page-specific
styles. **Do not** redefine `html`, `body`, or `*` rules — they belong to the shell.

---

## 2. Body skeleton

### 2a. Variant WITH tab bar (home, kBeauty, kStore, categories, ramenSubcategory, catalog, cart, favorites, profile)

```html
<body data-tab="home" data-page="home" style="background:#FFFDFB">
  <div class="kom-app" style="background:#FFFDFB">

    <!-- iOS status bar -->
    <div class="ios-status">
      <span class="ios-time">9:41</span>
      <div class="ios-island" aria-hidden="true"></div>
      <div class="ios-right">
        <!-- signal -->
        <svg width="17" height="11" viewBox="0 0 17 11" fill="none" aria-hidden="true">
          <rect x="0" y="7" width="3" height="4" rx="1" fill="currentColor"/>
          <rect x="4.5" y="5" width="3" height="6" rx="1" fill="currentColor"/>
          <rect x="9" y="3" width="3" height="8" rx="1" fill="currentColor"/>
          <rect x="13.5" y="1" width="3" height="10" rx="1" fill="currentColor"/>
        </svg>
        <!-- wifi -->
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none" aria-hidden="true">
          <path d="M1 4a10 10 0 0 1 13 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M3.5 6.5a6.5 6.5 0 0 1 8 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="7.5" cy="9" r="1.2" fill="currentColor"/>
        </svg>
        <!-- battery -->
        <svg width="24" height="11" viewBox="0 0 24 11" fill="none" aria-hidden="true">
          <rect x="0.5" y="0.5" width="20" height="10" rx="2.5" stroke="currentColor"/>
          <rect x="2" y="2" width="15" height="7" rx="1.5" fill="currentColor"/>
          <rect x="21.5" y="3" width="2" height="5" rx="1" fill="currentColor"/>
        </svg>
      </div>
    </div>

    <!-- Scrollable page content -->
    <div class="kom-scroll kom-scroll--with-tabs">
      <!-- ... page content here ... -->
    </div>

    <!-- Tab bar -->
    <nav class="kom-tabs" aria-label="Главная навигация">
      <a class="kom-tab" data-tab="home" href="home.html" aria-current="page">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z"/></svg>
        <span>Главная</span>
      </a>
      <a class="kom-tab" data-tab="categories" href="categories.html">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
        <span>Каталог</span>
      </a>
      <a class="kom-tab" data-tab="cart" href="cart.html">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 4h2l2.4 12.1a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L21 8H6"/><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/></svg>
        <span>Корзина</span>
        <span class="badge"></span>
      </a>
      <a class="kom-tab" data-tab="favorites" href="favorites.html">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20.5l-7.2-7A4.6 4.6 0 0 1 11.3 7l.7.7.7-.7a4.6 4.6 0 0 1 6.5 6.5z"/></svg>
        <span>Избранное</span>
      </a>
      <a class="kom-tab" data-tab="profile" href="profile.html">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>
        <span>Профиль</span>
      </a>
    </nav>

    <!-- Home indicator -->
    <div class="ios-home-indicator" aria-hidden="true"></div>
  </div>
</body>
```

Mark the current tab with `aria-current="page"` and set `<body data-tab="...">` to match.

### 2b. Variant WITHOUT tab bar (splash, langSelect, onboarding, phoneLogin, smsCode, createAccount, product, reviews, search, checkoutBelowThreshold, checkoutFreeShipping, orderPlaced)

```html
<body data-page="splash" data-role="splash" style="background:linear-gradient(176deg,#FFFDFB 0%,#FAF3EE 46%,#FADDE2 135%)">
  <div class="kom-app" style="background:linear-gradient(176deg,#FFFDFB 0%,#FAF3EE 46%,#FADDE2 135%)">

    <div class="ios-status">
      <span class="ios-time">9:41</span>
      <div class="ios-island" aria-hidden="true"></div>
      <div class="ios-right"><!-- same signal/wifi/battery svgs --></div>
    </div>

    <div class="kom-scroll">
      <!-- ... page content here ... -->
    </div>

    <div class="ios-home-indicator" aria-hidden="true"></div>
  </div>
</body>
```

`data-role="splash"` ONLY on `splash.html` — triggers shell.js auto-advance after 1500ms.

---

## 3. `data-tab` values per page

| Page | tab bar | `body[data-tab]` / `aria-current` |
|---|---|---|
| splash | no | — |
| langSelect | no | — |
| onboarding | no | — |
| phoneLogin | no | — |
| smsCode | no | — |
| createAccount | no | — |
| home | yes | `home` |
| kBeauty | yes | `home` |
| kStore | yes | `home` |
| categories | yes | `categories` |
| ramenSubcategory | yes | `categories` |
| catalog | yes | `categories` |
| search | no | — |
| product | no | — |
| reviews | no | — |
| cart | yes | `cart` |
| checkoutBelowThreshold | no | — |
| checkoutFreeShipping | no | — |
| orderPlaced | no | — |
| favorites | yes | `favorites` |
| profile | yes | `profile` |

---

## 4. Per-page backgrounds (derived from existing mockups)

Apply on **both** `body` AND `.kom-app` (so safe-area edges read correctly):

| Page | Background | Status-bar text color |
|---|---|---|
| splash | `linear-gradient(176deg,#FFFDFB 0%,#FAF3EE 46%,#FADDE2 135%)` | `#2B2723` |
| langSelect | `#FFFDFB` | `#2B2723` |
| onboarding | `#FFFDFB` | `#2B2723` |
| phoneLogin | `#FFFDFB` | `#2B2723` |
| smsCode | `#FFFDFB` | `#2B2723` |
| createAccount | `#FFFDFB` | `#2B2723` |
| home | `#FFFDFB` | `#2B2723` |
| kBeauty | `#FFFDFB` (header section uses `linear-gradient(180deg,#FBEFF1,#FFFDFB 88%)`) | `#2B2723` |
| kStore | `#FFFDFB` (header section uses `linear-gradient(180deg,#EFF7E4,#FFFDFB 88%)`) | `#2B2723` |
| categories | `#FFFDFB` | `#2B2723` |
| ramenSubcategory | `#FFFDFB` | `#2B2723` |
| catalog | `#FFFDFB` | `#2B2723` |
| search | `#FFFDFB` | `#2B2723` |
| product | `#FFFDFB` (hero block uses `linear-gradient(160deg,#FBEFF0,#F4D9DD)`) | `#2B2723` |
| reviews | `#FFFDFB` | `#2B2723` |
| cart | `#FFFDFB` | `#2B2723` |
| checkoutBelowThreshold | `#FFFDFB` | `#2B2723` |
| checkoutFreeShipping | `#FFFDFB` | `#2B2723` |
| orderPlaced | `#FFFDFB` | `#2B2723` |
| favorites | `#FFFDFB` | `#2B2723` |
| profile | `#FFFDFB` | `#2B2723` |

If a page later introduces a dark hero pinned under the status bar, set
`style="color:#fff"` on the `.ios-status` element for the inverted region.

Default `.kom-app` background — if no inline override — falls back to `--base` (`#FFFDFB`).

---

## 5. Pattern: petals (splash decoration)

Use the shell's `@keyframes komartPetal` (already defined in `shell.css`). The 10 canonical
seeds — keep order, sizes, delays — for any page that wants the splash atmosphere:

```html
<div class="kom-petals" aria-hidden="true">
  <div style="position:absolute;top:-30px;left:8%;width:14px;height:11.9px;background:#FADDE2;border-radius:62% 38% 58% 42% / 50% 60% 40% 50%;animation:komartPetal 9s linear 0s infinite"></div>
  <div style="position:absolute;top:-30px;left:22%;width:10px;height:8.5px;background:#F4C3CC;border-radius:62% 38% 58% 42% / 50% 60% 40% 50%;animation:komartPetal 11s linear 2.5s infinite"></div>
  <div style="position:absolute;top:-30px;left:38%;width:16px;height:13.6px;background:#F9E8E8;border-radius:62% 38% 58% 42% / 50% 60% 40% 50%;animation:komartPetal 8s linear 1.2s infinite"></div>
  <div style="position:absolute;top:-30px;left:55%;width:9px;height:7.65px;background:#FADDE2;border-radius:62% 38% 58% 42% / 50% 60% 40% 50%;animation:komartPetal 12s linear 3.8s infinite"></div>
  <div style="position:absolute;top:-30px;left:70%;width:13px;height:11.05px;background:#F4C3CC;border-radius:62% 38% 58% 42% / 50% 60% 40% 50%;animation:komartPetal 10s linear 0.6s infinite"></div>
  <div style="position:absolute;top:-30px;left:84%;width:11px;height:9.35px;background:#F9E8E8;border-radius:62% 38% 58% 42% / 50% 60% 40% 50%;animation:komartPetal 9s linear 2.1s infinite"></div>
  <div style="position:absolute;top:-30px;left:15%;width:8px;height:6.8px;background:#FADDE2;border-radius:62% 38% 58% 42% / 50% 60% 40% 50%;animation:komartPetal 13s linear 4.5s infinite"></div>
  <div style="position:absolute;top:-30px;left:92%;width:15px;height:12.75px;background:#F4C3CC;border-radius:62% 38% 58% 42% / 50% 60% 40% 50%;animation:komartPetal 11s linear 1.8s infinite"></div>
  <div style="position:absolute;top:-30px;left:47%;width:12px;height:10.2px;background:#F9E8E8;border-radius:62% 38% 58% 42% / 50% 60% 40% 50%;animation:komartPetal 10s linear 5.2s infinite"></div>
  <div style="position:absolute;top:-30px;left:63%;width:8px;height:6.8px;background:#FADDE2;border-radius:62% 38% 58% 42% / 50% 60% 40% 50%;animation:komartPetal 12s linear 3.1s infinite"></div>
</div>
```

Place INSIDE `.kom-app` as a sibling of `.kom-scroll`. Petals are absolute-positioned and
pointer-events: none, so they decorate without interfering.

---

## 6. Pattern: product card

A product card is a tappable link, with a fav heart as a separate button that does not
propagate to the card. The shell auto-wires both.

```html
<a class="tap" href="product.html?id=cica-cream" data-id="cica-cream"
   style="display:block;border-radius:18px;overflow:hidden;background:#FFFDFB;border:1px solid var(--line);position:relative">
  <div style="aspect-ratio:1/1;background:linear-gradient(160deg,#FBEFF0,#F4D9DD);"></div>
  <button class="fav-btn" data-fav-id="cica-cream" data-fav-toggle aria-pressed="false"
          aria-label="В избранное"
          style="position:absolute;top:10px;right:10px">
    <svg class="fav-icon" width="16" height="16" viewBox="0 0 24 24" fill="none"
         stroke="#B05468" stroke-width="2" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 20.5l-7.2-7A4.6 4.6 0 0 1 11.3 7l.7.7.7-.7a4.6 4.6 0 0 1 6.5 6.5z"/>
    </svg>
  </button>
  <div style="padding:10px 12px 12px">
    <div style="font-size:13px;font-weight:700">Centella Soothing Cream</div>
    <div style="font-size:11px;color:var(--muted);margin-top:2px">SkinNature · 50ml</div>
    <div style="font-size:14px;font-weight:800;margin-top:6px">129 000 сум</div>
  </div>
</a>
```

**Important**: hearts must carry the `data-fav-toggle` attribute (or be a `<button>` /
`.fav-btn`) so shell.js treats them as toggles. A card without this attribute will not
toggle on the wrapping element — the click bubbles to the `<a>` and navigates instead.

---

## 7. Pattern: add-to-cart button

The data-attribute payload is parsed as JSON. Keys: `id`, `name`, `price`, `world`
(`"beauty"` or `"store"`). The shell shows the toast "Добавлено в корзину".

```html
<button class="tap" data-add-to-cart='{"id":"cica-cream","name":"Centella Soothing Cream","price":129000,"world":"beauty"}'
        style="padding:12px 18px;border-radius:99px;background:var(--ink);color:#fff;border:0;font-weight:800">
  + в корзину
</button>
```

If on a product card link, prefer a dedicated `<button>` so it does not navigate. If you
must add-to-cart from an `<a>`, the shell calls `preventDefault()` automatically.

---

## 8. Pattern: back button

```html
<button class="kom-back tap" data-back="home.html" aria-label="Назад">
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M15 5l-7 7 7 7"/>
  </svg>
</button>
```

The shell calls `history.back()` when possible, else falls back to `data-back` URL.

---

## 9. Click map (canonical)

```
splash      →  (auto 1.5s, via shell.js)  langSelect.html  (or home.html if seenOnboarding)
langSelect  →  «Продолжить»                onboarding.html
onboarding  →  «Начать покупки»            phoneLogin.html
            →  «У меня уже есть аккаунт»   phoneLogin.html
            →  «Пропустить»                home.html  (also marks seenOnboarding)
phoneLogin  →  «Получить код»              smsCode.html
            →  back arrow                  onboarding.html
smsCode     →  «Подтвердить»               createAccount.html
            →  back arrow                  phoneLogin.html
createAccount → primary CTA                home.html  (also marks seenOnboarding)

home        →  K-Beauty world card         kBeauty.html
            →  K-Store world card          kStore.html
            →  search bar                  search.html
            →  any product card            product.html
            →  «Все категории»             categories.html
kBeauty     →  any product card            product.html
            →  back arrow                  home.html
kStore     →   any product card            product.html
            →  back arrow                  home.html
categories  →  «Рамен» tile                ramenSubcategory.html
            →  any other category tile     catalog.html
ramenSub    →  any product card            product.html
            →  back arrow                  categories.html
catalog     →  any product card            product.html
            →  back arrow                  categories.html
search      →  any result row              product.html
            →  back arrow                  home.html

product     →  back arrow                  data-back="home.html"
            →  reviews link/strip          reviews.html
            →  «В корзину» (data-add-to-cart) — shell handles, NO navigation; toast appears
            →  cart icon in header         cart.html
            →  heart icon (data-fav-id)
reviews     →  back arrow                  product.html

cart        →  «Оформить заказ»            checkoutBelowThreshold.html
checkoutBelowThreshold → «Добавить ещё»    checkoutFreeShipping.html
                       → «Оплатить Payme»  orderPlaced.html
                       → back              cart.html
checkoutFreeShipping   → «Оплатить Payme»  orderPlaced.html
                       → back              cart.html
orderPlaced → «На главную»                 home.html

favorites   →  any product card            product.html
profile     →  «Выйти»                     splash.html (also calls kom.reset())
            →  language item               langSelect.html
            →  «Мои заказы» / similar      orderPlaced.html
```

For the profile «Выйти» action, prefer:

```html
<button class="tap" onclick="if(window.kom)kom.reset();location.href='splash.html'">Выйти</button>
```

For createAccount / onboarding skip actions:

```html
<a class="tap" href="home.html" onclick="if(window.kom)kom.markOnboarded()">Пропустить</a>
```

---

## 10. Available `kom` API (recap)

```
kom.cart()                          // [{id,name,price,qty,world}]
kom.addToCart({id,name,price,world})
kom.removeFromCart(id)
kom.cartCount() / kom.cartTotal()
kom.favs() / kom.toggleFav(id) / kom.isFav(id)
kom.lang() / kom.setLang(l)
kom.seenOnboarding() / kom.markOnboarded()
kom.reset()
kom.toast(msg)
```

Event: `window.addEventListener('kom:state', e => …)` — `e.detail.type` is one of
`cart | favs | lang | onboarding | reset`.

---

## 11. Hard rules

- **No inline `@keyframes komartPetal`** — already in `shell.css`.
- **No inline `html, body` styling** — already in `shell.css`.
- **Do not** wrap content in the old 390×844 phone card. The shell IS the phone.
- The first scrollable child must be `.kom-scroll`. The status bar is absolute and
  overlays content; `.kom-scroll` already pads `padding-top:47px` to clear it.
- **Add the `.kom-scroll--with-tabs` class** if the page renders `.kom-tabs`.
- All tap targets ≥ 36 × 36 px. Use the `.tap` class for press feedback.
- No console errors. No external JS.
- Use existing palette tokens (`--ink`, `--muted`, `--brown`, `--beauty-accent`,
  `--store-accent`, etc.) — do not invent new colors.
