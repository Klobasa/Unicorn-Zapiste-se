const { join } = require('path');
const fs = require('fs');

const lpDirectory = join(__dirname, 'storage', 'lesson_participants');

const lessonDao = require("./lesson-dao");
const participantDao = require("./participant-dao");

function list() {
    try {   
        const files = fs.readdirSync(lpDirectory);
        const lessonParticipants = files.map(file => {
            const lpData = fs.readFileSync(join(lpDirectory, file), 'utf8');
            return JSON.parse(lpData);
        });
        return lessonParticipants;
    } catch (error) {
        console.error('Error listing lesson_participants:', error);
        throw { message: 'Failed to list lesson_participants', code: "failedToListLessonParticipants" };
    }
}

function create (lessonId, participantId) {
    try {
        const lesson = lessonDao.get(lessonId);
        if (!lesson) {
            throw { message: 'Lesson not found', code: "lessonNotFound", lessonParticipant: { lessonId, participantId } };
        }

        if (!participantDao.get(participantId)) {
            throw { message: 'Participant not found', code: "participantNotFound", lessonParticipant: { lessonId, participantId } };
        }

        const lpList = list();
        if (lpList.some(lp => lp.lessonId === lessonId && lp.participantId === participantId)) {
            throw { message: 'Participant is already enrolled in this lesson', code: "participantAlreadyEnrolled", lessonParticipant: { lessonId, participantId } };
        }

        const enrolled = lpList.filter(lp => lp.lessonId === lessonId).length;
        if (enrolled >= lesson.capacity) {
            throw { message: 'Lesson is at full capacity', code: "lessonAtCapacity", lessonParticipant: { lessonId, participantId } };
        }

        let lessonParticipant = { lessonId, participantId };
        const lpPath = join(lpDirectory, `${lessonId}_${participantId}.json`);
        const lpData = JSON.stringify(lessonParticipant);
        fs.writeFileSync(lpPath, lpData, 'utf8');
        return lessonParticipant;
    } catch (error) {
        console.error('Error creating lesson_participant:', error);
        throw { message: error.message || 'Failed to create lesson_participant - dao', code: error.code || "failedToCreateLessonParticipant", lessonParticipant: error.lessonParticipant };
    }
}

function remove(lessonId, participantId) {
    try {
        const lpPath = join(lpDirectory, `${lessonId}_${participantId}.json`);
        fs.unlinkSync(lpPath);
        return {};
    } catch (error) {
        if (error.code === "ENOENT") {
            return {};
        }
        console.error('Error deleting lesson_participant:', error);
        throw { message: 'Failed to delete lesson_participant', code: "failedToDeleteLessonParticipant", lessonParticipant: { lessonId, participantId } };
    }
}

function listByLesson(lessonId) {
    try {
        const files = fs.readdirSync(lpDirectory);
        const lessonParticipants = files.filter(file => file.startsWith(`${lessonId}_`)).map(file => {
            const lpData = fs.readFileSync(join(lpDirectory, file), 'utf8');
            return JSON.parse(lpData);
        });
        return lessonParticipants;
    } catch (error) {
        console.error('Error listing lesson_participants by lesson:', error);
        throw { message: 'Failed to list lesson_participants by lesson', code: "failedToListLessonParticipantsByLesson", lesson: { id: lessonId } };
    }
}

function listByParticipant(participantId) {
    try {
        const files = fs.readdirSync(lpDirectory);
        const lessonParticipants = files.filter(file => file.endsWith(`_${participantId}.json`)).map(file => {
            const lpData = fs.readFileSync(join(lpDirectory, file), 'utf8');
            return JSON.parse(lpData);
        });
        return lessonParticipants;
    } catch (error) {
        console.error('Error listing lesson_participants by participant:', error);
        throw { message: 'Failed to list lesson_participants by participant', code: "failedToListLessonParticipantsByParticipant", participant: { id: participantId } };
    }
}

function removeByLesson(lessonId) {
    try {
        const lessonParticipants = listByLesson(lessonId);
        lessonParticipants.forEach(file => fs.unlinkSync(join(lpDirectory, `${file.lessonId}_${file.participantId}.json`)));
        return {};
    } catch (error) {
        console.error('Error deleting lesson_participants by lesson:', error);
        throw { message: 'Failed to delete lesson_participants by lesson', code: "failedToDeleteLessonParticipantsByLesson", lesson: { id: lessonId } };
    }
}

function removeByParticipant(participantId) {  
    try {
        const lessonParticipants = listByParticipant(participantId);
        lessonParticipants.forEach(file => fs.unlinkSync(join(lpDirectory, `${file.lessonId}_${file.participantId}.json`)));
        return {};
    } catch (error) {
        console.error('Error deleting lesson_participants by participant:', error);
        throw { message: 'Failed to delete lesson_participants by participant', code: "failedToDeleteLessonParticipantsByParticipant", participant: { id: participantId } };
    }
}

module.exports = {
    list,
    create,
    remove,
    listByLesson,
    listByParticipant,
    removeByLesson,
    removeByParticipant
};
