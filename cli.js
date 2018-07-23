#!/usr/bin/env node

const fs = require('fs');
const panda = require('./panda');
const filename = process.argv[2];

const readlineSync = require('readline-sync');

function prompt(toCompile) {
  var answer = readlineSync.question('>>> ');
  var codeState = panda.mainCompile(toCompile.join(" "))
  if (answer.trim() == "quit;") {
    console.log(codeState);
  } else {
    if (codeState.slice(0, 4) == "Error") {
      console.error(codeState);
    } else {
      toCompile.push(answer.trim());
    }
    prompt(toCompile);
  }
}

if (!filename) {
  var emptyArray = new Array();
  prompt(emptyArray);
  process.exit(1);
}

fs.readFile(filename, (err, data) => {
  if (err) {
    console.error('err: error reading the file', err);
    process.exit(1);
  }

  const fileDataToCompileNewlines = data.toString();
  const fileDataToCompile = fileDataToCompileNewlines.replace(/\n|\r/g, " ").trim();

  const machineCode = panda.mainCompile(fileDataToCompile);
  console.log(machineCode);
});

