import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { InPatienrservicesService } from '../in-patienrservices.service';

@Component({
  selector: 'app-finalbill-print',
  templateUrl: './finalbill-print.component.html',
  styleUrls: ['./finalbill-print.component.scss']
})
export class FinalbillPrintComponent implements OnInit {

  constructor(
    private location: Location,
    private service: InPatienrservicesService
  ) { }

  bill_data: any[] = [];
  user_id: any;
  usr_nm: any;

  INwords: string = 'ZERO';
  final_bill_no: any = '';

  paymentMode: string = 'CASH';
  cash: any = 0;
  upi: any = 0;
  transactionId: any = '';

  rent_room: any = 0;
  treatment_charges: any = 0;
  equipment_charges: any = 0;
  blood: any = 0;
  drug_charges: any = 0;
  nursing_charges: any = 0;
  misc_charges: any = 0;
  pulse_oximeter: any = 0;
  oxygen_charges: any = 0;
  grandTotal: any = 0;

  showSpinner = false;

  ngOnInit(): void {
    const finalBillData = sessionStorage.getItem('finallbill');

    if (finalBillData) {
      this.bill_data = [JSON.parse(finalBillData)];
      this.getOrginalDat();
    } else {
      this.bill_data = [{}];
      alert('Final bill data not found');
    }

    this.user_id = localStorage.getItem('user_id');
    this.usr_nm = localStorage.getItem('usr_nm');
  }

  print() {
    setTimeout(() => window.print(), 200);
  }

  Back() {
    this.location.back();
  }

  toAmount(value: any): number {
    return Number(value) || 0;
  }

  formatDate(dateString: string, includeTime: boolean = true): string {
    if (!dateString || dateString === 'null') return '-';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';

    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      ...(includeTime ? { hour: '2-digit', minute: '2-digit', hour12: true } : {})
    };

