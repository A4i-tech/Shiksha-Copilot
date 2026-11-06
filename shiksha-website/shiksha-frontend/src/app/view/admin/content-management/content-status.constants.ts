export const CONTENT_STATUS = {
  DRAFT: 'draft',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
} as const;

export type ContentStatus = typeof CONTENT_STATUS[keyof typeof CONTENT_STATUS];

export const LIST_TAB_BY_STATUS: { [status: string]: string } = {
  [CONTENT_STATUS.DRAFT]: '3',
  [CONTENT_STATUS.UNDER_REVIEW]: '4',
  [CONTENT_STATUS.APPROVED]: '0',
};

export const STATUS_LABELS: { [key: string]: string } = {
  [CONTENT_STATUS.DRAFT]: 'Draft',
  [CONTENT_STATUS.UNDER_REVIEW]: 'Ready for review',
  [CONTENT_STATUS.APPROVED]: 'Approved',
};

export const STATUS_BADGE_CLASSES: { [key: string]: string } = {
  [CONTENT_STATUS.DRAFT]: 'text-content bg-shade-80',
  [CONTENT_STATUS.UNDER_REVIEW]: 'text-warn bg-warn-50',
  [CONTENT_STATUS.APPROVED]: 'text-success bg-success-50',
};

export const CURATOR_STATUS_LABELS: { [key: string]: string } = {
  [CONTENT_STATUS.DRAFT]: 'Draft',
  [CONTENT_STATUS.UNDER_REVIEW]: 'Under review',
};
