// engines/python/PythonErrorInterpreter.ts
// NEXUS Academy — Python Error Interpreter Engine

import { ErrorInterpretation } from './python.types';
import errorKnowledgeBase from '../../data/python-errors.json';

export class PythonErrorInterpreter {
  /**
   * Translates a raw Python error into a beginner-friendly Bangla explanation,
   * pinpointing line numbers, the user's offending line of code, and providing
   * context-aware 1-line suggested fixes.
   */
  public static interpret(
    stderr: string, 
    errorType?: string, 
    sourceCode?: string
  ): ErrorInterpretation | null {
    if (!stderr) return null;

    // Handle Timeouts specifically
    if (errorType === 'TimeoutError' || stderr.includes('Execution timed out')) {
      return {
        errorType: 'TimeoutError',
        originalError: 'Execution timed out',
        banglaTitle: 'টাইমআউট এরর (Timeout Error)',
        explanation: 'তোমার কোডটি চলতে অনেক বেশি সময় নিচ্ছে, তাই এটি বন্ধ করে দেওয়া হয়েছে।',
        whyItHappened: 'সাধারণত ইনফিনিট লুপ (যেমন while True) থাকলে বা কোডটি খুব জটিল হলে এমন হয়।',
        howToFix: 'লুপগুলো চেক করো, দেখো লুপ শেষ হওয়ার কোনো শর্ত দেওয়া আছে কিনা।',
        correctedExample: 'ভুল: while True:\n    pass\n\nসঠিক: while x < 10:\n    x += 1',
        relatedDictionaryTermId: 'loops'
      };
    }

    // Step 1: Extract Line Number
    const lineNumber = PythonErrorInterpreter.extractLineNumber(stderr);

    // Step 2: Extract Offending Line of Code
    const offendingLine = PythonErrorInterpreter.extractOffendingLine(stderr, lineNumber, sourceCode);

    // Step 3: Extract Error Type
    let extractedType = errorType;
    if (!extractedType) {
      const match = stderr.match(/([a-zA-Z0-9]+Error):/);
      if (match) {
        extractedType = match[1];
      } else if (stderr.includes('SyntaxError')) {
        extractedType = 'SyntaxError';
      } else if (stderr.includes('IndentationError')) {
        extractedType = 'IndentationError';
      }
    }

    // Step 4: Run Micro-Diagnostic Pattern Matchers (High Precision)
    const microDiagnostic = PythonErrorInterpreter.matchMicroDiagnostics(
      stderr, 
      extractedType, 
      lineNumber, 
      offendingLine
    );

    if (microDiagnostic) {
      return microDiagnostic;
    }

    if (!extractedType) return null;

    // Step 5: Look up in knowledge base as fallback
    const knownError = (errorKnowledgeBase as ErrorInterpretation[]).find(
      (e) => e.errorType === extractedType
    );

    if (knownError) {
      return {
        ...knownError,
        originalError: stderr,
        lineNumber,
        offendingLine,
      };
    }

    // Fallback for unknown errors
    return {
      errorType: extractedType,
      originalError: stderr,
      banglaTitle: 'অজানা এরর (Unknown Error)',
      explanation: 'তোমার কোডে একটি সমস্যা হয়েছে যা আমি সঠিকভাবে বুঝতে পারছি না।',
      whyItHappened: 'এটি পাইথনের একটি ত্রুটি। নিচের মূল এরর মেসেজ ও লাইন নম্বর দেখে বোঝার চেষ্টা করো।',
      howToFix: 'কোডটি ভালোভাবে চেক করো এবং ভুল লাইনটিতে কোনো বানানের বা সিনট্যাক্সের সমস্যা আছে কিনা দেখো।',
      correctedExample: '',
      lineNumber,
      offendingLine,
    };
  }

  /**
   * Extracts the 1-based line number from a Python traceback string.
   */
  public static extractLineNumber(stderr: string): number | undefined {
    // Matches: File "<exec>", line 2 or File "<string>", line 4
    const fileLineMatch = stderr.match(/File\s+["'][^"']+["'],\s+line\s+(\d+)/i);
    if (fileLineMatch) {
      return parseInt(fileLineMatch[1], 10);
    }

    // Fallback: line 4
    const genericLineMatch = stderr.match(/\bline\s+(\d+)\b/i);
    if (genericLineMatch) {
      return parseInt(genericLineMatch[1], 10);
    }

    return undefined;
  }

