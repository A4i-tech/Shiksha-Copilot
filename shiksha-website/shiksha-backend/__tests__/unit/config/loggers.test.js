const loggers = require('../../../config/loggers');

describe('Loggers', () => {
    it('should export logger object', () => {
        expect(loggers).toBeDefined();
    });

    it('should have required methods', () => {
        expect(loggers.info).toBeDefined();
        expect(loggers.error).toBeDefined();
        expect(loggers.warn).toBeDefined();
    });

    it('should log info messages', () => {
        expect(() => loggers.info('Test message')).not.toThrow();
    });

    it('should log error messages', () => {
        expect(() => loggers.error('Error message')).not.toThrow();
    });

    it('should log warn messages', () => {
        expect(() => loggers.warn('Warning message')).not.toThrow();
    });
});
