import { readFileSync, writeFileSync } from "fs";
import path from "path";
const __dirname = path.resolve("src");

const TEST_NAME = "test2";

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

const output = container.replace(
  "{{QUIZ}}",
  `
${question_genus}

${question_specie}

${question_common}

${question_env}
`
);

const rawData = JSON.parse(
  readFileSync(path.resolve(__dirname, `../input/${TEST_NAME}.json`), {
    encoding: "utf-8",
  })
);

const data = {
  ...rawData,
  PLANT_NUMBER_FORMATTED: addZeroIfNeeded(rawData["PLANT_NUMBER"]),
};

const final = Object.keys(data).reduce((acc, expression) => {
  return acc.replaceAll(`{{${expression}}}`, data[expression]);
}, output);

writeFileSync(path.resolve(__dirname, `../output/${TEST_NAME}.xml`), final);
