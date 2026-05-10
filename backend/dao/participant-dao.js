const { join } = require('path');
const fs = require('fs');
const crypto = require('crypto');

const participantDirectory = join(__dirname, 'storage', 'participants');

function get(participantId){  
    try {
        const participantPath = join(participantDirectory, `${participantId}.json`);
        const participantData = fs.readFileSync(participantPath, 'utf8');
        return JSON.parse(participantData);
    } catch (error) {
        if (error.code === "ENOENT") return null;
        console.error(`Error reading participant with ID ${participantId}:`, error);
        throw { message: 'Failed to read participant', code: "failedToReadParticipant", participant: error.participant };
    }
}

function list() {
    try {   
        const files = fs.readdirSync(participantDirectory);
        return files.map(file => {
            const participantData = fs.readFileSync(join(participantDirectory, file), 'utf8');
            return JSON.parse(participantData);
        });
    } catch (error) {
        console.error('Error listing participants:', error);
        throw { message: 'Failed to list participants', code: "failedToListParticipants" };
    }
}  

function create(participant) {
    try {
        const participantList = list();
        if (participantList.some(p => p.email === participant.email)) {
            throw { message: 'Participant with this email already exists', code: "participantEmailExists", participant: { email: participant.email } };
        }

        participant.id = crypto.randomUUID();
        const participantPath = join(participantDirectory, `${participant.id}.json`);
        const participantData = JSON.stringify(participant);
        fs.writeFileSync(participantPath, participantData, 'utf8');
        return participant;
    } catch (error) {
        if (error.code === "participantEmailExists") throw error;
        console.error('Error creating participant:', error);
        throw { message: 'Failed to create participant', code: "failedToCreateParticipant", participant: error.participant };
    }
}

function update(participant) {
    try {
        const existingParticipant = get(participant.id);
        if (!existingParticipant) {
            throw { message: 'Participant not found', code: "participantNotFound", participant: { id: participant.id } };
        }

        if (participant.email && participant.email !== existingParticipant.email) {
            const participantList = list();
            if (participantList.some(p => p.email === participant.email)) {
                throw { message: 'Participant with this email already exists', code: "participantEmailExists", participant: { email: participant.email } };
            }
        }

        const updatedParticipant = { ...existingParticipant, ...participant };
        const participantPath = join(participantDirectory, `${participant.id}.json`);
        const participantData = JSON.stringify(updatedParticipant);
        fs.writeFileSync(participantPath, participantData, 'utf8');
        return updatedParticipant;
    } catch (error) {
        if (error.code === "participantNotFound") throw error;
        if (error.code === "participantEmailExists") throw error;
        console.error('Error updating participant:', error);
        throw { message: 'Failed to update participant', code: "failedToUpdateParticipant", participant: error.participant };
    }
}

function remove(participantId) {
    try {
        const participantPath = join(participantDirectory, `${participantId}.json`);
        fs.unlinkSync(participantPath);
        return {};
    } catch (error) {
        if (error.code === "ENOENT") {
            return {};
        }   
        console.error('Error deleting participant:', error);
        throw { message: 'Failed to delete participant', code: "failedToDeleteParticipant", participant: error.participant };
    }
}

module.exports = {
    get,
    list,
    create,
    update,
    remove
};