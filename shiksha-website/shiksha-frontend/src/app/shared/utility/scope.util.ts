import { PermissionGrant, RegionDependency } from '../interfaces/permission.interface';

export const SCOPE_FIELDS: Record<string, string[]> = {
  STATE: ['STATE'],
  ZONE: ['STATE', 'ZONE'],
  DISTRICT: ['STATE', 'ZONE', 'DISTRICT'],
  BLOCK: ['STATE', 'ZONE', 'DISTRICT', 'BLOCK'],
  SCHOOL: ['STATE', 'ZONE', 'DISTRICT', 'BLOCK', 'SCHOOL'],
};
export const ORGANISATION_SCOPES = ['GLOBAL', ...Object.keys(SCOPE_FIELDS)];

export function regionScopePaths(grants: PermissionGrant[]): Partial<RegionDependency>[] {
  if (grants.some((grant) => grant.scopeType === 'GLOBAL')) return [{}];
  return grants.filter((grant) => grant.scopeType !== 'SCHOOL').map((grant) => grant.dep as RegionDependency);
}

export function pathAllowed(scopes: Partial<RegionDependency>[], path: Partial<RegionDependency>): boolean {
  return scopes.some((scope) => Object.entries(path).every(([field, value]) => {
    const allowed = scope[field as keyof RegionDependency];
    return allowed === undefined || allowed === value;
  }));
}

export function scopeBelow(grants: PermissionGrant[], scopeType: string, path: Partial<RegionDependency>): boolean {
  if (scopeType === 'UNBOUND') return grants.some((grant) => grant.scopeType === 'GLOBAL');
  const target = ORGANISATION_SCOPES.indexOf(scopeType);
  return grants.some((grant) => {
    const source = ORGANISATION_SCOPES.indexOf(grant.scopeType);
    return source !== -1 && source < target && (source === 0 || pathAllowed([grant.dep as RegionDependency], path));
  });
}
