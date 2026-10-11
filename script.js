(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const on = (selector,event,handler) => $(selector)?.addEventListener(event,handler);
  const read = (key,fallback) => {try {return JSON.parse(localStorage.getItem(key)) ?? fallback;} catch {return fallback;}};
  const write = (key,value) => {try {localStorage.setItem(key,JSON.stringify(value));return true;} catch {showToast('Browser storage is unavailable. Changes will last only in this tab.');return false;}};
  const safeArray = key => {const value=read(key,[]);return Array.isArray(value)?value:[];};
  $$('[data-home-foods]').forEach(grid=>grid.innerHTML=grid.dataset.homeFoods.split(',').map(id=>Choply.card(Choply.find(id))).join(''));
  $$('.hero-slide[data-food-id]').forEach(slide=>{const food=Choply.find(slide.dataset.foodId);if(food){slide.querySelector('h3').textContent=food.name;slide.querySelector('p').textContent=Choply.money(food.price);}});
  let cart = safeArray('choplyCartV2').filter(item=>Choply.find(item.id)&&Number.isInteger(item.quantity)&&item.quantity>0).map(item=>({id:item.id,quantity:Math.min(99,item.quantity)}));
  let favourites = new Set(safeArray('choplyFavourites').filter(id=>Choply.find(id)));
  let accounts = safeArray('choplyDemoAccounts').filter(user=>user&&typeof user.email==='string'&&typeof user.name==='string'&&user.hash&&user.salt);
  let session = read('choplyDemoSession',null);
  let user = accounts.find(account=>account.email===session?.email) || null;
  let orders = safeArray('choplyDemoOrders').filter(order=>order&&/^CHP-\d{5}$/.test(order.id)&&typeof order.email==='string'&&Number.isFinite(order.total));
  let authMode='signin',lastFocus=null,activeDialog=null,toastTimer;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  window.showToast = showToast;
  function showToast(message) {
    if (!$('#toast')) return;
    $('#toastMessage').textContent=message;$('#toast').classList.add('active');
    clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('active'),4500);
  }

  try {localStorage.removeItem('choplyUser');} catch {}
  function closeDialog() {
    if(!activeDialog) return;
    activeDialog.classList.remove('active');activeDialog.inert=true;activeDialog.setAttribute('aria-hidden','true');
    $('#cartOverlay')?.classList.remove('active');
    $$('header,main,footer').forEach(element=>element.inert=false);
    document.body.style.overflow='';activeDialog=null;
    if(lastFocus?.isConnected) lastFocus.focus();
  }
  function openDialog(selector) {
    const dialog=$(selector);if(!dialog)return;
    const trigger=document.activeElement;closeDialog();lastFocus=trigger;
    activeDialog=dialog;dialog.inert=false;dialog.setAttribute('aria-hidden','false');dialog.classList.add('active');
    if(selector==='#cartDrawer')$('#cartOverlay').classList.add('active');
    $$('header,main,footer').forEach(element=>element.inert=true);
    document.body.style.overflow='hidden';
    dialog.querySelector('button,input,[tabindex]')?.focus();
  }
  $$('.modal-overlay,.cart-drawer').forEach(element=>{element.inert=true;element.setAttribute('aria-hidden','true');element.setAttribute('role','dialog');element.setAttribute('aria-modal','true');});
  document.addEventListener('keydown',event=>{
    if(!activeDialog)return;
    if(event.key==='Escape'){closeDialog();return;}
    if(event.key!=='Tab')return;
    const nodes=[...activeDialog.querySelectorAll('button,input,select,a[href],[tabindex="0"]')].filter(node=>!node.disabled&&node.getClientRects().length);
    if(!nodes.length){event.preventDefault();return;}
    const first=nodes[0],last=nodes.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  });
  $$('.modal-overlay').forEach(element=>element.addEventListener('click',event=>{if(event.target===element)closeDialog();}));
  ['#closeCart','#closeAuth','#closeProfile','#cartOverlay'].forEach(selector=>on(selector,'click',closeDialog));
  on('#cartButton','click',()=>openDialog('#cartDrawer'));
  function renderCart() {
    const subtotal=cart.reduce((sum,item)=>sum+Choply.find(item.id).price*item.quantity,0);
    const delivery=cart.length?1000:0;
    $('.cart-count').textContent=cart.reduce((sum,item)=>sum+item.quantity,0);
    $('#cartSubtotal').textContent=Choply.money(subtotal);$('#deliveryFee').textContent=Choply.money(delivery);$('#cartTotal').textContent=Choply.money(subtotal+delivery);
    $('#checkoutButton').disabled=!cart.length;
    $('#cartItems').innerHTML=cart.length?cart.map(item=>{
      const food=Choply.find(item.id);
      return `<div class="cart-item"><div><h3>${food.name}</h3><p>${Choply.money(food.price)} each</p><strong>${Choply.money(food.price*item.quantity)}</strong></div><div class="quantity-controls"><button type="button" data-quantity="-1" data-food-id="${food.id}" aria-label="Decrease ${food.name} quantity">−</button><span aria-label="Quantity">${item.quantity}</span><button type="button" data-quantity="1" data-food-id="${food.id}" aria-label="Increase ${food.name} quantity">+</button><button type="button" data-remove="${food.id}" aria-label="Remove ${food.name}">×</button></div></div>`;
    }).join(''):'<div class="empty-cart"><h3>A little empty in here.</h3><p>Add a dish from the menu to get started.</p><a href="menu.html" class="text-link">Explore the menu →</a></div>';
    write('choplyCartV2',cart);
  }
  function syncFavourites() {
    $$('.like-btn').forEach(button=>{
      const id=button.dataset.foodId||button.closest('[data-food-id]')?.dataset.foodId;
      const saved=favourites.has(id);button.classList.toggle('active',saved);button.setAttribute('aria-pressed',String(saved));
      button.setAttribute('aria-label',`${saved?'Unsave':'Save'} ${Choply.find(id)?.name||'dish'}`);
    });
  }
  function addItem(id) {
    const food=Choply.find(id);if(!food)return;
    const item=cart.find(item=>item.id===id);
    if(item&&item.quantity>=99){showToast('Maximum 99 of each dish in this demo.');return;}
    if(item)item.quantity++;else cart.push({id,quantity:1});
    renderCart();showToast(`${food.name} added to your cart.`);
  }
  document.addEventListener('click',event=>{
    const add=event.target.closest('.add-btn');if(add){addItem(add.dataset.foodId||add.closest('[data-food-id]')?.dataset.foodId);return;}
    const like=event.target.closest('.like-btn');if(like){
      const id=like.dataset.foodId||like.closest('[data-food-id]')?.dataset.foodId;if(!Choply.find(id))return;
      if(favourites.has(id))favourites.delete(id);else favourites.add(id);
      write('choplyFavourites',[...favourites]);syncFavourites();document.dispatchEvent(new Event('choply:favourites'));return;
    }
    const quantity=event.target.closest('[data-quantity]');if(quantity){const item=cart.find(item=>item.id===quantity.dataset.foodId);if(item){item.quantity=Math.min(99,item.quantity+Number(quantity.dataset.quantity));cart=cart.filter(item=>item.quantity>0);renderCart();}return;}
    const remove=event.target.closest('[data-remove]');if(remove){cart=cart.filter(item=>item.id!==remove.dataset.remove);renderCart();}
  });
  // Search the complete catalogue, not only cards currently shown on the homepage.
  function search(value) {
    location.href=`menu.html${value.trim()?'?q='+encodeURIComponent(value.trim()):''}`;
  }
  ['#desktopSearch','#mobileSearchInput'].forEach(selector=>on(selector,'keydown',event=>{if(event.key==='Enter'){event.preventDefault();search(event.target.value);}}));
  on('#searchButton','click',()=>{
    if($('.search-wrapper').classList.contains('active')&&$('#desktopSearch').value.trim())search($('#desktopSearch').value);
    else {$('.search-wrapper').classList.toggle('active');$('#desktopSearch').focus();}
  });
  function closeMobileMenu() {$('#mobileMenu').classList.remove('active');$('#hamburgerButton').setAttribute('aria-expanded','false');}
  on('#hamburgerButton','click',()=>{const open=$('#mobileMenu').classList.toggle('active');$('#hamburgerButton').setAttribute('aria-expanded',String(open));});
  $$('#mobileMenu a').forEach(link=>link.addEventListener('click',closeMobileMenu));
  $$('.category-card').forEach(button=>button.addEventListener('click',()=>location.href=`menu.html?category=${encodeURIComponent(button.dataset.category)}`));
  on('.prev-btn','click',()=>$('.categories').scrollBy({left:-300,behavior:motion.matches?'auto':'smooth'}));
  on('.next-btn','click',()=>$('.categories').scrollBy({left:300,behavior:motion.matches?'auto':'smooth'}));
  // Homepage preview filters do not affect the full menu or popular picks.
  $$('.filter-btn').forEach(button=>button.addEventListener('click',()=>{
    $$('.filter-btn').forEach(item=>{item.classList.toggle('active',item===button);item.setAttribute('aria-pressed',String(item===button));});
    $$('#menu .menu-food').forEach(card=>card.hidden=button.dataset.filter!=='all'&&card.dataset.category!==button.dataset.filter);
  }));
  function setAuthMode(mode) {
    authMode=mode;$('#authForm').reset();$('#auth-password').type='password';
    $('.signup-field').classList.toggle('hidden',mode!=='signup');$('#auth-name').required=mode==='signup';
    $('#authTitle').textContent=mode==='signup'?'Create an account':'Welcome back';
    $('#authDescription').textContent='This is not a real authentication service.';
    $('.auth-submit').textContent=mode==='signup'?'Create an account':'Sign in to Choply';
    $('#authSwitchText').textContent=mode==='signup'?'Already created one?':'New to the Choply?';$('#switchAuth').textContent=mode==='signup'?'Sign in':'Create account';
    $('#auth-password').autocomplete=mode==='signup'?'new-password':'current-password';
  }
  function accountAction(){closeMobileMenu();if(user)openDialog('#profileModal');else{setAuthMode(accounts.length?'signin':'signup');openDialog('#authModal');}}
  on('#profileButton','click',accountAction);on('#mobileProfile','click',accountAction);
  on('#switchAuth','click',()=>setAuthMode(authMode==='signin'?'signup':'signin'));
  on('.password-toggle','click',()=>{const input=$('#auth-password');input.type=input.type==='password'?'text':'password';$('.password-toggle').setAttribute('aria-label',input.type==='password'?'Show password':'Hide password');});
  async function hashPassword(password,salt) {
    if(!window.crypto?.subtle)throw new Error('Please open CHOPLY using localhost (Live Server) or HTTPS to try demo accounts.');
    const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);
    const bytes=await crypto.subtle.deriveBits({name:'PBKDF2',salt:new Uint8Array(salt),iterations:100000,hash:'SHA-256'},key,256);
    return Array.from(new Uint8Array(bytes)).map(byte=>byte.toString(16).padStart(2,'0')).join('');
  }
  on('#authForm','submit',async event=>{
    event.preventDefault();const email=$('#auth-email').value.trim().toLowerCase(),password=$('#auth-password').value,name=$('#auth-name').value.trim();
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){showToast('Enter an email address, for example demo@johnbosco.com.');return;}
    if(password.length<8){showToast('Use a password with at least 8 characters.');return;}
    if(authMode==='signup'&&!name){showToast('Enter a name for your Choply profile.');return;}
    const submit=$('.auth-submit');submit.disabled=true;
    try {
      let account=accounts.find(account=>account.email===email);
      if(authMode==='signup'){
        if(account){showToast('That account already exists. Select Sign in.');return;}
        const salt=Array.from(crypto.getRandomValues(new Uint8Array(16)));
        account={email,name:name.slice(0,80),salt,hash:await hashPassword(password,salt)};
        accounts.push(account);write('choplyDemoAccounts',accounts);
      } else {
        if(!account||await hashPassword(password,account.salt)!==account.hash){showToast('Email or password does not match any account on this browser.');return;}
      }
      user=account;write('choplyDemoSession',{email});renderUser();closeDialog();showToast('Signed in. You can now place an order.');
    } catch(error){showToast(error.message);} finally {submit.disabled=false;}
  });
  function renderUser() {
    $('#profileModal h2').textContent=user?user.name:'My Profile';$('#mobileLogout').hidden=!user;
    $('#profileButton').setAttribute('aria-label',user?'Open your  profile':'Open sign in');
  }
  function logout(){user=null;write('choplyDemoSession',null);renderUser();closeDialog();closeMobileMenu();showToast('Signed out. Your account still exists on this browser.');}
  on('#logoutButton','click',logout);on('#mobileLogout','click',logout);
  $$('.profile-options button').forEach((button,index)=>button.addEventListener('click',()=>{
    const panel=$('#profileDetails');if(!user||!panel)return;
    if(index===0)panel.textContent=`${user.name} · ${user.email}`;
    if(index===1)panel.innerHTML=`<form id="addressForm"><label for="Address">delivery address</label><input id="demoAddress" maxlength="180" value="${Choply.escape(user.address||'')}" placeholder="Use a sample address" required><button type="submit" class="primary-btn">Save address</button></form>`;
    if(index===2){const mine=orders.filter(order=>order.email===user.email);panel.innerHTML=mine.length?mine.slice().reverse().map(order=>`<p><strong>${order.id}</strong> · ${Choply.money(order.total)}<br><small>Demo order placed · ${new Date(order.date).toLocaleDateString()}</small></p>`).join(''):'No demo orders yet.';}
    if(index===3)location.href='menu.html?favourites=1';
  }));
  on('#profileDetails','submit',event=>{if(event.target.id==='addressForm'){event.preventDefault();user.address=$('#demoAddress').value.trim().slice(0,180);write('choplyDemoAccounts',accounts);showToast('Demo address saved.');}});
  on('#checkoutButton','click',()=>{
    if(!cart.length)return;
    if(!user){setAuthMode(accounts.length?'signin':'signup');openDialog('#authModal');return;}
    if(orders.length>=90000){showToast('Demo order storage is full.');return;}
    let id;do{id='CHP-'+(10000+crypto.getRandomValues(new Uint32Array(1))[0]%90000);}while(orders.some(order=>order.id===id));
    const total=cart.reduce((sum,item)=>sum+Choply.find(item.id).price*item.quantity,0)+1000;
    const order={id,email:user.email,total,date:new Date().toISOString(),items:cart.map(item=>({...item,price:Choply.find(item.id).price,name:Choply.find(item.id).name}))};
    orders.push(order);const stored=write('choplyDemoOrders',orders);if(!stored){orders.pop();return;}
    cart=[];renderCart();closeDialog();
    $('#receiptDetails').textContent=`${id} · ${Choply.money(total)} · ${order.items.reduce((sum,item)=>sum+item.quantity,0)} item(s)`;
    $('#receiptTrack').href=`index.html?order=${id}#tracking`;
    openDialog('#receiptModal');
  });
  on('#closeReceipt','click',closeDialog);
  function track(id) {
    const order=orders.find(order=>order.id===id);
    $('#trackingResult').innerHTML=order?`<div class="tracking-status"><strong>Demo order placed — ${order.id}</strong><p>${Choply.money(order.total)} · ${order.items?.length||0} dish type(s).</p><p>This is a simulation. No payment was taken and no delivery is in progress.</p></div>`:'<div class="tracking-status"><strong>Order not found on this browser.</strong><p>Place a demo order first, then enter its ID. Orders from other browsers are not available here.</p></div>';
  }
  on('#trackingForm','submit',event=>{event.preventDefault();const id=$('#orderNumber').value.trim().toUpperCase();if(!/^CHP-\d{5}$/.test(id)){showToast('Enter an order ID such as CHP-12345.');return;}track(id);});
  const requestedOrder=new URLSearchParams(location.search).get('order');if(requestedOrder&&$('#orderNumber')){$('#orderNumber').value=requestedOrder;track(requestedOrder);}
  // Auto-slide can be paused and respects reduced motion and hidden tabs.
  const slides=$$('.hero-slide'),dots=$$('.hero-dot');let slide=0,slideTimer,paused=false;
  function showSlide(index){slide=index;slides.forEach((item,i)=>{item.classList.toggle('active',i===index);item.setAttribute('aria-hidden',String(i!==index));});dots.forEach((dot,i)=>{dot.classList.toggle('active',i===index);dot.setAttribute('aria-pressed',String(i===index));});}
  function startSlides(){clearInterval(slideTimer);if(slides.length&&!paused&&!motion.matches&&!document.hidden)slideTimer=setInterval(()=>showSlide((slide+1)%slides.length),5000);}
  dots.forEach((dot,i)=>dot.addEventListener('click',()=>{showSlide(i);startSlides();}));
  on('#pauseHero','click',()=>{paused=!paused;$('#pauseHero').textContent=paused?'Play slides':'Pause slides';$('#pauseHero').setAttribute('aria-pressed',String(paused));startSlides();});
  document.addEventListener('visibilitychange',startSlides);motion.addEventListener('change',startSlides);if(slides.length){showSlide(0);startSlides();}
  const reveal=$$('.section-heading,.about-content,.feature,.tracking-content');
  if('IntersectionObserver' in window&&!motion.matches){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:0.08});reveal.forEach(element=>{element.classList.add('reveal-ready');observer.observe(element);});}
  // Missing photos receive an honest placeholder; filenames keep their original casing.
  function prepareImages(root=document){root.querySelectorAll('img').forEach(img=>{
    if(img.dataset.prepared)return;img.dataset.prepared='true';
    const fallback=()=>{img.removeAttribute('srcset');img.src='assets/dish-placeholder.svg';img.alt=`${img.alt||'Dish'} — photo unavailable`;};
    img.addEventListener('error',fallback,{once:true});if(img.complete&&!img.naturalWidth)fallback();
  });}
  document.addEventListener('choply:render',()=>{syncFavourites();prepareImages();renderIcons();});
  // Inline icons keep the interface usable without the optional local icon font.
  function renderIcons(){
    const paths={search:'M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',person:'M20 21v-2a6 6 0 0 0-6-6h-4a6 6 0 0 0-6 6v2 M16 5a4 4 0 1 1-8 0 4 4 0 0 1 8 0',shopping_cart:'M2 3h3l3 13h11l3-10H6 M10 21h.01 M18 21h.01',add:'M12 5v14 M5 12h14',favorite:'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8',menu:'M3 6h18 M3 12h18 M3 18h18',close:'M6 6l12 12 M18 6 6 18',arrow_forward:'M4 12h16 M14 6l6 6-6 6',chevron_right:'M9 5l7 7-7 7',mail:'M3 5h18v14H3z M3 6l9 7 9-7',lock:'M5 10h14v11H5z M8 10V6a4 4 0 0 1 8 0v4',receipt_long:'M5 3h14v18l-3-2-4 2-4-2-3 2z M8 7h8 M8 11h8 M8 15h5',location_on:'M20 9c0 6-8 13-8 13S4 15 4 9a8 8 0 1 1 16 0 M15 9a3 3 0 1 1-6 0 3 3 0 0 1 6 0',logout:'M9 3H3v18h6 M9 12h13 M17 7l5 5-5 5',check_circle:'M22 12a10 10 0 1 1-5-9 M7 12l4 4L22 5',visibility_off:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12 M4 3l16 18',local_fire_department:'M12 2c1 7 6 5 6 11a6 6 0 0 1-12 0c0-3 3-5 6-11',verified:'M12 2l3 3 4 1 1 4 2 2-2 3-1 4-4 1-3 2-3-2-4-1-1-4-2-3 2-2 1-4 4-1z M8 12l3 3 5-6',support_agent:'M3 13V10a9 9 0 0 1 18 0v7h-5 M3 10h4v7H3z M17 10h4v7h-4z',delivery_dining:'M2 16h14l4-6h-6l-2-5H6 M5 20a3 3 0 1 0 0-6 3 3 0 0 0 0 6 M19 20a3 3 0 1 0 0-6 3 3 0 0 0 0 6',restaurant:'M4 2v8h6V2 M7 10v12 M18 2v20 M18 2c-4 2-4 8 0 8'};
    $$('.material-symbols-rounded').forEach(span=>{if(span.querySelector('svg'))return;const name=span.textContent.trim();const path=paths[name]||paths.verified;span.innerHTML=`<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${path}"/></svg>`;span.setAttribute('aria-hidden','true');});
  }
  window.Choply.isFavourite=id=>favourites.has(id);
  window.Choply.refresh=()=>document.dispatchEvent(new Event('choply:render'));
  renderCart();renderUser();syncFavourites();prepareImages();renderIcons();
})();
