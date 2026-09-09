const fs = require('fs'); 
const path = 'docs/engineering/MISSION_ENGINEERING_SPEC.md'; 
let content = fs.readFileSync(path, 'utf8'); 
const newRule = `\n\n## Rule 22 — The A+B Narrative Standard (B2B AI Agency)\nTo combine Startup Simulation with diverse real-world scenarios, missions must use the "B2B AI Agency" narrative framework.\n- **The Learner:** A Junior Developer at "Nexus AI", a fast-growing AI solutions agency.\n- **The Setup:** Tasks are assigned by a Senior Developer, Tech Lead, or Project Manager.\n- **The Domain:** Every mission features a different client industry (e.g., E-commerce, Healthcare, FinTech, Logistics) to ensure diverse, real-world abstract problem solving.\n- **Tone:** Professional, fast-paced, but encouraging. No childish analogies (magic, dragons) unless used briefly as an in-office joke.`;
fs.writeFileSync(path, content + newRule);
