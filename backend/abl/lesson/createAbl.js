const Ajv = require("ajv");
const ajv = new Ajv();

const lessonDao = require("../../dao/lesson-dao");

const schema = {
    type: "object",
    properties: {
        title: { type: "string" },
        description: { type: "string" },
        teacher: { type: "string" },
        day: { type: "integer" },
        timeFrom: { type: "string", pattern: "^([01]\\d|2[0-3]):?([0-5]\\d)$" },
        timeTo: { type: "string", pattern: "^([01]\\d|2[0-3]):?([0-5]\\d)$" },
        capacity: { type: "integer" }

    },
    required: ["title", "teacher", "day", "timeFrom", "timeTo", "capacity"],
    additionalProperties: false,
};

async function CreateAbl(req, res) {
    try {
        let lesson = req.body;
        
        if (!ajv.validate(schema, lesson)) {
            console.error('Validation errors:', ajv.errors);
            res.status(400).json({ message: 'Invalid lesson param data', code: "invalidLessonParams", errors: ajv.errors });
            return;
        }
 
        const createdLesson = lessonDao.create(lesson);
        res.status(201).json(createdLesson);

    } catch (error) {
        res.status(500).json({ message: error.message, code: error.code || "failedToCreateLesson", lesson: error.lesson || null });
    }
}

module.exports = CreateAbl;