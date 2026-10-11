(() => {
  const $=selector=>document.querySelector(selector);
  const params=new URLSearchParams(location.search);
  let query=(params.get('q')||'').slice(0,120);
  let category=Object.hasOwn(CHOPLY_CATEGORIES,params.get('category'))?params.get('category'):'all';
  let saved=params.get('favourites')==='1';
  let sort=['featured','low','high','name'].includes(params.get('sort'))?params.get('sort'):'featured';
  let limit=12;
  $('#menuQuery').value=query;$('#menuSort').value=sort;
  $('#menuCategories').innerHTML=Object.entries(CHOPLY_CATEGORIES).map(([key,label])=>`<button type="button" data-category="${key}" aria-pressed="${category===key}" class="${category===key?'active':''}">${label}</button>`).join('');
  function saveURL() {
    const next=new URLSearchParams();if(query.trim())next.set('q',query.trim());if(category!=='all')next.set('category',category);if(saved)next.set('favourites','1');if(sort!=='featured')next.set('sort',sort);
    history.replaceState(null,'',location.pathname+(next.size?'?'+next:''));
  }
  function render() {
    let matches=CHOPLY_FOODS.filter(food=>(category==='all'||food.category===category)&&Choply.matches(food,query)&&(!saved||Choply.isFavourite(food.id)));
    if(sort==='low')matches.sort((a,b)=>a.price-b.price);if(sort==='high')matches.sort((a,b)=>b.price-a.price);if(sort==='name')matches.sort((a,b)=>a.name.localeCompare(b.name));
    $('#catalogueGrid').innerHTML=matches.slice(0,limit).map(Choply.card).join('');
    $('#resultCount').textContent=`${matches.length} ${matches.length===1?'dish':'dishes'}${query.trim()?' matching “'+query.trim()+'”':''} · showing ${Math.min(limit,matches.length)}`;
    $('#menuEmpty').hidden=!!matches.length;
    $('#emptyMessage').textContent=saved?'No saved dishes match. Tap a heart on a dish, or clear these filters.':'Try a different dish, category or spelling. Nothing has been removed from the menu.';
    $('#loadMore').hidden=limit>=matches.length;
    $('#onlyFavourites').classList.toggle('active',saved);$('#onlyFavourites').setAttribute('aria-pressed',String(saved));
    $('#menuCategories').querySelectorAll('button').forEach(button=>{button.classList.toggle('active',button.dataset.category===category);button.setAttribute('aria-pressed',String(button.dataset.category===category));});
    saveURL();Choply.refresh();
  }
  $('#menuSearchForm').addEventListener('submit',event=>{event.preventDefault();query=$('#menuQuery').value;limit=12;render();});
  let timer;$('#menuQuery').addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(()=>{query=$('#menuQuery').value;limit=12;render();},160);});
  $('#menuCategories').addEventListener('click',event=>{const button=event.target.closest('button');if(button){category=button.dataset.category;limit=12;render();}});
  $('#menuSort').addEventListener('change',event=>{sort=event.target.value;limit=12;render();});
  $('#onlyFavourites').addEventListener('click',()=>{saved=!saved;limit=12;render();});
  $('#resetMenu').addEventListener('click',()=>{query='';category='all';saved=false;sort='featured';limit=12;$('#menuQuery').value='';$('#menuSort').value=sort;render();});
  $('#loadMore').addEventListener('click',()=>{const oldCount=$('#catalogueGrid').children.length;limit+=12;render();const firstNew=$('#catalogueGrid').children[oldCount];if(firstNew){firstNew.tabIndex=-1;firstNew.focus({preventScroll:true});}});
  document.addEventListener('choply:favourites',()=>{if(saved)render();});
  render();
})();
