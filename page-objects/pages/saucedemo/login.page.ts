import { Page } from "@playwright/test";
import { Wait } from "settings/config/timeout.config";
import Env from "settings/env/env.global";

export class SauceLoginPage {
    constructor(protected page: Page) {}

    elements = {
        usernameInput: () => this.page.locator("#user-name"),
        passwordInput: () => this.page.locator("#password"),
        loginButton: () => this.page.locator("#login-button"),
        errorMessage: () => this.page.locator('[data-test="error"]'),
    };

    async goto() {
        await this.page.goto(Env.SAUCE_WEB_URL);
        await this.page.waitForLoadState("load", { timeout: Wait.LONG });
    }

    async login(username: string, password: string) {
        await this.elements.usernameInput().fill(username);
        await this.elements.passwordInput().fill(password);
        await this.elements.loginButton().click();
    }

    async gotoAndLogin(username: string, password: string) {
        await this.goto();
        await this.login(username, password);
    }
}
