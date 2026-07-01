const AdminUser = require("../models/admin.user.model.js");
const BaseDao = require("./base.dao.js");

class AdminUserDao extends BaseDao {
	constructor() {
		super(AdminUser);
	}

	async getByPhone(phone) {
		try {
			let adminUser = await AdminUser.findOne({ phone }).select("+loginAttempts");
			if (adminUser) return adminUser;
			return false;
		} catch (err) {
			console.log("Error -> AdminUserDao -> getByPhone", err);
		}
	}

	async getAll(...args) {
		const result = await super.getAll(...args);
		result.results = result.results.map(({ loginAttempts, ...user }) => user);
		return result;
	}

	async update(id, data, session = null) {
		try {
			const result = await AdminUser.findOneAndUpdate(
				{ _id: id },
				{
					$set: {
						name: data?.name,
						email: data?.email,
						phone: data?.phone,
						address: data?.address,
						role: data?.role,
						isDeleted: data?.isDeleted,
						state: data?.state,
						zones: data?.zones,
						districts: data?.districts,
						otp : data?.otp,
						isLoginAllowed: data?.isLoginAllowed,
						rememberMeToken:data?.rememberMeToken
					},
				},
				{ new: true, useFindAndModify: false, session: session }
			);
			return result;
		} catch (err) {
			console.log("Error -> AdminUserDao -> update", err);
			throw err;
		}
	}
}

module.exports = AdminUserDao;
