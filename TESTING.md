# Verification

Checked 11 October 2026 using headless Chromium and Playwright against the actual HTML/CSS/JavaScript served locally.

Passed:

- Homepage renders eight preview cards and four correctly mapped hero slides.
- Cart subtotal, quantities, total, checkout and delivery fee.
- Demo signup, incorrect-password rejection, signin and logout without deleting the account.
- No plaintext password field in the stored account record.
- Simulated checkout creates a unique order ID; known orders can be tracked and invented IDs are rejected.
- Desktop and mobile homepage searches navigate to the full catalogue, including dishes not displayed on the homepage.
- Empty results, reset, categories, combined search/filter behaviour, saved dishes, price sorting and load more.
- Mobile navigation closes correctly and homepage search remains available.
- No horizontal document overflow on either page at 320, 375, 390, 768, 1024 and 1440 pixels.
- Escape closes the cart and restores focus to its trigger.
- Invalid stored JSON does not prevent the interface from loading.
- No JavaScript page errors during the functional suite.
- Unique HTML IDs, one main landmark and one H1 per page; all JavaScript files pass Node syntax checks.

Limits: original food photos, backgrounds and icon font were not supplied. Tests exercised the included fallback graphics, not the original image assets. Browser checks used reduced motion for deterministic automation. Animation timing, real-device Safari behaviour, screen-reader output and a deployed build still need a final manual check. No real authentication, payments or restaurant delivery were tested because this is a frontend demo.
