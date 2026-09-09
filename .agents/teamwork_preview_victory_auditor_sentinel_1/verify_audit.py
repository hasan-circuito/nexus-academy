import json
import re
import sys

with open('data/missions/mission-005.json', 'r', encoding='utf-8') as f:
    m = json.load(f)

print('=== 1. STEP STRUCTURE CHECK ===')
expected_types = [
    'intro',
    'story',
    'analogy',
    'concept',
    'code_example',
    'practice',
    'practice',
    'practice',
    'debug_challenge',
    'debug_challenge',
    'debug_challenge',
    'reflection',
    'mission_complete'
]
actual_types = [s.get('type') for s in m['steps']]
print('Expected count:', len(expected_types), 'Actual count:', len(actual_types))
assert len(expected_types) == len(actual_types), f'Step count mismatch: {len(actual_types)} != {len(expected_types)}'
for idx, (exp, act) in enumerate(zip(expected_types, actual_types)):
    print(f'Step {idx}: {act} (Expected: {exp}) - Match: {exp == act}')
    assert exp == act, f'Step {idx} type mismatch: {act} != {exp}'

print('\n=== 2. TITLE AND CONCEPT CHECK ===')
print('Title:', m.get('title'))
print('BanglaTitle:', m.get('banglaTitle'))
assert 'Information' in m.get('banglaTitle') or 'বদলাতে' in m.get('banglaTitle'), 'Title should be problem oriented'

print('\n=== 3. DEPENDENCY LEAK AUDIT ===')
full_text = json.dumps(m, ensure_ascii=False)
assert 'input(' not in full_text, 'input() found in mission!'
assert 'Room 101' not in full_text, 'Room 101 found in mission!'

# Extract all Python code snippets
code_snippets = []
for s in m['steps']:
    for field in ['code', 'solution', 'starterCode', 'buggyCode', 'fixedCode']:
        if field in s:
            code_snippets.append((s['type'], field, s[field]))

for stype, field, code in code_snippets:
    # Check for arithmetic
    for op in [' + ', ' - ', ' * ', ' / ', ' % ', ' // ', ' ** ']:
        assert op not in code, f'Arithmetic operator {op} found in {stype} ({field})'

print('No dependency leaks found (no arithmetic, no input, no complex edge cases).')

print('\n=== 4. PYTHON RUNTIME EXECUTION TEST ===')
# Test code_example
code_example = m['steps'][4]['code']
print('Executing code_example...')
exec_env = {}
exec(code_example, exec_env)
assert exec_env.get('number_data') == 50
assert exec_env.get('score_text') == '50'
assert isinstance(exec_env.get('number_data'), int)
assert isinstance(exec_env.get('score_text'), str)
print('code_example OK!')

# Test practice 1 solution
p1_sol = m['steps'][5]['solution']
env1 = {}
exec(p1_sol, env1)
assert env1.get('data') == '50'
assert env1.get('num') == 50
assert isinstance(env1.get('num'), int)
print('practice 1 solution OK!')

# Test practice 2 solution
p2_sol = m['steps'][6]['solution']
env2 = {}
exec(p2_sol, env2)
assert env2.get('count') == 50
assert env2.get('count_text') == '50'
assert isinstance(env2.get('count_text'), str)
print('practice 2 solution OK!')

# Test practice 3 solution
p3_sol = m['steps'][7]['solution']
env3 = {}
exec(p3_sol, env3)
assert env3.get('a_text') == '50'
assert env3.get('a_num') == 50
assert env3.get('b_num') == 50
assert env3.get('b_text') == '50'
assert isinstance(env3.get('a_num'), int)
assert isinstance(env3.get('b_text'), str)
print('practice 3 solution OK!')

# Test debug 1
d1_buggy = m['steps'][8]['buggyCode']
d1_fixed = m['steps'][8]['fixedCode']
try:
    exec(d1_buggy, {})
    assert False, 'd1_buggy should fail'
except NameError as e:
    assert 'integer' in str(e)
    print(f'd1_buggy correctly raised NameError: {e}')

env_d1 = {}
exec(d1_fixed, env_d1)
assert env_d1.get('val_num') == 50
print('d1_fixed OK!')

# Test debug 2
d2_buggy = m['steps'][9]['buggyCode']
d2_fixed = m['steps'][9]['fixedCode']
try:
    exec(d2_buggy, {})
    assert False, 'd2_buggy should fail'
except NameError as e:
    assert 'string' in str(e)
    print(f'd2_buggy correctly raised NameError: {e}')

env_d2 = {}
exec(d2_fixed, env_d2)
assert env_d2.get('total_text') == '50'
print('d2_fixed OK!')

# Test debug 3
d3_buggy = m['steps'][10]['buggyCode']
d3_fixed = m['steps'][10]['fixedCode']
try:
    exec(d3_buggy, {})
    assert False, 'd3_buggy should fail'
except ValueError as e:
    assert 'invalid literal for int()' in str(e)
    print(f'd3_buggy correctly raised ValueError: {e}')

env_d3 = {}
exec(d3_fixed, env_d3)
assert env_d3.get('score_num') == 50
print('d3_fixed OK!')

print('\n=== 5. VALIDATION REGEX TESTING ===')
for p_idx, step_num in enumerate([5, 6, 7], 1):
    step = m['steps'][step_num]
    patterns = step['validation']['requiredPatterns']
    req_vars = step['validation']['requiredVariables']
    sol = step['solution']
    for pat in patterns:
        assert re.search(pat, sol), f'Practice {p_idx} solution does not match pattern {pat}'
    print(f'Practice {p_idx} validation patterns verified against solution.')

print('\nALL INDEPENDENT TESTS PASSED SUCCESSFULLY!')
