var assert = require('assert');
var {parseNumber, parseIdentifier, parseDeclaration} = require('./index.js');

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
console.log(parseDeclaration("new i = 13"));

// Parsing basic arithmetic 
/*
  These tests will be added later on
*/

console.log("Hooray! All Tests Passed!");