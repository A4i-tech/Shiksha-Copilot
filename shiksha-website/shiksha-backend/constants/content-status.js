const CONTENT_STATUS = {
	DRAFT: "draft",
	UNDER_REVIEW: "under_review",
	APPROVED: "approved",
};

const CONTENT_STATUSES = Object.values(CONTENT_STATUS);

// Bulk upload only. Under-review chapters refuse content.
const CHAPTER_ACCEPTS_CONTENT = { $or: [{ isDeleted: { $ne: true } }, { status: CONTENT_STATUS.DRAFT }] };

const CONTENT_CURATOR_ROLE_ID = "7368696b7368615f63637572";

module.exports = { CONTENT_STATUS, CONTENT_STATUSES, CONTENT_CURATOR_ROLE_ID, CHAPTER_ACCEPTS_CONTENT };
