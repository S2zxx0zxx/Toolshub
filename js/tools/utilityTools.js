/* ============================================
   TOOLSHUB — UTILITY TOOLS
   100% client-side inline tools:
   Word Counter, QR Generator, Password Generator,
   Case Converter, Age Calculator, Unit Converter,
   GPA Calculator (also used by the career category).
   ============================================ */

export const UtilityTools = (() => {

  /* ---- shared helpers ---- */
  function panel() { return document.getElementById('utilityPanel'); }

  function header(tool) {
    return `
      <div>
        <div class="utility-tool-title">${tool.title}</div>
        <div class="utility-tool-sub">${tool.sub}</div>
      </div>`;
  }

  /* Patch: hide utility panel when "New chat" is clicked */
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('newChatBtn')?.addEventListener('click', () => {
      const p = panel();
      if (p && p.style.display !== 'none') {
        p.style.display = 'none';
        const iz = document.querySelector('.input-zone');
        if (iz) iz.style.display = '';
      }
    });
  });

  /* ---- main router ---- */
  function render(tool) {
    const el = panel();
    if (!el) return;
    el.innerHTML = ''; // clear previous tool

    const map = {
      'word-counter':   renderWordCounter,
      'qr-generator':   renderQRGenerator,
      'password-gen':   renderPasswordGen,
      'case-converter': renderCaseConverter,
      'age-calculator': renderAgeCalculator,
      'unit-converter': renderUnitConverter,
      'gpa-calc':       renderGPACalc,
    };

    const fn = map[tool.id];
    if (fn) fn(el, tool);
  }

  /* ===================================================
     WORD & CHARACTER COUNTER
     =================================================== */
  function renderWordCounter(el, tool) {
    el.innerHTML = `
      <div class="utility-tool-wrap">
        ${header(tool)}
        <textarea class="utility-textarea" id="ut-wc-text"
          placeholder="Type or paste your text here…" rows="7"></textarea>
        <div class="utility-stats">
          <div class="utility-stat-card">
            <div class="utility-stat-value" id="ut-wc-words">0</div>
            <div class="utility-stat-label">Words</div>
          </div>
          <div class="utility-stat-card">
            <div class="utility-stat-value" id="ut-wc-chars">0</div>
            <div class="utility-stat-label">Characters</div>
          </div>
          <div class="utility-stat-card">
            <div class="utility-stat-value" id="ut-wc-read">0s</div>
            <div class="utility-stat-label">Read time</div>
          </div>
        </div>
        <div class="utility-stats" style="grid-template-columns:repeat(2,1fr);">
          <div class="utility-stat-card">
            <div class="utility-stat-value" id="ut-wc-charno">0</div>
            <div class="utility-stat-label">Chars (no spaces)</div>
          </div>
          <div class="utility-stat-card">
            <div class="utility-stat-value" id="ut-wc-sent">0</div>
            <div class="utility-stat-label">Sentences</div>
          </div>
        </div>
      </div>`;

    document.getElementById('ut-wc-text').addEventListener('input', function () {
      const t = this.value;
      const words = t.trim() === '' ? 0 : t.trim().split(/\s+/).length;
      const chars = t.length;
      const charsNoSp = t.replace(/\s/g, '').length;
      const sentences = (t.match(/[.!?]+/g) || []).length;
      // ~200 wpm average reading speed
      const secRaw = Math.ceil((words / 200) * 60);
      const readLabel = words === 0 ? '0s'
        : secRaw < 60 ? secRaw + 's'
        : Math.ceil(secRaw / 60) + ' min';

      document.getElementById('ut-wc-words').textContent  = words.toLocaleString();
      document.getElementById('ut-wc-chars').textContent  = chars.toLocaleString();
      document.getElementById('ut-wc-charno').textContent = charsNoSp.toLocaleString();
      document.getElementById('ut-wc-sent').textContent   = sentences.toLocaleString();
      document.getElementById('ut-wc-read').textContent   = readLabel;
    });
  }

  /* ===================================================
     QR CODE GENERATOR  (requires qrcodejs CDN)
     =================================================== */
  function renderQRGenerator(el, tool) {
    el.innerHTML = `
      <div class="utility-tool-wrap">
        ${header(tool)}
        <div class="utility-input-group">
          <input class="utility-input" id="ut-qr-input" type="text"
            placeholder="https://example.com  or any text…">
          <button class="btn btn-primary" id="ut-qr-btn" style="flex-shrink:0;">Generate</button>
        </div>
        <div class="qr-output" id="ut-qr-out">
          <span style="font-size:var(--fs-sm);color:var(--text-muted);">QR code will appear here</span>
        </div>
        <div id="ut-qr-dl-wrap" style="display:none;text-align:center;">
          <button class="btn btn-ghost" id="ut-qr-dl">⬇ Download PNG</button>
        </div>
      </div>`;

    const generate = () => {
      const text = document.getElementById('ut-qr-input').value.trim();
      if (!text) return;
      const out = document.getElementById('ut-qr-out');
      out.innerHTML = '';

      if (window.QRCode) {
        new QRCode(out, {
          text,
          width: 200,
          height: 200,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H,
        });
        document.getElementById('ut-qr-dl-wrap').style.display = '';
        document.getElementById('ut-qr-dl').onclick = () => {
          // qrcodejs creates a canvas; download it
          const canvas = out.querySelector('canvas');
          if (canvas) {
            canvas.toBlob(blob => {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url; a.download = 'qrcode.png'; a.click();
              setTimeout(() => URL.revokeObjectURL(url), 5000);
            });
          }
        };
      } else {
        out.innerHTML = `<span style="color:var(--danger);font-size:var(--fs-sm);">
          QR library not loaded. Check your internet connection.</span>`;
      }
    };

    document.getElementById('ut-qr-btn').addEventListener('click', generate);
    document.getElementById('ut-qr-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') generate();
    });
  }

  /* ===================================================
     PASSWORD GENERATOR
     =================================================== */
  function renderPasswordGen(el, tool) {
    el.innerHTML = `
      <div class="utility-tool-wrap">
        ${header(tool)}
        <div class="card">
          <div style="margin-bottom:var(--sp-5);">
            <label class="util-label">Length: <span id="ut-pw-len-lbl">16</span></label>
            <div class="utility-slider-group">
              <span style="font-size:var(--fs-xs);color:var(--text-muted);">8</span>
              <input class="utility-slider" type="range" id="ut-pw-len" min="8" max="64" value="16" style="flex:1;">
              <span style="font-size:var(--fs-xs);color:var(--text-muted);">64</span>
            </div>
          </div>
          <div class="utility-check-group" style="margin-bottom:var(--sp-5);">
            <label class="utility-check-label">
              <input type="checkbox" id="ut-pw-upper" checked> Uppercase (A–Z)
            </label>
            <label class="utility-check-label">
              <input type="checkbox" id="ut-pw-lower" checked> Lowercase (a–z)
            </label>
            <label class="utility-check-label">
              <input type="checkbox" id="ut-pw-num" checked> Numbers (0–9)
            </label>
            <label class="utility-check-label">
              <input type="checkbox" id="ut-pw-sym" checked> Symbols (!@#$…)
            </label>
          </div>
          <button class="btn btn-primary" id="ut-pw-gen" style="width:100%;">Generate Password</button>
        </div>
        <div class="password-display" id="ut-pw-row" style="display:none;">
          <span class="password-text" id="ut-pw-out"></span>
          <button class="btn-icon" id="ut-pw-copy" title="Copy to clipboard">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2"/>
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
            </svg>
          </button>
        </div>
      </div>`;

    const lenInput = document.getElementById('ut-pw-len');
    lenInput.addEventListener('input', () => {
      document.getElementById('ut-pw-len-lbl').textContent = lenInput.value;
    });

    document.getElementById('ut-pw-gen').addEventListener('click', () => {
      let charset = '';
      if (document.getElementById('ut-pw-upper').checked)
        charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (document.getElementById('ut-pw-lower').checked)
        charset += 'abcdefghijklmnopqrstuvwxyz';
      if (document.getElementById('ut-pw-num').checked)
        charset += '0123456789';
      if (document.getElementById('ut-pw-sym').checked)
        charset += '!@#$%^&*()-_=+[]{}|;:,.<>?';

      if (!charset) {
        alert('Please select at least one character type.'); return;
      }

      const len = parseInt(lenInput.value, 10);
      const rand = new Uint32Array(len);
      window.crypto.getRandomValues(rand);
      let pw = '';
      for (let i = 0; i < len; i++) pw += charset[rand[i] % charset.length];

      document.getElementById('ut-pw-out').textContent = pw;
      document.getElementById('ut-pw-row').style.display = 'flex';
    });

    document.getElementById('ut-pw-copy').addEventListener('click', function () {
      const pw = document.getElementById('ut-pw-out').textContent;
      navigator.clipboard?.writeText(pw);
      this.classList.add('copy-flash');
      setTimeout(() => this.classList.remove('copy-flash'), 350);
    });
  }

  /* ===================================================
     CASE CONVERTER
     =================================================== */
  function renderCaseConverter(el, tool) {
    el.innerHTML = `
      <div class="utility-tool-wrap">
        ${header(tool)}
        <textarea class="utility-textarea" id="ut-cc-in"
          placeholder="Type or paste your text here…"></textarea>
        <div class="utility-input-group" style="flex-wrap:wrap;">
          <button class="btn btn-ghost" data-case="upper">UPPER CASE</button>
          <button class="btn btn-ghost" data-case="lower">lower case</button>
          <button class="btn btn-ghost" data-case="title">Title Case</button>
          <button class="btn btn-ghost" data-case="sentence">Sentence case</button>
          <button class="btn btn-ghost" data-case="camel">camelCase</button>
          <button class="btn btn-ghost" data-case="snake">snake_case</button>
          <button class="btn btn-ghost" data-case="kebab">kebab-case</button>
        </div>
        <div id="ut-cc-result-wrap" style="display:none;">
          <div class="utility-result" id="ut-cc-out"></div>
          <div style="margin-top:var(--sp-3);">
            <button class="btn btn-ghost" id="ut-cc-copy">Copy result</button>
          </div>
        </div>
      </div>`;

    el.querySelectorAll('[data-case]').forEach(btn => {
      btn.addEventListener('click', () => {
        const raw = document.getElementById('ut-cc-in').value;
        if (!raw.trim()) return;
        let out = '';
        switch (btn.dataset.case) {
          case 'upper':    out = raw.toUpperCase(); break;
          case 'lower':    out = raw.toLowerCase(); break;
          case 'title':    out = raw.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()); break;
          case 'sentence': out = raw.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase()); break;
          case 'camel':
            out = raw.trim().toLowerCase()
              .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()); break;
          case 'snake':    out = raw.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_'); break;
          case 'kebab':    out = raw.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'); break;
        }
        document.getElementById('ut-cc-out').textContent = out;
        document.getElementById('ut-cc-result-wrap').style.display = '';
      });
    });

    document.getElementById('ut-cc-copy').addEventListener('click', () => {
      navigator.clipboard?.writeText(document.getElementById('ut-cc-out').textContent);
    });
  }

  /* ===================================================
     AGE CALCULATOR
     =================================================== */
  function renderAgeCalculator(el, tool) {
    const today = new Date().toISOString().split('T')[0];
    el.innerHTML = `
      <div class="utility-tool-wrap">
        ${header(tool)}
        <div class="card">
          <label class="util-label">Date of Birth</label>
          <div class="utility-input-group">
            <input class="utility-input" type="date" id="ut-age-dob" max="${today}" style="flex:1;">
            <button class="btn btn-primary" id="ut-age-calc" style="flex-shrink:0;">Calculate</button>
          </div>
        </div>
        <div id="ut-age-result" style="display:none;">
          <div class="utility-stats">
            <div class="utility-stat-card">
              <div class="utility-stat-value" id="ut-age-yrs">—</div>
              <div class="utility-stat-label">Years</div>
            </div>
            <div class="utility-stat-card">
              <div class="utility-stat-value" id="ut-age-mon">—</div>
              <div class="utility-stat-label">Months</div>
            </div>
            <div class="utility-stat-card">
              <div class="utility-stat-value" id="ut-age-day">—</div>
              <div class="utility-stat-label">Days</div>
            </div>
          </div>
          <div class="utility-result" id="ut-age-detail" style="text-align:center;margin-top:var(--sp-1);"></div>
        </div>
      </div>`;

    document.getElementById('ut-age-calc').addEventListener('click', () => {
      const val = document.getElementById('ut-age-dob').value;
      if (!val) return;

      const birth = new Date(val);
      const now   = new Date();
      if (birth > now) { alert('Date of birth cannot be in the future.'); return; }

      let yrs = now.getFullYear() - birth.getFullYear();
      let mon = now.getMonth()    - birth.getMonth();
      let day = now.getDate()     - birth.getDate();

      if (day < 0) {
        mon--;
        const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        day += prevMonthEnd.getDate();
      }
      if (mon < 0) { yrs--; mon += 12; }

      const totalDays  = Math.floor((now - birth) / 86400000);
      const totalHours = totalDays * 24;

      document.getElementById('ut-age-yrs').textContent = yrs;
      document.getElementById('ut-age-mon').textContent = mon;
      document.getElementById('ut-age-day').textContent = day;
      document.getElementById('ut-age-detail').textContent =
        `Total ${totalDays.toLocaleString()} days · ${totalHours.toLocaleString()} hours lived`;
      document.getElementById('ut-age-result').style.display = '';
    });

    // Allow pressing Enter in the date field
    document.getElementById('ut-age-dob').addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('ut-age-calc').click();
    });
  }

  /* ===================================================
     UNIT CONVERTER
     =================================================== */
  function renderUnitConverter(el, tool) {
    const CATS = {
      length: {
        label: 'Length',
        units: { m: 'Metre', km: 'Kilometre', cm: 'Centimetre', mm: 'Millimetre',
                 mi: 'Mile', yd: 'Yard', ft: 'Foot', in: 'Inch' },
        // relative to 1 metre
        factors: { m: 1, km: 1000, cm: 0.01, mm: 0.001,
                   mi: 1609.344, yd: 0.9144, ft: 0.3048, in: 0.0254 },
      },
      weight: {
        label: 'Weight / Mass',
        units: { kg: 'Kilogram', g: 'Gram', mg: 'Milligram',
                 lb: 'Pound', oz: 'Ounce', t: 'Tonne' },
        factors: { kg: 1, g: 0.001, mg: 1e-6, lb: 0.453592, oz: 0.0283495, t: 1000 },
      },
      temperature: {
        label: 'Temperature',
        units: { c: 'Celsius (°C)', f: 'Fahrenheit (°F)', k: 'Kelvin (K)' },
        factors: null, // handled specially
      },
      speed: {
        label: 'Speed',
        units: { mps: 'm/s', kph: 'km/h', mph: 'mph', knot: 'Knot' },
        factors: { mps: 1, kph: 1 / 3.6, mph: 0.44704, knot: 0.514444 },
      },
    };

    function opts(cat) {
      return Object.entries(cat.units).map(([k, v]) =>
        `<option value="${k}">${v}</option>`).join('');
    }

    el.innerHTML = `
      <div class="utility-tool-wrap">
        ${header(tool)}
        <div class="card">
          <div style="margin-bottom:var(--sp-4);">
            <label class="util-label">Category</label>
            <select class="utility-select" id="ut-uc-cat">
              <option value="length">Length</option>
              <option value="weight">Weight / Mass</option>
              <option value="temperature">Temperature</option>
              <option value="speed">Speed</option>
            </select>
          </div>
          <div style="display:flex;gap:var(--sp-3);margin-bottom:var(--sp-4);">
            <div style="flex:1;">
              <label class="util-label">From</label>
              <select class="utility-select" id="ut-uc-from">${opts(CATS.length)}</select>
            </div>
            <div style="flex:1;">
              <label class="util-label">To</label>
              <select class="utility-select" id="ut-uc-to">${opts(CATS.length)}</select>
            </div>
          </div>
          <div class="utility-input-group">
            <input class="utility-input" type="number" id="ut-uc-val" placeholder="Enter value…" style="flex:1;">
            <button class="btn btn-primary" id="ut-uc-convert" style="flex-shrink:0;">Convert</button>
          </div>
        </div>
        <div class="utility-result" id="ut-uc-result"
          style="display:none;font-size:var(--fs-lg);font-weight:600;text-align:center;color:var(--text-primary);"></div>
      </div>`;

    // Update unit selects when category changes
    function syncSelects() {
      const cat = CATS[document.getElementById('ut-uc-cat').value];
      const o = opts(cat);
      document.getElementById('ut-uc-from').innerHTML = o;
      document.getElementById('ut-uc-to').innerHTML   = o;
      // Default 'to' to second unit
      const toSel = document.getElementById('ut-uc-to');
      if (toSel.options.length > 1) toSel.selectedIndex = 1;
    }
    // Set initial second selection
    document.getElementById('ut-uc-to').selectedIndex = 1;

    document.getElementById('ut-uc-cat').addEventListener('change', syncSelects);

    const doConvert = () => {
      const catKey = document.getElementById('ut-uc-cat').value;
      const from   = document.getElementById('ut-uc-from').value;
      const to     = document.getElementById('ut-uc-to').value;
      const v      = parseFloat(document.getElementById('ut-uc-val').value);
      if (isNaN(v)) return;

      const cat = CATS[catKey];
      let result;

      if (catKey === 'temperature') {
        let celsius;
        if (from === 'c') celsius = v;
        else if (from === 'f') celsius = (v - 32) * 5 / 9;
        else celsius = v - 273.15;

        if (to === 'c') result = celsius;
        else if (to === 'f') result = celsius * 9 / 5 + 32;
        else result = celsius + 273.15;
      } else {
        result = (v * cat.factors[from]) / cat.factors[to];
      }

      const fmt = n =>
        Number.isInteger(n) ? n.toLocaleString()
        : parseFloat(n.toPrecision(8)).toLocaleString(undefined, { maximumFractionDigits: 8 });

      const fromLabel = cat.units[from];
      const toLabel   = cat.units[to];
      const resultEl  = document.getElementById('ut-uc-result');
      resultEl.textContent = `${v} ${fromLabel} = ${fmt(result)} ${toLabel}`;
      resultEl.style.display = '';
    };

    document.getElementById('ut-uc-convert').addEventListener('click', doConvert);
    document.getElementById('ut-uc-val').addEventListener('keydown', e => {
      if (e.key === 'Enter') doConvert();
    });
  }

  /* ===================================================
     GPA / PERCENTAGE CALCULATOR
     (shared by career category via mode:'utility')
     =================================================== */
  let gpaRowCount = 3;

  function gpaRow(n) {
    return `
      <tr id="ut-gpa-row-${n}">
        <td><input class="utility-input gpa-subj" type="text" placeholder="Subject ${n}"></td>
        <td><input class="utility-input gpa-cred" type="number" placeholder="3" min="0.5" max="20" step="0.5" style="width:80px;"></td>
        <td><input class="utility-input gpa-grade" type="text" placeholder="A or 85%"></td>
        <td>
          <button class="btn-icon ut-gpa-del" title="Remove row" style="width:30px;height:30px;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </td>
      </tr>`;
  }

  function attachDelHandlers(tbody) {
    tbody.querySelectorAll('.ut-gpa-del').forEach(btn => {
      btn.onclick = function () { this.closest('tr').remove(); };
    });
  }

  function renderGPACalc(el, tool) {
    gpaRowCount = 3;
    el.innerHTML = `
      <div class="utility-tool-wrap">
        ${header(tool)}
        <div class="card" style="overflow-x:auto;">
          <table class="gpa-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Credits</th>
                <th>Grade (letter or %)</th>
                <th></th>
              </tr>
            </thead>
            <tbody id="ut-gpa-tbody">
              ${gpaRow(1)}${gpaRow(2)}${gpaRow(3)}
            </tbody>
          </table>
          <div style="margin-top:var(--sp-4);display:flex;gap:var(--sp-3);">
            <button class="btn btn-ghost" id="ut-gpa-add">+ Add Subject</button>
            <button class="btn btn-primary" id="ut-gpa-calc">Calculate GPA</button>
          </div>
        </div>
        <div id="ut-gpa-result" style="display:none;">
          <div class="utility-stats">
            <div class="utility-stat-card">
              <div class="utility-stat-value" id="ut-gpa-gpa">—</div>
              <div class="utility-stat-label">GPA (4.0 scale)</div>
            </div>
            <div class="utility-stat-card">
              <div class="utility-stat-value" id="ut-gpa-pct">—</div>
              <div class="utility-stat-label">Percentage</div>
            </div>
            <div class="utility-stat-card">
              <div class="utility-stat-value" id="ut-gpa-grade">—</div>
              <div class="utility-stat-label">Grade</div>
            </div>
          </div>
        </div>
      </div>`;

    const tbody = document.getElementById('ut-gpa-tbody');
    attachDelHandlers(tbody);

    document.getElementById('ut-gpa-add').addEventListener('click', () => {
      gpaRowCount++;
      tbody.insertAdjacentHTML('beforeend', gpaRow(gpaRowCount));
      // Attach del handler to the newly added row
      tbody.querySelector(`#ut-gpa-row-${gpaRowCount} .ut-gpa-del`).onclick =
        function () { this.closest('tr').remove(); };
    });

    document.getElementById('ut-gpa-calc').addEventListener('click', () => {
      const LETTER = {
        'A+': 4.0, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0, 'D-': 0.7, 'F': 0,
      };
      
      const LETTER_PCT = {
        'A+': 98, 'A': 95, 'A-': 91,
        'B+': 88, 'B': 85, 'B-': 81,
        'C+': 78, 'C': 75, 'C-': 71,
        'D+': 68, 'D': 65, 'D-': 61, 'F': 50,
      };

      let totalPts = 0, totalPctPoints = 0, totalCreds = 0;

      tbody.querySelectorAll('tr').forEach(row => {
        const cred  = parseFloat(row.querySelector('.gpa-cred')?.value);
        const grade = (row.querySelector('.gpa-grade')?.value || '').trim().toUpperCase();
        if (!grade || isNaN(cred) || cred <= 0) return;

        let pts;
        let rowPct;
        if (LETTER[grade] !== undefined) {
          pts = LETTER[grade];
          rowPct = LETTER_PCT[grade];
        } else {
          const pct = parseFloat(grade.replace('%', ''));
          if (isNaN(pct)) return;
          rowPct = pct;
          if (pct >= 90) pts = 4.0;
          else if (pct >= 80) pts = 3.0;
          else if (pct >= 70) pts = 2.0;
          else if (pct >= 60) pts = 1.0;
          else pts = 0;
        }
        totalPts       += pts * cred;
        totalPctPoints += rowPct * cred;
        totalCreds     += cred;
      });

      if (totalCreds === 0) { alert('Please fill in at least one valid row.'); return; }

      const gpa  = totalPts / totalCreds;
      const pct  = totalPctPoints / totalCreds;
      const grade = gpa >= 3.7 ? 'A' : gpa >= 3.3 ? 'A−' : gpa >= 3.0 ? 'B+'
        : gpa >= 2.7 ? 'B' : gpa >= 2.3 ? 'B−' : gpa >= 2.0 ? 'C+' : gpa >= 1.7 ? 'C' : 'D';

      document.getElementById('ut-gpa-gpa').textContent   = gpa.toFixed(2);
      document.getElementById('ut-gpa-pct').textContent   = pct.toFixed(1) + '%';
      document.getElementById('ut-gpa-grade').textContent = grade;
      document.getElementById('ut-gpa-result').style.display = '';
    });
  }

  /* ---- public API ---- */
  return { render };

})();

window.UtilityTools = UtilityTools;
