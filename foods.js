window.CHOPLY_FOODS = [
  {id:'chicken-shawarma',name:'Chicken Shawarma',category:'shawarma',price:5000,portion:'One wrap',description:'Chicken, crunchy vegetables and creamy sauce.',image:'images/shawarma1.jpeg.jpg',tags:'wrap quick bite'},
  {id:'special-shawarma',name:'Special Shawarma',category:'shawarma',price:7000,portion:'One loaded wrap',description:'An extra-filled wrap for a bigger appetite.',image:'images/shawarma.jpeg.jpg',tags:'wrap loaded'},
  {id:'classic-burger',name:'Classic Burger',category:'burger',price:6000,portion:'One burger',description:'A juicy patty, fresh greens and our house sauce.',image:'images/burger.jpg',tags:'burgers beef quick bite'},
  {id:'burger-fries',name:'Burger & Fries',category:'burger',price:8500,portion:'Burger + fries',description:'A classic burger with a side of golden fries.',image:'images/burger-fries.jpg',tags:'burgers chips combo'},
  {id:'jollof-rice',name:'Jollof Rice',category:'rice',price:3500,portion:'Rice only',description:'Smoky, tomato-rich rice. Protein sold separately.',image:'images/jollofrice.jpeg.jpg',tags:'party jollof'},
  {id:'jollof-chicken',name:'Jollof & Chicken',category:'rice',price:8000,portion:'Rice + chicken',description:'A comforting plate of jollof with chicken.',image:'images/partyjollof.jpeg.jpg',tags:'party jollof protein combo'},
  {id:'fried-rice',name:'Fried Rice & Chicken',category:'rice',price:8000,portion:'Rice + chicken',description:'Colourful vegetable rice with a chicken portion.',image:'images/friedrice-chicken.jpg',tags:'rice vegetables combo'},
  {id:'coconut-rice',name:'Coconut Rice',category:'rice',price:5000,portion:'Rice only',description:'Fragrant rice with a gentle coconut finish.',image:'images/coconut-rice.jpg',tags:'rice coconut'},
  {id:'chicken-chips',name:'Chicken & Chips',category:'chicken',price:7500,portion:'Chicken + fries',description:'Golden chicken and crispy chips, made for sharing.',image:'images/chikenchips.jpeg.jpg',tags:'fries chicken combo'},
  {id:'chicken-wings',name:'Chicken Wings',category:'chicken',price:6000,portion:'Six wings',description:'A portion of saucy, satisfying wings.',image:'images/chiken.jpeg.jpg',tags:'chicken wings protein'},
  {id:'peppered-chicken',name:'Peppered Chicken',category:'chicken',price:5000,portion:'One portion',description:'Chicken tossed in a warming pepper sauce.',image:'images/pepperedchicken.jpg',tags:'chicken spicy protein'},
  {id:'grilled-chicken',name:'Grilled Chicken',category:'barbecue',price:6500,portion:'Half chicken',description:'A simple grill favourite with smoky flavour.',image:'images/grilledchicken.jpg',tags:'bbq barbecue grill protein'},
  {id:'barbecue-mix',name:'Barbecue Mix',category:'barbecue',price:15000,portion:'Sharing platter',description:'A generous selection from the grill.',image:'images/barbeque.jpg',tags:'bbq barbecue grill sharing'},
  {id:'tomato-pasta',name:'Tomato Pasta',category:'pasta',price:5000,portion:'One plate',description:'Spaghetti coated in a rich tomato sauce.',image:'images/spaghetti.jpeg.jpg',tags:'spaghetti noodles pasta'},
  {id:'chicken-pasta',name:'Chicken Pasta',category:'pasta',price:8000,portion:'One plate',description:'A hearty pasta bowl with chicken.',image:'images/Pasta1.jpeg.jpg',tags:'spaghetti chicken pasta'},
  {id:'chapman',name:'Chapman',category:'drinks',price:3000,portion:'One glass',description:'A refreshing Nigerian mocktail.',image:'images/chapman.jpg',tags:'drink mocktail cocktail non alcoholic'},
  {id:'strawberry-slush',name:'Strawberry Slush',category:'drinks',price:4000,portion:'One cup',description:'An icy berry drink for a sweet refresh.',image:'images/cocktail.jpeg.jpg',tags:'drink smoothie frozen juice berry'},
  {id:'virgin-mojito',name:'Virgin Mojito',category:'drinks',price:3000,portion:'One glass',description:'A minty, citrusy refresh without alcohol.',image:'images/Virgin Mojito.jpg',tags:'drink mocktail cocktail non alcoholic'},
  {id:'fruit-parfait',name:'Fruit Parfait',category:'parfait',price:4500,portion:'One cup',description:'Layers of yoghurt, fruit and crunchy granola.',image:'images/parfait1.jpeg.jpg',tags:'yogurt yoghurt dessert parfait'},
  {id:'large-parfait',name:'Large Parfait',category:'parfait',price:6500,portion:'Large cup',description:'More fruit, yoghurt and granola in every layer.',image:'images/parfait2.jpeg.jpg',tags:'yogurt yoghurt dessert parfait'}
];
window.CHOPLY_CATEGORIES = {all:'All dishes',shawarma:'Shawarma',burger:'Burgers',chicken:'Chicken',rice:'Rice',drinks:'Drinks',barbecue:'Barbecue',pasta:'Pasta',parfait:'Parfait'};
window.Choply = {
  money: value => new Intl.NumberFormat('en-NG',{style:'currency',currency:'NGN',maximumFractionDigits:0}).format(value),
  escape: value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
  find: id => CHOPLY_FOODS.find(food => food.id === id),
  matches: (food,query) => {
    const text = `${food.name} ${food.category} ${food.tags}`.toLowerCase();
    return query.toLowerCase().trim().split(/\s+/).every(word => text.includes(word));
  },
  card: food => `<article class="food-card menu-food" data-food-id="${food.id}" data-category="${food.category}">
    <div class="food-image">${food.image ? `<img src="${food.image}" alt="${food.name}" loading="lazy" width="480" height="320">` : `<div class="dish-placeholder"><span aria-hidden="true">✦</span><small>${CHOPLY_CATEGORIES[food.category]}</small><small>Photo coming soon</small></div>`}
      <button type="button" class="like-btn" data-food-id="${food.id}" aria-label="Save ${food.name}" aria-pressed="false"><span class="material-symbols-rounded">favorite</span></button>
    </div><div class="food-info"><span class="food-category">${CHOPLY_CATEGORIES[food.category]}</span><h3>${food.name}</h3>
      <p class="dish-description">${food.description}</p><p class="dish-portion">${food.portion}</p>
      <div class="food-bottom"><strong>${Choply.money(food.price)}</strong><button type="button" class="add-btn" data-food-id="${food.id}" aria-label="Add ${food.name} to cart"><span class="material-symbols-rounded">add</span></button></div>
    </div></article>`
};
