const express = require('express');
const app = express();
const port = 3000;


const lessonController = require('./controller/lesson');
const participantController = require('./controller/participant');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Ono to žije!");
});


app.use("/lesson", lessonController);
app.use("/participant", participantController);
app.use("/lesson-participant", require("./controller/lesson_participant"));

app.listen(port, () => {
  console.log(`Zapiste.se app listening on port ${port}`);
});