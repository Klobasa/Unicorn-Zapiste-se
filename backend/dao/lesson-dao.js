const { join } = require('path');
const fs = require('fs');
const crypto = require('crypto');

const lessonDirectory = join(__dirname, 'storage', 'lessons');

function get(lessonId){
    try {
        const lessonPath = join(lessonDirectory, `${lessonId}.json`);
        const lessonData = fs.readFileSync(lessonPath, 'utf8');
        return JSON.parse(lessonData);
    } catch (error) {
        if (error.code === "ENOENT") return null;
        console.error(`Error reading lesson with ID ${lessonId}:`, error);
        throw { message: 'Failed to read lesson', code: "failedToReadLesson", lesson: error.lesson };
    }
}

function list() {
    try {   
        const files = fs.readdirSync(lessonDirectory);
        const lessons = files.map(file => {
            const lessonData = fs.readFileSync(join(lessonDirectory, file), 'utf8');
            return JSON.parse(lessonData);
        });
        return lessons;
    } catch (error) {
        console.error('Error listing lessons:', error);
        throw { message: 'Failed to list lessons', code: "failedToListLessons" };
    }
}

function create(lesson) {
    try {
        const lessonList = list();

        lesson.id = crypto.randomUUID();
        const lessonPath = join(lessonDirectory, `${lesson.id}.json`);
        const lessonData = JSON.stringify(lesson);
        fs.writeFileSync(lessonPath, lessonData, 'utf8');
        return lesson;
    } catch (error) {
        console.error('Error creating lesson:', error);
        throw { message: 'Failed to create lesson', code: "failedToCreateLesson" };
    }
}

function update(lesson) {
    try {
        const existingLesson = get(lesson.id);
        if (!existingLesson) {
            throw { message: 'Lesson not found', code: "lessonNotFound", lesson: { id: lesson.id } };
        }

        const updatedLesson = { ...existingLesson, ...lesson };
        const lessonPath = join(lessonDirectory, `${lesson.id}.json`);
        const lessonData = JSON.stringify(updatedLesson);
        fs.writeFileSync(lessonPath, lessonData, 'utf8');
        return updatedLesson;
    } catch (error) {
        if (error.code === "lessonNotFound") throw error;
        console.error('Error updating lesson:', error);
        throw { message: 'Failed to update lesson', code: "failedToUpdateLesson", lesson: error.lesson };
    }
}

function remove(lessonId) {
    try {
        const lessonPath = join(lessonDirectory, `${lessonId}.json`);
        fs.unlinkSync(lessonPath);
        return {};
    } catch (error) {
        if (error.code === "ENOENT") {
            return {};
        }  
        console.error('Error deleting lesson:', error);
        throw { message: 'Failed to delete lesson', code: "failedToDeleteLesson", lesson: error.lesson };
    }
} 

module.exports = {
    get,
    list,
    create,
    update,
    remove 
};
        
    