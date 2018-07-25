#!node

var variableMemoryCellTrack = 255;
var memoryAllocations = [];
const MAX_LIMIT = 255;
const COMPILE_ERROR = "syntax error, please rewrite the faulty code.";

function compileDeclaration (declarationTree) {
  var instructionSet = null;

  if (declarationTree.value.type === "number") {
    instructionSet = [10, declarationTree.value.value, 12, variableMemoryCellTrack];
  } else if (declarationTree.value.type === "binexp") {
    instructionSet = calculateBinExp(declarationTree.value);
    instructionSet.push(12, variableMemoryCellTrack);
  } else if (declarationTree.value.type === "identifier") {
    instructionSet = [validIdentifierValue(declarationTree.value.value)];
    instructionSet.push(12, variableMemoryCellTrack);
  }

  if (instructionSet !== null) {
    var identifier = declarationTree.identifier;

    var variableMemoryDetails = {identifier: [identifier, variableMemoryCellTrack]};
    memoryAllocations.push(variableMemoryDetails);

    variableMemoryCellTrack--;
    return instructionSet;
  } else {
    return new Error(COMPILE_ERROR);
  }
}

function calculateBinExp(binExp) {
    var leftValue = binExp.left;
    var rightValue = binExp.right;
    var operator = binExp.operator;
    var valueA;
    var valueB;
    var instructionSet = [];

    if (leftValue.type === "identifier") {
      valueA = validIdentifierValue(leftValue.value);
      instructionSet.push(14, valueA, 12, valueA);
    } else {
      instructionSet.push(10, leftValue.value);
    }

    if (rightValue.type === "identifier") {
      valueB = validIdentifierValue(rightValue.value);
      instructionSet.push(15, valueB, 13, valueB);
    } else {
      instructionSet.push(11, rightValue.value);
    }

    if (operator === "+") {
      instructionSet.push(5);
    } else if (operator === "-") {
      instructionSet.push(6);
    } else {
      return new Error(COMPILE_ERROR);
    }

    return instructionSet;
}

function validIdentifierValue(identifier) {
  for (var i in memoryAllocations) {
    if (memoryAllocations[i].identifier.includes(identifier)) {
      var memoryLocationOfVariable = memoryAllocations[i].identifier[1];
      return memoryLocationOfVariable;
    }
  }

}

function chooseInstructionSet(programTree) {
  if (programTree.type === "declaration") {
    var instructions = compileDeclaration(programTree);
    return instructions;
  } else if (programTree.type === "assignment") {
    var instructions = compileAssignment(programTree);
    return instructions;
  } else if (programTree.type === "print") {
    var instructions = compilePrint(programTree);
    return instructions;
  } else if (programTree.type === "printAsChar") {
    var instructions = compilePrintAsChar(programTree);
    return instructions;
  } else {
    return new Error(COMPILE_ERROR);
  }
}

function compilePrintAsChar(printTree) {
  var instructionSet = null;

  if (printTree.value.type === "number") {
    instructionSet = [10, printTree.value.value, 17];
  } else if (printTree.value.type === "binexp") {
    instructionSet = calculateBinExp(printTree.value);
    instructionSet.push(17);
  } else if (printTree.value.type === "identifier") {
    instructionSet = [validIdentifierValue(printTree.value.value)];

    instructionSet.push(17);
  }

  if (instructionSet !== null) {
    return instructionSet;
  } else {
    return new Error(COMPILE_ERROR);
  }
}

function compilePrint (printTree) {
  var instructionSet = null;

  if (printTree.value.type === "number") {
    instructionSet = [10, printTree.value.value, 7];
  } else if (printTree.value.type === "binexp") {
    instructionSet = calculateBinExp(printTree.value);
    instructionSet.push(7);
  } else if (printTree.value.type === "identifier") {
    instructionSet = [validIdentifierValue(printTree.value.value)];

    instructionSet.push(7);
  }

  if (instructionSet !== null) {
    return instructionSet;
  } else {
    return new Error(COMPILE_ERROR);
  }
}

function compileAssignment (assignmentTree) {
  var instructionSet = null;
  var memoryLocation = validIdentifierValue(assignmentTree.identifier);

  if (assignmentTree.value.type === "number") {
    instructionSet = [10, assignmentTree.value.value, 12, memoryLocation];
  } else if (assignmentTree.value.type === "binexp") {
    instructionSet = calculateBinExp(assignmentTree.value);
    instructionSet.push(12, memoryLocation);
  } else if (assignmentTree.value.type === "identifier") {
    instructionSet = [validIdentifierValue(assignmentTree.value.value)];
    instructionSet.push(12, memoryLocation);
  }

  if (instructionSet !== null) {
    return instructionSet;
  } else {
    return new Error(COMPILE_ERROR);
  }
}

