const Ajv = require("ajv");
const addFormats = require("ajv-formats")

const ajv = new Ajv();
addFormats(ajv);

const participantDao = require("../../dao/participant-dao");

const schema = {
    type: "object",
    properties: {
        name: { type: "string" },
        surname: { type: "string" },
        email: { type: "string", format: "email" },
    },
    required: ["name", "email"],
    additionalProperties: false,
};

async function CreateAbl(req, res) {
    try {
        let participant = req.body;
        if (!ajv.validate(schema, participant)) {
            console.error('Validation errors:', ajv.errors);
            res.status(400).json({ message: 'Invalid participant param data', code: "invalidParticipantParams", errors: ajv.errors });
            return;
        }
        const createdParticipant = participantDao.create(participant);
        res.status(201).json(createdParticipant);

    } catch (error) {
        res.status(500).json({ message: error.message, code: error.code || "failedToCreateParticipant", participant: error.participant || null });
    }
}

module.exports = CreateAbl;