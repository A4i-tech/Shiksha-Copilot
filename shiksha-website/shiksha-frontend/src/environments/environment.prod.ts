import { runtimeEnv } from './runtime-env';

export const environment = {
    production: true,
    CRYPTO_SECRET: 'your_crypto_secret',
    EXP_MONTH: 3,
    ...runtimeEnv,
};
