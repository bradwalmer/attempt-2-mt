const assert = require('assert');
const { sections, provisions, questions } = require('./data');
const { match } = require('./matcher');
const ids = (a, lv) => match(a, provisions).filter((p) => !lv || p.matchLevel === lv).map((p) => p.id);
const tests = [
  ['T1 freelancer with home space: home office, QBI, SE tax half flagged as strong', () => { const r = ids({ selfEmp: true, homeSpace: true, seNet: 'u25', income: '25_50' }, 'likely'); ['home-office', 'qbi', 'se-tax-half'].forEach((i) => assert(r.includes(i))); }],
  ['T2 empty answers return nothing', () => assert.deepStrictEqual(ids({}), [])],
  ['T3 EDGE: home space without self-employment does not flag home office', () => assert(!ids({ homeSpace: true }).includes('home-office'))],
  ['T4 EDGE: self-employment loss downgrades QBI/SE-tax-half to "check"', () => { const r = match({ selfEmp: true, seNet: 'loss' }, provisions); assert.strictEqual(r.find((p) => p.id === 'qbi').matchLevel, 'check'); assert.strictEqual(r.find((p) => p.id === 'se-tax-half').matchLevel, 'check'); }],
  ['T5 income band matters: Saver’s Credit strong at $25-50k, check at $50-80k, none at $150k+', () => { const f = (income) => match({ retirementContrib: true, income }, provisions).find((p) => p.id === 'savers'); assert.strictEqual(f('25_50').matchLevel, 'likely'); assert.strictEqual(f('50_80').matchLevel, 'check'); assert.strictEqual(f('150p'), undefined); }],
  ['T6 FAILURE: bad input (null, strings, unknown keys) does not crash or over-match', () => { assert.deepStrictEqual(ids(null), []); assert.deepStrictEqual(ids('x'), []); assert.deepStrictEqual(ids({ bogus: true }), []); }],
  ['T7 EITC: dependents + low income + wages is strong; high income is none', () => { assert(ids({ wages: true, dependents: '2', income: 'u25' }, 'likely').includes('eitc')); assert(!ids({ wages: true, dependents: '2', income: '150p' }).includes('eitc')); }],
  ['T8 data integrity: https IRS/US Code links and valid question keys', () => provisions.forEach((p) => { assert(p.irs.startsWith('https://www.irs.gov/')); assert(p.usc.startsWith('https://uscode.house.gov/')); p.because.forEach((k) => assert(questions.some((q) => q.key === k), p.id + ' bad key ' + k)); })]
];
let fail = 0;
tests.forEach(([n, f]) => { try { f(); console.log('PASS', n); } catch (e) { fail++; console.log('FAIL', n, '-', e.message); } });
process.exit(fail ? 1 : 0);
