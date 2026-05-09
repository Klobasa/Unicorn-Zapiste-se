const lessonDao = require("../../dao/lesson-dao");

async function ListAbl(req, res) {
    try {
        const lessons = lessonDao.list();
        res.json(lessons);
    } catch (error) {
        res.status(500).json({ message: error.message, code: error.code || "failedToListLessons" });
    }
}
module.exports = ListAbl;