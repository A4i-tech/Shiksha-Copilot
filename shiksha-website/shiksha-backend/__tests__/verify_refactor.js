
const { validatePartsResponse } = require('../schemas/ai.response.schema');

const mockAiResponse = {
    metadata: { user_id: "test", subject: "Math", grade: "10" },
    questions: [
        {
            type: "MCQ",
            number_of_questions: 1,
            marks_per_question: 1,
            questions: [{ question: "Q1", options: ["1"], answer: "1" }]
        }
    ]
};

try {
    console.log("Testing Node.js Default Value...");
    const flattened = validatePartsResponse(mockAiResponse);
    const q1 = flattened[0];

    if (q1.difficulty === "Average") {
        console.log("SUCCESS: Default difficulty is 'Average'");
    } else {
        console.error(`FAILURE: Default difficulty is '${q1.difficulty}'`);
        process.exit(1);
    }
} catch (e) {
    console.error(e);
    process.exit(1);
}
