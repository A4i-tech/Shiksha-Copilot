import { runtimeEnv } from './runtime-env';

export const environment = {
    production: false,
    apiUrl: runtimeEnv.apiUrl,
    CRYPTO_SECRET: 'your_crypto_secret',
    EXP_MONTH: 3,
    turnstileSiteKey: runtimeEnv.turnstileSiteKey,
    supersetUrl: runtimeEnv.supersetUrl,
    supersetDashboardUuid: runtimeEnv.supersetDashboardUuid,
    supersetMobileDashboardUuid: runtimeEnv.supersetMobileDashboardUuid,
};
