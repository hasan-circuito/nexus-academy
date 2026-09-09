// engines/python/inputExtractor.ts
// NEXUS Academy — Extract expected input values from reference output strings

export function extractInputs(code: string, referenceOutput?: string): string[] {
  if (!referenceOutput || !code) return [];

  const inputs: string[] = [];
  const lines = referenceOutput.split('\n');

  // Find all prompt strings inside input(...) calls in the code
  const inputRegex = /input\s*\(\s*["'](.*?)["']\s*\)/g;
  let match: RegExpExecArray | null;

  while ((match = inputRegex.exec(code)) !== null) {
    const prompt = match[1];
    if (!prompt) continue;

    // Find the line in referenceOutput that contains this prompt
    const matchingLine = lines.find(l => l.includes(prompt));
    if (matchingLine) {
      const val = matchingLine.slice(matchingLine.indexOf(prompt) + prompt.length).trim();
      if (val) {
        inputs.push(val);
      }
    }
  }

  return inputs;
}
