const Ajv = require("ajv");
const ajv = new Ajv();

const participantDao = require("../../dao/participant-dao");
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
            res.status(400).json({ message: 'Invalid participant param data', code: "invalidParticipantParams", errors: ajv.errors });
            return;
        }

        if (reqParams.unregister) {
            lpDao.removeByParticipant(reqParams.id);
        } else if (lpDao.listByParticipant(reqParams.id).length > 0) {
            res.status(400).json({ message: 'Cannot delete participant with enrolled lessons', code: "cannotDeleteParticipantWithLessons", participant: { id: reqParams.id } });
            return;
        }

        participantDao.remove(reqParams.id);
        res.json({});
    } catch (error) {
        res.status(500).json({ message: error.message, code: error.code || "failedToDeleteParticipant", participant: error.participant || null });
    }
}

module.exports = DeleteAbl;