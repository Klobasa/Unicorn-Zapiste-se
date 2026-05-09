const Ajv = require("ajv");
const ajv = new Ajv();

const lpDao = require("../../dao/lesson_participant-dao");

const schema = {   
    type: "object",
    properties: {
        lessonId: { type: "string" },
        participantId: { type: "string" },
    },
    required: ["lessonId", "participantId"],
    additionalProperties: false,
};

async function DeleteAbl(req, res) {
    try {
        let lessonParticipant = req.body;
        const validate = ajv.compile(schema);
        if (!validate(lessonParticipant)) {
            console.error('Validation errors:', validate.errors);
            throw { message: 'Invalid lesson participant data', code: "invalidLessonParticipantData", lessonParticipant: lessonParticipant };
        }
        const deletedLessonParticipant = lpDao.remove(lessonParticipant.lessonId, lessonParticipant.participantId);
        res.status(200).json(deletedLessonParticipant);
    } catch (error) {
        res.status(500).json({ message: error.message, code: error.code || "failedToDeleteLessonParticipant", lessonParticipant: error.lessonParticipant || null });
    }
}

module.exports = DeleteAbl;