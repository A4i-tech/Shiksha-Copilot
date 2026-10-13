const { getRolePermissions } = require('../../../helper/permission.helper');

const CONTENT = ['content.view', 'lesson-plan.generate', 'lesson-resource.generate', 'presentation.generate.arbitrary', 'presentation.generate.lesson-plan'];
const names = (assignments) => getRolePermissions(assignments).map((grant) => grant.permission);

describe('content generation permissions (BUG-140)', () => {
  it('keeps them for Superuser', () => {
    expect(names([{ role: { isSuperUser: true } }])).toEqual(expect.arrayContaining(CONTENT));
  });
  it('keeps them for a GLOBAL-scope role', () => {
    expect(names([{ role: { scopeType: 'GLOBAL', permissions: CONTENT }, dep: null }])).toEqual(CONTENT);
  });
});
