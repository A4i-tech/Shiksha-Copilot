const { MESSAGES, CHAT_LIMIT, REGENERATION_LIMIT } = require('../../../config/constants');

describe('Constants', () => {
    describe('MESSAGES', () => {
        it('should have UPDATE_SUCCESS message', () => {
            expect(MESSAGES.UPDATE_SUCCESS).toBe('Data updated successfully!');
        });

        it('should have UPDATE_FAIL message', () => {
            expect(MESSAGES.UPDATE_FAIL).toBe('Failed to update data!');
        });

        it('should be an object', () => {
            expect(typeof MESSAGES).toBe('object');
        });
    });

    describe('CHAT_LIMIT', () => {
        it('should be 20', () => {
            expect(CHAT_LIMIT).toBe(20);
        });

        it('should be a number', () => {
            expect(typeof CHAT_LIMIT).toBe('number');
        });
    });

    describe('REGENERATION_LIMIT', () => {
        it('should be 3', () => {
            expect(REGENERATION_LIMIT).toBe(3);
        });

        it('should be a number', () => {
            expect(typeof REGENERATION_LIMIT).toBe('number');
        });
    });
});
