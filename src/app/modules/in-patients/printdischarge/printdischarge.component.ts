import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-printdischarge',
  templateUrl: './printdischarge.component.html',
  styleUrls: ['./printdischarge.component.scss']
})
export class PrintdischargeComponent implements OnInit {
  singleData: any = {};
  gender: string[] = [];
  assigned_date: string = '';
  completed_date: string = '';
  d_name: string = '';

  constructor(private route: ActivatedRoute, private router: Router) { }


  ngOnInit(): void {

    const stateData = history.state?.printData;

    if (stateData) {
      this.singleData = stateData;

      this.gender = [this.singleData.gender || '-'];
      this.assigned_date = this.singleData.admin_date || '-';
      this.completed_date = this.singleData.discharge_date || '-';
      this.d_name = this.singleData.entry_name || '-';
      if (this.singleData.medications_given) {
        this.singleData.medications_given =
          this.singleData.medications_given
            .split('\n')
            .filter((med: string) => med.trim() !== '')
            .join(', ');
      }
    } else {

      this.router.navigate(['/in-patients/dischargesummary']);
    }
  }

  openPDF() {
    window.print();
  }

  Back() {
    this.router.navigate(['/in-patients/dischargesummary']);
  }

}
