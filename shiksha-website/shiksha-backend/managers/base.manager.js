const formatApiReponse = require("../helper/response");
const { CONTENT_STATUS } = require("../constants/content-status");

require("dotenv").config();

/**
 * @template TDao
 */
class BaseManager {
	/**
	 * @param {TDao} dao
	 */
	constructor(dao) {
		/** @protected @type {TDao} */
		this.dao = dao;
	}

	async getAll(
		page = 1,
		limit,
		filters = {},
		sort = {},
		status,
		userId
	) {
		let data = await this.dao.getAll(
			page,
			limit,
			filters,
			sort,
			status,
			userId
		);
		return formatApiReponse(true, "", data);
	}

	async getById(req) {
		let data = await this.dao.getById(req.params.id);
		if (data) return formatApiReponse(true, "", data);
		return formatApiReponse(false, "", data);
	}

	async create(req) {
		let data = await this.dao.create(req.body);
		return formatApiReponse(true, "success!", data);
	}

	async adminUpdate(req, allowDeletedStatusUpdate = false) {
		if (typeof this._liveSiblings === "function") return this._checkedAdminUpdate(req);
		try {
			let data = await this.dao.adminUpdate(
				req.params?.id,
				req.body,
				null,
				allowDeletedStatusUpdate,
				req.draftOnly
			);
			if (!data) return formatApiReponse(false, "Record not found", null);
			return formatApiReponse(true, "Updated successfully!", data);
		} catch (err) {
			console.error("adminUpdate failed:", err);
			return formatApiReponse(false, err.message, null);
		}
	}

	withDraftMetadata(doc, userId) {
		return {
			...doc,
			status: CONTENT_STATUS.DRAFT,
			isDeleted: true,
			createdBy: userId,
		};
	}

	// isDeleted also marks a draft/under-review record that never went live, so only an
	// approved record that then got soft-deleted is genuinely gone.
	isGenuinelyDeleted(record) {
		return record.isDeleted === true && record.status === CONTENT_STATUS.APPROVED;
	}

	// Finds an existing record that duplicates `record` on any of `keyFns` (each a
	// (record) => string), skipping records that are genuinely deleted — a draft or
	// under-review record still blocks the duplicate, since it hasn't gone anywhere.
	findLiveConflict(record, existingRecords, keyFns) {
		const targetKeys = keyFns.map((keyFn) => keyFn(record));

		return existingRecords.find((other) => {
			if (this.isGenuinelyDeleted(other)) return false;
			return keyFns.some((keyFn, index) => keyFn(other) === targetKeys[index]);
		});
	}

	async finalizeBulkUpload({ Model, rows, documents, dryRun, entityLabel }) {
		const invalid = rows.filter((row) => row.errors.length > 0);

		const report = {
			dryRun,
			total: rows.length,
			valid: rows.length - invalid.length,
			invalid: invalid.length,
			inserted: 0,
			insertedIds: [],
			rows,
		};

		if (invalid.length > 0) {
			return formatApiReponse(
				false,
				`${invalid.length} of ${rows.length} ${entityLabel} failed validation. Nothing was saved.`,
				report
			);
		}

		if (dryRun) {
			return formatApiReponse(true, `All ${entityLabel} passed validation.`, report);
		}

		try {
			const saved = await Model.insertMany(documents, { ordered: true });
			report.inserted = saved.length;
			report.insertedIds = saved.map((doc) => String(doc._id));
			return formatApiReponse(true, `${saved.length} ${entityLabel} were added.`, report);
		} catch (err) {
			console.error(`bulkUpload insert failed for ${entityLabel}:`, err);
			return formatApiReponse(false, err?.message, null);
		}
	}

	async delete(req) {
		await this.dao.delete(req.params?.id);
		return formatApiReponse(true, "Deactivated successfully!", null);
	}

	async approve(req) {
		if (typeof this._liveSiblings === "function") return this._checkedApprove(req);
		const data = await this.dao.Model.findOneAndUpdate(
			{ _id: req.params.id, isDeleted: true, status: CONTENT_STATUS.UNDER_REVIEW },
			{ $set: { status: CONTENT_STATUS.APPROVED, isDeleted: false } },
			{ new: true }
		);

		if (!data) {
			return formatApiReponse(
				false,
				"This record is not ready for review, or it changed before the approval finished. Reload the list and try again.",
				null
			);
		}

		return formatApiReponse(true, "Approved successfully!", data);
	}

