#!/usr/bin/env node

const fs = require('fs');
const panda = require('./panda');
const filename = process.argv[2];

if (!filename) {
  console.error('err: requires a valid .pan file');
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

