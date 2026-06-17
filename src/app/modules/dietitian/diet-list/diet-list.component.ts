import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DietService } from '../diet.service';

@Component({
  selector: 'app-diet-list',
  templateUrl: './diet-list.component.html',
  styleUrls: ['./diet-list.component.scss']
})
export class DietListComponent implements OnInit {

  loading = false;

  rows: any[] = [];
  filtered: any[] = [];

  search = '';
  filterDate = '';
  filterDietType = '';

  // modal
  isModalOpen = false;
  selected: any = null;

  // view/edit mode
  modalMode: 'view' | 'edit' = 'view';
  editForm!: FormGroup;

  constructor(
    private dietService: DietService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.fetchList();
  }

  fetchList(): void {
    this.loading = true;

    this.dietService.getdiet().subscribe({
      next: (res) => {
        this.rows = res?.data || [];
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
       
        this.loading = false;
        this.rows = [];
        this.filtered = [];
      }
    });
  }

  applyFilters(): void {
    const q = (this.search || '').toLowerCase().trim();

    this.filtered = (this.rows || []).filter((r) => {
      const matchesSearch =
        !q ||
        String(r.patientid || '').toLowerCase().includes(q) ||
        String(r.patientname || '').toLowerCase().includes(q) ||
        String(r.wardroom || '').toLowerCase().includes(q);

      const matchesDate =
        !this.filterDate || String(r.dietdate || '').startsWith(this.filterDate);

      const matchesDietType =
        !this.filterDietType ||
        String(r.diettype || '').toLowerCase() === this.filterDietType.toLowerCase();

      return matchesSearch && matchesDate && matchesDietType;
    });
  }

  clearFilters(): void {
    this.search = '';
    this.filterDate = '';
    this.filterDietType = '';
    this.applyFilters();
  }