  /**
   * Extracts the offending line of code from sourceCode or from traceback.
   */
  public static extractOffendingLine(
    stderr: string, 
    lineNumber?: number, 
    sourceCode?: string
  ): string | undefined {
    if (sourceCode && lineNumber && lineNumber >= 1) {
      const lines = sourceCode.split(/\r?\n/);
      if (lineNumber <= lines.length) {
        const line = lines[lineNumber - 1];
        if (line !== undefined) return line.trim();
      }
    }

    // Attempt traceback extraction: look for code lines following "line X"
    const tbLines = stderr.split(/\r?\n/);
    for (let i = 0; i < tbLines.length; i++) {
      const l = tbLines[i];
      if (l.includes('line ') && (l.includes('File ') || l.trim().startsWith('File '))) {
        for (let j = i + 1; j < Math.min(i + 4, tbLines.length); j++) {
          const candidate = tbLines[j].trim();
          if (
            candidate && 
            !candidate.startsWith('^') && 
            !candidate.endsWith('Error:') && 
            !candidate.includes('Error:') &&
            !candidate.startsWith('Traceback')
          ) {
            return candidate;
          }
        }
      }
    }

    return undefined;
  }

  /**
   * Micro-diagnostics matching 13 frequent beginner mistake patterns.
   */
  private static matchMicroDiagnostics(
    stderr: string,
    errorType?: string,
    lineNumber?: number,
    offendingLine?: string
  ): ErrorInterpretation | null {
    const rawLower = stderr.toLowerCase();
    const line = offendingLine || '';

    // =========================================================================
    // Pattern 1: Quoted variable assignment ('price' = 100 or "total" = ...)
    // =========================================================================
    const quotedAssignRegex = /^\s*(['"])([a-zA-Z_]\w*)\1\s*=(.*)$/;
    if (
      rawLower.includes('cannot assign to literal') || 
      rawLower.includes("can't assign to literal") ||
      quotedAssignRegex.test(line)
    ) {
      let varName = 'variable';
      let suggestedFix: string | undefined = undefined;

      const m = line.match(quotedAssignRegex);
      if (m) {
        varName = m[2];
        const val = m[3].trim();
        suggestedFix = `${varName} = ${val}`;
      } else {
        const anyQuoteMatch = line.match(/(['"])([a-zA-Z_]\w*)\1\s*=/);
        if (anyQuoteMatch) {
          varName = anyQuoteMatch[2];
          suggestedFix = line.replace(/(['"])([a-zA-Z_]\w*)\1\s*=/, `${varName} =`);
        }
      }

      return {
        errorType: 'SyntaxError',
        errorSubType: 'QUOTED_VARIABLE',
        originalError: stderr,
        lineNumber,
        offendingLine,
        suggestedFix,
        banglaTitle: 'ভেরিয়েবলের নামের চারপাশে কোটেশন এরর (Quoted Variable Error)',
        explanation: 'ভেরিয়েবলের নামের চারপাশে কোটেশন (\' বা ") দেওয়া যাবে না। পাইথনে কোটেশন দিলে তা ভেরিয়েবল না হয়ে সাধারণ লেখা (String) হয়ে যায়—আর সাধারণ লেখার ভেতরে কোনো মান রাখা যায় না।',
        whyItHappened: `তুমি ভেরিয়েবলের নাম '${varName}' কে কোটেশনের মধ্যে লিখেছো। পাইথন ভাবছে তুমি একটি স্ট্রিং টেক্সটের ভেতর মান সংরক্ষণ করতে চাইছো, যা পাইথনে ব্যাকরণগতভাবে অসম্ভব।`,
        howToFix: `ভেরিয়েবলের নাম থেকে কোটেশন চিহ্ন মুছে দাও। ভেরিয়েবলের নাম সবসময় সরাসরি লিখতে হয়, যেমন: ${varName} = ...`,
        correctedExample: `ভুল: '${varName}' = 100\nসঠিক: ${varName} = 100`,
        relatedDictionaryTermId: 'variables'
      };
    }

    // =========================================================================
    // Pattern 2: Space in variable name (Total price = 100 or user name = ...)
    // =========================================================================
    const spaceInVarRegex = /^\s*([a-zA-Z_]\w*(?:\s+[a-zA-Z_]\w*)+)\s*=(.*)$/;
    if (
      (rawLower.includes('invalid syntax') || errorType === 'SyntaxError') &&
      spaceInVarRegex.test(line) &&
      !line.startsWith('if ') && !line.startsWith('elif ') && !line.startsWith('while ')
    ) {
      const m = line.match(spaceInVarRegex);
      let suggestedFix: string | undefined = undefined;
      let varWithSpaces = '';
      if (m) {
        varWithSpaces = m[1].trim();
        const snakeCase = varWithSpaces.replace(/\s+/g, '_').toLowerCase();
        const val = m[2].trim();
        suggestedFix = `${snakeCase} = ${val}`;
      }

      return {
        errorType: 'SyntaxError',
        errorSubType: 'SPACE_IN_VARIABLE_NAME',
        originalError: stderr,
        lineNumber,
        offendingLine,
        suggestedFix,
        banglaTitle: 'ভেরিয়েবলের নামে স্পেস এরর (Space in Variable Name)',
        explanation: 'ভেরিয়েবলের নামের মাঝে স্পেস (ফাঁকা জায়গা) ব্যবহার করা যায় না। পাইথন স্পেস দেখলে একাধিক ভিন্ন শব্দ মনে করে সিনট্যাক্স এরর দেয়।',
        whyItHappened: `তুমি '${varWithSpaces}' ভেরিয়েবলের নামের মাঝে স্পেস ব্যবহার করেছো।`,
        howToFix: 'স্পেসের জায়গায় আন্ডারস্কোর (_) ব্যবহার করো অথবা শব্দ দুটি একসাথে মিলিয়ে ছোট হাতের অক্ষরে লেখো (snake_case)।',
        correctedExample: `ভুল: ${varWithSpaces || 'total cost'} = 100\nসঠিক: ${(varWithSpaces || 'total cost').replace(/\s+/g, '_').toLowerCase()} = 100`,
        relatedDictionaryTermId: 'variables'
      };
    }

    // =========================================================================
    // Pattern 3: Multiplying two strings (e.g., 'price' * 'quantity' or str * str)
    // =========================================================================
    if (
      rawLower.includes("can't multiply sequence by non-int of type 'str'") ||
      rawLower.includes("can't multiply sequence")
    ) {
      let suggestedFix: string | undefined = undefined;
      const quotedMultMatch = line.match(/(['"])([a-zA-Z_]\w*)\1\s*\*\s*(['"])([a-zA-Z_]\w*)\3/);
      if (quotedMultMatch) {
        suggestedFix = line.replace(
          /(['"])([a-zA-Z_]\w*)\1\s*\*\s*(['"])([a-zA-Z_]\w*)\3/, 
          `${quotedMultMatch[2]} * ${quotedMultMatch[4]}`
        );
      }

      return {
        errorType: 'TypeError',
        errorSubType: 'STRING_MULTIPLICATION',
        originalError: stderr,
        lineNumber,
        offendingLine,
        suggestedFix,
        banglaTitle: 'টেক্সট গুণন এরর (String Multiplication Error)',
        explanation: 'দুটি লেখা বা টেক্সট (String) পরস্পরের সাথে গুণ করা যায় না। পাইথনে গুণ করতে হলে সংখ্যা (int বা float) প্রয়োজন।',
        whyItHappened: 'তুমি ভেরিয়েবলের চারপাশে কোটেশন দিয়েছিলে অথবা দুটি লেখার মধ্যে গুণ চিহ্ন (*) দিয়েছো। এতে পাইথন দুটি টেক্সটকে পরস্পরের সাথে গুণ করতে চেয়ে এরর দিচ্ছে।',
        howToFix: 'ভেরিয়েবলের নাম থেকে কোটেশন চিহ্ন মুছে নাও এবং নিশ্চিত করো উভয় মানই int() দিয়ে সংখ্যায় রূপান্তর করা হয়েছে।',
        correctedExample: 'ভুল: total = \'price\' * \'quantity\'\nসঠিক: total = price * quantity',
        relatedDictionaryTermId: 'data_types'
      };
    }

    // =========================================================================
    // Pattern 4: Concatenating string and int (can only concatenate str to str)
    // =========================================================================
    if (
      rawLower.includes('can only concatenate str') ||
      rawLower.includes('must be str, not int') ||
      rawLower.includes('must be str, not float')
    ) {
      let suggestedFix: string | undefined = undefined;
      if (line.includes('print(') && line.includes('+')) {
        suggestedFix = line.replace(/\s*\+\s*/g, ', ');
      }

      return {
        errorType: 'TypeError',
        errorSubType: 'STRING_INT_CONCAT',
        originalError: stderr,
        lineNumber,
        offendingLine,
        suggestedFix,
        banglaTitle: 'টেক্সট ও সংখ্যার যোগফল এরর (Type Mismatch in +)',
        explanation: 'যোগ চিহ্ন (+) দিয়ে টেক্সট (str) এবং সংখ্যা (int বা float) সরাসরি জোড়া লাগানো যায় না।',
        whyItHappened: 'তুমি \'+\' চিহ্ন দিয়ে লেখার সাথে সরাসরি সংখ্যা যুক্ত করতে চেয়েছো। পাইথন বুঝতে পারছে না এটা গাণিতিক যোগ নাকি টেক্সট জোড়া লাগানো।',
        howToFix: 'print() এর ভেতরে \'+\' এর বদলে কমা (,) ব্যবহার করো—যেমন: print("Total:", total)—অথবা সংখ্যাটিকে str(total) দিয়ে টেক্সটে রূপান্তর করো।',
        correctedExample: 'ভুল: print("Total: " + total)\nসঠিক: print("Total:", total) অথবা print("Total: " + str(total))',
        relatedDictionaryTermId: 'type_conversion'
      };
    }

    // =========================================================================
    // Pattern 5: NameError (name '...' is not defined)
    // =========================================================================
    const nameErrorMatch = stderr.match(/name\s+'([^']+)'\s+is not defined/);
    if (nameErrorMatch || errorType === 'NameError') {
      const varName = nameErrorMatch ? nameErrorMatch[1] : 'ভেরিয়েবল';
      return {
        errorType: 'NameError',
        errorSubType: 'UNDEFINED_NAME',
        originalError: stderr,
        lineNumber,
        offendingLine,
        banglaTitle: `ভেরিয়েবল '${varName}' খুঁজে পাওয়া যায়নি (Undefined Name Error)`,
        explanation: `'${varName}' নামের কোনো ভেরিয়েবল বা ফাংশন পাইথন মেমোরিতে খুঁজে পাচ্ছে না।`,
        whyItHappened: `হয়তো তুমি '${varName}' তৈরি করার আগেই ব্যবহার করছো, অথবা বানানে বা বড়-ছোট হাতের অক্ষরে (Case-sensitivity) ভুল হয়েছে।`,
        howToFix: `'${varName}' এর বানান ও বড়-ছোট হাতের অক্ষর চেক করো। পাইথনে 'Price' আর 'price' কিন্তু দুটি সম্পূর্ণ ভিন্ন জিনিস! আর ভেরিয়েবলটি আগে ডিফাইন করা হয়েছে কিনা নিশ্চিত করো।`,
        correctedExample: `ভুল: print(${varName})\nসঠিক:\n${varName} = 100\nprint(${varName})`,
        relatedDictionaryTermId: 'name_error'
      };
    }

    // =========================================================================
    // Pattern 6: Unterminated string literal (quote not closed)
    // =========================================================================
    if (
      rawLower.includes('unterminated string literal') || 
      rawLower.includes('eol while scanning string literal') ||
      rawLower.includes('unterminated triple-quoted string literal')
    ) {
      let suggestedFix: string | undefined = undefined;
      if (line) {
        if (line.includes('"') && (line.match(/"/g) || []).length % 2 !== 0) {
          suggestedFix = line.trimEnd() + '"';
        } else if (line.includes("'") && (line.match(/'/g) || []).length % 2 !== 0) {
          suggestedFix = line.trimEnd() + "'";
        }
      }

      return {
        errorType: 'SyntaxError',
        errorSubType: 'UNTERMINATED_STRING',
        originalError: stderr,
        lineNumber,
        offendingLine,
        suggestedFix,
        banglaTitle: 'কোটেশন শেষ না করা এরর (Unterminated String)',
        explanation: 'তুমি কোনো লেখা শুরু করার জন্য কোটেশন (\' বা ") দিয়েছিলে, কিন্তু লাইন শেষ হওয়ার আগে তা বন্ধ করতে ভুলে গেছো।',
        whyItHappened: 'কোটেশন চিহ্নের জোড়া মেলেনি (একটি শুরু হয়েছে কিন্তু শেষ হয়নি)।',
        howToFix: 'লাইনের শেষে বা লেখার শেষে প্রয়োজনীয় কোটেশন মার্ক (\' বা ") বসিয়ে দাও।',
        correctedExample: 'ভুল: print("Hello World)\nসঠিক: print("Hello World")',
        relatedDictionaryTermId: 'syntax_error'
      };
    }

    // =========================================================================
    // Pattern 7: Missing Colon (expected ':')
    // =========================================================================
    const isControlFlowLine = /^\s*(?:if|elif|else|while|for|def|class)\b/.test(line);
    if (
      rawLower.includes("expected ':'") || 
      (isControlFlowLine && !line.trimEnd().endsWith(':') && (rawLower.includes('invalid syntax') || errorType === 'SyntaxError'))
    ) {
      const suggestedFix = line ? line.trimEnd() + ':' : undefined;

      return {
        errorType: 'SyntaxError',
        errorSubType: 'MISSING_COLON',
        originalError: stderr,
        lineNumber,
        offendingLine,
        suggestedFix,
        banglaTitle: 'কোলন (:) মিসিং এরর (Missing Colon)',
        explanation: 'পাইথনে if, elif, else, while, for শর্ত বা লুপের লাইনের শেষে একটি কোলন (:) দিতেই হয়।',
        whyItHappened: 'কন্ডিশন বা স্টেটমেন্টের শেষে কোলন (:) দেওয়া হয়নি। পাইথনে কোলন দিয়ে বোঝানো হয় যে এর পরে একটি নতুন ব্লক শুরু হচ্ছে।',
        howToFix: 'লাইনটির একেবারে শেষে একটি কোলন (:) বসিয়ে দাও।',
        correctedExample: 'ভুল: if price > 100\nসঠিক: if price > 100:',
        relatedDictionaryTermId: 'if_else'
      };
    }

    // =========================================================================
    // Pattern 8: Indentation Error
    // =========================================================================
    if (
      errorType === 'IndentationError' || 
      rawLower.includes('indentationerror') ||
      rawLower.includes('expected an indented block') ||
      rawLower.includes('unexpected indent') ||
      rawLower.includes('unindent does not match')
    ) {
      return {
        errorType: 'IndentationError',
        errorSubType: 'INDENTATION_MISMATCH',
        originalError: stderr,
        lineNumber,
        offendingLine,
        banglaTitle: 'ইন্ডেন্টেশন বা ফাঁকা জায়গা এরর (Indentation Error)',
        explanation: 'পাইথনে কোডের লাইনের শুরুতে সঠিক পরিমাণ স্পেস (Indentation) থাকা বাধ্যতামূলক।',
        whyItHappened: 'হয়তো if/else ব্লকের ভেতরের কোডে ৪টি স্পেস দেওয়া হয়নি, অথবা সাধারণ লাইনের শুরুতে অযথা স্পেস পড়ে গেছে।',
        howToFix: 'শর্তের ভেতরের লাইনের শুরুতে ৪টি স্পেস (বা ১টি Tab) দাও। আর সাধারণ লাইনের শুরুতে কোনো অযথা স্পেস থাকলে তা মুছে ফেলো।',
        correctedExample: 'ভুল (শুরুতে স্পেস):\n price = 100\n\nসঠিক:\nprice = 100',
        relatedDictionaryTermId: 'indentation_error'
      };
    }

    // =========================================================================
    // Pattern 9: Unsupported operand type for arithmetic on str (forgot int() on input)
    // =========================================================================
    if (
      rawLower.includes("unsupported operand type(s) for -: 'str'") ||
      rawLower.includes("unsupported operand type(s) for *: 'str' and 'str'") ||
      rawLower.includes("unsupported operand type(s) for /: 'str'") ||
      rawLower.includes("unsupported operand type(s) for //: 'str'") ||
      rawLower.includes("unsupported operand type(s) for %: 'str'")
    ) {
      return {
        errorType: 'TypeError',
        errorSubType: 'STR_ARITHMETIC_NO_INT',
        originalError: stderr,
        lineNumber,
        offendingLine,
        banglaTitle: 'ইনপুট টেক্সটে গাণিতিক হিসাব এরর (Forgot int() on input)',
        explanation: 'input() দিয়ে ইউজার থেকে যা কিছু নেওয়া হয়, তা সবসময় টেক্সট (String) হিসেবে থাকে। টেক্সটের সাথে সরাসরি গাণিতিক হিসাব করা যায় না।',
        whyItHappened: 'input() নেওয়ার পর int() বা float() দিয়ে সংখ্যায় রূপান্তর করা হয়নি। ফলে পাইথন টেক্সটের উপর গণিত করতে গিয়ে এরর দিচ্ছে।',
        howToFix: 'input() এর আগে int() ব্যবহার করো, যেমন: price = int(input("Price: "))',
        correctedExample: 'ভুল: cost = input("Price: ") * 2\nসঠিক: cost = int(input("Price: ")) * 2',
        relatedDictionaryTermId: 'type_conversion'
      };
    }

    // =========================================================================
    // Pattern 10: ValueError on int() (invalid literal for int() with base 10)
    // =========================================================================
    if (rawLower.includes('invalid literal for int() with base 10')) {
      const invalidValMatch = stderr.match(/invalid literal for int\(\) with base 10:\s*'([^']*)'/);
      const invalidVal = invalidValMatch ? invalidValMatch[1] : '';

      return {
        errorType: 'ValueError',
        errorSubType: 'INVALID_INT_LITERAL',
        originalError: stderr,
        lineNumber,
        offendingLine,
        banglaTitle: 'সংখ্যার রূপান্তর ব্যর্থ (Non-Numeric Input to int())',
        explanation: 'int() ফাংশন কেবল সংখ্যার টেক্সটকে (যেমন "100") সংখ্যায় রূপান্তর করতে পারে। কোনো সাধারণ বর্ণ বা বাক্যকে সংখ্যা বানানো যায় না।',
        whyItHappened: invalidVal 
          ? `তুমি '${invalidVal}' কে সংখ্যা বানাতে চেয়েছো, যা কোনো বৈধ পূর্ণসংখ্যা নয়।`
          : 'ইনপুটে সংখ্যার জায়গায় কোনো বর্ণ বা কথা প্রবেশ করানো হয়েছে, অথবা দশমিক সংখ্যা দেওয়া হয়েছে।',
        howToFix: 'ইনপুটে কেবল পূর্ণসংখ্যা (০-৯) দাও। আর যদি দশমিক সংখ্যা নিয়ে কাজ করতে চাও, তবে int() এর বদলে float() ব্যবহার করো।',
        correctedExample: 'ভুল: int("hello")\nসঠিক: int("100") অথবা float("12.5")',
        relatedDictionaryTermId: 'type_conversion'
      };
    }

    // =========================================================================
    // Pattern 11: ZeroDivisionError
    // =========================================================================
    if (
      errorType === 'ZeroDivisionError' ||
      rawLower.includes('zerodivisionerror') ||
      rawLower.includes('division by zero') ||
      rawLower.includes('integer division or modulo by zero')
    ) {
      return {
        errorType: 'ZeroDivisionError',
        errorSubType: 'ZERO_DIVISION',
        originalError: stderr,
        lineNumber,
        offendingLine,
        banglaTitle: 'শূন্য দিয়ে ভাগ এরর (Zero Division Error)',
        explanation: 'গণিতে কোনো সংখ্যাকে শূন্য (0) দিয়ে ভাগ করা অসম্ভব। পাইথনেও 0 দিয়ে / বা % করলে এই এরর হয়।',
        whyItHappened: 'ভাজক (denominator) এর মান 0 দেওয়া হয়েছে।',
        howToFix: 'নিশ্চিত করো যাতে ভাজক কখনো 0 না হয়। প্রয়োজনে if দিয়ে চেক করে নাও (if b != 0: ...)।',
        correctedExample: 'ভুল: 100 / 0\nসঠিক: 100 / 5',
        relatedDictionaryTermId: 'zero_division'
      };
    }

    // =========================================================================
    // Pattern 12: Used = instead of == in condition (if x = 5:)
    // =========================================================================
    const ifAssignRegex = /^\s*(?:if|elif)\s+[^=!<>]*(?:=)[^=]/;
    if (
      (rawLower.includes('invalid syntax') || rawLower.includes('cannot assign to expression')) &&
      ifAssignRegex.test(line)
    ) {
      let suggestedFix: string | undefined = undefined;
      if (line) {
        suggestedFix = line.replace(/([^=!<>\s])\s*=\s*([^=])/, '$1 == $2');
      }

      return {
        errorType: 'SyntaxError',
        errorSubType: 'ASSIGNMENT_IN_CONDITION',
        originalError: stderr,
        lineNumber,
        offendingLine,
        suggestedFix,
        banglaTitle: 'শর্তে অ্যাসাইনমেন্ট ভুল (Used = instead of ==)',
        explanation: 'শর্তের মধ্যে দুটি মানের তুলনা করতে ডাবল সমান (==) দিতে হয়। একটি সমান (=) দিলে মান নির্ধারণ বোঝায়, যা শর্তের ভেতর ব্যবহার করা যায় না।',
        whyItHappened: 'if বা elif শর্তের ভেতরে \'==\' এর জায়গায় একটি \'=\' ব্যবহার করা হয়েছে।',
        howToFix: 'শর্তের ভেতরের \'=\' এর জায়গায় \'==\' লিখে ঠিক করো।',
        correctedExample: 'ভুল: if age = 18:\nসঠিক: if age == 18:',
        relatedDictionaryTermId: 'booleans'
      };
    }

    // =========================================================================
    // Pattern 13: Unclosed Parenthesis (was never closed / unmatched ')')
    // =========================================================================
    if (
      rawLower.includes('was never closed') || 
      rawLower.includes("unmatched ')'") ||
      rawLower.includes("closing parenthesis")
    ) {
      let suggestedFix: string | undefined = undefined;
      if (line) {
        const openParen = (line.match(/\(/g) || []).length;
        const closeParen = (line.match(/\)/g) || []).length;
        if (openParen > closeParen) {
          suggestedFix = line.trimEnd() + ')'.repeat(openParen - closeParen);
        }
      }

      return {
        errorType: 'SyntaxError',
        errorSubType: 'UNCLOSED_PARENTHESIS',
        originalError: stderr,
        lineNumber,
        offendingLine,
        suggestedFix,
        banglaTitle: 'ব্র্যাকেট বন্ধ না করার এরর (Unclosed Parenthesis)',
        explanation: 'তুমি কোনো ব্র্যাকেট ( যেমন ( বা [ ) শুরু করেছো কিন্তু লাইন শেষ হওয়ার আগে তা বন্ধ করোনি।',
        whyItHappened: 'ব্র্যাকেটের জোড়া মেলেনি। যতগুলো ব্র্যাকেট খোলা হয়েছে, ঠিক ততগুলোই বন্ধ করতে হবে।',
        howToFix: 'লাইনের শেষে ব্র্যাকেট সঠিকভাবে বন্ধ করা হয়েছে কিনা গণনা করে মিলিয়ে নাও।',
        correctedExample: 'ভুল: print(int(input("Price: "))\nসঠিক: print(int(input("Price: ")))',
        relatedDictionaryTermId: 'syntax_error'
      };
    }

    return null;
  }
}
