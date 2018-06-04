var assert = require('assert');
var {parseNumber, parseIdentifier, parseDeclaration, parseProgram, mainCompile} = require('./index.js');

// Parsing Number Related Tests

// Testing Parsing a number
assert (parseNumber("1234").value === 1234);
assert (parseNumber("1234").type === 'number');
// Testing parseNumber with a string
assert (parseNumber("abcdefg").type === null);
// Testing parseNumber with special characters
assert (parseNumber("!@#$%^&*()").type === null);
// Testing Parsing a number which has chars
// in between numbers
assert (parseNumber("12ty345").value === 12);
// Testing parseNumber with chars in front 
// of numbers
assert (parseNumber("abc90000000").type === null);

// Parsing Identifier Related Tests

// Testing Parsing a valid identifer
assert (parseIdentifier("GO8").type === "identifier");
assert (parseIdentifier("GO8").value === "GO8");

// Testing Parsing an invalid identifier
assert (parseIdentifier("$$$KushMan").type === null);
assert (parseIdentifier("$$$KushMan").value === null);

// Testing Parsing an identifier which starts with 
// numbers (should be invalid)
assert (parseIdentifier("1Hundred").type === null);
assert (parseIdentifier("1Hundred").type === null);

// Testing Parsing an identifier with whitespace (result
// should be an identifier containing all the valid chars
// up to the whitespace)
assert (parseIdentifier("St ark").type === "identifier");
assert (parseIdentifier("St ark").value === "St");

// Parsing a Variable Declaration Statement

// Testing a valid declaration
var sampleDeclaration = parseDeclaration("new i = 13;");
assert(sampleDeclaration.keyword === "new");
assert(sampleDeclaration.identifier === "i");
assert(sampleDeclaration.operator === "=");
assert(sampleDeclaration.value.value === 13);

// Testing a valid decleration with a 
// binary expression
sampleDeclaration = parseDeclaration("new exp = 1 + a;");
assert(sampleDeclaration.keyword === "new");
assert(sampleDeclaration.identifier === "exp");
assert(sampleDeclaration.operator === "=");
assert(sampleDeclaration.value.left.value === 1);
assert(sampleDeclaration.value.operator === "+");
assert(sampleDeclaration.value.right.type === "identifier");
assert(sampleDeclaration.value.right.value === "a");

// Testing an invalid declaration
sampleDeclaration = parseDeclaration("Yeet!!!");
assert(sampleDeclaration.type === null);

// Testing an almost valid declaration
sampleDeclaration = parseDeclaration("new i - 51 + 51");
assert(sampleDeclaration.type === null);

// Testing if the rest of code appears in rest
// after declaration is parsed
sampleDeclaration = parseDeclaration(
  "new variable = 256; variable = variable + 1;"
);
assert(sampleDeclaration.rest === " variable = variable + 1;");

// Parsing a program

// Parsing a series of declarations
parseProgram("new b = 12; new l = 14; new d = 16;");

// Compiling the code

// Testing a simple compilation of an integer declaration
var machineCode = mainCompile("new i = 13; new p = i + 5; i = 5;");
console.log(machineCode);
// Testing Parsing basic arithmetic 
/*
  These tests will be added later on
*/

console.log("*** Hooray! All Tests Passed! ***");