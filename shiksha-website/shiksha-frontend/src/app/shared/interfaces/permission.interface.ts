export interface RegionDependency {
  state: string;
  zone?: string;
  district?: string;
  block?: string;
}

export interface PermissionGrant {
  permission: string;
  scopeType: string;
  dep: string | RegionDependency | null;
}
