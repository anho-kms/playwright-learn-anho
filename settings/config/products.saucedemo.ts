export const Products = {
    BACKPACK: {
        name: "Sauce Labs Backpack",
        slug: "sauce-labs-backpack",
    },
    BIKE_LIGHT: {
        name: "Sauce Labs Bike Light",
        slug: "sauce-labs-bike-light",
    },
    BOLT_T_SHIRT: {
        name: "Sauce Labs Bolt T-Shirt",
        slug: "sauce-labs-bolt-t-shirt",
    },
    FLEECE_JACKET: {
        name: "Sauce Labs Fleece Jacket",
        slug: "sauce-labs-fleece-jacket",
    },
    ONESIE: {
        name: "Sauce Labs Onesie",
        slug: "sauce-labs-onesie",
    },
    ALL_THE_THINGS: {
        name: "Test.allTheThings() T-Shirt (Red)",
        slug: "test.allthethings()-t-shirt-(red)",
    },
} as const;

export const ALL_PRODUCTS_AZ = [
    Products.BACKPACK.name,
    Products.BIKE_LIGHT.name,
    Products.BOLT_T_SHIRT.name,
    Products.FLEECE_JACKET.name,
    Products.ONESIE.name,
    Products.ALL_THE_THINGS.name,
] as const;
