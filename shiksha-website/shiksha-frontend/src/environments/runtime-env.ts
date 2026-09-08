function requireEnv(key: keyof NonNullable<Window['env']>): string {
  const value = window.env?.[key];
  if (!value) throw new Error(`window.env.${key} is required but was not set`);
  return value;
}

export const runtimeEnv = {
  apiUrl: requireEnv('apiUrl'),
  turnstileSiteKey: requireEnv('turnstileSiteKey'),
  supersetUrl: requireEnv('supersetUrl'),
  supersetDashboardUuid: requireEnv('supersetDashboardUuid'),
  supersetMobileDashboardUuid: requireEnv('supersetMobileDashboardUuid'),
};
