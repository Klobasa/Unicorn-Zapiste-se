const Ajv = require("ajv");
const ajv = new Ajv();

const lessonDao = require("../../dao/lesson-dao");

const schema = {
    type: "object",
    properties: {
        title: { type: "string" },
        description: { type: "string" },
        teacher: { type: "string" },
        day: { type: "integer", minimum: 0, maximum: 6 },
        timeFrom: { type: "string", pattern: "^([01]\\d|2[0-3]):?([0-5]\\d)$" },
        timeTo: { type: "string", pattern: "^([01]\\d|2[0-3]):?([0-5]\\d)$" },
        capacity: { type: "integer" },
        id: { type: "string" }

    },
    required: ["id"],
    additionalProperties: false,
};

async function UpdateAbl(req, res) {
    try {
        let lesson = req.body;

        if (!ajv.validate(schema, lesson)) {
            console.error('Validation errors:', ajv.errors);
            res.status(400).json({ message: 'Invalid lesson data', code: "invalidLessonParams", errors: ajv.errors });
            return;
        }

        const existingLesson = lessonDao.get(lesson.id);
        if (!existingLesson) {
            res.status(404).json({ message: 'Lesson not found', code: "lessonNotFound" });
            return;
        }

        const mergedLesson = { ...existingLesson, ...lesson };

        if (mergedLesson.timeFrom >= mergedLesson.timeTo) {
            res.status(400).json({ message: 'Čas začátku musí být před časem konce', code: "invalidTimeRange" });
            return;
        }

        const allLessons = lessonDao.list();
        const overlapping = allLessons.find(other =>
            other.id !== mergedLesson.id &&
            other.day === mergedLesson.day &&
            mergedLesson.timeFrom < other.timeTo && other.timeFrom < mergedLesson.timeTo
        );
        if (overlapping) {
            res.status(409).json({ message: 'Lesson time overlaps with an existing lesson', code: "lessonTimeOverlap" });
            return;
        }

        let updatedLesson;

        try {
            updatedLesson = lessonDao.update(lesson);
        } catch (error) {
            res.status(400).json({ ...error, message: 'Failed to update lesson', code: error.code || "failedToUpdateLesson", lesson: error.lesson || null });
            return;
        }


        res.json(updatedLesson);
    } catch (error) {
        res.status(500).json({ message: error.message, code: error.code || "failedToUpdateLesson", lesson: error.lesson || null });
    } 
}

module.exports = UpdateAbl;