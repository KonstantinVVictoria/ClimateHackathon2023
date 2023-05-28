const AgentFactory = require("@adasuite/agentgpt");
const fetch = require("node-fetch");
const Recruit = AgentFactory({
  API_KEY: "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",
  ORG_KEY: "org-9zmpMvPhAdZm5BKT6oYVj6Gh",
});
const Analysis = {};

const Blooms = {};
Blooms.create = async function (lesson_plan) {
  return await Recruit.new_agent({
    analysis:
      "How can the lesson_plan be modified to foster the student's ability to create fresh and innovative tasks?",
    output: JSON.stringify({
      suggestion: "<short text>",
    }),
  }).analyze(lesson_plan, { model: "gpt-3.5-turbo" });
};
Blooms.evaluate = async function (lesson_plan) {
  return await Recruit.new_agent({
    analysis:
      "How can the lesson_plan be modified to foster the student's ability to justify a stand or decision?",
    output: JSON.stringify({
      suggestion: "<short text>",
    }),
  }).analyze(lesson_plan, { model: "gpt-3.5-turbo" });
};
Blooms.analyze = async function (lesson_plan) {
  return await Recruit.new_agent({
    analysis:
      "How can the lesson_plan be modified to foster the student's ability to draw connections among ideas?",
    output: JSON.stringify({
      suggestion: "<short text>",
    }),
  }).analyze(lesson_plan, { model: "gpt-3.5-turbo" });
};
Blooms.apply = async function (lesson_plan) {
  return await Recruit.new_agent({
    analysis:
      "How can the lesson_plan be modified to foster the student's ability to use information in new situations?",
    output: JSON.stringify({
      suggestion: "<short text>",
    }),
  }).analyze(lesson_plan, { model: "gpt-3.5-turbo" });
};
Blooms.understand = async function (lesson_plan) {
  return await Recruit.new_agent({
    analysis:
      "How can the lesson_plan be modified to foster the student's ability to explain ideas or concepts?",
    output: JSON.stringify({
      suggestion: "<short text>",
    }),
  }).analyze(lesson_plan, { model: "gpt-3.5-turbo" });
};
Blooms.remember = async function (lesson_plan) {
  return await Recruit.new_agent({
    analysis:
      "How can the lesson_plan be modified to foster the student's ability to recall facts or basic concepts?",
    output: JSON.stringify({
      suggestion: "<short text>",
    }),
  }).analyze(lesson_plan, { model: "gpt-3.5-turbo" });
};

Blooms.zero_shot = async function (lesson_plan) {
  return await Recruit.new_agent({
    analysis:
      "Analyze the lesson_plan according to Bloom's Taxonomy, and suggest a specific edit",
    output: JSON.stringify({
      create: "<text>",
      evaluate: "<text>",
      analyze: "<text>",
      apply: "<text>",
      understand: "<text>",
      remember: "<text>",
    }),
  }).analyze(lesson_plan, { model: "gpt-3.5-turbo" });
};

async function AnalyzeBySection(lesson_plan) {
  console.log("Analyzing...");
  const [
    analyze_rec,
    apply_rec,
    create_rec,
    evaluate_rec,
    remember_rec,
    understand_rec,
  ] = await Promise.all([
    Blooms.analyze(lesson_plan),
    Blooms.apply(lesson_plan),
    Blooms.create(lesson_plan),
    Blooms.evaluate(lesson_plan),
    Blooms.remember(lesson_plan),
    Blooms.understand(lesson_plan),
  ]);

  return {
    analyze_recommendation: analyze_rec,
    apply_recommendation: apply_rec,
    create_recommendation: create_rec,
    evaluate_recommendation: evaluate_rec,
    remember_recommendation: remember_rec,
    understand_recommendation: understand_rec,
  };
}

async function AnalyzeAll(lesson_plan) {
  return await Blooms.zero_shot(lesson_plan);
}

