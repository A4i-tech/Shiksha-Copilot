const formatApiResponse = require('../../../helper/response');

describe('formatApiResponse', () => {
    it('should format successful response', () => {
        const result = formatApiResponse(true, 'Success message', { id: 1, name: 'Test' });

        expect(result).toEqual({
            success: true,
            message: 'Success message',
            data: { id: 1, name: 'Test' }
        });
    });

    it('should format error response', () => {
        const result = formatApiResponse(false, 'Error message', null);

        expect(result).toEqual({
            success: false,
            message: 'Error message',
            data: null
        });
    });

    it('should format response with null data', () => {
        const result = formatApiResponse(true, 'Success', null);

        expect(result).toEqual({
            success: true,
            message: 'Success',
            data: null
        });
    });

    it('should format response with array data', () => {
        const data = [{ id: 1 }, { id: 2 }];
        const result = formatApiResponse(true, 'List retrieved', data);

        expect(result).toEqual({
            success: true,
            message: 'List retrieved',
            data: data
        });
    });
});
