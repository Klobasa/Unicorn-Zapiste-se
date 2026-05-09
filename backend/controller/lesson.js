const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/lesson/getAbl");
const ListAbl = require("../abl/lesson/listAbl");
const CreateAbl = require("../abl/lesson/createAbl");
const UpdateAbl = require("../abl/lesson/updateAbl");
const DeleteAbl = require("../abl/lesson/deleteAbl");

router.get("/get", GetAbl);
router.get("/list", ListAbl);
router.post("/create", CreateAbl);
router.put("/update", UpdateAbl);
router.delete("/delete", DeleteAbl);

module.exports = router;