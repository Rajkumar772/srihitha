import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { LabsServicesService } from '../labs-services.service';

@Component({
  selector: 'app-lab-report',
  templateUrl: './lab-report.component.html',
  styleUrls: ['./lab-report.component.scss']
})
export class LabReportComponent implements OnInit {

 loading: boolean = false;

  doctorPatients: any[] = [];
  searchText: string = '';

  constructor(private service: LabsServicesService) { }

  ngOnInit(): void {
    this.getDoctorAssignedPatients();
  }

  getDoctorAssignedPatients() {
    this.loading = true;

    this.service.getdata_assign_labs().subscribe((res: any) => {
      this.loading = false;
      this.doctorPatients = res.status === 200 ? (res.data || []) : [];
    }, () => {
      this.loading = false;
      this.doctorPatients = [];
    });
  }

  get filteredPatients() {
    const text = (this.searchText || '').toLowerCase().trim();

    if (!text) {
      return this.doctorPatients;
    }

    return this.doctorPatients.filter((p: any) =>
      (p.uh_id || '').toLowerCase().includes(text) ||
      (p.full_name || '').toLowerCase().includes(text) ||
      (p.phone_number || '').toLowerCase().includes(text)
    );
  }

  printPatientBill(patient: any) {
    const data = {
      uh_id: patient.uh_id,
      doctor_id: patient.id
    };

    this.loading = true;

    this.service.getdoctorsdata(data).subscribe((res: any) => {
      this.loading = false;

      if (res.status === 200 && res.data?.length) {
        const tests = res.data || [];

        const totalAmount = tests.reduce((sum: number, item: any) => {
          return sum + Number(item.amount || 0);
        }, 0);

        const printData = {
          patient: patient,
          tests: tests,
          totalAmount: totalAmount,
          amountInWords: this.numberToWords(totalAmount)
        };

        sessionStorage.setItem('lab-print-data', JSON.stringify(printData));

window.location.href = '/lab-print';
      } else {
        Swal.fire('No lab tests found for this patient');
      }
    }, () => {
      this.loading = false;
      Swal.fire('Error', 'Unable to load lab tests', 'error');
    });
  }

  numberToWords(num: number): string {
    if (!num) return 'Zero';

    const ones = [
      '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
      'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
      'Seventeen', 'Eighteen', 'Nineteen'
    ];

    const tens = [
      '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty',
      'Sixty', 'Seventy', 'Eighty', 'Ninety'
    ];

    const convert = (n: number): string => {
      if (n < 20) return ones[n];

      if (n < 100) {
        return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
      }

      if (n < 1000) {
        return ones[Math.floor(n / 100)] + ' Hundred ' + (n % 100 ? convert(n % 100) : '');
      }

      if (n < 100000) {
        return convert(Math.floor(n / 1000)) + ' Thousand ' + (n % 1000 ? convert(n % 1000) : '');
      }

      return convert(Math.floor(n / 100000)) + ' Lakh ' + (n % 100000 ? convert(n % 100000) : '');
    };

    return convert(Number(num)).trim();
  }
}