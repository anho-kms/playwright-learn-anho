import { test as base } from "@playwright/test";
import { SignInPage } from "page-objects/pages/sign-in.page";
import { SauceLoginPage } from "page-objects/pages/saucedemo/login.page";
import { InventoryPage } from "page-objects/pages/saucedemo/inventory.page";


type PageObjects = {
    signInPage: SignInPage;
    sauceLoginPage: SauceLoginPage;
    inventoryPage: InventoryPage;
};

export const test = base.extend<PageObjects>({
    signInPage: async ({ page }, use) => {
        await use(new SignInPage(page));
    },
    sauceLoginPage: async ({ page }, use) => {
        await use(new SauceLoginPage(page));
    },
    inventoryPage: async ({ page }, use) => {
        await use(new InventoryPage(page));
    },
});

export const expect = test.expect;
