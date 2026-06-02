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
        // Given the user is on the login page and logs in with standard_user/secret_sauce
        // Then the inventory page should be displayed
        await expect(page).toHaveURL(SaucedemoRoutes.INVENTORY);
        await expect(inventoryPage.elements.appLogo()).toHaveText("Swag Labs");

        // And the sort dropdown should show Name (A to Z) as the default selection
        await expect(inventoryPage.elements.sortActiveOption()).toHaveText("Name (A to Z)");
        await expect(inventoryPage.elements.sortDropdown()).toHaveValue("az");

        // And the products should be listed in alphabetical order
        await expect(inventoryPage.elements.productNames()).toHaveText(ALL_PRODUCTS_AZ);
    });

    test("Scenario 2: sort resets to default after logout and re-login", async ({
        page,
        inventoryPage,
        sauceLoginPage,
    }) => {
        // Given the user is logged in and on the inventory page
        // When the user selects Name (Z to A)
        await inventoryPage.sortBy(SortOption.ZA);
        await expect(inventoryPage.elements.sortActiveOption()).toHaveText("Name (Z to A)");

        // And the user opens the hamburger menu and logs out
        await inventoryPage.openBurgerMenuAndLogout();
        await expect(page).toHaveURL(SaucedemoRoutes.HOME);
        await expect(sauceLoginPage.elements.loginButton()).toBeVisible();

        // When the user logs back in with standard_user/secret_sauce
        await sauceLoginPage.login(Env.SAUCE_USERNAME, Env.SAUCE_PASSWORD);
        await expect(page).toHaveURL(SaucedemoRoutes.INVENTORY);

        // Then the inventory page should show the default sort state again
        await expect(inventoryPage.elements.sortActiveOption()).toHaveText("Name (A to Z)");
        await expect(inventoryPage.elements.sortDropdown()).toHaveValue("az");

        // And products should again be listed in ascending alphabetical order
        await expect(inventoryPage.elements.productNames()).toHaveText(ALL_PRODUCTS_AZ);
    });

    test("Scenario 3: sorting with items in cart preserves cart state and equal-price products keep stable order", async ({
        inventoryPage,
    }) => {
        // Given the user is logged in and on the inventory page
        // When the user adds Sauce Labs Backpack and Sauce Labs Onesie to the cart
        await inventoryPage.addToCart(Products.BACKPACK.slug);
        await inventoryPage.addToCart(Products.ONESIE.slug);

        // Then the cart badge should update to show 2 items
        await expect(inventoryPage.elements.cartBadge()).toHaveText("2");

        // When the user selects Price (high to low)
        await inventoryPage.sortBy(SortOption.HighToLow);

        // Then products should be ordered by descending price
        const actualPricesDesc = await inventoryPage.getProductPrices();
        const expectedSortedDesc = [...actualPricesDesc].sort((a, b) => b - a);
        expect(actualPricesDesc).toEqual(expectedSortedDesc);

        // And the cart badge should still show 2 items
        await expect(inventoryPage.elements.cartBadge()).toHaveText("2");

        // And the two added items should now show Remove buttons
        await expect(inventoryPage.elements.removeButtonFor(Products.BACKPACK.slug)).toBeVisible();
        await expect(inventoryPage.elements.removeButtonFor(Products.ONESIE.slug)).toBeVisible();

        // And all remaining products should still show Add to cart
        const remainingAddToCart = [
            Products.BIKE_LIGHT.slug,
            Products.BOLT_T_SHIRT.slug,
            Products.FLEECE_JACKET.slug,
            Products.ALL_THE_THINGS.slug,
        ];
        for (const slug of remainingAddToCart) {
            await expect(inventoryPage.elements.addToCartButtonFor(slug)).toBeVisible();
        }

        // When the user selects Price (low to high)
        await inventoryPage.sortBy(SortOption.LowToHigh);
        let names = await inventoryPage.getProductNames();
        let boltIdx = names.indexOf(Products.BOLT_T_SHIRT.name);
        let redIdx = names.indexOf(Products.ALL_THE_THINGS.name);

        // Then Sauce Labs Bolt T-Shirt should appear before Test.allTheThings() T-Shirt (Red) among equal-priced $15.99 items
        expect(boltIdx).toBeGreaterThanOrEqual(0);
        expect(redIdx).toBeGreaterThanOrEqual(0);
        expect(boltIdx).toBeLessThan(redIdx);

        // When the user selects Price (high to low) again
        await inventoryPage.sortBy(SortOption.HighToLow);
        names = await inventoryPage.getProductNames();
        boltIdx = names.indexOf(Products.BOLT_T_SHIRT.name);
        redIdx = names.indexOf(Products.ALL_THE_THINGS.name);

        // Then the stable sort should preserve the relative order of equal-priced items, with Bolt before Red
        expect(boltIdx).toBeLessThan(redIdx);
    });
});