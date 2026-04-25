export const PATHS = {
  // ── Public ──────────────────────────────────────────────
  HOME:            '/',
  ABOUT:           '/about',
  ADMISSION:       '/admission',
  DONATE:          '/donate',
  DONATE_MADRASA:  '/donate/madrasa',
  DONATE_MOSQUE:   '/donate/mosque',
  DONATE_SUPPORT:  '/donate/student-support',
  ZAKAT:           '/zakat',
  GALLERY:         '/gallery',
  TRANSPARENCY:    '/transparency',
  CONTACT:         '/contact',
  NOT_FOUND:       '*',

  // ── Admin ────────────────────────────────────────────────
  ADMIN: {
    LOGIN:           '/admin/login',
    DASHBOARD:       '/admin',
    STUDENTS:        '/admin/students',
    STUDENT_DETAIL:  '/admin/students/:id',
    STUDENT_FINANCE: '/admin/finance/students',
    DONATIONS:       '/admin/donations',
    ZAKAT:           '/admin/zakat',
    REPORTS:         '/admin/reports',
    EXPORT:          '/admin/reports/export',
    SETTINGS:        '/admin/settings',
    USERS:           '/admin/users',
    LANGUAGE:        '/admin/language',
    PROGRAMS:        '/admin/programs',
    TRANSPARENCY:    '/admin/transparency',
  },
};

export function buildPath(pattern, params = {}) {
  return Object.entries(params).reduce(
    (path, [key, value]) => path.replace(`:${key}`, value),
    pattern
  );
}
