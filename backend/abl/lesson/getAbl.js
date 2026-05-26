const Ajv = require("ajv");
const ajv = new Ajv();

const lessonDao = require("../../dao/lesson-dao");
const lpDao = require("../../dao/lesson_participant-dao");

const schema = {
    type: "object",
  properties: {
    id: { type: "string" },
  },
  required: ["id"],
  additionalProperties: false,
};

async function GetAbl(req, res) {
    try {
        // Parametr v url nebo body
        const reqParams = req.query?.id ? req.query : req.body;

        if (!ajv.validate(schema, reqParams)) {
            console.error('Validation errors:', ajv.errors);
            res.status(400).json({ message: 'Invalid lesson param data', code: "invalidLessonParams", errors: ajv.errors });
            return;
        }

        const lesson = lessonDao.get(reqParams.id);
        if (!lesson) {
            res.status(404).json({ message: 'Lesson not found', code: "lessonNotFound" });
            return;
        }
        const enrolledCount = lpDao.listByLesson(lesson.id).length;
        res.json({ ...lesson, enrolled: enrolledCount });

    } catch (error) {
        res.status(500).json({ message: error.message, code: error.code || "failedToGetLesson", lesson: error.lesson || null });
    }
    
}
module.exports = GetAbl;