	async activate(req) {
		if (typeof this._liveSiblings === "function") return this._checkedActivate(req);
		let data = await this.dao.activate(req.params.id);
		return formatApiReponse(true, "School is activated!", data);
	}

	// Template for managers that define _liveSiblings. Hooks: _model, _entityName, _describe,
	// _describeConflict, _conflictHint, _conflictKeyFns, _approveTransition, optional _honorsDraftOnly.
	async _findConflict(record) {
		const existing = await this._liveSiblings(record);
		return this.findLiveConflict(record, existing, this._conflictKeyFns());
	}

	_capitalize(text) {
		return text.charAt(0).toUpperCase() + text.slice(1);
	}

	// Only a draft or under-review record is editable: an approved one would let a change skip review.
	async _checkedAdminUpdate(req) {
		try {
			const current = await this._model().findById(req.params.id).lean();
			if (!current) return formatApiReponse(false, "Record not found", null);

			const updates = req.body;
			const merged = { ...current, ...updates };
			const conflict = await this._findConflict(merged);

			if (conflict) {
				return formatApiReponse(
					false,
					`Saving ${this._describe(merged)} would duplicate ${this._describeConflict(conflict)}. ${this._conflictHint}`,
					null
				);
			}

			const draftOnly = this._honorsDraftOnly && req.draftOnly;
			const data = await this._model().findOneAndUpdate(
				{ _id: current._id, status: draftOnly ? CONTENT_STATUS.DRAFT : { $in: [CONTENT_STATUS.DRAFT, CONTENT_STATUS.UNDER_REVIEW] } },
				{ $set: updates },
				{ new: true, runValidators: true }
			);

			if (!data) {
				return formatApiReponse(false, draftOnly ? "This record changed while you were editing it. Reload the page and try again." : "Record not found or has been deleted", null);
			}

			return formatApiReponse(true, "Updated successfully!", data);
		} catch (err) {
			console.error("adminUpdate failed:", err);
			return formatApiReponse(false, err?.message, null);
		}
	}

	// Another record can take this one's identity while it sits deleted.
	async _checkedActivate(req) {
		try {
			const record = await this._model().findById(req.params.id).lean();
			if (!record) return formatApiReponse(false, "Record not found", null);

			if (!this.isGenuinelyDeleted(record)) {
				return formatApiReponse(
					false,
					`${this._capitalize(this._describe(record))} is not a deleted, approved ${this._entityName}, so it cannot be restored.`,
					null
				);
			}

			const conflict = await this._findConflict(record);

			if (conflict) {
				return formatApiReponse(
					false,
					`Restoring ${this._describe(record)} would duplicate ${this._describeConflict(conflict)}. Change or remove that ${this._entityName} first.`,
					null
				);
			}

			const data = await this.dao.activate(req.params.id);
			return formatApiReponse(true, `${this._capitalize(this._entityName)} restored successfully!`, data);
		} catch (err) {
			console.error("activate failed:", err);
			return formatApiReponse(false, err?.message, null);
		}
	}

	// A ready-for-review record is approved in one atomic transition: restore only accepts an already-approved record.
	async _checkedApprove(req) {
		const record = await this._model().findById(req.params.id).lean();
		if (!record) return formatApiReponse(false, "Record not found", null);

		if (!(record.isDeleted === true && record.status === CONTENT_STATUS.UNDER_REVIEW)) {
			return formatApiReponse(
				false,
				`${this._capitalize(this._describe(record))} is not ready for review, so it cannot be approved.`,
				null
			);
		}

		const conflict = await this._findConflict(record);

		if (conflict) {
			return formatApiReponse(
				false,
				`Approving ${this._describe(record)} would duplicate ${this._describeConflict(conflict)}. Change or remove that ${this._entityName} first.`,
				null
			);
		}

		const data = await this._approveTransition(record);

		if (!data) {
			return formatApiReponse(
				false,
				`${this._capitalize(this._describe(record))} changed before the approval finished. Reload and try again.`,
				null
			);
		}

		return formatApiReponse(true, `${this._capitalize(this._entityName)} approved successfully!`, data);
	}
}


module.exports = BaseManager;
