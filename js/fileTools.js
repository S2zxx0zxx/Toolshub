/* ============================================
   TOOLSHUB — FILE & IMAGE TOOLS
   100% client-side file tools using Canvas API,
   jsPDF (CDN), and pdf-lib (CDN).
   ============================================ */

const FileTools = (() => {

  /* ---- shared helpers ---- */
  function panel() { return document.getElementById('utilityPanel'); }

  function header(tool) {
    return `
      <div>
        <div class="utility-tool-title">${tool.title}</div>
        <div class="utility-tool-sub">${tool.sub}</div>
      </div>`;
  }

  function dropzone(id, accept, label, sub, multi = false) {
    return `
      <div class="utility-dropzone" id="${id}-zone">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        <div class="utility-dropzone-label">${label}</div>
        <div class="utility-dropzone-sub">${sub}</div>
        <input type="file" id="${id}-file" accept="${accept}" ${multi ? 'multiple' : ''}
          style="display:none;">
      </div>`;
  }

  function setupDropzone(id, onFiles) {
    const zone  = document.getElementById(`${id}-zone`);
    const input = document.getElementById(`${id}-file`);
    zone.addEventListener('click', () => input.click());
    input.addEventListener('change', () => { onFiles([...input.files]); input.value = ''; });
    zone.addEventListener('dragover',  e => { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', ()  => zone.classList.remove('drag-over'));
    zone.addEventListener('drop',      e  => {
      e.preventDefault(); zone.classList.remove('drag-over');
      onFiles([...e.dataTransfer.files]);
    });
  }

  function formatBytes(b) {
    if (b < 1024)    return b + ' B';
    if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
    return (b / 1048576).toFixed(1) + ' MB';
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 8000);
  }

  function readAsDataURL(file) {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload  = e => res(e.target.result);
      r.onerror = rej;
      r.readAsDataURL(file);
    });
  }

  function loadImage(src) {
    return new Promise((res, rej) => {
      const img = new Image();
      img.onload  = () => res(img);
      img.onerror = rej;
      img.src = src;
    });
  }

  /* ---- main router ---- */
  function render(tool) {
    const el = panel();
    if (!el) return;
    el.innerHTML = '';

    const map = {
      'image-compressor': renderImageCompressor,
      'image-to-pdf':     renderImageToPDF,
      'pdf-merge':        renderPDFMerge,
      'pdf-split':        renderPDFSplit,
      'image-converter':  renderImageConverter,
    };

    const fn = map[tool.id];
    if (fn) fn(el, tool);
  }

  /* ===================================================
     IMAGE COMPRESSOR  (Canvas API — no CDN needed)
     =================================================== */
  function renderImageCompressor(el, tool) {
    el.innerHTML = `
      <div class="utility-tool-wrap">
        ${header(tool)}
        ${dropzone('ut-ic', 'image/jpeg,image/png,image/webp',
          'Drop an image here or click to browse', 'JPG · PNG · WebP supported')}
        <div id="ut-ic-ctrl" style="display:none;" class="card">
          <div id="ut-ic-info" class="utility-file-item" style="margin-bottom:var(--sp-4);"></div>
          <label class="util-label">
            Quality: <span id="ut-ic-qlbl">80</span>%
          </label>
          <div class="utility-slider-group" style="margin-bottom:var(--sp-4);">
            <span style="font-size:var(--fs-xs);color:var(--text-muted);">10%</span>
            <input class="utility-slider" type="range" id="ut-ic-q" min="10" max="100" value="80" style="flex:1;">
            <span style="font-size:var(--fs-xs);color:var(--text-muted);">100%</span>
          </div>
          <button class="btn btn-primary" id="ut-ic-go" style="width:100%;">Compress Image</button>
        </div>
        <div id="ut-ic-result" style="display:none;" class="card">
          <div class="utility-stats" style="margin-bottom:var(--sp-4);">
            <div class="utility-stat-card">
              <div class="utility-stat-value" id="ut-ic-orig">—</div>
              <div class="utility-stat-label">Original</div>
            </div>
            <div class="utility-stat-card">
              <div class="utility-stat-value" id="ut-ic-new">—</div>
              <div class="utility-stat-label">Compressed</div>
            </div>
            <div class="utility-stat-card">
              <div class="utility-stat-value" id="ut-ic-saved">—</div>
              <div class="utility-stat-label">Saved</div>
            </div>
          </div>
          <button class="btn btn-primary" id="ut-ic-dl" style="width:100%;">⬇ Download Compressed Image</button>
        </div>
      </div>`;

    let file = null;
    let compressed = null;

    document.getElementById('ut-ic-q').addEventListener('input', function () {
      document.getElementById('ut-ic-qlbl').textContent = this.value;
    });

    setupDropzone('ut-ic', files => {
      if (!files.length) return;
      file = files[0];
      document.getElementById('ut-ic-info').innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          style="width:18px;height:18px;color:var(--accent);flex-shrink:0;">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
        <span class="utility-file-item-name">${file.name}</span>
        <span class="utility-file-size">${formatBytes(file.size)}</span>`;
      document.getElementById('ut-ic-ctrl').style.display   = '';
      document.getElementById('ut-ic-result').style.display = 'none';
    });

    document.getElementById('ut-ic-go').addEventListener('click', async () => {
      if (!file) return;
      const quality = parseInt(document.getElementById('ut-ic-q').value, 10) / 100;
      const dataUrl = await readAsDataURL(file);
      const img = await loadImage(dataUrl);
      const canvas = document.createElement('canvas');
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      // White background for JPEG (removes transparent alpha)
      if (file.type !== 'image/png') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height); }
      ctx.drawImage(img, 0, 0);

      const outType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      canvas.toBlob(blob => {
        compressed = blob;
        const savings = ((1 - blob.size / file.size) * 100).toFixed(1);
        document.getElementById('ut-ic-orig').textContent  = formatBytes(file.size);
        document.getElementById('ut-ic-new').textContent   = formatBytes(blob.size);
        document.getElementById('ut-ic-saved').textContent = savings + '%';
        document.getElementById('ut-ic-result').style.display = '';
      }, outType, quality);
    });

    document.getElementById('ut-ic-dl').addEventListener('click', () => {
      if (!compressed || !file) return;
      const ext = file.type === 'image/png' ? '.png' : '.jpg';
      downloadBlob(compressed, 'compressed' + ext);
    });
  }

  /* ===================================================
     IMAGE TO PDF  (requires jsPDF CDN)
     =================================================== */
  function renderImageToPDF(el, tool) {
    el.innerHTML = `
      <div class="utility-tool-wrap">
        ${header(tool)}
        ${dropzone('ut-ip', 'image/jpeg,image/png,image/webp',
          'Drop images here or click to browse',
          'JPG · PNG · WebP · Multiple files supported', true)}
        <div id="ut-ip-list" class="utility-file-list"></div>
        <div id="ut-ip-act" style="display:none;">
          <button class="btn btn-primary" id="ut-ip-gen" style="width:100%;">Generate PDF</button>
        </div>
        <div id="ut-ip-prog" style="display:none;text-align:center;padding:var(--sp-4);color:var(--text-muted);font-size:var(--fs-sm);">
          Converting, please wait…
        </div>
      </div>`;

    let images = [];

    const renderList = () => {
      const list = document.getElementById('ut-ip-list');
      list.innerHTML = images.map((f, i) => `
        <div class="utility-file-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            style="width:16px;height:16px;color:var(--accent);flex-shrink:0;">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
          </svg>
          <span class="utility-file-item-name">${f.name}</span>
          <span class="utility-file-size">${formatBytes(f.size)}</span>
          <button class="btn-icon" style="width:26px;height:26px;" data-i="${i}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>`).join('');
      list.querySelectorAll('[data-i]').forEach(btn => {
        btn.onclick = () => { images.splice(+btn.dataset.i, 1); renderList(); };
      });
      document.getElementById('ut-ip-act').style.display = images.length ? '' : 'none';
    };

    setupDropzone('ut-ip', files => {
      images = [...images, ...files.filter(f => f.type.startsWith('image/'))];
      renderList();
    });

    document.getElementById('ut-ip-gen').addEventListener('click', async () => {
      if (!images.length) return;
      if (!window.jspdf) {
        alert('jsPDF library not loaded. Check your internet connection.'); return;
      }
      const prog = document.getElementById('ut-ip-prog');
      prog.style.display = '';
      document.getElementById('ut-ip-act').style.display = 'none';

      try {
        const { jsPDF } = window.jspdf;
        let doc = null;

        for (const file of images) {
          const dataUrl = await readAsDataURL(file);
          const img = await loadImage(dataUrl);
          const W = img.naturalWidth, H = img.naturalHeight;
          // A4 in points: 595.28 x 841.89
          const ratio = Math.min(595 / W, 842 / H);
          const pw = W * ratio, ph = H * ratio;
          const orientation = pw > ph ? 'landscape' : 'portrait';

          if (!doc) {
            doc = new jsPDF({ orientation, unit: 'pt', format: 'a4' });
          } else {
            doc.addPage('a4', orientation);
          }

          // Center image on the page
          const pageW = doc.internal.pageSize.getWidth();
          const pageH = doc.internal.pageSize.getHeight();
          const x = (pageW - pw) / 2, y = (pageH - ph) / 2;
          const fmt = file.type === 'image/png' ? 'PNG' : 'JPEG';
          doc.addImage(dataUrl, fmt, x, y, pw, ph);
        }

        doc.save('images-to-pdf.pdf');
      } catch (e) {
        console.error(e);
        alert('Error generating PDF: ' + e.message);
      }

      prog.style.display = 'none';
      document.getElementById('ut-ip-act').style.display = '';
    });
  }

  /* ===================================================
     MERGE PDF  (requires pdf-lib CDN)
     =================================================== */
  function renderPDFMerge(el, tool) {
    el.innerHTML = `
      <div class="utility-tool-wrap">
        ${header(tool)}
        ${dropzone('ut-pm', 'application/pdf',
          'Drop PDF files here or click to browse',
          'Select 2 or more PDFs to merge', true)}
        <div id="ut-pm-list" class="utility-file-list"></div>
        <div id="ut-pm-act" style="display:none;">
          <button class="btn btn-primary" id="ut-pm-merge" style="width:100%;">Merge PDFs</button>
        </div>
        <div id="ut-pm-prog" style="display:none;text-align:center;padding:var(--sp-4);color:var(--text-muted);font-size:var(--fs-sm);">
          Merging, please wait…
        </div>
      </div>`;

    let pdfs = [];

    const pdfIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
      style="width:16px;height:16px;color:var(--danger);flex-shrink:0;">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>`;

    const renderList = () => {
      const list = document.getElementById('ut-pm-list');
      list.innerHTML = pdfs.map((f, i) => `
        <div class="utility-file-item">
          ${pdfIcon}
          <span class="utility-file-item-name">${f.name}</span>
          <span class="utility-file-size">${formatBytes(f.size)}</span>
          <button class="btn-icon" style="width:26px;height:26px;" data-i="${i}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>`).join('');
      list.querySelectorAll('[data-i]').forEach(btn => {
        btn.onclick = () => { pdfs.splice(+btn.dataset.i, 1); renderList(); };
      });
      document.getElementById('ut-pm-act').style.display = pdfs.length >= 2 ? '' : 'none';
    };

    setupDropzone('ut-pm', files => {
      pdfs = [...pdfs, ...files.filter(f => f.type === 'application/pdf')];
      renderList();
    });

    document.getElementById('ut-pm-merge').addEventListener('click', async () => {
      if (pdfs.length < 2) return;
      if (!window.PDFLib) {
        alert('pdf-lib not loaded. Check your internet connection.'); return;
      }
      const prog = document.getElementById('ut-pm-prog');
      prog.style.display = '';
      document.getElementById('ut-pm-act').style.display = 'none';

      try {
        const { PDFDocument } = PDFLib;
        const merged = await PDFDocument.create();

        for (const f of pdfs) {
          const bytes = await f.arrayBuffer();
          const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
          const copied = await merged.copyPages(src, src.getPageIndices());
          copied.forEach(p => merged.addPage(p));
        }

        const out = await merged.save();
        downloadBlob(new Blob([out], { type: 'application/pdf' }), 'merged.pdf');
      } catch (e) {
        console.error(e);
        alert('Error merging PDFs: ' + e.message);
      }

      prog.style.display = 'none';
      document.getElementById('ut-pm-act').style.display = '';
    });
  }

  /* ===================================================
     SPLIT / EXTRACT PDF PAGES  (requires pdf-lib CDN)
     =================================================== */
  function renderPDFSplit(el, tool) {
    el.innerHTML = `
      <div class="utility-tool-wrap">
        ${header(tool)}
        ${dropzone('ut-ps', 'application/pdf',
          'Drop a PDF file here or click to browse',
          'Select a single PDF to extract pages from')}
        <div id="ut-ps-ctrl" style="display:none;" class="card">
          <div id="ut-ps-info" class="utility-file-item" style="margin-bottom:var(--sp-4);"></div>
          <label class="util-label">Page range</label>
          <p style="font-size:var(--fs-xs);color:var(--text-muted);margin-bottom:var(--sp-2);">
            Examples: <code style="font-size:var(--fs-xs);">1-3</code> &nbsp;·&nbsp;
            <code style="font-size:var(--fs-xs);">2,4,6</code> &nbsp;·&nbsp;
            <code style="font-size:var(--fs-xs);">1-3,5,7-9</code>
          </p>
          <div class="utility-input-group">
            <input class="utility-input" type="text" id="ut-ps-range" placeholder="e.g. 1-3" style="flex:1;">
            <button class="btn btn-primary" id="ut-ps-go" style="flex-shrink:0;">Extract Pages</button>
          </div>
          <div id="ut-ps-pages" style="font-size:var(--fs-xs);color:var(--text-muted);margin-top:var(--sp-2);"></div>
        </div>
        <div id="ut-ps-prog" style="display:none;text-align:center;padding:var(--sp-4);color:var(--text-muted);font-size:var(--fs-sm);">
          Extracting pages…
        </div>
      </div>`;

    let currentFile = null;
    let totalPages  = 0;

    setupDropzone('ut-ps', async files => {
      const f = files[0];
      if (!f || f.type !== 'application/pdf') return;
      currentFile = f;

      // Count pages if pdf-lib is loaded
      if (window.PDFLib) {
        try {
          const bytes = await f.arrayBuffer();
          const pdf = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
          totalPages = pdf.getPageCount();
          document.getElementById('ut-ps-pages').textContent =
            `This PDF has ${totalPages} page${totalPages !== 1 ? 's' : ''}.`;
          document.getElementById('ut-ps-range').placeholder = `1-${totalPages}`;
        } catch (_) { totalPages = 0; }
      }

      document.getElementById('ut-ps-info').innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          style="width:16px;height:16px;color:var(--danger);flex-shrink:0;">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        <span class="utility-file-item-name">${f.name}</span>
        <span class="utility-file-size">${formatBytes(f.size)}</span>`;
      document.getElementById('ut-ps-ctrl').style.display = '';
    });

    document.getElementById('ut-ps-go').addEventListener('click', async () => {
      if (!currentFile) return;
      if (!window.PDFLib) {
        alert('pdf-lib not loaded. Check your internet connection.'); return;
      }

      const rangeStr = document.getElementById('ut-ps-range').value.trim();
      if (!rangeStr) return;

      // Parse "1-3,5,7-9" → [0, 1, 2, 4, 6, 7, 8] (0-indexed)
      const pages = new Set();
      rangeStr.split(',').forEach(part => {
        const [a, b] = part.trim().split('-').map(Number);
        if (b !== undefined) {
          for (let i = a; i <= b; i++) pages.add(i);
        } else {
          pages.add(a);
        }
      });
      const indices = [...pages]
        .filter(p => p >= 1 && (!totalPages || p <= totalPages))
        .map(p => p - 1)
        .sort((a, b) => a - b);

      if (!indices.length) { alert('Invalid page range. Pages start from 1.'); return; }

      const prog = document.getElementById('ut-ps-prog');
      prog.style.display = '';

      try {
        const { PDFDocument } = PDFLib;
        const bytes = await currentFile.arrayBuffer();
        const src = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const out = await PDFDocument.create();
        const copied = await out.copyPages(src, indices);
        copied.forEach(p => out.addPage(p));
        const pdfBytes = await out.save();
        downloadBlob(new Blob([pdfBytes], { type: 'application/pdf' }), 'extracted.pdf');
      } catch (e) {
        console.error(e);
        alert('Error extracting pages: ' + e.message);
      }

      prog.style.display = 'none';
    });
  }

  /* ===================================================
     IMAGE FORMAT CONVERTER  (Canvas API)
     =================================================== */
  function renderImageConverter(el, tool) {
    el.innerHTML = `
      <div class="utility-tool-wrap">
        ${header(tool)}
        ${dropzone('ut-iconv', 'image/jpeg,image/png,image/webp,image/gif,image/bmp',
          'Drop an image here or click to browse',
          'JPG · PNG · WebP · GIF · BMP supported')}
        <div id="ut-iconv-ctrl" style="display:none;" class="card">
          <div id="ut-iconv-info" class="utility-file-item" style="margin-bottom:var(--sp-4);"></div>
          <label class="util-label">Convert to</label>
          <div class="utility-input-group">
            <select class="utility-select" id="ut-iconv-fmt" style="flex:1;">
              <option value="image/jpeg">JPEG (.jpg)</option>
              <option value="image/png">PNG (.png)</option>
              <option value="image/webp">WebP (.webp)</option>
            </select>
            <button class="btn btn-primary" id="ut-iconv-go" style="flex-shrink:0;">Convert &amp; Download</button>
          </div>
        </div>
      </div>`;

    let currentFile = null;

    setupDropzone('ut-iconv', files => {
      const f = files[0];
      if (!f) return;
      currentFile = f;
      document.getElementById('ut-iconv-info').innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          style="width:18px;height:18px;color:var(--accent);flex-shrink:0;">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
        <span class="utility-file-item-name">${f.name}</span>
        <span class="utility-file-size">${formatBytes(f.size)}</span>`;
      document.getElementById('ut-iconv-ctrl').style.display = '';
    });

    document.getElementById('ut-iconv-go').addEventListener('click', async () => {
      if (!currentFile) return;
      const targetType = document.getElementById('ut-iconv-fmt').value;
      const ext = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' }[targetType] || '.jpg';
      const baseName = currentFile.name.replace(/\.[^.]+$/, '');

      const dataUrl = await readAsDataURL(currentFile);
      const img = await loadImage(dataUrl);
      const canvas = document.createElement('canvas');
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');

      // Fill white background for JPEG (removes transparency)
      if (targetType === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(blob => {
        if (blob) downloadBlob(blob, baseName + ext);
        else alert('Conversion failed. The browser may not support the target format.');
      }, targetType, 0.92);
    });
  }

  /* ---- public API ---- */
  return { render };

})();

window.FileTools = FileTools;
