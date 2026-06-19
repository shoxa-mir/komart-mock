/* KoMart client state — Agent A
 * Plain global script. Exposes window.kom.
 * Storage keys: kom_cart, kom_favs, kom_lang, kom_seen_onboarding
 * Dispatches CustomEvent('kom:state', {detail:{type:'cart'|'favs'|'lang'|'onboarding'|'reset'}})
 */
(function(){
  var KEYS = {
    cart: 'kom_cart',
    favs: 'kom_favs',
    lang: 'kom_lang',
    onb:  'kom_seen_onboarding'
  };

  function read(key, fallback){
    try{
      var raw = localStorage.getItem(key);
      if(raw == null) return fallback;
      return JSON.parse(raw);
    }catch(e){
      return fallback;
    }
  }
  function write(key, val){
    try{ localStorage.setItem(key, JSON.stringify(val)); }catch(e){}
  }
  function fire(type){
    try{
      window.dispatchEvent(new CustomEvent('kom:state', {detail:{type:type}}));
    }catch(e){}
  }

  var kom = {
    // ---------- cart ----------
    cart: function(){
      var c = read(KEYS.cart, []);
      return Array.isArray(c) ? c : [];
    },
    addToCart: function(item){
      if(!item || !item.id) return;
      var c = kom.cart();
      var found = false;
      for(var i=0;i<c.length;i++){
        if(c[i].id === item.id){
          c[i].qty = (c[i].qty || 1) + (item.qty || 1);
          found = true;
          break;
        }
      }
      if(!found){
        c.push({
          id: item.id,
          name: item.name || '',
          price: item.price || 0,
          qty: item.qty || 1,
          world: item.world || ''
        });
      }
      write(KEYS.cart, c);
      fire('cart');
    },
    removeFromCart: function(id){
      var c = kom.cart().filter(function(x){ return x.id !== id; });
      write(KEYS.cart, c);
      fire('cart');
    },
    cartCount: function(){
      return kom.cart().reduce(function(s,x){ return s + (x.qty || 0); }, 0);
    },
    cartTotal: function(){
      return kom.cart().reduce(function(s,x){ return s + (x.price || 0) * (x.qty || 0); }, 0);
    },

    // ---------- favorites ----------
    favs: function(){
      var f = read(KEYS.favs, []);
      return Array.isArray(f) ? f : [];
    },
    toggleFav: function(id){
      if(!id) return;
      var f = kom.favs();
      var i = f.indexOf(id);
      if(i >= 0) f.splice(i, 1);
      else f.push(id);
      write(KEYS.favs, f);
      fire('favs');
    },
    isFav: function(id){
      return kom.favs().indexOf(id) >= 0;
    },

    // ---------- language ----------
    lang: function(){
      return read(KEYS.lang, 'ru') || 'ru';
    },
    setLang: function(l){
      write(KEYS.lang, l || 'ru');
      fire('lang');
    },

    // ---------- onboarding ----------
    seenOnboarding: function(){
      return !!read(KEYS.onb, false);
    },
    markOnboarded: function(){
      write(KEYS.onb, true);
      fire('onboarding');
    },

    // ---------- reset ----------
    reset: function(){
      try{
        localStorage.removeItem(KEYS.cart);
        localStorage.removeItem(KEYS.favs);
        localStorage.removeItem(KEYS.lang);
        localStorage.removeItem(KEYS.onb);
      }catch(e){}
      fire('reset');
    },

    // ---------- toast (no-op stub; shell.js overrides) ----------
    toast: function(/*msg*/){ /* shell.js implements rendering */ }
  };

  window.kom = kom;
})();
