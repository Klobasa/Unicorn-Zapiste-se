const lessonDao = require("../../dao/lesson-dao");
const lpDao = require("../../dao/lesson_participant-dao");

async function ListAbl(req, res) {
    try {
        const lessons = lessonDao.list();
        const enriched = lessons.map((lesson) => ({
            ...lesson,
            enrolled: lpDao.listByLesson(lesson.id).length,
        }));
        res.json(enriched);
    } catch (error) {
        res.status(500).json({ message: error.message, code: error.code || "failedToListLessons" });
    }
}
module.exports = ListAbl;