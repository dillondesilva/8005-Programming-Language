function compileDeclaration (declarationTree) {
  console.log("Beginning Code Generation for Variable Declaration");
  console.log("Declaration Value is " + declarationTree.value.value);
  console.log("Declaration identifier is ", declarationTree.identifier);
}

function chooseInstructionSet(programTree) {
  if (programTree.type === "declaration") {
    compileDeclaration(programTree);
  } else {
    console.log("Error trying to compile");
    return 
  }
}

function mainCompile (program) {
  var programTrees = parseProgram(program);
  // Loop over all the tree structures formed from each line
  // and perform actions
  for (var i in programTrees) {
    chooseInstructionSet(programTrees[i]);
  }
}

function parseProgram (input) {
  var statement = parseDeclaration(input);
  var programTrees = [];

  // new a = 10; a
  while (statement.type !== null) {
    programTrees.push(statement);
    statement = parseDeclaration(statement.rest);
  }

  if (statement.rest !== "") {
    console.log("Error compiling. Line is " + statement.rest);
    return;
  } 

  console.log("Program successfully parsed!");
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
  const KEYWORDS = ["new", "if", "else", "num", "char"];
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
  const VALID_ARITHMETIC_OPERATORS = ["+", "-", "*"];

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

  var statementSplit = statement.split(" ");

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
  returnObject.type = "declaration";
  returnObject.keyword = keyword.value;
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