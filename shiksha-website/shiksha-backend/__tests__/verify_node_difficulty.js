
const { normalizePartsResponse } = require('../schemas/ai.response.schema');

const mockAiResponse = {
    metadata: {
        user_id: "test_user",
        subject: "Math",
        grade: "10"
    },
    questions: [
        {
            type: "MCQ",
            number_of_questions: 1,
            marks_per_question: 1,
            questions: [
                {
                    question: "What is 2+2?",
                    options: ["1", "2", "3", "4"],
                    answer: "4",
                    difficulty: "Easy"
                }
            ]
        },
        {
            type: "Short Answer",
            number_of_questions: 1,
            marks_per_question: 2,
            questions: [
                {
                    question: "Explain gravity.",
                    difficulty: "Hard"
                }
            ]
        }
    ]
};

try {
    console.log("Testing normalizePartsResponse with mock data...");
    const flattened = normalizePartsResponse(mockAiResponse);

    console.log("Result:");
    console.log(JSON.stringify(flattened, null, 2));

    const easyQ = flattened.find(q => q.question === "What is 2+2?");
    const hardQ = flattened.find(q => q.question === "Explain gravity.");

    if (easyQ.difficulty === "Easy" && hardQ.difficulty === "Hard") {
        console.log("\nSUCCESS: Difficulty fields are correctly mapped!");
    } else {
        console.error("\nFAILURE: Difficulty fields are NOT mapped correctly.");
        console.error("Easy Question Difficulty:", easyQ.difficulty);
        console.error("Hard Question Difficulty:", hardQ.difficulty);
        process.exit(1);
    }

} catch (error) {
    console.error("Validation failed:", error.message);
    process.exit(1);
}
