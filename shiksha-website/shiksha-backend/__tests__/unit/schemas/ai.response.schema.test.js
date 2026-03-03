const { validatePartsResponse } = require('../../../schemas/ai.response.schema');

describe('validatePartsResponse', () => {

    // ──── Questions-envelope format (AI service) ────

    describe('questions-envelope format', () => {

        it('should flatten a standard MCQ block', () => {
            const result = validatePartsResponse({
                questions: [{
                    type: 'MCQ',
                    marks_per_question: 2,
                    questions: [
                        { question: 'What is 2+2?', options: ['3', '4'], answer: '4', difficulty: 'Easy' },
                    ],
                }],
            });

            expect(result).toHaveLength(1);
            expect(result[0]).toMatchObject({
                question: 'What is 2+2?',
                options: ['3', '4'],
                answer: '4',
                difficulty: 'Easy',
                marks: 2,
            });
        });



        it('should pass through questions that already have typed pairs', () => {
            const result = validatePartsResponse({
                questions: [{
                    type: 'Match the Following',
                    marks_per_question: 1,
                    questions: [
                        { pairs: [{ left: 'A', right: '1' }, { left: 'B', right: '2' }] },
                    ],
                }],
            });

            expect(result).toHaveLength(1);
            expect(result[0].pairs).toEqual([{ left: 'A', right: '1' }, { left: 'B', right: '2' }]);
        });

        it('should REJECT malformed pairs (not an array of {left,right})', () => {
            expect(() => validatePartsResponse({
                questions: [{
                    type: 'Match the Following',
                    marks_per_question: 1,
                    questions: [
                        { pairs: 'not-an-array' },
                    ],
                }],
            })).toThrow();
        });

        it('should REJECT pairs with missing left/right strings', () => {
            expect(() => validatePartsResponse({
                questions: [{
                    type: 'Match the Following',
                    marks_per_question: 1,
                    questions: [
                        { pairs: [{ left: 123, right: true }] },
                    ],
                }],
            })).toThrow();
        });

        it('should preserve extra fields via .passthrough()', () => {
            const result = validatePartsResponse({
                questions: [{
                    type: 'MCQ',
                    marks_per_question: 1,
                    unit_name: 'Chapter 1',
                    questions: [
                        { question: 'Test?', unit_name: 'Unit A', objective: 'Knowledge', custom_field: 'kept' },
                    ],
                }],
            });

            expect(result).toHaveLength(1);
            // Extra fields that aren't in the schema should survive .passthrough()
            expect(result[0].unit_name).toBe('Unit A');
            expect(result[0].objective).toBe('Knowledge');
            expect(result[0].custom_field).toBe('kept');
        });

        it('should skip questions with no question text, no text, and no pairs', () => {
            const result = validatePartsResponse({
                questions: [{
                    type: 'MCQ',
                    marks_per_question: 1,
                    questions: [
                        { answer: 'orphan answer' },
                    ],
                }],
            });

            expect(result).toHaveLength(0);
        });

    });

    // ──── Items-envelope format (Python service) ────

    describe('items-envelope format', () => {

        it('should flatten items with nested item objects', () => {
            const result = validatePartsResponse({
                items: [
                    {
                        unit_name: 'Unit 1',
                        type: 'MCQ',
                        marks_per_question: 3,
                        difficulty: 'Hard',
                        item: { question: 'Capital of France?', answer: 'Paris' },
                    },
                ],
            });

            expect(result).toHaveLength(1);
            expect(result[0]).toMatchObject({
                question: 'Capital of France?',
                answer: 'Paris',
                difficulty: 'Hard',
                marks: 3,
            });
        });

        it('should pass through items that already have typed pairs', () => {
            const result = validatePartsResponse({
                items: [
                    {
                        type: 'Match the Following',
                        marks_per_question: 1,
                        difficulty: 'Easy',
                        item: { pairs: [{ left: 'Dog', right: 'Animal' }] },
                    },
                ],
            });

            expect(result).toHaveLength(1);
            expect(result[0].pairs).toEqual([{ left: 'Dog', right: 'Animal' }]);
        });

        it('should preserve extra fields on item via .passthrough()', () => {
            const result = validatePartsResponse({
                items: [
                    {
                        type: 'MCQ',
                        marks_per_question: 1,
                        difficulty: 'Easy',
                        item: { question: 'Test?', extra_meta: 'preserved' },
                    },
                ],
            });

            expect(result).toHaveLength(1);
            expect(result[0].extra_meta).toBe('preserved');
        });

        it('should REJECT items with malformed pairs', () => {
            expect(() => validatePartsResponse({
                items: [
                    {
                        type: 'Match the Following',
                        marks_per_question: 1,
                        item: { pairs: { left: 'A', right: '1' } }, // object, not array
                    },
                ],
            })).toThrow();
        });
    });

    // ──── Edge cases ────

    describe('edge cases', () => {

        it('should throw on completely invalid data', () => {
            expect(() => validatePartsResponse('just a string')).toThrow();
            expect(() => validatePartsResponse(42)).toThrow();
            expect(() => validatePartsResponse(null)).toThrow();
        });

        it('should accept an empty questions array', () => {
            const result = validatePartsResponse({ questions: [] });
            expect(result).toEqual([]);
        });

        it('should accept items envelope with empty items array', () => {
            const result = validatePartsResponse({ items: [] });
            expect(result).toEqual([]);
        });
    });
});
