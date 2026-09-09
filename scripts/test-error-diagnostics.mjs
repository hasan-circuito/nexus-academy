// scripts/test-error-diagnostics.mjs
// NEXUS Academy — Contextual Error Diagnostic Engine Automated Test Suite

import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const jiti = require('jiti')(process.cwd());
const { PythonErrorInterpreter } = jiti('./engines/python/PythonErrorInterpreter.ts');

console.log('\n======================================================');
console.log('🩺 NEXUS ACADEMY — CONTEXTUAL ERROR DIAGNOSTICS SUITE');
console.log('======================================================\n');

let totalAssertions = 0;
let passedAssertions = 0;
let failedAssertions = 0;

function assert(condition, message) {
  totalAssertions++;
  if (condition) {
    passedAssertions++;
    console.log(`  ✓ ${message}`);
  } else {
    failedAssertions++;
    console.error(`  ❌ FAILED: ${message}`);
  }
}

// -----------------------------------------------------------------------------
// Test 1: User's Exact Screenshot Scenario ('price'=int(input(...)))
// -----------------------------------------------------------------------------
console.log('🔍 Test 1: Quoted Variable Assignment (User Screenshot Reproduction)...');
const userCode = `'price'=int(input("Product price"))
'quantity'=int(input("Quantity"))
Total = 'price'*'quantity'
print("Total cost is", Total)`;

const userStderr = `Traceback (most recent call last):
  File "<exec>", line 1, in <module>
    'price'=int(input("Product price"))
SyntaxError: cannot assign to literal here. Maybe you meant '==' instead of '='?`;

const res1 = PythonErrorInterpreter.interpret(userStderr, 'SyntaxError', userCode);
assert(res1 !== null, 'Returned an interpretation');
assert(res1?.errorSubType === 'QUOTED_VARIABLE', 'Identified as QUOTED_VARIABLE error');
assert(res1?.lineNumber === 1, 'Extracted exact lineNumber = 1');
assert(res1?.offendingLine === '\'price\'=int(input("Product price"))', 'Captured exact offendingLine');
assert(res1?.suggestedFix === 'price = int(input("Product price"))', 'Generated exact 1-line suggested fix without quotes');
assert(res1?.relatedDictionaryTermId === 'variables', 'Linked to variables dictionary term');
assert(res1?.banglaTitle?.includes('কোটেশন'), 'Title explains quoted variable issue in Bengali');
assert(res1?.whyItHappened?.includes('price'), 'Why section specifically mentions variable name price');

// -----------------------------------------------------------------------------
// Test 2: Space in Variable Name
// -----------------------------------------------------------------------------
console.log('\n🔍 Test 2: Space in Variable Name (total cost = 500)...');
const spaceCode = `total cost = 500
print(total cost)`;
const spaceStderr = `  File "<exec>", line 1
    total cost = 500
          ^
SyntaxError: invalid syntax`;

const res2 = PythonErrorInterpreter.interpret(spaceStderr, 'SyntaxError', spaceCode);
assert(res2?.errorSubType === 'SPACE_IN_VARIABLE_NAME', 'Identified as SPACE_IN_VARIABLE_NAME');
assert(res2?.lineNumber === 1, 'Extracted line 1');
assert(res2?.suggestedFix === 'total_cost = 500', 'Suggested snake_case fix total_cost = 500');
assert(res2?.banglaTitle?.includes('স্পেস'), 'Title highlights space in variable name');

// -----------------------------------------------------------------------------
// Test 3: Multiplying Two Strings ('price' * 'quantity')
// -----------------------------------------------------------------------------
console.log('\n🔍 Test 3: String Multiplication (Total = \'price\'*\'quantity\')...');
const multCode = `price = 50
quantity = 2
Total = 'price'*'quantity'
print(Total)`;
const multStderr = `Traceback (most recent call last):
  File "<exec>", line 3, in <module>
    Total = 'price'*'quantity'
TypeError: can't multiply sequence by non-int of type 'str'`;

const res3 = PythonErrorInterpreter.interpret(multStderr, 'TypeError', multCode);
assert(res3?.errorSubType === 'STRING_MULTIPLICATION', 'Identified as STRING_MULTIPLICATION');
assert(res3?.lineNumber === 3, 'Extracted line 3');
assert(res3?.suggestedFix === 'Total = price * quantity', 'Generated clean suggested fix removing quotes');
assert(res3?.banglaTitle?.includes('টেক্সট গুণন'), 'Title explains string multiplication');

