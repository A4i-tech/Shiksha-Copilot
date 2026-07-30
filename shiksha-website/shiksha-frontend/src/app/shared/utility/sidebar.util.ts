const assetURl = 'assets/icons';
export const menuItem = [
  getMenuItems(
    'Dashboard',
    '/leaders-dashboard',
    'dashboard.svg',
    'dashboard-light.svg',
    'leaders-dashboard',
    ['analytics.view']
  ),
  getMenuItems(
    'Home',
    '/dashboard',
    'dashboard.svg',
    'dashboard-light.svg',
    'dashboard',
    ['dashboard.teacher.view']
  ),
  getMenuItems(
    'Profile',
    '/profile',
    'profile.svg',
    'profile-light.svg',
    'profile',
    ['profile.view']
  ),
  getMenuItems(
    'School Management',
    '/schools',
    'school-management.svg',
    'school-management-light.svg',
    'schools',
    ['school.list']
  ),
  getMenuItems(
    'Teacher Management',
    '/teachers',
    'user-management.svg',
    'user-management-light.svg',
    'teachers',
    ['teacher.view']
  ),
  getMenuItems(
    'Staff Management',
    '/staff',
    'staff-management.svg',
    'staff-management-light.svg',
    'staff',
    ['staff.view']
  ),
  getMenuItems(
    'Role Management',
    '/roles',
    'role-management.svg',
    'role-management-light.svg',
    'roles',
    ['role.view']
  ),
  getMenuItems(
    'Content Generation',
    '/content',
    'content-generation.svg',
    'content-generation-light.svg',
    'content',
    ['content.view']
  ),
  getMenuItems(
    'Question Paper Generation',
    '/question-papers',
    'question-bank.svg',
    'question-bank-light.svg',
    'question-papers',
    ['question-paper.generate']
  ),
  getMenuItems(
    'Chatbot',
    '/chat',
    'chatbot.svg',
    'chatbot-light.svg',
    'chat',
    ['chat.use']
  ),
  getMenuItems(
    'My Schedules',
    '/schedule',
    'schedule.svg',
    'schedule-light.svg',
    'schedule',
    ['schedule.view']
  ),
  getMenuItems(
    'Teacher Training',
    '/training',
    'teacher-training-light.svg',
    'teacher-training.svg',
    'training',
    ['training.view']
  ),
  getMenuItems(
    'Content Activity',
    '/content-activity',
    'content-activity.svg',
    'content-activity-light.svg',
    'content-activity',
    ['content.activity.view']
  ),
  getMenuItems(
    'Audit Log',
    '/audit-log',
    'audit-log-light.svg',
    'audit-log.svg',
    'audit-log',
    ['audit.view']
  ),
  getMenuItems(
    'Help',
    '/help',
    'help-light.svg',
    'help.svg',
    'help',
    ['help.view']
  ),
  getMenuItems(
    'FAQ',
    '/faq',
    'faq-light.svg',
    'faq.svg',
    'faq',
    ['help.view']
  )

];

function getMenuItems(
  text: string,
  route: string,
  darkIcon: string,
  lightIcon: string,
  match: string,
  permission: string[]
) {
  return {
    text,
    route,
    darkIcon: `${assetURl}/${darkIcon}`,
    lightIcon: `${assetURl}/${lightIcon}`,
    match,
    permission,
  };
}
