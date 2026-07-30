const assetURl = 'assets/icons';
export const menuItem = [
  getMenuItems(
    'Dashboard',
    '/leaders-dashboard',
    'dashboard.svg',
    'dashboard-light.svg',
    'leaders-dashboard',
    ['admin', 'manager', 'hm', 'crp', 'beo', 'meo', 'deo', 'ddpi', 'state']
  ),
  getMenuItems(
    'Home',
    '/home',
    'dashboard.svg',
    'dashboard-light.svg',
    'home',
    ['standard', 'power']
  ),
  getMenuItems(
    'Profile',
    '/profile',
    'profile.svg',
    'profile-light.svg',
    'profile',
    ['standard', 'power', 'admin', 'manager']
  ),
  getMenuItems(
    'School Management',
    '/school-management',
    'school-management.svg',
    'school-management-light.svg',
    'school-management',
    ['admin','manager']
  ),
  getMenuItems(
    'Teacher Management',
    '/teacher-management',
    'user-management.svg',
    'user-management-light.svg',
    'teacher-management',
    ['admin','manager']
  ),
  getMenuItems(
    'Staff Management',
    '/staff-management',
    'staff-management.svg',
    'staff-management-light.svg',
    'staff-management',
    ['admin']
  ),
  getMenuItems(
    'Content Generation',
    '/content-generation',
    'content-generation.svg',
    'content-generation-light.svg',
    'content-generation',
    ['standard', 'power']
  ),
  getMenuItems(
    'Question Paper Generation',
    '/question-paper',
    'question-bank.svg',
    'question-bank-light.svg',
    'question-paper',
    ['standard', 'power']
  ),
  getMenuItems(
    'Chatbot',
    '/chatbot',
    'chatbot.svg',
    'chatbot-light.svg',
    'chatbot',
    ['power']
  ),
  getMenuItems(
    'My Schedules',
    '/schedule',
    'schedule.svg',
    'schedule-light.svg',
    'schedule',
    ['standard', 'power']
  ),
  getMenuItems(
    'Teacher Training',
    '/teacher-training',
    'teacher-training-light.svg',
    'teacher-training.svg',
    'teacher-training',
    ['admin', 'manager']
  ),
  getMenuItems(
    'Content Activity',
    '/content-activity',
    'content-activity.svg',
    'content-activity-light.svg',
    'content-activity',
    ['admin','manager']
  ),
  getMenuItems(
    'Audit Log',
    '/audit-log',
    'audit-log-light.svg',
    'audit-log.svg',
    'audit-log',
    ['admin','manager']
  ),
  getMenuItems(
    'Help',
    '/help',
    'help-light.svg',
    'help.svg',
    'help',
    ['standard', 'power']
  ),
  getMenuItems(
    'FAQ',
    '/faq',
    'faq-light.svg',
    'faq.svg',
    'faq',
    ['admin','manager','standard', 'power']
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
