import { Component, OnInit } from '@angular/core';
import { AccountsreportsallService } from '../accountsreportsall.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-all-bills',
  templateUrl: './patient-all-bills.component.html',
  styleUrls: ['./patient-all-bills.component.scss']
})
export class PatientAllBillsComponent {


  searchValue = '';

  patient: any = {};
  summary: any = {};

  bills: any[] = [];
  filteredBills: any[] = [];

  searched = false;
  loading = false;

  activeDept = 'ALL';

  departments = ['ALL', 'OP', 'IP', 'LAB', 'PHARMACY', 'ADVANCE', 'REFUND'];

  selectedBill: any = null;
  billDetails: any[] = [];
  billDetailsTotal = 0;
  showDetailsPopup = false;

  constructor(
    private serv: AccountsreportsallService,
    private router: Router
  ) { }

  ngOnInit() {
    const saved = sessionStorage.getItem('patient_all_bills_state');

    if (saved) {
      const state = JSON.parse(saved);

      this.searchValue = state.searchValue || '';
      this.patient = state.patient || {};
      this.summary = state.summary || {};
      this.bills = state.bills || [];
      this.activeDept = state.activeDept || 'ALL';
      this.searched = state.searched || false;

      this.filterBills(this.activeDept);
    }
  }

  savePageState() {
    sessionStorage.setItem('patient_all_bills_state', JSON.stringify({
      searchValue: this.searchValue,
      patient: this.patient,
      summary: this.summary,
      bills: this.bills,
      activeDept: this.activeDept,
      searched: this.searched
    }));
  }

  getPatientAllBills() {
    if (!this.searchValue || !this.searchValue.trim()) {
      alert('Enter UHID / IP No / Mobile');
      return;
    }

    this.loading = true;
    this.searched = false;

    this.patient = {};
    this.summary = {};
    this.bills = [];
    this.filteredBills = [];

    this.closeDetailsPopup();

    this.serv.getPatientAllBills({
      search_value: this.searchValue.trim()
    }).subscribe({
      next: (res: any) => {
        const data = res?.data || {
          patient: {},
          summary: {},
          bills: []
        };

        this.patient = data.patient || {};
        this.summary = data.summary || {};
        this.bills = data.bills || [];

        this.filterBills('ALL');

        this.searched = true;
        this.loading = false;

        this.savePageState();
      },
      error: (err: any) => {
        console.error('ALL BILLS API ERROR:', err);

        this.patient = {};
        this.summary = {};
        this.bills = [];
        this.filteredBills = [];

        this.searched = true;
        this.loading = false;

        alert('Something went wrong while fetching bills');
      }
    });
  }

  filterBills(type: string) {
    this.activeDept = type;

    this.filteredBills = type === 'ALL'
      ? this.bills
      : this.bills.filter(
        x => String(x.bill_source || '').toUpperCase() === type
      );

    this.savePageState();
  }

  viewBillDetails(row: any) {
    this.selectedBill = row;
    this.billDetails = [];
    this.billDetailsTotal = 0;
    this.showDetailsPopup = true;

    this.serv.getPatientBillDetails({
      bill_source: row.bill_source,
      source_id: row.source_id,
      bill_no: row.bill_no,
      uh_id: row.uh_id
    }).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.billDetails = res.data || [];
          this.billDetailsTotal = res.total || 0;
        }
      },
      error: () => {
        this.billDetails = [];
        this.billDetailsTotal = 0;
      }
    });
  }

  closeDetailsPopup() {
    this.showDetailsPopup = false;
    this.selectedBill = null;
    this.billDetails = [];
    this.billDetailsTotal = 0;
  }

  openPharmacyInvoice(row: any) {
    this.savePageState();

    localStorage.setItem('sale_bill_no', row.bill_no);
    localStorage.setItem('uh_id', row.uh_id);

    this.closeDetailsPopup();

    this.router.navigate(['/salesreportsPrint']);
  }

  printAllBills() {
    if (!this.bills.length) {
      alert('No bills available to print');
      return;
    }

    window.print();
  }
}