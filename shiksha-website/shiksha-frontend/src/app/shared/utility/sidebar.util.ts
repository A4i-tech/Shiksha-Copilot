const assetURl = 'assets/icons';
export const menuItem = [
  getMenuItems('Dashboard', '/dashboard', 'dashboard.svg', 'dashboard-light.svg', 'dashboard', ['analytics.view']),
  getMenuItems('Home', '/home', 'home.svg', 'home-light.svg', 'home', ['home.view']),
  getMenuItems('Profile', '/profile', 'profile.svg', 'profile-light.svg', 'profile', ['profile.view']),
  getMenuItems('School Management', '/schools', 'school-management.svg', 'school-management-light.svg', 'schools', ['school.list']),
  getMenuItems('Teacher Management', '/teachers', 'user-management.svg', 'user-management-light.svg', 'teachers', ['user.view']),
  getMenuItems('Staff Management', '/staff', 'staff-management.svg', 'staff-management-light.svg', 'staff', ['user.view']),
  getMenuItems('Role Management', '/roles', 'role-management.svg', 'role-management-light.svg', 'roles', ['role.view']),
  getMenuItems('Content Generation', '/content-generation', 'content-generation.svg', 'content-generation-light.svg', 'content-generation', ['content.view']),
  getMenuItems('Question Paper Generation', '/question-papers', 'question-bank.svg', 'question-bank-light.svg', 'question-papers', ['question-paper.generate']),
  getMenuItems('Chatbot', '/chat', 'chatbot.svg', 'chatbot-light.svg', 'chat', ['chat.use']),
  getMenuItems('My Schedules', '/schedule', 'schedule.svg', 'schedule-light.svg', 'schedule', ['schedule.view']),
  getMenuItems('Teacher Training', '/training', 'teacher-training-light.svg', 'teacher-training.svg', 'training', ['training.view']),
  getMenuItems('Content Activity', '/content-activity', 'content-activity.svg', 'content-activity-light.svg', 'content-activity', ['content.activity.view']),
  getMenuItems('Content Management', '/content-management', 'content-activity.svg', 'content-activity-light.svg', 'content-management', ['content.manage']),
  getMenuItems('Audit Log', '/audit-log', 'audit-log-light.svg', 'audit-log.svg', 'audit-log', ['audit.view']),
  getMenuItems('Help', '/help', 'help-light.svg', 'help.svg', 'help', ['help.view']),
  getMenuItems('FAQ', '/faq', 'faq-light.svg', 'faq.svg', 'faq', ['help.view']),
];

function getMenuItems(text: string, route: string, darkIcon: string, lightIcon: string, match: string, permission: string[]) {
  return { text, route, darkIcon: `${assetURl}/${darkIcon}`, lightIcon: `${assetURl}/${lightIcon}`, match, permission };
}