// -----------------------------------------------------------------------------
// Test 4: Concatenating String and Int
// -----------------------------------------------------------------------------
console.log('\n🔍 Test 4: String + Int Concatenation...');
const concatCode = `total = 500
print("Total cost is: " + total)`;
const concatStderr = `Traceback (most recent call last):
  File "<exec>", line 2, in <module>
    print("Total cost is: " + total)
TypeError: can only concatenate str (not "int") to str`;

const res4 = PythonErrorInterpreter.interpret(concatStderr, 'TypeError', concatCode);
assert(res4?.errorSubType === 'STRING_INT_CONCAT', 'Identified as STRING_INT_CONCAT');
assert(res4?.lineNumber === 2, 'Extracted line 2');
assert(res4?.suggestedFix === 'print("Total cost is: ", total)', 'Suggested comma replacement for print');

// -----------------------------------------------------------------------------
// Test 5: NameError with dynamic variable name
// -----------------------------------------------------------------------------
console.log('\n🔍 Test 5: NameError with Dynamic Variable Name...');
const nameCode = `price = 100
print(prce)`;
const nameStderr = `Traceback (most recent call last):
  File "<exec>", line 2, in <module>
    print(prce)
NameError: name 'prce' is not defined`;

const res5 = PythonErrorInterpreter.interpret(nameStderr, 'NameError', nameCode);
assert(res5?.errorSubType === 'UNDEFINED_NAME', 'Identified as UNDEFINED_NAME');
assert(res5?.lineNumber === 2, 'Extracted line 2');
assert(res5?.banglaTitle?.includes('prce'), 'Title includes the misspelled variable name prce');
assert(res5?.whyItHappened?.includes('prce'), 'Explanation mentions prce');

// -----------------------------------------------------------------------------
// Test 6: Unterminated String Literal
// -----------------------------------------------------------------------------
console.log('\n🔍 Test 6: Unterminated String Literal...');
const untermCode = `print("Hello World)`;
const untermStderr = `  File "<exec>", line 1
    print("Hello World)
          ^
SyntaxError: unterminated string literal (detected at line 1)`;

const res6 = PythonErrorInterpreter.interpret(untermStderr, 'SyntaxError', untermCode);
assert(res6?.errorSubType === 'UNTERMINATED_STRING', 'Identified as UNTERMINATED_STRING');
assert(res6?.lineNumber === 1, 'Extracted line 1');
assert(res6?.suggestedFix === 'print("Hello World)"', 'Appended closing quote in suggested fix');

// -----------------------------------------------------------------------------
// Test 7: Missing Colon on Control Flow
// -----------------------------------------------------------------------------
console.log('\n🔍 Test 7: Missing Colon on Control Flow...');
const colonCode = `age = 20
if age >= 18
    print("Allowed")`;
const colonStderr = `  File "<exec>", line 2
    if age >= 18
                ^
SyntaxError: expected ':'`;

const res7 = PythonErrorInterpreter.interpret(colonStderr, 'SyntaxError', colonCode);
assert(res7?.errorSubType === 'MISSING_COLON', 'Identified as MISSING_COLON');
assert(res7?.lineNumber === 2, 'Extracted line 2');
assert(res7?.suggestedFix === 'if age >= 18:', 'Appended colon in suggested fix');

// -----------------------------------------------------------------------------
// Test 8: IndentationError
// -----------------------------------------------------------------------------
console.log('\n🔍 Test 8: IndentationError...');
const indentCode = `if True:
print("Hi")`;
const indentStderr = `  File "<exec>", line 2
    print("Hi")
    ^
IndentationError: expected an indented block after 'if' statement on line 1`;

const res8 = PythonErrorInterpreter.interpret(indentStderr, 'IndentationError', indentCode);
assert(res8?.errorSubType === 'INDENTATION_MISMATCH', 'Identified as INDENTATION_MISMATCH');
assert(res8?.lineNumber === 2, 'Extracted line 2');

// -----------------------------------------------------------------------------
// Test 9: Input Arithmetic without int()
// -----------------------------------------------------------------------------
console.log('\n🔍 Test 9: Input Arithmetic without int()...');
const inputArithStderr = `Traceback (most recent call last):
  File "<exec>", line 2, in <module>
    balance = initial - spent
TypeError: unsupported operand type(s) for -: 'str' and 'int'`;

const res9 = PythonErrorInterpreter.interpret(inputArithStderr, 'TypeError');
assert(res9?.errorSubType === 'STR_ARITHMETIC_NO_INT', 'Identified as STR_ARITHMETIC_NO_INT');
assert(res9?.relatedDictionaryTermId === 'type_conversion', 'Linked to type_conversion');

