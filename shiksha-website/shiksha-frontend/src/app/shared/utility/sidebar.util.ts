const assetUrl = 'assets/icons';
const item = (text: string, route: string, darkIcon: string, lightIcon: string, permission: string[]) => ({
  text,
  route,
  darkIcon: `${assetUrl}/${darkIcon}`,
  lightIcon: `${assetUrl}/${lightIcon}`,
  match: route,
  permission,
});

export const menuItem = [
  item('Dashboard', '/dashboard', 'dashboard.svg', 'dashboard-light.svg', ['dashboard.teacher.view']),
  item('Leaders Dashboard', '/leaders-dashboard', 'dashboard.svg', 'dashboard-light.svg', ['dashboard.admin.view']),
  item('Operations', '/operations', 'dashboard.svg', 'dashboard-light.svg', ['dashboard.admin.view']),
  item('Profile', '/profile', 'profile.svg', 'profile-light.svg', ['profile.view']),
  item('Content Generation', '/content', 'content-generation.svg', 'content-generation-light.svg', ['content.view']),
  item('Chatbot', '/chat', 'chatbot.svg', 'chatbot-light.svg', ['chat.use']),
  item('Question Paper Generation', '/question-papers', 'question-bank.svg', 'question-bank-light.svg', ['question-paper.generate']),
  item('My Schedules', '/schedule', 'schedule.svg', 'schedule-light.svg', ['schedule.view']),
  item('School Management', '/schools', 'school-management.svg', 'school-management-light.svg', ['school.view']),
  item('Teacher Management', '/teachers', 'user-management.svg', 'user-management-light.svg', ['teacher.view']),
  item('Staff Management', '/staff', 'staff-management.svg', 'staff-management-light.svg', ['staff.view']),
  item('Role Management', '/roles', 'role-management.svg', 'role-management-light.svg', ['role.view']),
  item('Content Activity', '/content-activity', 'content-activity.svg', 'content-activity-light.svg', ['content.activity.view']),
  item('Audit Log', '/audit-log', 'audit-log-light.svg', 'audit-log.svg', ['audit.view']),
  item('Teacher Training', '/training', 'teacher-training-light.svg', 'teacher-training.svg', ['training.view']),
  item('Help', '/help', 'help-light.svg', 'help.svg', ['help.view']),
  item('FAQ', '/faq', 'faq-light.svg', 'faq.svg', ['help.view']),
];
