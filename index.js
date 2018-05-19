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
    value: null
  }

  var inputSplit = input.split(" "); 
  var keyword = inputSplit[0];
  if (KEYWORDS.includes(keyword)) {
    returnObject.type = "keyword";
    returnObject.value = keyword;
  }

  return returnObject;
}

function parseNumber (input) {
  var strNum = "";
  var returnObject = {
    type: null,
    value: null
  }

  var digit = parseDigit(input);
  if (digit.type !== null) {
    returnObject.type = "number";
    while (digit.type !== null) {
      strNum += digit.value;
      digit = parseDigit(digit.rest);
    }

    returnObject.value = Number(strNum);
  }

  return returnObject;
}

function parseOperator (input) {
  const VALID_OPERATORS = ["="];
  var returnObject = {
    type: null,
    value: null
  }
 
  var operator = input[0];

  if (VALID_OPERATORS.includes(operator)) {
    returnObject.type = "operator";
    returnObject.value = operator;  
  }

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
    value: null
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
  }

  return returnObject;
}

function parseDeclaration (statement) {
  // Parsing Counter which stores the positions
  // of what to pass next in a valid declaration.
  // E.g: parsingCounter at 0 is looking for an identifier
  var parsingCounter = 0;
  var returnObject = {
    type: "declaration",
    keyword: null,
    identifier: null,
    operator: null,
    value: null
  };

  var statementSplit = statement.split(" ");
  console.log(statementSplit[0]);

  // Parsing the keyword
  var keyword = parseKeyword(statementSplit[0]);
  returnObject.keyword = keyword;

  // Parsing the identifier
  var identifier = parseIdentifier(statementSplit[1]);
  returnObject.identifier = identifier; 

  // Parsing an operator
  var operator = parseOperator(statementSplit[2]);
  returnObject.operator = operator; 

  // Parsing a number
  console.log(statement[1]);
  var value = parseNumber(statementSplit[3]);
  returnObject.value = value; 

  return returnObject;
}

module.exports = {
  parseNumber,
  parseIdentifier,
  parseDeclaration
}