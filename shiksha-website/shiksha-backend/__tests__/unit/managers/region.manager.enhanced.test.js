const RegionManager = require('../../../managers/region.manager');
const RegionDao = require('../../../dao/region.dao');
const SchoolDao = require('../../../dao/school.dao');

jest.mock('../../../dao/region.dao');
jest.mock('../../../dao/school.dao');

describe('RegionManager', () => {
    let regionManager;
    let mockRegionDao;
    let mockSchoolDao;

    beforeEach(() => {
        regionManager = new RegionManager();
        mockRegionDao = {
            getAll: jest.fn()
        };
        mockSchoolDao = {
            getAll: jest.fn()
        };
        regionManager.dao = mockRegionDao;
        regionManager.schoolDao = mockSchoolDao;
        jest.clearAllMocks();
    });

    describe('getStates', () => {
        it('should return unique states', async () => {
            const mockRegions = [
                { state: 'Karnataka', zones: [] },
                { state: 'Tamil Nadu', zones: [] },
                { state: 'Karnataka', zones: [] }
            ];
            mockRegionDao.getAll.mockResolvedValue({ results: mockRegions });

            const result = await regionManager.getStates();

            expect(result).toHaveLength(2);
            expect(result).toContain('Karnataka');
            expect(result).toContain('Tamil Nadu');
        });

        it('should return empty array when no regions', async () => {
            mockRegionDao.getAll.mockResolvedValue({ results: [] });

            const result = await regionManager.getStates();

            expect(result).toEqual([]);
        });
    });

    describe('getZones', () => {
        it('should return zones for a state', async () => {
            const mockRegions = [
                {
                    state: 'Karnataka',
                    zones: [{ name: 'Zone A' }, { name: 'Zone B' }]
                }
            ];
            mockRegionDao.getAll.mockResolvedValue({ results: mockRegions });

            const result = await regionManager.getZones('Karnataka');

            expect(result).toHaveLength(2);
            expect(result[0].name).toBe('Zone A');
        });

        it('should return empty array when state not found', async () => {
            mockRegionDao.getAll.mockResolvedValue({ results: [] });

            const result = await regionManager.getZones('Unknown State');

            expect(result).toEqual([]);
        });
    });

    describe('getSchools', () => {
        it('should return schools for a taluk', async () => {
            const mockSchools = [
                { name: 'School 1', block: 'Taluk A' },
                { name: 'School 2', block: 'Taluk A' },
                { name: 'School 3', block: 'Taluk B' }
            ];
            mockSchoolDao.getAll.mockResolvedValue({ results: mockSchools });

            const result = await regionManager.getSchools('Taluk A');

            expect(result).toHaveLength(2);
            expect(result[0].block).toBe('Taluk A');
        });
    });
});