    return date.toLocaleDateString('en-GB', options);
  }

  getOrginalDat() {
    if (!this.bill_data?.[0]?.uh_id || !this.bill_data?.[0]?.ip_number) return;

    const data = {
      uh_id: this.bill_data[0].uh_id,
      ip_number: this.bill_data[0].ip_number
    };

    this.showSpinner = true;

    this.service.getIPpatientFinallBilldata(data).subscribe({
      next: (res: any) => {
        this.showSpinner = false;

        const row = res?.data?.[0];

        if (!row) {
          this.calculateGrandTotal();
          return;
        }

        this.final_bill_no = row.final_bill_no || '';

        this.rent_room = this.toAmount(row.rent_room);
        this.treatment_charges = this.toAmount(row.treatment_charges);
        this.equipment_charges = this.toAmount(row.equipment_charges);
        this.blood = this.toAmount(row.blood);
        this.drug_charges = this.toAmount(row.drug_charges);
        this.nursing_charges = this.toAmount(row.nursing_charges);
        this.misc_charges = this.toAmount(row.misc_charges);
        this.pulse_oximeter = this.toAmount(row.pulse_oximeter);
        this.oxygen_charges = this.toAmount(row.oxygen_charges);

        this.grandTotal = this.toAmount(row.grandTotal);

        this.paymentMode = row.paymentMode || 'CASH';
        this.cash = this.toAmount(row.cash);
        this.upi = this.toAmount(row.upi);
        this.transactionId = row.transactionId || '';

        this.updateAmountWords();
      },
      error: () => {
        this.showSpinner = false;
        alert('Failed to load final bill data');
      }
    });
  }

  calculateGrandTotal() {
    this.grandTotal =
      this.toAmount(this.rent_room) +
      this.toAmount(this.treatment_charges) +
      this.toAmount(this.equipment_charges) +
      this.toAmount(this.blood) +
      this.toAmount(this.drug_charges) +
      this.toAmount(this.nursing_charges) +
      this.toAmount(this.misc_charges) +
      this.toAmount(this.pulse_oximeter) +
      this.toAmount(this.oxygen_charges);

    this.grandTotal = Number(this.grandTotal.toFixed(2));

    if (this.paymentMode === 'CASH') {
      this.cash = this.grandTotal;
      this.upi = 0;
    }

    if (this.paymentMode === 'UPI') {
      this.cash = 0;
      this.upi = this.grandTotal;
    }

    this.updateAmountWords();
  }

  updateAmountWords() {
    const amount = Math.round(this.toAmount(this.grandTotal));
    this.INwords = amount > 0 ? this.convertNumberToIndianWords(amount).toUpperCase() : 'ZERO';
  }

  convertNumberToIndianWords(num: number): string {
    const ones = [
      '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
      'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
      'sixteen', 'seventeen', 'eighteen', 'nineteen'
    ];

    const tens = [
      '', '', 'twenty', 'thirty', 'forty', 'fifty',
      'sixty', 'seventy', 'eighty', 'ninety'
    ];

    const belowHundred = (n: number): string => {
      if (n < 20) return ones[n];
      return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    };

    const belowThousand = (n: number): string => {
      let word = '';
      if (n >= 100) {
        word += ones[Math.floor(n / 100)] + ' hundred';
        if (n % 100) word += ' and ';
      }
      word += belowHundred(n % 100);
      return word.trim();
    };

    if (num === 0) return 'zero';

    let words = '';

    const crore = Math.floor(num / 10000000);
    num %= 10000000;

    const lakh = Math.floor(num / 100000);
    num %= 100000;

    const thousand = Math.floor(num / 1000);
    num %= 1000;

    if (crore) words += belowThousand(crore) + ' crore ';
    if (lakh) words += belowThousand(lakh) + ' lakh ';
    if (thousand) words += belowThousand(thousand) + ' thousand ';
    if (num) words += belowThousand(num);

    return words.trim();
  }

  onPaymentModeChange() {
    if (this.paymentMode === 'CASH') {
      this.cash = this.grandTotal;
      this.upi = 0;
      this.transactionId = '';
    }

    if (this.paymentMode === 'UPI') {
      this.cash = 0;
      this.upi = this.grandTotal;
    }

    if (this.paymentMode === 'BOTH') {
      this.cash = 0;
      this.upi = 0;
    }
  }

  submitFinallBill() {
    this.calculateGrandTotal();

    if (this.grandTotal <= 0) {
      alert('Please enter bill amount');
      return;
    }

    if (!this.paymentMode) {
      alert('Please select payment mode');
      return;
    }

    if (this.paymentMode === 'BOTH') {
      const paidTotal = this.toAmount(this.cash) + this.toAmount(this.upi);

      if (Number(paidTotal.toFixed(2)) !== Number(this.grandTotal.toFixed(2))) {
        alert('Cash + UPI amount should be equal to Grand Total');
        return;
      }
    }

    const data = {
      uh_id: this.bill_data[0]?.uh_id,
      ip_number: this.bill_data[0]?.ip_number,
      name: this.bill_data[0]?.name || '',

      rent_room: this.toAmount(this.rent_room),
      treatment_charges: this.toAmount(this.treatment_charges),
      equipment_charges: this.toAmount(this.equipment_charges),
      blood: this.toAmount(this.blood),
      drug_charges: this.toAmount(this.drug_charges),
      nursing_charges: this.toAmount(this.nursing_charges),
      misc_charges: this.toAmount(this.misc_charges),
      pulse_oximeter: this.toAmount(this.pulse_oximeter),
      oxygen_charges: this.toAmount(this.oxygen_charges),
      grandTotal: this.toAmount(this.grandTotal),
      // totalamount: this.toAmount(this.grandTotal),

      paymentMode: this.paymentMode,
      cash: this.paymentMode === 'CASH' ? this.grandTotal : this.toAmount(this.cash),
      upi: this.paymentMode === 'UPI' ? this.grandTotal : this.toAmount(this.upi),
      transactionId: this.transactionId || '',

      user_id: localStorage.getItem('user_id'),
      usr_nm: localStorage.getItem('usr_nm')
    };
    this.showSpinner = true;
    this.service.saveIPpatientFinallBill(data).subscribe({
      next: (res: any) => {
        this.showSpinner = false;
        if (res?.status === 200) {
          alert('Success');
          this.getOrginalDat();
        } else {
          alert(res?.message || 'Failed to save final bill');
        }
      },
      error: (err: any) => {
        this.showSpinner = false;
        console.error('Final bill save error:', err);
        alert('Server error while saving final bill');
      }
    });
  }

  numericOnly(event: any): void {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode !== 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }
}