const checkOverlap = require('../../../helper/overlap');

describe('checkOverlap', () => {
    it('should return false when no schedules overlap', () => {
        const schedules = [
            { date: '2024-01-01', fromTime: '09:00', toTime: '10:00' },
            { date: '2024-01-01', fromTime: '10:00', toTime: '11:00' },
            { date: '2024-01-01', fromTime: '11:00', toTime: '12:00' }
        ];

        const result = checkOverlap(schedules);
        expect(result).toBe(false);
    });

    it('should return true when schedules overlap', () => {
        const schedules = [
            { date: '2024-01-01', fromTime: '09:00', toTime: '11:00' },
            { date: '2024-01-01', fromTime: '10:00', toTime: '12:00' }
        ];

        const result = checkOverlap(schedules);
        expect(result).toBe(true);
    });

    it('should return true when one schedule completely contains another', () => {
        const schedules = [
            { date: '2024-01-01', fromTime: '09:00', toTime: '12:00' },
            { date: '2024-01-01', fromTime: '10:00', toTime: '11:00' }
        ];

        const result = checkOverlap(schedules);
        expect(result).toBe(true);
    });

    it('should return false when schedules are on different dates', () => {
        const schedules = [
            { date: '2024-01-01', fromTime: '09:00', toTime: '11:00' },
            { date: '2024-01-02', fromTime: '09:00', toTime: '11:00' }
        ];

        const result = checkOverlap(schedules);
        expect(result).toBe(false);
    });

    it('should handle empty array', () => {
        const schedules = [];

        const result = checkOverlap(schedules);
        expect(result).toBe(false);
    });

    it('should handle single schedule', () => {
        const schedules = [
            { date: '2024-01-01', fromTime: '09:00', toTime: '10:00' }
        ];

        const result = checkOverlap(schedules);
        expect(result).toBe(false);
    });

    it('should correctly sort and check unordered schedules', () => {
        const schedules = [
            { date: '2024-01-01', fromTime: '14:00', toTime: '15:00' },
            { date: '2024-01-01', fromTime: '09:00', toTime: '10:30' },
            { date: '2024-01-01', fromTime: '10:00', toTime: '11:00' }
        ];

        const result = checkOverlap(schedules);
        expect(result).toBe(true);
    });

    it('should handle schedules that touch but do not overlap', () => {
        const schedules = [
            { date: '2024-01-01', fromTime: '09:00', toTime: '10:00' },
            { date: '2024-01-01', fromTime: '10:00', toTime: '11:00' }
        ];

        const result = checkOverlap(schedules);
        expect(result).toBe(false);
    });
});
