# 8005-Programming-Language

## What the 8005 Microprocessor Instruction Set Looks like
<ol start="0">
  <li>Halt</li>
  <li>Increment R0 (R0 = R0 + 1)</li>
  <li>Decrement R0 (R0 = R0 - 1)</li>
  <li>Increment R1 (R1 = R1 + 1)</li>
  <li>Decrement R1 (R1 = R1 - 1)</li>
  <li>Add (R0 = R0 + R1)</li>
  <li>Subtract (R0 = R0 - R1)</li>
  <li>Print R0</li>
  <li>Jump to address <data> if R0 != 0</li>
  <li>Jump to address <data> if R0 == 0</li>
  <li>Load <data> in to R0</li>
  <li>Load <data> in to R1</li>
  <li>Store R0 into address <data></li>
  <li>Store R1 into address <data></li>
  <li>Swap R0 and address <data></li>
  <li>Swap R1 and address <data></li>
  <li>Ring the bell!</li>
  <li>Print R0 as an ASCII character</li>
</ol>

Currently, Panda does not support functionality to compile some code into some of these instructions but this has been provided as a reference
## Installation
### Installing Panda

To install Panda, perform the following commands
```
npm i 8005-panda-lang -g
```

Voila! You have successfully installed Panda!

## Usage
### Compiling Panda files

- Valid Panda files have the .pan file extension
- To compile a .pan file simply perform the following

```
panda fileName.pan
```

## Details
### Baseline Features

- My programming language allows users to use basic declaration statements with addition     and subtraction

- My compiler successfully parses the code written in my programming language and prints     out all the 8005 machine code

- My programming language is elegant and easy to use

- My programming language allows users to use the print as a number function

## The Grammar/Syntax
### Keywords

- "new" = Variable Declaration
- "print" = Print as unsigned char
- "printAsChar" = Prints a decimal value as it's ASCII equivalent

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

- Make sure you don't use floats in your code

- Make sure there is no space between the last part of the statement and semi colon

### HOW TO: Assignments

Samples of valid variable assignments are listed below

```
variableName1 = 13;
variableName2 = variableName1;
variableName3 = variableName1 + 3;
```
Restrictions in Panda for assignments

- Inability to assign a value to more than 2 values in a binary expression
- Only numerical values

Things to keep in mind when assigning variables in Panda

- Make sure that you don't have variables which exceed over 256 or are under 0 otherwise the code will parse but you will have buggy machine code

- Make sure you don't use floats in your code

- Make sure there is no space between the last part of the statement and semi colo### HOW TO: Assignments

### HOW TO: Print as Int

Samples of valid print calls are listed below

```
print 13;
print variable;
```
Restrictions in Panda for print

- Inability to print binary expressions
- Only numerical values

Things to keep in mind when printing in Panda

- Make sure that you don't have variables which exceed over 256 or are under 0 otherwise the code will parse but you will have buggy machine code

- Make sure you don't use floats in your code

- Make sure there is no space between the last part of the statement and semi colon

### HOW TO: Print Int as Char

Samples of valid printAsChar calls are listed below

```
printAsChar 65;
printAsChar variable
```
Restrictions in Panda for printAsChar

- Inability to print binary expressions
- Only numerical values

Things to keep in mind when printing as char in Panda

- Make sure that you don't have variables which exceed over 256 or are under 0 otherwise the code will parse but you will have buggy machine code

- Make sure you don't use floats in your code

- Make sure there is no space between the last part of the statement and semi colon

## Final example

test.pan
```
new i = 13;
print i;

i = i + 60;
printAsChar i;
```

In your terminal perform the following
```
panda test.pan
```