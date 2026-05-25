const Ajv = require("ajv");
const ajv = new Ajv();

const lpDao = require("../../dao/lesson_participant-dao");

const schema = {
    type: "object",
  properties: {
    participantId: { type: "string" },
  },
  required: ["participantId"],
  additionalProperties: false,
};

async function ListByParticipantAbl(req, res) {
    try {
        // Parametr v url nebo body
        const reqParams = req.query?.participantId ? req.query : req.body;

        if (!ajv.validate(schema, reqParams)) {
            console.error('Validation errors:', ajv.errors);
            res.status(400).json({ message: 'Invalid participant param data', code: "invalidParticipantParams", errors: ajv.errors });
            return;
        }

        const lessonParticipants = lpDao.listByParticipant(reqParams.participantId);
        res.json(lessonParticipants);
    } catch (error) {
        res.status(500).json({ message: error.message, code: error.code || "failedToListLessonsByParticipant", participantId: reqParams.participantId || null });
    }
}
module.exports = ListByParticipantAbl;