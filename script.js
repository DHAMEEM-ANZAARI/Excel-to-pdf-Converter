/* ── State ── */
let workbook   = null;
let activeSheet = null;

/* ── Drag & Drop ── */
function dzOver(e)  { e.preventDefault(); document.getElementById('dropzone').classList.add('over'); }
function dzLeave()  { document.getElementById('dropzone').classList.remove('over'); }
function dzDrop(e)  {
  e.preventDefault();
  dzLeave();
  const f = e.dataTransfer.files[0];
  if (f) handleFile(f);
}

/* ── Handle File ── */
function handleFile(file) {
  if (!file) return;
  const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
  if (!['.xlsx', '.xls', '.csv'].includes(ext)) {
    setStatus('error', '✕ Please upload an .xlsx, .xls, or .csv file.');
    return;
  }

  setStatus('info', '<span class="spin"></span>&nbsp;Reading file…');

  const reader = new FileReader();
  reader.onload = e => {
    try {
      workbook = XLSX.read(new Uint8Array(e.target.result), {
        type: 'array',
        cellDates: true,
        cellNF: true,
        cellText: true
      });

      document.getElementById('fname').textContent = file.name;
      document.getElementById('fsize').textContent = fmtBytes(file.size);
      document.getElementById('file-bar').style.display   = 'flex';
      document.getElementById('settings').style.display   = 'block';
      document.getElementById('action-bar').style.display = 'block';
      document.getElementById('opt-filename').value = file.name.replace(/\.[^.]+$/, '');

      buildSheetTabs();
      activeSheet = workbook.SheetNames[0];
      renderPreview();
      setStatus('success', `✓ Loaded ${workbook.SheetNames.length} sheet(s) — ready to convert.`);
    } catch (err) {
      setStatus('error', '✕ Could not read file: ' + err.message);
    }
  };
  reader.readAsArrayBuffer(file);
}

/* ── Sheet Tabs ── */
function buildSheetTabs() {
  const wrap = document.getElementById('sheet-tabs');
  wrap.innerHTML = '';
  if (workbook.SheetNames.length < 2) { wrap.style.display = 'none'; return; }
  wrap.style.display = 'flex';
  workbook.SheetNames.forEach(name => {
    const btn = document.createElement('button');
    btn.className = 'stab' + (name === activeSheet ? ' active' : '');
    btn.textContent = name;
    btn.onclick = () => {
      activeSheet = name;
      wrap.querySelectorAll('.stab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderPreview();
    };
    wrap.appendChild(btn);
  });
}


function formatExcelValue(value) {
  if (value instanceof Date) {
    return value.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }
  return value;
}

/* ── Preview ── */
function renderPreview() {
  if (!workbook) return;
  const sheet = workbook.Sheets[activeSheet];
  const allRows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: '',
    raw: false
  });
  const maxOpt  = document.getElementById('opt-preview').value;
  const rows    = maxOpt === 'all' ? allRows : allRows.slice(0, parseInt(maxOpt) + 1);

  const table = document.getElementById('preview-table');
  table.innerHTML = '';

  if (!allRows.length) {
    document.getElementById('preview-wrap').style.display = 'none';
    return;
  }

  const headers = rows[0] || [];

  // thead
  const thead = table.createTHead();
  const hRow  = thead.insertRow();
  headers.forEach(h => {
    const th = document.createElement('th');
    th.textContent = h !== '' ? h : '—';
    hRow.appendChild(th);
  });

  // tbody
  const tbody = table.createTBody();
  rows.slice(1).forEach(row => {
    const tr = tbody.insertRow();
    headers.forEach((_, ci) => {
      const td = tr.insertCell();
      td.textContent = (row[ci] !== undefined && row[ci] !== '')
        ? formatExcelValue(row[ci])
        : '';
    });
  });

  const totalRows = allRows.length - 1;
  document.getElementById('preview-info').textContent =
    `"${activeSheet}" · ${totalRows} row${totalRows !== 1 ? 's' : ''} · ${headers.length} columns`;

  document.getElementById('preview-wrap').style.display = 'flex';
}

/* ── Convert ── */
async function convertToPDF() {
  if (!workbook) return;
  const btn = document.getElementById('btn-convert');
  btn.disabled = true;
  setStatus('info', '<span class="spin"></span>&nbsp;Generating PDF…');

  try {
    await new Promise(r => setTimeout(r, 30));

    const { jsPDF } = window.jspdf;
    const page     = document.getElementById('opt-page').value;
    const orient   = document.getElementById('opt-orient').value;
    const fontSize = parseInt(document.getElementById('opt-font').value);
    const filename = (document.getElementById('opt-filename').value.trim() || 'converted') + '.pdf';

    const doc = new jsPDF({ orientation: orient, unit: 'pt', format: page });

    workbook.SheetNames.forEach((sheetName, idx) => {
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        defval: '',
        raw: false
      });
      if (!rows.length) return;
      if (idx > 0) doc.addPage(page, orient);

      const pageW = doc.internal.pageSize.getWidth();

      // Sheet title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(fontSize + 3);
      doc.setTextColor(80, 70, 200);
      doc.text(sheetName, 36, 34);

      // Meta line
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(fontSize - 1);
      doc.setTextColor(140, 140, 165);
      doc.text(`${rows.length - 1} rows · ${(rows[0] || []).length} columns`, 36, 48);

      const headers = (rows[0] || []).map(h => String(h));
      const body = rows.slice(1).map(r =>
        headers.map((_, ci) => {
          let value = r[ci];

          if (value === undefined || value === null) {
            return '';
          }

          return String(value);
        })
      );

      doc.autoTable({
        head: [headers],
        body: body,
        startY: 58,
        margin: { left: 28, right: 28 },
        styles: {
          fontSize,
          cellPadding: 3.2,
          overflow: 'linebreak',
          valign: 'middle',
          textColor: [25, 25, 40],
        },
        headStyles: {
          fillColor: [108, 99, 255],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize,
        },
        alternateRowStyles: { fillColor: [246, 245, 255] },
        tableLineColor: [215, 215, 235],
        tableLineWidth: 0.3,
        didDrawPage: () => {
          const pageH = doc.internal.pageSize.getHeight();
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(6.5);
          doc.setTextColor(180, 180, 200);
          doc.text(
            `Page ${doc.internal.getCurrentPageInfo().pageNumber}  ·  ${filename}  ·  ${sheetName}`,
            pageW / 2, pageH - 14,
            { align: 'center' }
          );
        }
      });
    });

    doc.save(filename);
    setStatus('success', `✓ Saved as "${filename}"`);
  } catch (err) {
    setStatus('error', '✕ Conversion failed: ' + err.message);
  }

  btn.disabled = false;
}

/* ── Reset ── */
function resetAll() {
  workbook = activeSheet = null;
  document.getElementById('file-input').value = '';
  ['file-bar','settings','action-bar','sheet-tabs','preview-wrap','status']
    .forEach(id => {
      const el = document.getElementById(id);
      el.style.display = 'none';
    });
}

/* ── Helpers ── */
function setStatus(type, html) {
  const el = document.getElementById('status');
  el.className = type;
  el.innerHTML = html;
  el.style.display = 'flex';
}

function fmtBytes(n) {
  if (n < 1024)        return n + ' B';
  if (n < 1048576)     return (n / 1024).toFixed(1) + ' KB';
  return (n / 1048576).toFixed(2) + ' MB';
}
