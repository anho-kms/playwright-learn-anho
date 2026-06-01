import Env from "settings/env/env.global";

export const SaucedemoRoutes = {
    get HOME() {
        return Env.SAUCE_WEB_URL + "/";
    },
    INVENTORY: /\/inventory\.html$/,
};
