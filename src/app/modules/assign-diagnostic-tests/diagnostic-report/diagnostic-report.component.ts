import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DiagnosticServicesService } from '../diagnostic-services.service';

@Component({
  selector: 'app-diagnostic-report',
  templateUrl: './diagnostic-report.component.html',
  styleUrls: ['./diagnostic-report.component.scss']
})
export class DiagnosticReportComponent implements OnInit {
  loading: boolean = false;

  diagnosticPatients: any[] = [];
  searchText: string = '';

  constructor(
    private service: DiagnosticServicesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getDoctorAssignedRadiology();
  }

  getDoctorAssignedRadiology() {
    this.loading = true;

    this.service.get_tests_from_doctor().subscribe((res: any) => {
      this.loading = false;

      if (res.status === 200) {
        this.diagnosticPatients = res.data || [];
      } else {
        this.diagnosticPatients = [];
      }
      console.log(this.diagnosticPatients);

    }, () => {
      this.loading = false;
      this.diagnosticPatients = [];
      Swal.fire('Error', 'Unable to load radiology tests', 'error');
    });
  }

  get filteredPatients() {
   
    
    const text = (this.searchText || '').toLowerCase().trim();

    if (!text) {
      return this.diagnosticPatients;
    }

    return this.diagnosticPatients.filter((p: any) =>
      (p.uh_id || '').toLowerCase().includes(text) ||
      (p.name || '').toLowerCase().includes(text) ||
      (p.full_name || '').toLowerCase().includes(text) ||
      (p.phone_number || '').toLowerCase().includes(text)
    );
  }

  printDiagnostic(row: any) {
    const tests = row.tests || row.test_details || row.xarrayData || row.radiology_tests || [];

    const printData = {
      ...row,
      tests: tests
    };

    sessionStorage.setItem('diagnostic-print', JSON.stringify(printData));
    sessionStorage.setItem('phone_number', row.phone_number || row.mobile || '');

    this.router.navigate(['/diagnostic-print']);
  }
}
