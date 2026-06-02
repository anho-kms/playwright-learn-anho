
# Locator Exercise

| Element | CSS Selector | Xpath |
| --- | --- | --- |
| Shopping cart link/icon | `.shopping_cart_link` | `//a[contains(@class,"shopping_cart_link")]` |
| All "Add to cart" buttons | `button.btn_inventory[id^='add-to-cart']` | `//button[starts-with(@id,"add-to-cart")]` |
| Sort dropdown | `select.product_sort_container` | `//select[@data-test="product-sort-container"]` |
| All product images | `img.inventory_item_img` | `//img[contains(@class,"inventory_item_img")]` |
| Items whose price contains "$15.99" | `this.page.locator(".inventory_item").filter({has: this.page.locator".inventory_item_price", hasText: '$15.99'})` (`div.inventory_item .inventory_item_price`) | `//div[@data-test="inventory-item"][.//div[@data-test="inventory-item-price" and contains(.,"15.99")]]` |
| "Add to cart" button for "Sauce Labs Backpack" | `button#add-to-cart-sauce-labs-backpack` | `//button[@id="add-to-cart-sauce-labs-backpack"]` |
| "Remove" button for "Sauce Labs Onesie" | `#remove-sauce-labs-onesie` | `//button[@id="remove-sauce-labs-onesie"]` |
| All buttons with `data-test` starting with "add-to-cart" | `button[data-test^="add-to-cart"]` | `//button[starts-with(@data-test,"add-to-cart")]` |
| Product names that do NOT contain "Sauce Labs" | `.inventory_item_name:not(:text-matches('Sauce Labs'))` | `//div[contains(@class,"inventory_item_name") and not(contains(text(),"Sauce Labs"))]` |
| Product image by partial alt text match (e.g. "Backpack") | `img.inventory_item_img[alt*="<partialAlt>" i]` | `//img[contains(@class,"inventory_item_img") and contains(@alt,"<partialAlt>")]` |
