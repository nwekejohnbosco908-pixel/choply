# CHOPLY — Food Discovery & Ordering Demo

**From discovering a meal to building an order.**

CHOPLY is my personal food-ordering frontend project, built with **HTML, CSS and JavaScript**. It combines automatic cart totals, unique demo order IDs, favourites and a client-side sign-in flow with responsive cards and layouts for phones and larger screens.

I started CHOPLY in **June 2026** to practise turning an idea into an interactive website while developing my JavaScript skills. The visual direction uses warm cream and orange colours, bold typography and food photography.

**Status:** Frontend demo · In development · Public demo link to be added after deployment.

## Why I built it

I wanted to make browsing food and putting together an order feel simple. The homepage introduces a small selection of dishes, while a separate menu page lets visitors explore more choices without filling the homepage with food cards.

The main challenge has been connecting the account, cart and ordering interactions while keeping the navigation, cards and layouts usable across screen sizes.

## Features

- **Curated homepage:** Featured meals, popular picks, categories and a small menu preview.
- **Full menu:** Twenty sample dishes across eight categories, with descriptions, portions and prices in naira.
- **Search across dishes:** Homepage searches open the full menu, including items that are not displayed on the homepage.
- **Combined filters:** Search, categories and saved dishes work together, with price and alphabetical sorting.
- **Favourites:** Save dishes and revisit them through the saved-dishes filter.
- **Shopping cart:** Add or remove dishes, change quantities and calculate the subtotal, sample delivery fee and total automatically.
- **Demo accounts:** Create a local account, sign in, sign out and save a sample address. Signing out keeps the account available for another visit.
- **Simulated orders:** Generate a unique order ID, view a receipt and look up an order saved in the same browser.
- **Responsive interactions:** Mobile navigation, a pausable hero slider, scroll reveals, keyboard focus controls and reduced-motion support.

## Built with

| Technology | How I use it |
| --- | --- |
| HTML | Page structure, forms, navigation and content |
| CSS | Responsive layouts, card design, transitions and animations |
| JavaScript | Search, filters, favourites, cart calculations and demo account/order flows |
| localStorage | Browser persistence for demo accounts, cart, favourites and orders |
| Web Crypto | Salted password hashing for the local account demonstration |

CHOPLY uses plain HTML, CSS and JavaScript. It does not require React, Next.js or an npm development server.

## What I am learning

This project gives me practical experience with DOM events, form validation, reusable data, browser storage and responsive design. I am also learning to handle empty search results, incorrect sign-in details, missing photos and invalid stored data so that the interface remains useful when something goes wrong.

A shared catalogue in `foods.js` keeps dish names and prices consistent between the homepage, menu and cart. It also makes adding or updating dishes easier.

The idea and visual direction are mine. I use AI assistance for implementation, debugging and refinement as I continue learning and understanding the code.

**Status:** Live frontend demo · Deployed on Vercel

## Live demo

[Explore CHOPLY](https://choply-blue.vercel.app/)

[View source code](https://github.com/nwekejohnbosco908-pixel/choply)

## Project files

| File | Purpose |
| --- | --- |
| `index.html` | Homepage and shared interaction dialogs |
| `menu.html` | Full-menu page |
| `style.css` | Homepage, menu and responsive styles |
| `foods.js` | Dish catalogue, prices, descriptions and image paths |
| `script.js` | Shared cart, account, favourites, order and navigation behaviour |
| `menu.js` | Full-menu search, filters, sorting and URL state |
| `images/` | Food and background photographs |
| `assets/dish-placeholder.svg` | Fallback illustration for unavailable photos |
| `TESTING.md` | Checks completed and remaining verification limits |

To change a price or add a dish, edit `foods.js`. Keep existing dish IDs stable so saved favourites and cart items continue to refer to the correct dishes.

## Try the ordering flow

1. Search for **Chapman** from the homepage and press Enter.
2. Browse the menu, save a favourite and add a dish to the cart.
3. Change the quantity and check the totals.
4. Select **Place order** and create an account using made-up details.
5. Place the order after signing in, copy its `CHP-12345` style ID and try order tracking.

## Demo scope

CHOPLY demonstrates frontend behaviour. It has **no backend authentication, payment processing or restaurant delivery service**. Nothing is sent to a restaurant and no payment is collected. Tracking shows only simulated orders saved in the same browser.

Account records use salted password hashes, but browser storage is editable and does not provide production authentication. Use made-up details. Data does not sync between browsers, devices, localhost and deployment.

Prices and portions are sample content. New dishes without a supplied photograph show a labelled placeholder.

## Testing

The updated version passed automated Chromium checks for cart totals, demo signup/sign-in/logout, known and unknown order tracking, desktop/mobile search, combined filters, favourites, sorting and invalid stored data.

Both pages were checked for horizontal overflow at widths from **320px to 1440px**. Original food photos were not included in that test environment; they still need to be checked in the complete project. See `TESTING.md` for details.

## Next steps

- Add suitable photographs for the new dishes.
- Review the complete site on real devices before deployment.
- Publish a live demo and add its link here and to my portfolio.
- Continue improving the JavaScript structure as my skills grow.
- Explore backend authentication, a shared database and real order handling as future work.

## References

I reviewed [Intek Lounge’s menu](https://inteklounge.com/menu/) for Nigerian menu pricing and portion distinctions, and [Chop Shap](https://chopshap.com/) as an ordering-interface reference. CHOPLY keeps its own visual identity and uses adapted demo prices.

## About me

I’m **Nweke Johnbosco Chiemerie**, a frontend developer and Computer Science with Statistics student at the **University of Nigeria, Nsukka**. I am learning by building and improving projects, and I am open to frontend internships, junior opportunities and collaborations.

- [My portfolio](https://johnbosco-portfolio-xi.vercel.app/)
- [My GitHub](https://github.com/nwekejohnbosco908-pixel)