const Constraints = {
  ["Lesson Title"]: "Atmospheric Carbon Dioxide and Climate Change",
  ["Grade Level"]: "High School",
  ["Subject"]: "Earth Sciences or Environmental Sciences",
  ["Learning Objectives"]: [
    "Understand the relationship between atmospheric carbon dioxide and climate change",
    "Observe/Analyze data from the Keeling Curve to identify trends and patterns in carbon dioxide levels.",
    "Create a prediction of future atmospheric CO2 from the Keeling curve",
  ],
  ["Prerequisites"]: "No prerequisites needed",
  ["Duration"]: "45 minutes",
  ["Materials"]: [
    "Projector/whiteboard",
    "Printed handouts with the Keeling curve",
  ],
};

async function Scaffold(Constraints) {
  return await Recruit.new_agent({
    analysis: "Based on the constraints, generate a lesson plan outline",
    output: JSON.stringify({
      introduction: "<text>",
      core_content: "<text>",
      learning_activities: ["<activity 1>", "..."],
      assessment_evaluation: "<text>",
      conclusion: "<text>",
    }),
  }).analyze(Constraints);
}

async function Expand(Sections) {
  return await Recruit.new_agent({
    analysis:
      "Rewrite each lesson plan's section. Make it more detailed and thorough",
    output: JSON.stringify({
      introduction: "<text>",
      core_content: "<text>",
      learning_activities: ["<activity 1>", "..."],
      assessment_evaluation: "<text>",
      conclusion: "<text>",
    }),
  }).analyze(Sections);
}
async function Improve(Revision) {
  return await Recruit.new_agent({
    analysis:
      "Revise the lesson plan's sections based on the given recommendations and edits",
    output: JSON.stringify({
      introduction: "<text>",
      core_content: "<text>",
      learning_activities: ["<activity 1>", "..."],
      assessment_evaluation: "<text>",
      conclusion: "<text>",
    }),
  }).analyze(Revision);
}

async function DeriveTopics(Revision) {
  return await Recruit.new_agent({
    analysis:
      "Based on the lesson plan, derive the five main terms that need to be verified for accuracy.",
    output: JSON.stringify({
      terms: ["<term>", "<...>"],
    }),
  }).analyze(Revision);
}

async function Test(lesson_plan) {
  console.log("Beginning query");
  const analysis = await Blooms.zero_shot({ lesson_plan: lesson_plan });
  console.log(analysis);
  return analysis;
}
const start_time = new Date().getTime();
console.log(start_time);

async function Summarizer(summary) {
  return await Recruit.new_agent({
    analysis: "summarize the data",
    output: JSON.stringify({
      summary: "<short_summary>",
    }),
  }).analyze(summary, { model: "gpt-3.5-turbo" });
}

