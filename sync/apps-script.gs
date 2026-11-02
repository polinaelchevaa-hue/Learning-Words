/**
 * Word Cards — progress sync.
 * Paste this whole file into Extensions → Apps Script of your Google Sheet,
 * then Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone).
 */
const SHEET_NAME = 'Progress';
const HEAD = ['Group', 'Name', 'Last update', 'Words learned', 'Still learning', 'Tests', 'Data (do not edit)'];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEAD);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEAD.length).setFontWeight('bold').setBackground('#f4c9d6');
    sh.setColumnWidth(4, 260); sh.setColumnWidth(5, 320); sh.setColumnWidth(6, 260); sh.setColumnWidth(7, 120);
  }
  return sh;
}

const key_ = (g, n) => String(g).trim().toLowerCase() + '|' + String(n).trim().toLowerCase();

function findRow_(sh, g, n) {
  const last = sh.getLastRow();
  if (last < 2) return -1;
  const vals = sh.getRange(2, 1, last - 1, 2).getValues();
  const k = key_(g, n);
  for (let i = 0; i < vals.length; i++) if (key_(vals[i][0], vals[i][1]) === k) return i + 2;
  return -1;
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const p = e.parameter || {};
  if (!p.g || !p.n) return out_({ ok: false, error: 'missing' });
  const sh = sheet_();
  const r = findRow_(sh, p.g, p.n);
  if (r < 0) return out_({ ok: true, data: null });
  const raw = sh.getRange(r, 7).getValue();
  let data = null;
  try { data = JSON.parse(raw); } catch (err) {}
  return out_({ ok: true, data: data });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (!d.g || !d.n || !d.data) return out_({ ok: false, error: 'missing' });
    const sh = sheet_();
    const row = [d.g, d.n, new Date(), d.summary || '', d.weak || '', d.tests || '', JSON.stringify(d.data)];
    const r = findRow_(sh, d.g, d.n);
    if (r < 0) sh.appendRow(row); else sh.getRange(r, 1, 1, row.length).setValues([row]);
    return out_({ ok: true });
  } finally {
    lock.releaseLock();
  }
}
