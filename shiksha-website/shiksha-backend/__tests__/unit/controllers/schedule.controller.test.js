const ScheduleController = require('../../../controllers/schedule.controller');
const ScheduleManager = require('../../../managers/schedule.manager');
const handleError = require('../../../helper/handleError');

jest.mock('../../../managers/schedule.manager');
jest.mock('../../../helper/handleError');

describe('ScheduleController', () => {
    let scheduleController;
    let mockReq;
    let mockRes;
    let mockScheduleManager;

    beforeEach(() => {
        scheduleController = new ScheduleController();
        mockReq = {
            body: {},
            params: {},
            query: {},
            user: { _id: 'user123', schoolId: 'school123' }
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        mockScheduleManager = {
            update: jest.fn(),
            getAllSchedulesBasedOnTeacherId: jest.fn(),
            getBySchool: jest.fn(),
            getMySchedules: jest.fn()
        };
        scheduleController.manager = mockScheduleManager;
        jest.clearAllMocks();
    });

    describe('update', () => {
        it('should update schedule successfully', async () => {
            mockReq.body = { _id: 'schedule123', title: 'Updated Schedule' };
            const mockResult = { success: true, message: 'Schedule updated', data: {} };
            mockScheduleManager.update.mockResolvedValue(mockResult);

            await scheduleController.update(mockReq, mockRes);

            expect(mockScheduleManager.update).toHaveBeenCalledWith(
                'schedule123',
                { title: 'Updated Schedule', _id: undefined },
                mockReq.user
            );
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockResult);
        });

        it('should handle error when update fails', async () => {
            mockReq.body = { _id: 'schedule123' };
            const mockResult = { success: false, message: 'Update failed' };
            mockScheduleManager.update.mockResolvedValue(mockResult);

            await scheduleController.update(mockReq, mockRes);

            expect(handleError).toHaveBeenCalledWith(mockResult, mockRes);
        });
    });

    describe('getAllSchedulesBasedOnTeacherId', () => {
        it('should get all schedules for teacher', async () => {
            mockReq.params = { teacherId: 'teacher123' };
            const mockResult = { success: true, message: 'Schedules found', data: [] };
            mockScheduleManager.getAllSchedulesBasedOnTeacherId.mockResolvedValue(mockResult);

            await scheduleController.getAllSchedulesBasedOnTeacherId(mockReq, mockRes);

            expect(mockScheduleManager.getAllSchedulesBasedOnTeacherId).toHaveBeenCalledWith('teacher123');
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockResult);
        });
    });

    describe('getBySchool', () => {
        it('should get schedules by school', async () => {
            mockReq.query = { fromDate: '2024-01-01', toDate: '2024-01-31', teacherClass: 'class1', teacherSchedule: 'true' };
            const mockResult = { success: true, message: 'Schedules found', data: [] };
            mockScheduleManager.getBySchool.mockResolvedValue(mockResult);

            await scheduleController.getBySchool(mockReq, mockRes);

            expect(mockScheduleManager.getBySchool).toHaveBeenCalledWith(
                mockReq.user,
                '2024-01-01',
                '2024-01-31',
                'class1',
                'true'
            );
            expect(mockRes.status).toHaveBeenCalledWith(200);
        });
    });

    describe('getMySchedules', () => {
        it('should get user schedules', async () => {
            mockReq.query = { date: '2024-01-01' };
            const mockResult = { success: true, message: 'Schedules found', data: [] };
            mockScheduleManager.getMySchedules.mockResolvedValue(mockResult);

            await scheduleController.getMySchedules(mockReq, mockRes);

            expect(mockScheduleManager.getMySchedules).toHaveBeenCalledWith('user123', '2024-01-01');
            expect(mockRes.status).toHaveBeenCalledWith(200);
        });
    });
});
