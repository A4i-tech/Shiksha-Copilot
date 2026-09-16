import { runtimeEnv } from "./runtime-env";

export const environment = {
    production: false,
    CRYPTO_SECRET: "your_crypto_secret",
    EXP_MONTH: 3,
    turnstileSiteKey: "your_turnstile_site_key",
    ...runtimeEnv,
};