  openView(row: any, ev?: MouseEvent): void {
    ev?.stopPropagation();
    this.selected = row;
    this.modalMode = 'view';
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  editRow(row: any, ev?: MouseEvent): void {
    ev?.stopPropagation();
    this.selected = row;
    this.modalMode = 'edit';
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
    this.buildEditForm(row);
  }

  startEdit(): void {
    if (!this.selected) return;
    this.modalMode = 'edit';
    this.buildEditForm(this.selected);
  }

  cancelEdit(): void {
    this.modalMode = 'view';
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selected = null;
    this.modalMode = 'view';
    document.body.style.overflow = '';
  }

  buildEditForm(row: any): void {
    const dietdate = this.toInputDate(row?.dietdate);

    this.editForm = this.fb.group({
      wardroom: [row?.wardroom || ''],
      dietdate: [dietdate || ''],
      diettype: [row?.diettype || ''],
      calories: [row?.calories || ''],
      allergies: [row?.allergies || ''],
      notes: [row?.notes || ''],
      breakfast: [row?.breakfast || ''],
      lunch: [row?.lunch || ''],
      dinner: [row?.dinner || ''],
      snacks: [row?.snacks || '']
    });
  }

saveEdit(): void {
  if (!this.selected) return;

  const id = this.selected.id;   // ✅ because your SELECT includes id

  const payload = {
    ...this.selected,
    ...this.editForm.value
  };

  this.dietService.updateDiet(id, payload).subscribe({
    next: (res) => {
      alert('Diet updated successfully ✅');
      this.fetchList();     // refresh table
      this.modalMode = 'view';
      this.selected = payload; // show updated in view
    },
    error: (err) => {
      
      alert('Update failed ❌');
    }
  });
}


  toInputDate(value: any): string {
    if (!value) return '';

    // already yyyy-MM-dd
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

    // dd-mm-yyyy
    if (typeof value === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(value)) {
      const [dd, mm, yyyy] = value.split('-');
      return `${yyyy}-${mm}-${dd}`;
    }

    const d = new Date(value);
    if (isNaN(d.getTime())) return '';
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  




printRow(row: any, ev?: MouseEvent): void {
  ev?.preventDefault();
  ev?.stopPropagation();
  (ev as any)?.stopImmediatePropagation?.();  // extra safe

  if (!row) return;

  // ✅ Direct print from row (NO modal open, NO edit)
  this.printDietFromRow(row);
}
private printDietFromRow(row: any): void {
  const title = `Diet Plan - ${row?.patientname || row?.wardroom || ''}`.trim();
  const styleText = this.getPrintStyles();

  const w = window.open('', '_blank', 'width=900,height=650');
  if (!w) return;

  const html = `
    <div class="print-page">
      <div class="print-head">
        <div class="h-title">Diet Plan</div>
        <div class="h-sub">
          Patient: <b>${this.escapeHtml(row?.patientname || '-')}</b>
          &nbsp;|&nbsp;
          ID: <b>${this.escapeHtml(row?.patientid || '-')}</b>
          <br/>
          &nbsp;|&nbsp;
          Date: <b>${this.escapeHtml(this.formatDate(row?.dietdate))}</b>
        </div>
      </div>

      <div class="grid print-area">
        <div class="box"><b>Date</b><span>${this.escapeHtml(this.formatDate(row?.dietdate))}</span></div>
        <div class="box"><b>Diet Type</b><span>${this.escapeHtml(row?.diettype || '-')}</span></div>
        <div class="box"><b>Calories</b><span>${this.escapeHtml(row?.calories || '-')}</span></div>

        <div class="box wide"><b>Allergies</b><span>${this.escapeHtml(row?.allergies || '-')}</span></div>
        <div class="box wide"><b>Notes</b><span>${this.escapeHtml(row?.notes || '-')}</span></div>

        <div class="box wide"><b>Breakfast</b><span>${this.escapeHtml(row?.breakfast || '-')}</span></div>
        <div class="box wide"><b>Lunch</b><span>${this.escapeHtml(row?.lunch || '-')}</span></div>
        <div class="box wide"><b>Dinner</b><span>${this.escapeHtml(row?.dinner || '-')}</span></div>
        <div class="box wide"><b>Snacks</b><span>${this.escapeHtml(row?.snacks || '-')}</span></div>
      </div>
    </div>
  `;

  w.document.open();
  w.document.write(`
    <html>
      <head>
        <title>${this.escapeHtml(title)}</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style>${styleText}</style>
      </head>
      <body>
        ${html}
        <script>
          window.onload = function(){
            window.focus();
            window.print();
            setTimeout(() => window.close(), 200);
          }
        </script>
      </body>
    </html>
  `);
  w.document.close();
}

printDietPlan(): void {
  if (!this.selected) return;

  const printEl = document.getElementById('dietPrintArea');
  if (!printEl) return;

  const title = `Diet Plan - ${this.selected?.patientname || this.selected?.wardroom || ''}`.trim();

  // ✅ Grab your component styles (optional but helpful)
  const styleText = this.getPrintStyles();

  const w = window.open('', '_blank', 'width=900,height=650');
  if (!w) return;

  w.document.open();
  w.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style>
          ${styleText}
        </style>
      </head>
      <body>
        <div class="print-page">
          <div class="print-head">
            <div class="h-title">Diet Plan</div>
            <div class="h-sub">
              Ward/Room: <b>${this.escapeHtml(this.selected?.wardroom || '-')}</b>
              &nbsp;|&nbsp;
              Date: <b>${this.formatDate(this.selected?.dietdate)}</b>
            </div>
          </div>

          ${printEl.outerHTML}
        </div>

        <script>
          window.onload = function(){
            window.focus();
            window.print();
            setTimeout(() => window.close(), 200);
          }
        </script>
      </body>
    </html>
  `);
  w.document.close();
}

private formatDate(v: any): string {
  if (!v) return '-';
  const d = new Date(v);
  if (isNaN(d.getTime())) return String(v);
  // dd-MMM-yyyy like 16-Feb-2026
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

private escapeHtml(text: any): string {
  const s = String(text ?? '');
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
private getPrintStyles(): string {
  return `
    /* ===== A4 PRINT ===== */
    @page { size: A4; margin: 8mm; }
    html, body { margin: 0; padding: 0; background: #fff; color: #0b1220; }
    body {
      font-family: Arial, sans-serif;
      font-size: 13px;
      line-height: 1.35;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .no-print { display: none !important; }

    /* ===== PAGE WRAP ===== */
    .print-page{
      width: 100%;
      padding: 0;
    }

    /* ===== HEADER ===== */
    .print-head{
      display:flex;
      flex-direction:column;
      gap:6px;
      padding-bottom:10px;
      margin-bottom:12px;
      border-bottom:2px solid #e5e7eb;
    }

    .h-title{
      font-size: 18px;
      font-weight: 800;
      letter-spacing: .2px;
      margin:0;
    }

    .h-sub{
      font-size: 12.5px;
      color:#334155;
      margin:0;
    }

    /* ===== GRID LAYOUT ===== */
    .grid{
      display:grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    /* For long sections */
    .wide{ grid-column: 1 / -1; }

    /* ===== BOX STYLE ===== */
    .box{
      border: 1px solid #dbe3ee;
      border-radius: 10px;
      padding: 10px 12px;
      background: #fff;
      page-break-inside: avoid;
    }

    .box b{
      display:block;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: .3px;
      text-transform: uppercase;
      color:#0f172a;
      margin-bottom: 6px;
    }

    .box span{
      display:block;
      font-size: 13px;
      color:#111827;
      white-space: pre-wrap;
      word-break: break-word;
    }

    /* ===== Make long meal text look better ===== */
    .box.wide span{
      line-height: 1.45;
    }

    /* ===== Avoid huge empty bottom ===== */
    .print-area{ margin-top: 0; }
  `;
}
















}
