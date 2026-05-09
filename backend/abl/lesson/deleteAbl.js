const Ajv = require("ajv");
const ajv = new Ajv();

const lessonDao = require("../../dao/lesson-dao");
const lpDao = require("../../dao/lesson_participant-dao");

const schema = {
    type: "object",
  properties: {
    id: { type: "string" },
    unregister: { type: "boolean" }
  },
  required: ["id"],
  additionalProperties: false,
};

async function DeleteAbl(req, res) {
    try {
        const reqParams = req.query?.id ? req.query : req.body;

        if (!ajv.validate(schema, reqParams)) {
            console.error('Validation errors:', ajv.errors);
            res.status(400).json({ message: 'Invalid lesson param data', code: "invalidLessonParams", errors: ajv.errors });
            return;
        }

        if (reqParams.unregister) {
            lpDao.removeByLesson(reqParams.id);
        } else if (lpDao.listByLesson(reqParams.id).length > 0) {
            res.status(400).json({ message: 'Cannot delete lesson with enrolled participants', code: "cannotDeleteLessonWithParticipants", lesson: { id: reqParams.id } });
            return;
        }

        lessonDao.remove(reqParams.id);
        res.json({});
    } catch (error) {
        res.status(500).json({ message: error.message, code: error.code || "failedToDeleteLesson", lesson: error.lesson || null });
    }
}
module.exports = DeleteAbl;