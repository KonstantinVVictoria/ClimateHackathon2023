const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const {
  Scaffold,
  Expand,
  DeriveTopics,
  TruthSource,
  ReviseTruth,
  AnalyzeBySection,
  Improve,
} = require("./Pipeline");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, preserveOrder: true }));
app.post("/generate_template", async (req, res) => {
  const constraints = req.body;
  console.log(constraints);
  const template = await Scaffold(constraints);
  console.log(template);
  res.json(template);
});

app.post("/generate_first_draft", async (req, res) => {
  const data = req.body;
  console.log(data);
  const first_draft = await Expand(data);
  console.log(first_draft);
  res.json(first_draft);
});

app.post("/derive_topics", async (req, res) => {
  const data = req.body;
  console.log(data);
  const topics = await DeriveTopics(data);
  console.log(topics);
  res.json(topics);
});
app.post("/truth_source", async (req, res) => {
  const data = req.body;
  console.log(data);
  const sources = await TruthSource(data);
  console.log(sources);
  res.json(sources);
});
app.post("/revise_truth", async (req, res) => {
  const data = req.body;
  console.log(JSON.parse(data.truths), JSON.parse(data.lesson_plan));
  const second_draft = await ReviseTruth(
    JSON.parse(data.truths),
    JSON.parse(data.lesson_plan)
  );
  console.log(second_draft);
  res.json(second_draft);
});

app.post("/analyze", async (req, res) => {
  const data = req.body;
  console.log(data);
  const analysis = await AnalyzeBySection(data);
  console.log(analysis);
  res.json(analysis);
});

app.post("/improve", async (req, res) => {
  const data = req.body;
  console.log({
    lesson_plan: JSON.parse(data.lesson_plan),
    recommendation: JSON.parse(data.recommendation),
  });
  const final_draft = await Improve({
    lesson_plan: JSON.parse(data.lesson_plan),
    recommendation: JSON.parse(data.recommendation),
  });
  console.log(final_draft);
  res.json(final_draft);
});

app.listen(8000, () => {
  console.log("listening");
});