function mainCompile (program) {
  var programTrees = parseProgram(program);
  if (programTrees instanceof Error) {
    return programTrees;
  }
  // Loop over all the tree structures formed from each line
  // and perform actions
  var machineCode = [];
  for (var i in programTrees) {
    var instructionSet = chooseInstructionSet(programTrees[i]);
    if (instructionSet instanceof Error) {
      return instructionSet;
    } else {
      machineCode = machineCode.concat(instructionSet);
    }
  }

  return machineCode;
}

function parseProgram (input) {
  var statement = parseDeclaration(input);
  var programTrees = [];

  while (statement.type !== null) {
    programTrees.push(statement);
    statement = parseDeclaration(statement.rest);
    if (statement.type === null) {
      statement = parseAssignment(statement.rest);
    }

    if (statement.type === null) {
      statement = parsePrint(statement.rest);
    }

    if (statement.type === null) {
      statement = parsePrintAsChar(statement.rest);
    }
  }

  if (statement.rest !== "") {
    return new Error(COMPILE_ERROR);
  }

  return programTrees;
}

function parseDigit(input) {
  var returnObject = {
    type: null,
    value: null,
    rest: input
  }

  var digit = input[0];

  const DIGITS = "0123456789";

  if (DIGITS.includes(digit)) {
    returnObject.type = "digit";
    returnObject.value = digit;
    returnObject.rest = input.slice(1);
  }

  return returnObject;
}

function parseKeyword (input) {
  const KEYWORDS = ["new", "print", "printAsChar"];
  var returnObject = {
    type: null,
    value: null,
    rest: input
  }

  var keyword = "";
  var char = parseValidChar(input);

  if (char.type !== null) {
    returnObject.type = "keyword";
    while (char.type !== null) {
      keyword += char.value;
      char = parseValidChar(char.rest);
    }
  }

  if (KEYWORDS.includes(keyword)) {
    returnObject.value = keyword;
  }

  returnObject.rest = char.rest;
  return returnObject;
}

function parseNumber (input) {
  var strNum = "";
  var returnObject = {
    type: null,
    value: null,
    rest: input
  }

  var digit = parseDigit(input);
  if (digit.type !== null) {
    returnObject.type = "number";
    while (digit.type !== null) {
      strNum += digit.value;
      digit = parseDigit(digit.rest);
    }

    returnObject.value = Number(strNum);
    returnObject.rest = digit.rest;
  }

  return returnObject;
}

function parseOperator (input, isAssignment) {
  const VALID_ASSIGNMENT_OPERATORS = ["="];
  const VALID_ARITHMETIC_OPERATORS = ["+", "-"];

  var returnObject = {
    type: null,
    value: null,
    rest: input
  }

  var operator = input[0];

  if ((VALID_ASSIGNMENT_OPERATORS.includes(operator)) && (isAssignment)) {
    returnObject.type = "operator";
    returnObject.value = operator;
  } else if (VALID_ARITHMETIC_OPERATORS.includes(operator)) {
    returnObject.type = "operator";
    returnObject.value = operator;
  }

  returnObject.rest = input.slice(1);

  return returnObject;
}

function parseValidChar (input) {
  const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  var char = input[0];
  var returnObject = {
    type: null,
    value: null,
    rest: input
  }

  if (LETTERS.includes(char)) {
    returnObject.type = "char";
    returnObject.value = char;
    returnObject.rest = input.slice(1);
  }

  return returnObject;
}

function parseIdentifier (input) {
  var identifier = "";
  var returnObject = {
    type: null,
    value: null,
    rest: input
  }

  var char = parseValidChar(input);
  if (char.type !== null) {
    returnObject.type = "identifier";
    while (char.type !== null) {
      identifier += char.value;
      char = parseValidChar(char.rest);
      if (char.type === null) {
        char = parseDigit(char.rest);
      }
    }

    returnObject.value = identifier;
    returnObject.rest = char.rest;
  }

  return returnObject;
}

function parseWhitespace (input) {
  var returnObject = {
    rest: input
  }

  //var whiteSpaceCounter = 0;

  if (/\s/.test(input[0])) {
    return parseWhitespace(input.slice(1));
  } else {
    return returnObject;
  }
}

function parseDeclaration (statement) {
  // Parsing Counter which stores the positions
  // of what to pass next in a valid declaration.
  // E.g: parsingCounter at 0 is looking for an identifier
  var parsingCounter = 0;
  var returnObject = {
    type: null,
    rest: statement
  };

  // Parsing the keyword
  statement = parseWhitespace(statement);
  var keyword = parseKeyword(statement.rest);

  if (keyword.type === null) {
    return returnObject;
  }

  // Parsing the identifier
  statement = parseWhitespace(keyword.rest);
  var identifier = parseIdentifier(statement.rest);

  if (identifier.type === null) {
    return returnObject;
  }

  // Parsing an operator
  statement = parseWhitespace(identifier.rest)
  var operator = parseOperator(statement.rest, true);
  if (operator.type === null) {
    return returnObject;
  }

  statement = operator.rest;
  var value = parseOperation (statement);

  if (value.type === null) {
    // Parsing a number
    statement = parseWhitespace(statement);
    value = parseNumber(statement.rest);
    if (value.type === null) {
      value = parseIdentifier(statement.rest);
    }
  }

  if (value.type === null) {
    return returnObject;
  }

  var endOfStatement = parseSemiColon(value.rest);

  if (endOfStatement.type === null) {
    return returnObject;
  }

  returnObject.value = value;
  returnObject.type = "declaration";
  returnObject.keyword = keyword.value;
  returnObject.operator = operator.value;
  returnObject.identifier = identifier.value;
  returnObject.rest = endOfStatement.rest;

  return returnObject;
}

