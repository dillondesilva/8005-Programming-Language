# 8005-Programming-Language 

## Details
### Baseline Features

- My programming language allows users to use basic declaration statements with addition     and subtraction

- My compiler successfully parses the code written in my programming language and prints     out all the 8005 machine code

- My programming language is elegant and easy to use

- My programming language allows users to use the print as a number function

## The Grammar
### Keywords

- "new" = Variable Declaration
- "print" = Print as unsigned char
 
### Operators

- "=" = Assignment 
- "-" = Decrement
- "+" = Increment

### Terminals

- " " = Whitespace
- ";" = End of statement

### Functions

- "print" = Print

## Documentation
### HOW TO: Declarations

Samples of valid variable declarations are listed below

```
new variableName1 = 13;
new variableName2 = variableName1;
new variableName3 = variableName1 + 3;
```

Restrictions in Panda for declaring variables 

- Inability to assign a value to more than 2 values in a binary expression
- Only numerical values 

Things to keep in mind when declaring variables in Panda

- Make sure that you don't have variables which exceed over 256 or are under 0 otherwise the code will parse but you will have buggy machine code

- Make sure there is no space between the last part of the statement and semi colon

### HOW TO: Assignments

Samples of valid variable assignments are listed below

```
new variableName1 = 13;
new variableName2 = variableName1;
new variableName3 = variableName1 + 3;
```
Restrictions in Panda for assignments

- Inability to assign a value to more than 2 values in a binary expression
- Only numerical values 

Things to keep in mind when assigning variables in Panda

- Make sure that you don't have variables which exceed over 256 or are under 0 otherwise the code will parse but you will have buggy machine code

- Make sure there is no space between the last part of the statement and semi colon