// -----------------------------------------------------------------------------
// Test 10: ValueError on non-numeric input to int()
// -----------------------------------------------------------------------------
console.log('\n🔍 Test 10: Non-numeric Input to int()...');
const valStderr = `ValueError: invalid literal for int() with base 10: 'Hasan'`;
const res10 = PythonErrorInterpreter.interpret(valStderr, 'ValueError');
assert(res10?.errorSubType === 'INVALID_INT_LITERAL', 'Identified as INVALID_INT_LITERAL');
assert(res10?.whyItHappened?.includes('Hasan'), 'Mentions the invalid input Hasan');

// -----------------------------------------------------------------------------
// Test 11: ZeroDivisionError
// -----------------------------------------------------------------------------
console.log('\n🔍 Test 11: ZeroDivisionError...');
const zeroStderr = `ZeroDivisionError: division by zero`;
const res11 = PythonErrorInterpreter.interpret(zeroStderr, 'ZeroDivisionError');
assert(res11?.errorSubType === 'ZERO_DIVISION', 'Identified as ZERO_DIVISION');

// -----------------------------------------------------------------------------
// Test 12: Assignment in Condition (if x = 5)
// -----------------------------------------------------------------------------
console.log('\n🔍 Test 12: Assignment in Condition (= instead of ==)...');
const ifAssignCode = `if score = 100:
    print("Perfect")`;
const ifAssignStderr = `  File "<exec>", line 1
    if score = 100:
             ^
SyntaxError: invalid syntax`;

const res12 = PythonErrorInterpreter.interpret(ifAssignStderr, 'SyntaxError', ifAssignCode);
assert(res12?.errorSubType === 'ASSIGNMENT_IN_CONDITION', 'Identified as ASSIGNMENT_IN_CONDITION');
assert(res12?.suggestedFix === 'if score == 100:', 'Replaced = with == in suggested fix');

// -----------------------------------------------------------------------------
// Test 13: Unclosed Parenthesis
// -----------------------------------------------------------------------------
console.log('\n🔍 Test 13: Unclosed Parenthesis...');
const parenCode = `print(int(input("Enter number: "))`;
const parenStderr = `  File "<exec>", line 1
    print(int(input("Enter number: "))
         ^
SyntaxError: '(' was never closed`;

const res13 = PythonErrorInterpreter.interpret(parenStderr, 'SyntaxError', parenCode);
assert(res13?.errorSubType === 'UNCLOSED_PARENTHESIS', 'Identified as UNCLOSED_PARENTHESIS');
assert(res13?.suggestedFix === 'print(int(input("Enter number: ")))', 'Closed matching missing parenthesis');

// -----------------------------------------------------------------------------
// Test 14: Execution Timeout
// -----------------------------------------------------------------------------
console.log('\n🔍 Test 14: Execution Timeout...');
const timeoutStderr = `Execution timed out after 5000ms`;
const res14 = PythonErrorInterpreter.interpret(timeoutStderr, 'TimeoutError');
assert(res14?.errorType === 'TimeoutError', 'Identified TimeoutError');
assert(res14?.banglaTitle?.includes('টাইমআউট'), 'Bangla title contains Timeout');

// -----------------------------------------------------------------------------
// Test 15: Fallback for Unknown Error with line extraction
// -----------------------------------------------------------------------------
console.log('\n🔍 Test 15: Unknown Error Fallback with Line Extraction...');
const unknownStderr = `Traceback (most recent call last):
  File "<exec>", line 4, in <module>
    raise SpecialCustomError("custom issue")
SpecialCustomError: custom issue`;
const res15 = PythonErrorInterpreter.interpret(unknownStderr, 'SpecialCustomError');
assert(res15?.errorType === 'SpecialCustomError', 'Extracted SpecialCustomError');
assert(res15?.lineNumber === 4, 'Extracted line 4 for unknown error');

console.log('\n======================================================');
console.log(`📊 ERROR DIAGNOSTICS VALIDATION SUMMARY:`);
console.log(`  Total Assertions Tested : ${totalAssertions}`);
console.log(`  Passed                  : ${passedAssertions} (✓)`);
console.log(`  Failed                  : ${failedAssertions} (✗)`);
console.log('======================================================\n');

if (failedAssertions > 0) {
  console.error('❌ Diagnostics suite failed.');
  process.exit(1);
} else {
  console.log('🎉 ALL 15 DIAGNOSTIC PATTERNS & MICRO-ERROR MATCHERS PASSED 100%!\n');
  process.exit(0);
}
