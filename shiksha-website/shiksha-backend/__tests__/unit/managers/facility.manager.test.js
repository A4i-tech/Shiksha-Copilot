const FacilityManager = require('../../../managers/facility.manager');
const FacilityDao = require('../../../dao/facility.dao');

jest.mock('../../../dao/facility.dao');

describe('FacilityManager', () => {
    let facilityManager;
    let mockFacilityDao;

    beforeEach(() => {
        facilityManager = new FacilityManager();
        mockFacilityDao = {
            update: jest.fn()
        };
        facilityManager.dao = mockFacilityDao;
        jest.clearAllMocks();
    });

    describe('update', () => {
        it('should update facility successfully', async () => {
            const mockReq = {
                body: { id: 'facility123', name: 'Updated Facility' }
            };
            const mockData = { id: 'facility123', name: 'Updated Facility' };
            mockFacilityDao.update.mockResolvedValue(mockData);

            const result = await facilityManager.update(mockReq);

            expect(mockFacilityDao.update).toHaveBeenCalledWith(mockReq.body);
            expect(result.success).toBe(true);
            expect(result.data).toEqual(mockData);
        });

        it('should return error when update fails', async () => {
            const mockReq = {
                body: { id: 'facility123' }
            };
            mockFacilityDao.update.mockResolvedValue(null);

            const result = await facilityManager.update(mockReq);

            expect(result.success).toBe(false);
            expect(result.message).toBe('failed to update facilities');
        });

        it('should propagate errors instead of swallowing them', async () => {
            const mockReq = {
                body: { id: 'facility123' }
            };
            const error = new Error('Database error');
            mockFacilityDao.update.mockRejectedValue(error);

            await expect(facilityManager.update(mockReq)).rejects.toThrow('Database error');
        });
    });
});
