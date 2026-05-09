const express = require("express");
const router = express.Router();

const CreateAbl = require("../abl/lesson_participant/createAbl");
const DeleteAbl = require("../abl/lesson_participant/deleteAbl");

router.post("/create", CreateAbl);
router.delete("/delete", DeleteAbl);

module.exports = router;