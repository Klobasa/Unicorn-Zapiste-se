const express = require("express");
const router = express.Router();

const CreateAbl = require("../abl/lesson_participant/createAbl");
const DeleteAbl = require("../abl/lesson_participant/deleteAbl");
const ListByParticipantAbl = require("../abl/lesson_participant/listByParticipantAbl");
const ListByLessonAbl = require("../abl/lesson_participant/listByLessonAbl");

router.get("/list-by-lesson", ListByLessonAbl);
router.get("/list-by-participant", ListByParticipantAbl);
router.post("/create", CreateAbl);
router.delete("/delete", DeleteAbl);

module.exports = router;