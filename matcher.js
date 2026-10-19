(function (root) {
  // Deterministic rules: each provision's level() returns 'likely', 'check' or null for the given answers.
  function match(answers, provisions) {
    const a = answers && typeof answers === 'object' ? answers : {};
    const rank = { likely: 0, check: 1 };
    return provisions.map((p) => ({ ...p, matchLevel: p.level(a) })).filter((p) => p.matchLevel)
      .sort((x, y) => rank[x.matchLevel] - rank[y.matchLevel]);
  }
  if (typeof module !== 'undefined') module.exports = { match }; else root.TAXMATCH = { match };
})(this);
