const mongoose = require('mongoose');
const Schedule = require('../../../models/schedule.model');

describe('Schedule Model', () => {
    describe('Schema validation', () => {
        it('should create a valid schedule', () => {
            const validSchedule = new Schedule({
                teacherId: new mongoose.Types.ObjectId(),
                subject: 'Mathematics',
                schoolId: new mongoose.Types.ObjectId(),
                scheduleType: 'regular',
                class: 10,
                medium: 'English',
                board: 'CBSE',
                section: 'A',
                scheduleDateTime: [{
                    date: new Date('2024-01-01'),
                    fromTime: '09:00',
                    toTime: '10:00'
                }]
            });

            const validationError = validSchedule.validateSync();
            expect(validationError).toBeUndefined();
        });

        it('should fail validation when required fields are missing', () => {
            const invalidSchedule = new Schedule({});

            const validationError = invalidSchedule.validateSync();
            expect(validationError).toBeDefined();
            expect(validationError.errors.medium).toBeDefined();
            expect(validationError.errors.board).toBeDefined();
        });

        it('should use default values correctly', () => {
            const schedule = new Schedule({
                medium: 'English',
                board: 'CBSE'
            });

            expect(schedule.isDeleted).toBe(false);
            expect(schedule.otherClass).toBe('');
            expect(schedule.topic).toBe('');
            expect(schedule.subTopic).toBe('');
        });

        it('should validate scheduleType enum correctly', () => {
            const scheduleWithInvalidType = new Schedule({
                medium: 'English',
                board: 'CBSE',
                scheduleType: 'invalid_type'
            });

            const validationError = scheduleWithInvalidType.validateSync();
            expect(validationError).toBeDefined();
        });

        it('should allow valid scheduleType', () => {
            const schedule = new Schedule({
                medium: 'English',
                board: 'CBSE',
                scheduleType: 'regular'
            });

            const validationError = schedule.validateSync();
            expect(validationError).toBeUndefined();
        });
    });

    describe('scheduleDateTime array', () => {
        it('should accept multiple scheduleDateTime entries', () => {
            const schedule = new Schedule({
                medium: 'English',
                board: 'CBSE',
                scheduleDateTime: [
                    { date: new Date('2024-01-01'), fromTime: '09:00', toTime: '10:00' },
                    { date: new Date('2024-01-02'), fromTime: '11:00', toTime: '12:00' }
                ]
            });

            const validationError = schedule.validateSync();
            expect(validationError).toBeUndefined();
            expect(schedule.scheduleDateTime).toHaveLength(2);
        });

        it('should accept empty scheduleDateTime array', () => {
            const schedule = new Schedule({
                medium: 'English',
                board: 'CBSE',
                scheduleDateTime: []
            });

            const validationError = schedule.validateSync();
            expect(validationError).toBeUndefined();
        });
    });

    describe('References', () => {
        it('should accept valid ObjectId references', () => {
            const schedule = new Schedule({
                teacherId: new mongoose.Types.ObjectId(),
                schoolId: new mongoose.Types.ObjectId(),
                lessonId: new mongoose.Types.ObjectId(),
                medium: 'English',
                board: 'CBSE'
            });

            const validationError = schedule.validateSync();
            expect(validationError).toBeUndefined();
        });
    });
});
