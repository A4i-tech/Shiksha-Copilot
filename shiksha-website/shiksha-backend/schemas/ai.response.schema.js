const { z } = require("zod");

// Recursive schema definition for nested structures
const BaseItemSchema = z.object({}).passthrough(); // Allow any other properties for now (like 'question', 'answer', etc.)

// Schema for an item that might contain nested items/questions
const ItemSchema = BaseItemSchema.extend({
    questions: z.lazy(() => z.array(ItemSchema).optional()),
    items: z.lazy(() => z.array(ItemSchema).optional()),
    item: z.lazy(() => ItemSchema.optional()), // Sometimes single item is nested
});

// 1. { questions: [...] }
// 2. { items: [...] }
// 3. [...] (Array of items)
const AIResponseSchema = z.union([
    z.object({ questions: z.array(ItemSchema) }),
    z.object({ items: z.array(ItemSchema) }),
    z.array(ItemSchema),
]);

/**
 * Normalizes the AI response into a flat array of question items.
 * Validates against AIResponseSchema and handles recursive extraction.
 * 
 * @param {unknown} responseData - The raw data from the AI service.
 * @returns {Array<object>} - A flat array of question objects.
 * @throws {Error} - If validation fails.
 */
function normalizeAIResponse(responseData) {
    try {
        // 1. Validate structure
        const parsedData = AIResponseSchema.parse(responseData);

        // 2. Normalize to an array
        let rootItems = [];
        if (Array.isArray(parsedData)) {
            rootItems = parsedData;
        } else if (parsedData.questions) {
            rootItems = parsedData.questions;
        } else if (parsedData.items) {
            rootItems = parsedData.items;
        }

        // 3. Recursive extraction (Flattening)
        const recursiveExtract = (items) => {
            let extracted = [];
            if (!Array.isArray(items)) return extracted;

            for (const item of items) {
                if (item.questions && Array.isArray(item.questions)) {
                    extracted.push(...recursiveExtract(item.questions));
                } else if (item.items && Array.isArray(item.items)) {
                    // Handle 'items' key if it exists nested
                    extracted.push(...recursiveExtract(item.items));
                } else if (item.item && typeof item.item === 'object') {
                    // Handle 'item' wrapper
                    extracted.push(item.item);
                } else {
                    // It's a leaf item (question)
                    // valid question should ideally have 'question' text, but we passthrough for now
                    // We can strip 'questions'/'items'/'item' keys to be clean if needed, 
                    // but for now we just push the object as is (with potentially unused keys ignored by downstream)
                    const { questions, items, item: nestedItem, ...cleanItem } = item;
                    extracted.push(cleanItem);
                }
            }
            return extracted;
        };

        return recursiveExtract(rootItems);

    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error("AI Response Validation Error:", JSON.stringify(error.errors, null, 2));
            throw new Error(`Invalid AI Response Format: ${error.message}`);
        }
        throw error;
    }
}

module.exports = {
    AIResponseSchema,
    normalizeAIResponse
};