function parsePrint (statement) {
  var returnObject = {
    type: null,
    rest: statement
  }

  // Parsing the keyword
  statement = parseWhitespace(statement);
  var keyword = parseKeyword(statement.rest);
  if (keyword.type === null || keyword.value !== "print") {
    return returnObject;
  }

  // Parsing the print function parameter (either an identifier or number)
  statement = keyword.rest;
  var value = parseOperation (statement);

  if (value.type === null) {
    // Parsing a number
    statement = parseWhitespace(statement);
    value = parseNumber(statement.rest);
    if (value.type === null) {
      value = parseIdentifier(statement.rest);
    }
  }

  if (value.type === null) {
    return returnObject;
  }

  var endOfStatement = parseSemiColon(value.rest);

  if (endOfStatement.type === null) {
    return returnObject;
  }

  returnObject.value = value;
  returnObject.type = "print";
  returnObject.keyword = keyword.value;
  returnObject.rest = endOfStatement.rest;

  return returnObject;
}

function parsePrintAsChar (statement) {
  var returnObject = {
    type: null,
    rest: statement
  }

  // Parsing the keyword
  statement = parseWhitespace(statement);
  var keyword = parseKeyword(statement.rest);
  if (keyword.type === null || keyword.value !== "printAsChar") {
    return returnObject;
  }

  // Parsing the print function parameter (either an identifier or number)
  statement = keyword.rest;
  var value = parseOperation (statement);

  if (value.type === null) {
    // Parsing a number
    statement = parseWhitespace(statement);
    value = parseNumber(statement.rest);
    if (value.type === null) {
      value = parseIdentifier(statement.rest);
    }
  }

  if (value.type === null) {
    return returnObject;
  }

  var endOfStatement = parseSemiColon(value.rest);

  if (endOfStatement.type === null) {
    return returnObject;
  }
  returnObject.value = value;
  returnObject.type = "printAsChar";
  returnObject.keyword = keyword.value;
  returnObject.rest = endOfStatement.rest;

  return returnObject;
}

function parseAssignment (statement) {
  var returnObject = {
    type: null,
    rest: statement
  };

  // Parsing the identifier
  statement = parseWhitespace(statement);
  var identifier = parseIdentifier(statement.rest);

  if (identifier.type === null) {
    return returnObject;
  }

  // Parsing an operator
  statement = parseWhitespace(identifier.rest)
  var operator = parseOperator(statement.rest, true);
  if (operator.type === null) {
    return returnObject;
  }

  // returnObject.operator = operator.value;
  statement = operator.rest;
  var value = parseOperation (statement);

  if (value.type === null) {
    // Parsing a number
    statement = parseWhitespace(statement);
    value = parseNumber(statement.rest);
    if (value.type === null) {
      value = parseIdentifier(statement.rest);
    }
  }

  if (value.type === null) {
    return returnObject;
  }

  var endOfStatement = parseSemiColon(value.rest);

  if (endOfStatement.type === null) {
    return returnObject;
  }

  returnObject.value = value;
  returnObject.type = "assignment";
  returnObject.operator = operator.value;
  returnObject.identifier = identifier.value;
  returnObject.rest = endOfStatement.rest;

  return returnObject;
}

function parseSemiColon (input) {
  returnObject = {
    type: null,
    rest: input
  }

  if (input[0] === ";") {
    returnObject.rest = input.slice(1);
    returnObject.type = "EoS";
  }

  return returnObject;
}

function parseOperation (input) {
  var returnObject = {
    type: null,
    rest: input
  }

  input = parseWhitespace(input);
  var left = parseNumber(input.rest);
  if (left.type === null) {
    left = parseIdentifier(input.rest);
  }

  if (left.type === null) {
    return returnObject;
  }

  input = parseWhitespace(left.rest);

  var operator = parseOperator(input.rest, false);
  if (operator.type === null) {
    return returnObject;
  }

  input = parseWhitespace(operator.rest);
  var right = parseNumber (input.rest);

  if (right.type === null) {
    right = parseIdentifier(input.rest);
  }

  if (right.type === null) {
    return returnObject;
  }

  returnObject.right = right;
  returnObject.left = left;
  returnObject.operator = operator.value;
  returnObject.rest = right.rest;
  returnObject.type = "binexp";

  return returnObject;
}

module.exports = {
  parseNumber,
  parseIdentifier,
  parseDeclaration,
  parseProgram,
  mainCompile
}