async function TruthSource({ terms }) {
  var url = "https://en.wikipedia.org/w/api.php";
  const truths = {};
  for (const term of terms) {
    var params = new URLSearchParams({
      action: "query",
      list: "search",
      srsearch: term,
      format: "json",
    });
    await fetch(`${url}?${params}`)
      .then(function (response) {
        return response.json();
      })
      .then(async function (response) {
        const wiki_word = response.query.search[0].title;
        const is_similar = await Recruit.new_agent({
          analysis: "Are these words the same?",
          output: JSON.stringify({
            truthy: "<true | false>",
          }),
        }).analyze(
          {
            word_1: term,
            word_2: wiki_word,
          },
          { model: "gpt-3.5-turbo" }
        );
        if (is_similar.truthy) {
          const summary_data = await fetch(
            `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&pageids=${response.query.search[0].pageid}`
          ).then((res) => res.json());
          const summary = Object.values(summary_data.query.pages)[0].extract;
          truths[term] = await Summarizer(summary);
        }
        console.log(truths);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  return truths;
}

async function ReviseTruth(truths, lesson_plan) {
  return await Recruit.new_agent({
    analysis: "If necessary, based on the information, revise the lesson plan.",
    output: JSON.stringify({
      introduction: "<text>",
      core_content: "<text>",
      learning_activities: ["<activity 1>", "..."],
      assessment_evaluation: "<text>",
      conclusion: "<text>",
    }),
  }).analyze({
    information: truths,
    lesson_plan: lesson_plan,
  });
}

// Scaffold(Constraints).then(async (data) => {
//   console.log("Generating template...");
//   console.log(data);
//   console.log("Expanding template...");
//   let lesson_plan = await Expand(data);
//   console.log(lesson_plan);
//   console.log("Check for accuracy");
//   const topics = await DeriveTopics(lesson_plan);
//   console.log(topics);
//   const truths = await TruthSource(topics);
//   console.log(truths);
//   console.log("Revise based on truths");
//   lesson_plan = await ReviseTruth(truths, lesson_plan);
//   console.log(lesson_plan);
//   console.log("Individual Analysis");
//   const analysis = await AnalyzeBySection({ lesson_plan: data });
//   console.log(analysis);
//   console.log("Reviewing and Improving");
//   const final_draft = await Improve({
//     lesson_plan: lesson_plan,
//     recommendation: analysis,
//   });
//   console.log(final_draft);
//   console.log((new Date().getTime() - start_time) / 60000, "minutes");
// });
module.exports = {
  Scaffold,
  Expand,
  DeriveTopics,
  TruthSource,
  ReviseTruth,
  AnalyzeBySection,
  Improve,
};
// Test(`I. Introduction
// Introduce observations of changing atmospheric CO2
// Explain that atmospheric carbon dioxide plays a significant role in climate change

// I. Introduction (10 minutes)
//    - Engage students in a brief discussion about climate change and its global impact. (Knowledge)
//    - Explain the role of atmospheric carbon dioxide in climate change. (Knowledge)
//    - Pose questions to activate prior knowledge and stimulate thinking. (Knowledge/Comprehension)

// II. Core Content
//    Topic information
//       - [Text content]
// II. The Keeling Curve and Carbon Dioxide Levels (15 minutes)
//    - Present an overview of the Keeling Curve and its significance in climate science. (Knowledge)
//    - Display simplified data from the Keeling Curve on the projector or whiteboard. (Knowledge)
//    - Lead a guided discussion on the general trend of increasing carbon dioxide levels. (Comprehension/Analysis)

// III. Impact of Atmospheric Carbon Dioxide on Climate Change (10 minutes)
//    - Explain the greenhouse effect and the role of carbon dioxide as a greenhouse gas. (Comprehension)
//    - Discuss the consequences of increasing carbon dioxide levels on global climate systems: temperature changes, weather patterns, sea level rise, and ecosystems. (Comprehension/Application)

// IV. Mitigation and Adaptation Strategies (15 minutes)
//    - Introduce simplified strategies for mitigating and adapting to climate change: reducing carbon emissions and adapting to changes. (Comprehension/Application)
//    - Engage students in a small group activity where they brainstorm and generate specific actions related to their assigned strategy. (Application/Analysis/Creation)
//    - Each group presents their ideas to the class and evaluates the feasibility and effectiveness of the proposed actions. (Evaluation/Creation)

// III. Learning Activities
//    A. Activity 1
//       - Show the Keeling curve
//       - Show the Keeling curve
// B. Activity 2
//       - Break students into groups
// V. Class Activity and Reflection (10 minutes)
//    - Conclude with a brief reflection activity where students individually write a sentence or two reflecting on their understanding of the lesson and their role in addressing climate change. (Evaluation/Creation)

// IV. Assessment/evaluation
//    - Set the students a writing exercise
//    - Students summarize current understanding of global warming and how this understanding
// affects their lives.

// V. Conclusion and Reflection
//    - Set a plenary discussion where students talk about their understanding of global warming`);

Analysis.Blooms = Blooms;
