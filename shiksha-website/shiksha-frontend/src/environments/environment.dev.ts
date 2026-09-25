import { runtimeEnv } from "./runtime-env";

export const environment = {
    ...runtimeEnv,
    production: false,
    apiUrl: "your_backend_url",
    CRYPTO_SECRET: "your_crypto_secret",
    EXP_MONTH: 3,
    turnstileSiteKey: "",
};
