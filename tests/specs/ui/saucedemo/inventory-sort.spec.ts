import { SortOption } from "page-objects/pages/saucedemo/inventory.page";
import Env from "settings/env/env.global";
import { SaucedemoRoutes } from "settings/config/routes.saucedemo";
import { Products, ALL_PRODUCTS_AZ } from "settings/config/products.saucedemo";
import { test, expect } from "settings/fixtures/ui.fixture";

test.describe("Saucedemo - inventory sort", () => {
    test.beforeEach(async ({ sauceLoginPage }) => {
        // Login to inventory page before each test
        await sauceLoginPage.gotoAndLogin(Env.SAUCE_USERNAME, Env.SAUCE_PASSWORD);
    });

    test("Scenario 1: default sort state after login is Name (A to Z)", async ({
        page,
        inventoryPage,
    }) => {
        await expect(page).toHaveURL(SaucedemoRoutes.INVENTORY);
        await expect(inventoryPage.elements.appLogo()).toHaveText("Swag Labs");

        await expect(inventoryPage.elements.sortActiveOption()).toHaveText("Name (A to Z)");
        await expect(inventoryPage.elements.sortDropdown()).toHaveValue("az");

        await expect(inventoryPage.elements.productNames()).toHaveText(ALL_PRODUCTS_AZ);
    });

    test("Scenario 2: sort resets to default after logout and re-login", async ({
        page,
        inventoryPage,
        sauceLoginPage,
    }) => {
        await inventoryPage.sortBy(SortOption.ZA);
        await expect(inventoryPage.elements.sortActiveOption()).toHaveText("Name (Z to A)");

        await inventoryPage.openBurgerMenuAndLogout();
        await expect(page).toHaveURL(SaucedemoRoutes.HOME);
        await expect(sauceLoginPage.elements.loginButton()).toBeVisible();

        await sauceLoginPage.login(Env.SAUCE_USERNAME, Env.SAUCE_PASSWORD);
        await expect(page).toHaveURL(SaucedemoRoutes.INVENTORY);

        await expect(inventoryPage.elements.sortActiveOption()).toHaveText("Name (A to Z)");
        await expect(inventoryPage.elements.sortDropdown()).toHaveValue("az");
        await expect(inventoryPage.elements.productNames()).toHaveText(ALL_PRODUCTS_AZ);
    });

    test("Scenario 3: sorting with items in cart preserves cart state and equal-price products keep stable order", async ({
        inventoryPage,
    }) => {
        await inventoryPage.addToCart(Products.BACKPACK.slug);
        await inventoryPage.addToCart(Products.ONESIE.slug);

        await expect(inventoryPage.elements.cartBadge()).toHaveText("2");

        await inventoryPage.sortBy(SortOption.HighToLow);

        // Verify the product list is now sorted by price descending
        const actualPricesDesc = await inventoryPage.getProductPrices();
        const expectedSortedDesc = [...actualPricesDesc].sort((a, b) => b - a);
        expect(actualPricesDesc).toEqual(expectedSortedDesc);

        // Verify the cart state is preserved after sorting
        await expect(inventoryPage.elements.cartBadge()).toHaveText("2");
        await expect(inventoryPage.elements.removeButtonFor(Products.BACKPACK.slug)).toBeVisible();
        await expect(inventoryPage.elements.removeButtonFor(Products.ONESIE.slug)).toBeVisible();

        // Verify other products still display "Add to cart"
        const remainingAddToCart = [
            Products.BIKE_LIGHT.slug,
            Products.BOLT_T_SHIRT.slug,
            Products.FLEECE_JACKET.slug,
            Products.ALL_THE_THINGS.slug,
        ];
        for (const slug of remainingAddToCart) {
            await expect(inventoryPage.elements.addToCartButtonFor(slug)).toBeVisible();
        }

        // Low → High: stable order of equally priced $15.99 items
        await inventoryPage.sortBy(SortOption.LowToHigh);
        let names = await inventoryPage.getProductNames();
        let boltIdx = names.indexOf(Products.BOLT_T_SHIRT.name);
        let redIdx = names.indexOf(Products.ALL_THE_THINGS.name);
        expect(boltIdx).toBeGreaterThanOrEqual(0);
        expect(redIdx).toBeGreaterThanOrEqual(0);
        expect(boltIdx).toBeLessThan(redIdx);

        // High → Low: stable sort — Bolt still appears before Red among equal-priced items
        await inventoryPage.sortBy(SortOption.HighToLow);
        names = await inventoryPage.getProductNames();
        boltIdx = names.indexOf(Products.BOLT_T_SHIRT.name);
        redIdx = names.indexOf(Products.ALL_THE_THINGS.name);
        expect(boltIdx).toBeLessThan(redIdx);
    });
});

test.describe("Saucedemo - required locator coverage (CSS + XPath)", () => {
    test.beforeEach(async ({ sauceLoginPage }) => {
        await sauceLoginPage.gotoAndLogin(Env.SAUCE_USERNAME, Env.SAUCE_PASSWORD);
    });

    test("CSS and XPath locators resolve to the expected elements", async ({ inventoryPage }) => {
        const l = inventoryPage.locators;

        // 1. cart link
        await expect(l.cartLinkCss()).toHaveCount(1);
        await expect(l.cartLinkXpath()).toHaveCount(1);

        // 2. all "Add to cart" buttons (6 on a fresh inventory page)
        await expect(l.addToCartButtonsCss()).toHaveCount(6);
        await expect(l.addToCartButtonsXpath()).toHaveCount(6);

        // 3. sort dropdown
        await expect(l.sortDropdownCss()).toHaveCount(1);
        await expect(l.sortDropdownXpath()).toHaveCount(1);

        // 4. all product images
        await expect(l.productImagesCss()).toHaveCount(6);
        await expect(l.productImagesXpath()).toHaveCount(6);

        // 5. items priced "$15.99" — Bolt T-Shirt + Test.allTheThings() T-Shirt
        await expect(l.itemsWithPrice1599Css()).toHaveCount(2);
        await expect(l.itemsWithPrice1599Xpath()).toHaveCount(2);

        // 6. backpack add-to-cart
        await expect(l.addBackpackButtonCss()).toBeVisible();
        await expect(l.addBackpackButtonXpath()).toBeVisible();

        // 7. remove button for onesie appears after adding
        await inventoryPage.addToCart(Products.ONESIE.slug);
        await expect(l.removeOnesieButtonCss()).toBeVisible();
        await expect(l.removeOnesieButtonXpath()).toBeVisible();

        // 8. buttons with data-test starting with "add-to-cart" (5 left after onesie added)
        await expect(l.addToCartByDataTestCss()).toHaveCount(5);
        await expect(l.addToCartByDataTestXpath()).toHaveCount(5);

        // 9. product names NOT containing "Sauce Labs" -> only "Test.allTheThings() T-Shirt (Red)"
        await expect(l.nonSauceLabsNamesCss()).toHaveCount(1);
        await expect(l.nonSauceLabsNamesXpath()).toHaveCount(1);
        await expect(l.nonSauceLabsNamesXpath()).toHaveText(Products.ALL_THE_THINGS.name);

        // 10. image by partial alt text match
        await expect(l.productImageByAltCss("Backpack")).toHaveCount(1);
        await expect(l.productImageByAltXpath("Backpack")).toHaveCount(1);
    });
});