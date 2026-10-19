const Site = {
  save(a) { try { sessionStorage.setItem('tf', JSON.stringify(a)); } catch (e) {} },
  load() { try { return JSON.parse(sessionStorage.getItem('tf')); } catch (e) { return null; } },
  clear() { try { sessionStorage.removeItem('tf'); } catch (e) {} },
  card(p) {
    const d = document.createElement('div'); d.className = 'card';
    const mk = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; e.textContent = x; return e; };
    const top = document.createElement('div');
    if (p.matchLevel) top.append(mk('span', 'badge ' + p.matchLevel, p.matchLevel === 'likely' ? 'Strong match' : 'Worth checking'));
    top.append(mk('span', 'badge cat', p.category));
    const links = document.createElement('p');
    [['IRS page', p.irs], ['US Code', p.usc]].forEach(([t, u], i) => { const a = document.createElement('a'); a.href = u; a.target = '_blank'; a.rel = 'noopener'; a.textContent = t; if (i) links.append(' · '); links.append(a); });
    d.append(top, mk('h3', '', p.name), mk('p', '', p.why));
    if (p.because) d.append(mk('p', 'mut', 'Based on your answers: ' + p.because));
    d.append(links, mk('p', 'mut', 'Last verified: ' + (p.lastVerified || 'not yet verified')));
    return d;
  }
};
document.addEventListener('DOMContentLoaded', () => {
  const pages = [['index.html', 'Home'], ['find.html', 'Questionnaire'], ['results.html', 'Results'], ['library.html', 'Library'], ['about.html', 'About']];
  const cur = location.pathname.split('/').pop() || 'index.html';
  const h = document.createElement('header');
  h.innerHTML = '<div class="wrap"><a class="brand" href="index.html">Overlooked Tax Finder</a><nav>' + pages.map(([u, t]) => `<a href="${u}"${u === cur ? ' class="on"' : ''}>${t}</a>`).join('') + '</nav></div>';
  document.body.prepend(h);
  const f = document.createElement('footer');
  f.innerHTML = '<div class="wrap">Educational use only. Not tax advice. Confirm every item on IRS.gov or with a tax professional. AI 101 midterm prototype.</div>';
  document.body.append(f);
});
