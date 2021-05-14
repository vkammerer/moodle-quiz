import { readFileSync, writeFileSync } from "fs";
import path from "path";
import csvtojson from "csvtojson";

const TEST_NAME = "LASC211_S1_test_2";

// Ok when ran from root
const __dirname = path.resolve("src");

const transpose = (m) => m[0].map((x, i) => m.map((x) => x[i]));

const readTemplate = (name) =>
  readFileSync(path.resolve(__dirname, `../templates/${name}.xml`), {
    encoding: "utf-8",
  });

const addZeroIfNeeded = (myNumber) =>
  myNumber.toString().length < 2 ? "0" + myNumber : myNumber;

const container = readTemplate("container");
const question_genus = readTemplate("question_genus");
const question_specie = readTemplate("question_specie");
const question_common = readTemplate("question_common");
const question_env = readTemplate("question_env");

const questionsSetTemplate = () => `
${question_genus}

${question_specie}

${question_common}

${question_env}
`;

const quiz = await csvtojson({ noheader: true, ignoreEmpty: true })
  .fromFile(path.resolve(__dirname, `../input/${TEST_NAME}.csv`))
  .then((users) => {
    return transpose(users.map((u) => Object.values(u)));
  })
  .catch((err) => {
    console.log(err);
  });

const [fields, ...questionsSets] = quiz;
const questionsXml = questionsSets
  .map((set) =>
    fields.reduce(
      (acc, field, index) =>
        acc
          .replaceAll(`{{${field}}}`, set[index])
          .replaceAll("{{PLANT_NUMBER_FORMATTED}}", addZeroIfNeeded(set[0])),
      questionsSetTemplate()
    )
  )
  .join("");

const output = container.replace("{{QUIZ}}", questionsXml);

writeFileSync(path.resolve(__dirname, `../output/${TEST_NAME}.xml`), output);
