const participantDao = require("../../dao/participant-dao");

async function ListAbl(req, res) {
    try {
        const participants = participantDao.list();
        res.json(participants);
    } catch (error) {
        res.status(500).json({ message: error.message, code: error.code || "failedToListParticipants" });
    }
}
module.exports = ListAbl;