const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/participant/getAbl");  
const ListAbl = require("../abl/participant/listAbl");
const CreateAbl = require("../abl/participant/createAbl");
const UpdateAbl = require("../abl/participant/updateAbl");
const DeleteAbl = require("../abl/participant/deleteAbl");

router.get("/get", GetAbl);
router.get("/list", ListAbl);
router.post("/create", CreateAbl);
router.put("/update", UpdateAbl);
router.delete("/delete", DeleteAbl); 

module.exports = router;