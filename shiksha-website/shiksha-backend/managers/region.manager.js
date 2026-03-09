const RegionDao = require("../dao/region.dao");
const BaseManager = require("./base.manager");
const SchoolDao = require("../dao/school.dao");

class RegionManager extends BaseManager {
	constructor() {
		super(new RegionDao());
		this.schoolDao = new SchoolDao();
	}

	/**
	 * Get all states
	 * @returns {Promise<Array>} Array of states
	 */
	async getStates() {
		const response = await this.dao.getAll();
		const regions = response.results;
		const states = [...new Set((regions).map(region => region.state))];
		return states;
	}

	/**
	 * Get zones for a state
	 * @param {string} state - State name
	 * @returns {Promise<Array>} Array of zones
	 */
	async getZones(state) {
		const response = await this.dao.getAll();
		const regions = response.results;
		const stateRegion = regions.find(region => region.state === state);
		if (!stateRegion) {
			return [];
		}
		return stateRegion.zones;
	}

	/**
	 * Get districts for a zone
	 * @param {string} zone - Zone name
	 * @returns {Promise<Array>} Array of districts
	 */
	async getDistricts(zone) {
		const response = await this.dao.getAll();
		const regions = response.results;
		for (const region of regions) {
			const zoneData = region.zones.find(z => z.name === zone);
			if (zoneData) {
				// districts is now an array, return it directly
				return zoneData.districts;
			}
		}
		return [];
	}

	/**
	 * Get taluks for a district
	 * @param {string} district - District name
	 * @returns {Promise<Array>} Array of taluks
	 */
	async getTaluks(district) {
		const response = await this.dao.getAll();
		const regions = response.results;
		for (const region of regions) {
			for (const zone of region.zones) {
				// districts is now an array, find the matching district
				if (Array.isArray(zone.districts)) {
					const districtObj = zone.districts.find(d => d.name === district);
					if (districtObj) {
						return districtObj.blocks;
					}
				} else if (zone.districts && zone.districts.name === district) {
					// Handle legacy object structure for backward compatibility
					return zone.districts.blocks;
				}
			}
		}
		return [];
	}

	/**
	 * Get schools for a taluk
	 * @param {string} taluk - Taluk name
	 * @returns {Promise<Array>} Array of schools
	 */
	async getSchools(taluk) {
		const response = await this.schoolDao.getAll();
		const schools = response.results;
		return schools.filter(school => school.block === taluk);
	}
}

module.exports = RegionManager;
