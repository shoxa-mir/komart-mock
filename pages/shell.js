/* KoMart shell behaviors — Agent A
 * Runs on DOMContentLoaded. Wires clock, badges, favs, add-to-cart, splash auto-advance,
 * back buttons, toast renderer, postMessage highlight.
 */
(function(){
  'use strict';

  var TIME_FMT;
  try{
    TIME_FMT = new Intl.DateTimeFormat(undefined, {hour:'2-digit', minute:'2-digit', hour12:false});
  }catch(e){
    TIME_FMT = null;
  }

  function fmtTime(){
    var d = new Date();
    if(TIME_FMT){
      // Some locales return narrow no-break space; strip leading zeros only when needed.
      return TIME_FMT.format(d);
    }
    var h = String(d.getHours()).padStart(2,'0');
    var m = String(d.getMinutes()).padStart(2,'0');
    return h + ':' + m;
  }

  function tickClock(){
    var t = fmtTime();
    var nodes = document.querySelectorAll('.ios-time');
    for(var i=0;i<nodes.length;i++) nodes[i].textContent = t;
  }

  function updateCartBadge(){
    if(!window.kom) return;
    var n = kom.cartCount();
    var txt = n > 0 ? String(n > 99 ? '99+' : n) : '';
    var sel = document.querySelectorAll('.kom-tab[data-tab="cart"] .badge, .kom-cart-badge');
    for(var i=0;i<sel.length;i++) sel[i].textContent = txt;
  }

  function reflectFav(el){
    if(!window.kom) return;
    var id = el.getAttribute('data-fav-id');
    if(!id) return;
    var on = kom.isFav(id);
    el.setAttribute('aria-pressed', on ? 'true' : 'false');
    if(on) el.classList.add('is-fav');
    else el.classList.remove('is-fav');
  }
  function reflectAllFavs(){
    var nodes = document.querySelectorAll('[data-fav-id]');
    for(var i=0;i<nodes.length;i++) reflectFav(nodes[i]);
  }

  function wireFavs(){
    document.addEventListener('click', function(e){
      var el = e.target.closest('[data-fav-id]');
      if(!el) return;
      // Only treat dedicated fav controls as toggles — not the whole product card.
      // A node is a toggle if it has an explicit data-fav-toggle attribute, OR it's a button/.fav-btn.
      var isToggle = el.hasAttribute('data-fav-toggle')
        || el.classList.contains('fav-btn')
        || el.tagName === 'BUTTON';
      if(!isToggle) return;
      if(el.tagName === 'A') e.preventDefault();
      e.stopPropagation();
      if(window.kom){
        kom.toggleFav(el.getAttribute('data-fav-id'));
      }
    }, true);
  }

  function wireAddToCart(){
    document.addEventListener('click', function(e){
      var el = e.target.closest('[data-add-to-cart]');
      if(!el) return;
      if(el.tagName === 'A') e.preventDefault();
      e.stopPropagation();
      var raw = el.getAttribute('data-add-to-cart');
      var item = null;
      try{ item = JSON.parse(raw); }catch(err){ item = null; }
      if(item && window.kom){
        kom.addToCart(item);
        kom.toast('Добавлено в корзину');
      }
    }, true);
  }

  function wireBack(){
    document.addEventListener('click', function(e){
      var el = e.target.closest('[data-back]');
      if(!el) return;
      if(el.tagName === 'A') e.preventDefault();
      var fallback = el.getAttribute('data-back');
      if(history.length > 1){
        history.back();
      }else if(fallback){
        location.href = fallback;
      }
    });
  }

  function ensureToast(){
    var t = document.querySelector('.kom-toast');
    if(t) return t;
    var host = document.querySelector('.kom-app') || document.body;
    t = document.createElement('div');
    t.className = 'kom-toast';
    host.appendChild(t);
    return t;
  }
  var toastTimer = null;
  function showToast(msg){
    var t = ensureToast();
    t.textContent = msg || '';
    // force reflow so transition replays even when retoasting fast
    void t.offsetWidth;
    t.classList.add('is-on');
    if(toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){
      t.classList.remove('is-on');
    }, 3000);
  }
  function wireToast(){
    if(window.kom){
      kom.toast = showToast;
    }
  }

  function splashAutoAdvance(){
    if(document.body && document.body.dataset && document.body.dataset.role === 'splash'){
      setTimeout(function(){
        var next = (window.kom && kom.seenOnboarding()) ? 'home.html' : 'langSelect.html';
        location.href = next;
      }, 5000);
    }
  }

  function wireHighlightMessage(){
    window.addEventListener('message', function(ev){
      var d = ev && ev.data;
      if(!d || d.type !== 'kom:highlight') return;
      var sel = 'a, [data-add-to-cart], [data-fav-id]';
      var nodes = document.querySelectorAll(sel);
      for(var i=0;i<nodes.length;i++) nodes[i].classList.add('kom-hi');
      setTimeout(function(){
        for(var i=0;i<nodes.length;i++) nodes[i].classList.remove('kom-hi');
      }, 1500);
    });
  }

  function onStateChange(ev){
    var t = ev && ev.detail && ev.detail.type;
    if(t === 'cart' || t === 'reset') updateCartBadge();
    if(t === 'favs' || t === 'reset') reflectAllFavs();
  }

  function init(){
    tickClock();
    setInterval(tickClock, 30000); // 30s is plenty given minute resolution
    updateCartBadge();
    reflectAllFavs();
    wireFavs();
    wireAddToCart();
    wireBack();
    wireToast();
    wireHighlightMessage();
    window.addEventListener('kom:state', onStateChange);
    splashAutoAdvance();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  }else{
    init();
  }
})();
