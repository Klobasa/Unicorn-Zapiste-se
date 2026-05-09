const Ajv = require("ajv");
const ajv = new Ajv();

const participantDao = require("../../dao/participant-dao");

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
            res.status(400).json({ message: 'Invalid participant param data', code: "invalidParticipantParams", errors: ajv.errors });
            return;
        }

        const participant = participantDao.get(reqParams.id);
        if (!participant) {
            res.status(404).json({ message: 'Participant not found', code: "participantNotFound" });
            return;
        }

        res.json(participant);
    } catch (error) {
        res.status(500).json({ message: error.message, code: error.code || "failedToGetParticipant", participant: error.participant || null });
    }
}

module.exports = GetAbl;