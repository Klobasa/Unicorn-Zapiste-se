const Ajv = require("ajv");
const addFormats = require("ajv-formats")

const ajv = new Ajv();
addFormats(ajv);

const participantDao = require("../../dao/participant-dao");

const schema = {
    type: "object",
    properties: {
        name: { type: "string" },
        surname: { type: ["string", "null"] },
        email: { type: "string", format: "email" },
        id: { type: "string" }
    },
    required: ["id"],
    additionalProperties: false,
};

async function UpdateAbl(req, res) {
    try {
        let participant = req.body;

        if (!ajv.validate(schema, participant)) {
            console.error('Validation errors:', ajv.errors);
            res.status(400).json({ message: 'Invalid participant data', code: "invalidParticipantData", errors: ajv.errors });
            return;
        }

        let updatedParticipant;
        
        try {
            updatedParticipant = participantDao.update(participant);
        } catch (error) {
            res.status(400).json({ ...error, message: 'Failed to update participant', code: error.code || "failedToUpdateParticipant", participant: error.participant || null });
            return;
        }

        if (!updatedParticipant) {
            res.status(404).json({ message: 'Participant not found', code: "participantNotFound" });
            return;
        }  

        res.json(updatedParticipant);
    } catch (error) {
        res.status(500).json({ message: error.message, code: error.code || "failedToUpdateParticipant", participant: error.participant || null });
    }
}

module.exports = UpdateAbl;