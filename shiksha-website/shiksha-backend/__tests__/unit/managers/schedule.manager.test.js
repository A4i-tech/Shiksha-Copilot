const ScheduleManager = require('../../../managers/schedule.manager');
const ScheduleDao = require('../../../dao/schedule.dao');
const overlap = require('../../../helper/overlap');

jest.mock('../../../dao/schedule.dao');
jest.mock('../../../helper/overlap');

describe('ScheduleManager', () => {
    let scheduleManager;
    let mockScheduleDao;

    beforeEach(() => {
        scheduleManager = new ScheduleManager();
        mockScheduleDao = {
            create: jest.fn(),
            getParallelSchedules: jest.fn()
        };
        scheduleManager.dao = mockScheduleDao;
        jest.clearAllMocks();
        overlap.mockReturnValue(false);
    });

    describe('create', () => {
        it('should create schedule successfully when no overlap or parallel schedules', async () => {
            const mockReq = {
                user: {
                    _id: 'teacher123',
                    school: { _id: 'school123' }
                },
                body: {
                    scheduleDateTime: [
                        { date: '2024-01-01', fromTime: '09:00', toTime: '10:00' }
                    ],
                    class: 'class1',
                    board: 'board1',
                    medium: 'English'
                }
            };

            mockScheduleDao.getParallelSchedules.mockResolvedValue({ canSchedule: true });
            mockScheduleDao.create.mockResolvedValue({ id: 'schedule123' });

            const result = await scheduleManager.create(mockReq);

            expect(result.success).toBe(true);
            expect(result.message).toBe('schedule created successfully!');
            expect(mockScheduleDao.create).toHaveBeenCalled();
        });

        it('should return error when schedules overlap', async () => {
            const mockReq = {
                user: {
                    _id: 'teacher123',
                    school: { _id: 'school123' }
                },
                body: {
                    scheduleDateTime: [
                        { date: '2024-01-01', fromTime: '09:00', toTime: '11:00' },
                        { date: '2024-01-01', fromTime: '10:00', toTime: '12:00' }
                    ],
                    class: 'class1',
                    board: 'board1',
                    medium: 'English'
                }
            };

            overlap.mockReturnValue(true);

            const result = await scheduleManager.create(mockReq);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Overlap in entries');
            expect(mockScheduleDao.create).not.toHaveBeenCalled();
        });

        it('should return error when fromTime equals toTime', async () => {
            const mockReq = {
                user: {
                    _id: 'teacher123',
                    school: { _id: 'school123' }
                },
                body: {
                    scheduleDateTime: [
                        { date: '2024-01-01', fromTime: '09:00', toTime: '09:00' }
                    ],
                    class: 'class1',
                    board: 'board1',
                    medium: 'English'
                }
            };

            const result = await scheduleManager.create(mockReq);

            expect(result.success).toBe(false);
            expect(result.message).toBe('fromTime and toTime cannot be the same');
        });

        it('should return error when duplicate time slot detected', async () => {
            const mockReq = {
                user: {
                    _id: 'teacher123',
                    school: { _id: 'school123' }
                },
                body: {
                    scheduleDateTime: [
                        { date: '2024-01-01', fromTime: '09:00', toTime: '10:00' },
                        { date: '2024-01-01', fromTime: '09:00', toTime: '10:00' }
                    ],
                    class: 'class1',
                    board: 'board1',
                    medium: 'English'
                }
            };

            const result = await scheduleManager.create(mockReq);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Duplicate time slot detected');
        });

        it('should return error when parallel schedules exist', async () => {
            const mockReq = {
                user: {
                    _id: 'teacher123',
                    school: { _id: 'school123' }
                },
                body: {
                    scheduleDateTime: [
                        { date: '2024-01-01', fromTime: '09:00', toTime: '10:00' }
                    ],
                    class: 'class1',
                    board: 'board1',
                    medium: 'English'
                }
            };

            mockScheduleDao.getParallelSchedules.mockResolvedValue({
                canSchedule: false,
                conflictingSchedules: []
            });

            const result = await scheduleManager.create(mockReq);

            expect(result.success).toBe(false);
            expect(result.message).toBe('parallel schedules exist');
        });
    });
});
