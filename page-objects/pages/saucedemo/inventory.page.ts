import { Page, Locator } from "@playwright/test";

export const enum SortOption {
    AZ        = "az",
    ZA        = "za",
    LowToHigh = "lohi",
    HighToLow = "hilo",
}

/**
 * Inventory page object for saucedemo.com.
 *
 * The `locators` group intentionally exposes BOTH CSS and XPath variants for the
 * 10 selector requirements so they can be exercised/asserted in tests. The
 * `elements` group exposes the canonical locator used by page actions.
 */
export class InventoryPage {
    constructor(protected page: Page) {}

    // ---------------------------------------------------------------------
    // Locators
    // ---------------------------------------------------------------------
    locators = {
        // 1. Shopping cart link/icon
        cartLinkCss: (): Locator => this.page.locator(".shopping_cart_link"),
        cartLinkXpath: (): Locator => this.page.locator('xpath=//a[contains(@class,"shopping_cart_link")]'),

        // 2. All "Add to cart" buttons
        addToCartButtonsCss: (): Locator => this.page.locator("button.btn_inventory[id^='add-to-cart']"),
        addToCartButtonsXpath: (): Locator =>
            this.page.locator('xpath=//button[starts-with(@id,"add-to-cart")]'),

        // 3. Sort dropdown
        sortDropdownCss: (): Locator => this.page.locator("select.product_sort_container"),
        sortDropdownXpath: (): Locator => this.page.locator('xpath=//select[@data-test="product-sort-container"]'),

        // 4. All product images
        productImagesCss: (): Locator => this.page.locator("img.inventory_item_img"),
        productImagesXpath: (): Locator => this.page.locator('xpath=//img[contains(@class,"inventory_item_img")]'),

        // 5. Items whose price contains "$15.99"
        itemsWithPrice1599Css: (): Locator => this.page.locator('.inventory_item').filter({has: this.page.locator('.inventory_item_price'),hasText: '$15.99'}),
        itemsWithPrice1599Xpath: (): Locator =>
            this.page.locator(
                'xpath=//div[@data-test="inventory-item"][.//div[@data-test="inventory-item-price" and contains(.,"15.99")]]',
            ),

        // 6. "Add to cart" button for "Sauce Labs Backpack"
        addBackpackButtonCss: (): Locator => this.page.locator("button#add-to-cart-sauce-labs-backpack"),
        addBackpackButtonXpath: (): Locator => this.page.locator('xpath=//button[@id="add-to-cart-sauce-labs-backpack"]'),

        // 7. "Remove" button for "Sauce Labs Onesie" (appears after adding to cart)
        removeOnesieButtonCss: (): Locator => this.page.locator("#remove-sauce-labs-onesie"),
        removeOnesieButtonXpath: (): Locator => this.page.locator('xpath=//button[@id="remove-sauce-labs-onesie"]'),

        // 8. All buttons with data-test starting with "add-to-cart"
        addToCartByDataTestCss: (): Locator => this.page.locator('button[data-test^="add-to-cart"]'),
        addToCartByDataTestXpath: (): Locator =>
            this.page.locator('xpath=//button[starts-with(@data-test,"add-to-cart")]'),

        // 9. Product names that do NOT contain "Sauce Labs"
        nonSauceLabsNamesCss: (): Locator =>
            this.page.locator(".inventory_item_name:not(:text-matches('Sauce Labs'))"),
        nonSauceLabsNamesXpath: (): Locator =>
            this.page.locator('xpath=//div[contains(@class,"inventory_item_name") and not(contains(text(),"Sauce Labs"))]'),

        // 10. Product image by partial alt text match (e.g. "Backpack")
        productImageByAltCss: (partialAlt: string): Locator =>
            this.page.locator(`img.inventory_item_img[alt*="${partialAlt}" i]`),
        productImageByAltXpath: (partialAlt: string): Locator =>
            this.page.locator(`xpath=//img[contains(@class,"inventory_item_img") and contains(@alt,"${partialAlt}")]`),
    };

    // ---------------------------------------------------------------------
    // Canonical elements used by page actions.
    // ---------------------------------------------------------------------
    elements = {
        appLogo: (): Locator => this.page.locator(".app_logo"),
        sortDropdown: (): Locator => this.page.locator('[data-test="product-sort-container"]'),
        sortActiveOption: (): Locator => this.page.locator(".active_option"),
        cartLink: (): Locator => this.page.locator(".shopping_cart_link"),
        cartBadge: (): Locator => this.page.locator(".shopping_cart_badge"),
        productNames: (): Locator => this.page.locator(".inventory_item_name"),
        productPrices: (): Locator => this.page.locator(".inventory_item_price"),
        burgerMenuButton: (): Locator => this.page.locator("#react-burger-menu-btn"),
        logoutLink: (): Locator => this.page.locator("#logout_sidebar_link"),
        addToCartButtonFor: (productSlug: string): Locator =>
            this.page.locator(`[id="add-to-cart-${productSlug}"]`),
        removeButtonFor: (productSlug: string): Locator =>
            this.page.locator(`[id="remove-${productSlug}"]`),
        inventoryItemByName: (name: string): Locator =>
            this.page.locator(".inventory_item", { hasText: name }),
    };

    // ---------------------------------------------------------------------
    // Actions
    // ---------------------------------------------------------------------
    async sortBy(option: SortOption) {
        await this.elements.sortDropdown().selectOption(option);
    }

    async addToCart(productSlug: string) {
        await this.elements.addToCartButtonFor(productSlug).click();
    }

    async openBurgerMenuAndLogout() {
        await this.elements.burgerMenuButton().click();
        await this.elements.logoutLink().click();
    }

    async getProductNames(): Promise<string[]> {
        return this.elements.productNames().allTextContents();
    }

    async getProductPrices(): Promise<number[]> {
        const raw = await this.elements.productPrices().allTextContents();
        return raw.map((p) => parseFloat(p.replace("$", "")));
    }
}
