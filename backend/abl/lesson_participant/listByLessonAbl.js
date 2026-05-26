const Ajv = require("ajv");
const ajv = new Ajv();

const lpDao = require("../../dao/lesson_participant-dao");
const participantDao = require("../../dao/participant-dao");

const schema = {
    type: "object",
  properties: {
    lessonId: { type: "string" },
  },
  required: ["lessonId"],
  additionalProperties: false,
};

async function ListByLessonAbl(req, res) {
    try {
        // Parametr v url nebo body
        const reqParams = req.query?.lessonId ? req.query : req.body;

        if (!ajv.validate(schema, reqParams)) {
            console.error('Validation errors:', ajv.errors);
            res.status(400).json({ message: 'Invalid lesson param data', code: "invalidLessonParams", errors: ajv.errors });
            return;
        }

        const lessonParticipants = lpDao.listByLesson(reqParams.lessonId);
        const enriched = lessonParticipants.map((lp) => ({
            ...lp,
            participant: participantDao.get(lp.participantId),
        }));
        res.json(enriched);
    } catch (error) {
        res.status(500).json({ message: error.message, code: error.code || "failedToListLessonsByLesson", lessonId: reqParams.lessonId || null });
    }
}
module.exports = ListByLessonAbl;