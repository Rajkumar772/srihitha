import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dischargeprint',
  templateUrl: './dischargeprint.component.html',
  styleUrls: ['./dischargeprint.component.scss']
})
export class DischargeprintComponent implements OnInit {
 singleData: any = {};
  gender: string[] = [];
  assigned_date: string = '';
  completed_date: string = '';
  d_name: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['printData']) {
        // Parse the JSON string
        this.singleData = JSON.parse(params['printData']);
       
        this.gender = [this.singleData.gender || '-'];
        this.assigned_date = this.singleData.admin_date || '-';
        this.completed_date = this.singleData.discharge_date || '-';
        this.d_name = this.singleData.entry_name || '-';
      } else {
        
      }
    });
    if (this.singleData.medications_given) {
  this.singleData.medications_given =
    this.singleData.medications_given
      .split('\n')
      .filter((med: string) => med.trim() !== '')
      .join(', ');
}
  }

  openPDF() {
    window.print();
  }

  Back() {
    this.router.navigate(['/previouspage']);
  }
}
