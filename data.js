(function (root) {
  const U = (s) => `https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title26-section${s}&num=0&edition=prelim`;
  const n = (x) => Number(x) || 0;
  // Student TODO: verify every summary, URL and lastVerified date on IRS.gov / uscode.house.gov.
  const bands = [['u25', 'Under $25,000'], ['25_50', '$25,000 to $49,999'], ['50_80', '$50,000 to $79,999'], ['80_150', '$80,000 to $149,999'], ['150p', '$150,000 or more']];
  const cnt = [['0', 'None'], ['1', '1'], ['2', '2'], ['3', '3 or more']];
  const sections = [
    { title: 'About you', intro: 'Your filing status changes which limits apply to many provisions.', fields: [
      { key: 'filing', type: 'select', label: 'Filing status', options: [['single', 'Single'], ['mfj', 'Married filing jointly'], ['mfs', 'Married filing separately'], ['hoh', 'Head of household']] }] },
    { title: 'Income sources', intro: 'Select every kind of income you or your household had this year.', fields: [
      { key: 'wages', type: 'check', label: 'Wages or salary from an employer (W-2)' },
      { key: 'selfEmp', type: 'check', label: 'Freelance, gig or small-business income (1099 or sole proprietor)' },
      { key: 'invest', type: 'check', label: 'Interest, dividends or investment sales' },
      { key: 'rental', type: 'check', label: 'Rental property income' },
      { key: 'retireInc', type: 'check', label: 'Pension or retirement account withdrawals' },
      { key: 'ssBenefits', type: 'check', label: 'Social Security benefits' },
      { key: 'unemployment', type: 'check', label: 'Unemployment compensation' }] },
    { title: 'Income level', intro: 'Ranges only. Pick the band that best fits your total household income before deductions.', fields: [
      { key: 'income', type: 'select', label: 'Total household income', options: bands },
      { key: 'seNet', type: 'select', label: 'Net profit from self-employment (income minus business expenses)', showIf: 'selfEmp', options: [['loss', 'A loss or break-even'], ['u25', 'Under $25,000'], ['25_75', '$25,000 to $74,999'], ['75p', '$75,000 or more']] }] },
    { title: 'Family', intro: 'Dependents and care costs drive several credits.', fields: [
      { key: 'dependents', type: 'select', label: 'Number of dependents', options: cnt },
      { key: 'kidsUnder17', type: 'select', label: 'Dependents under age 17', options: cnt },
      { key: 'careCosts', type: 'check', label: 'I paid for child or dependent care so I could work' }] },
    { title: 'Education', intro: 'Education costs are one of the most commonly overlooked areas.', fields: [
      { key: 'tuition', type: 'check', label: 'I (or a dependent) paid college or job-training tuition' },
      { key: 'studentLoan', type: 'check', label: 'I paid interest on a student loan' },
      { key: 'teacher', type: 'check', label: 'I am a K-12 educator who buys classroom supplies' }] },
    { title: 'Savings, health and work', intro: 'Last step.', fields: [
      { key: 'retirementContrib', type: 'check', label: 'I contributed to an IRA or workplace retirement plan' },
      { key: 'hdhp', type: 'check', label: 'I have a high-deductible health plan' },
      { key: 'marketplace', type: 'check', label: 'I bought health insurance through the Marketplace (healthcare.gov)' },
      { key: 'paysHealth', type: 'check', label: 'I pay my own health insurance premiums', showIf: 'selfEmp' },
      { key: 'homeSpace', type: 'check', label: 'I use part of my home regularly and only for business', showIf: 'selfEmp' }] }
  ];
  const lowInc = (a) => ['u25', '25_50'].includes(a.income);
  const P = (id, name, category, why, because, irs, sec, level) => ({ id, name, category, why, because, irs, usc: U(sec), lastVerified: null, level });
  const provisions = [
    P('home-office', 'Home office deduction', 'Business', 'Self-employed people who use part of their home regularly and exclusively for business may deduct related costs.', ['selfEmp', 'homeSpace'],
      'https://www.irs.gov/businesses/small-businesses-self-employed/home-office-deduction', '280A', (a) => a.selfEmp && a.homeSpace ? 'likely' : null),
    P('qbi', 'Qualified business income deduction', 'Business', 'Many sole proprietors and some rental owners can deduct a share of qualified business income. It is often missed.', ['selfEmp', 'rental'],
      'https://www.irs.gov/newsroom/qualified-business-income-deduction', '199A', (a) => a.selfEmp && a.seNet !== 'loss' ? 'likely' : (a.selfEmp || a.rental) ? 'check' : null),
    P('se-tax-half', 'Deduction for half of self-employment tax', 'Business', 'You pay both halves of Social Security and Medicare tax on self-employment profit, and part of it is deductible.', ['selfEmp'],
      'https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes', '164', (a) => a.selfEmp ? (a.seNet === 'loss' ? 'check' : 'likely') : null),
    P('se-health', 'Self-employed health insurance deduction', 'Business', 'Self-employed people who pay their own premiums may be able to deduct them.', ['selfEmp', 'paysHealth'],
      'https://www.irs.gov/publications/p535', '162', (a) => a.selfEmp && a.paysHealth ? 'likely' : null),
    P('savers', 'Saver’s Credit', 'Retirement', 'Lower- and moderate-income savers may get a credit for retirement contributions, on top of any other benefit.', ['retirementContrib', 'income'],
      'https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-savings-contributions-savers-credit', '25B', (a) => !a.retirementContrib ? null : lowInc(a) ? 'likely' : a.income === '50_80' ? 'check' : null),
    P('hsa', 'Health savings account deduction', 'Health', 'With a high-deductible health plan you may be able to contribute to an HSA and deduct it.', ['hdhp'],
      'https://www.irs.gov/publications/p969', '223', (a) => a.hdhp ? 'likely' : null),
    P('ptc', 'Premium tax credit', 'Health', 'Marketplace insurance buyers may qualify for a credit that lowers premiums, and it is reconciled on your return.', ['marketplace', 'income'],
      'https://www.irs.gov/affordable-care-act/individuals-and-families/the-premium-tax-credit', '36B', (a) => a.marketplace ? (a.income === '150p' ? 'check' : 'likely') : null),
    P('student-loan', 'Student loan interest deduction', 'Education', 'You may deduct interest paid on qualified student loans without itemizing.', ['studentLoan', 'income'],
      'https://www.irs.gov/taxtopics/tc456', '221', (a) => !a.studentLoan || a.income === '150p' ? null : a.income === '80_150' ? 'check' : 'likely'),
    P('edu-credits', 'Education credits (AOTC and Lifetime Learning)', 'Education', 'Tuition and related costs may qualify for a credit, which is worth more than a deduction of the same size.', ['tuition', 'income'],
      'https://www.irs.gov/credits-deductions/individuals/education-credits-aotc-llc', '25A', (a) => a.tuition ? (a.income === '150p' ? 'check' : 'likely') : null),
    P('educator', 'Educator expense deduction', 'Education', 'Eligible educators may deduct some unreimbursed classroom expenses.', ['teacher'],
      'https://www.irs.gov/taxtopics/tc458', '62', (a) => a.teacher ? 'likely' : null),
    P('dependent-care', 'Child and dependent care credit', 'Family', 'Care costs that let you (and a spouse) work or look for work may qualify for a credit.', ['careCosts', 'dependents'],
      'https://www.irs.gov/taxtopics/tc602', '21', (a) => a.careCosts && n(a.dependents) > 0 ? 'likely' : null),
    P('ctc', 'Child tax credit', 'Family', 'Dependents under 17 may qualify you for a credit per child, subject to income limits.', ['kidsUnder17', 'income'],
      'https://www.irs.gov/credits-deductions/individuals/child-tax-credit', '24', (a) => n(a.kidsUnder17) > 0 ? (a.income === '150p' ? 'check' : 'likely') : null),
    P('eitc', 'Earned income tax credit', 'Family', 'Working people with low to moderate earnings may get this refundable credit, and many eligible filers never claim it.', ['wages', 'selfEmp', 'income', 'dependents'],
      'https://www.irs.gov/credits-deductions/individuals/earned-income-tax-credit-eitc', '32', (a) => {
        if (!(a.wages || a.selfEmp)) return null;
        if (n(a.dependents) > 0) return lowInc(a) ? 'likely' : a.income === '50_80' ? 'check' : null;
        return a.income === 'u25' ? 'check' : null; })
  ];
  const data = { sections, provisions, bands, questions: sections.flatMap((s) => s.fields) };
  if (typeof module !== 'undefined') module.exports = data; else root.TAXDATA = data;
})(this);
