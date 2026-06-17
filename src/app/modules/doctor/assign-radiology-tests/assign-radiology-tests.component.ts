import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DoctorserviceService } from '../doctorservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assign-radiology-tests',
  templateUrl: './assign-radiology-tests.component.html',
  styleUrls: ['./assign-radiology-tests.component.scss']
})
export class AssignRadiologyTestsComponent implements OnInit {
@Output() selectedRadiologyChange = new EventEmitter<any[]>();

  radiologyTests: any[] = [];
  selectedTests: any[] = [];
  searchText: string = '';

  patient: any = null;
  uhid: string = '';

  constructor(private service: DoctorserviceService) { }

  ngOnInit(): void {
    this.getDiagnosticTests();
  }

  getDiagnosticTests() {
    this.service.getdiagnosticTests().subscribe((res: any) => {
      this.radiologyTests = res.data || [];
    });
  }

  searchPatient() {
    if (!this.uhid || this.uhid.trim() === '') {
      Swal.fire('Enter UHID');
      return;
    }

    this.service.getPatientByUhidOrMobile({
      searchValue: this.uhid.trim()
    }).subscribe((res: any) => {
      if (res.status === 200 && res.data?.length) {
        this.patient = res.data[0];

        Swal.fire({
          icon: 'success',
          title: 'Patient details loaded',
          timer: 1000,
          showConfirmButton: false
        });
      } else {
        this.patient = null;
        Swal.fire('Patient not found');
      }
    });
  }

  get filteredTests() {
    const text = (this.searchText || '').toLowerCase().trim();

    if (!text) {
      return this.radiologyTests;
    }

    return this.radiologyTests.filter((t: any) =>
      (t.d_test_name || '').toLowerCase().includes(text)
    );
  }

  isSelected(test: any): boolean {
    return this.selectedTests.some(
      (x: any) => x.d_test_name === test.d_test_name
    );
  }

  toggleTest(test: any, event: any) {
    if (event.target.checked) {
      const exists = this.selectedTests.some(
        (x: any) => x.d_test_name === test.d_test_name
      );

      if (!exists) {
        this.selectedTests.push({
          d_test_name: test.d_test_name,
          d_test_amount: test.d_test_amount,
          d_test_report: test.d_test_report,
          d_test_report_type: test.d_test_report_type,
          d_test_brief: test.d_test_brief
        });
      }
    } else {
      this.selectedTests = this.selectedTests.filter(
        (x: any) => x.d_test_name !== test.d_test_name
      );
    }

    this.selectedRadiologyChange.emit(this.selectedTests);
  }

  removeTest(index: number) {
    this.selectedTests.splice(index, 1);
    this.selectedRadiologyChange.emit(this.selectedTests);
  }

  clearAll() {
    this.selectedTests = [];
    this.selectedRadiologyChange.emit(this.selectedTests);
  }

  get totalAmount(): number {
    return this.selectedTests.reduce(
      (sum: number, item: any) => sum + Number(item.d_test_amount || 0),
      0
    );
  }

  submitLabOrders() {
    if (!this.patient) {
      Swal.fire('Search patient first');
      return;
    }

    if (!this.selectedTests.length) {
      Swal.fire('Select at least one radiology test');
      return;
    }

    const data = {
      doctor_frm: {
        uh_id: this.patient.uh_id,
        patient_type: 'OLD',
        date: new Date().toISOString().substring(0, 10),
        name: this.patient.title || '',
        full_name: this.patient.name || '',
        age: this.patient.age || '',
        gender: this.patient.gender || '',
        phone_number: this.patient.phone_number || this.patient.mobile || '',
        complaint: 'RADIOLOGY TEST ORDER',
        examination: 'RADIOLOGY TEST ORDER',
        advice: 'RADIOLOGY TEST ORDER',
        labs_total: 0,
        diagnostic_total: this.totalAmount,
        op_date: ''
      },
      medicinearry: [],
      medicallistArr_lab: [],
      xarrayData: this.selectedTests,
      groupTestdts: null,
      final_diagnoss: '-'
    };

    this.service.post_doctor_patient(data).subscribe((res: any) => {
      if (res.status === 200) {
        Swal.fire('Success', 'Radiology tests assigned successfully', 'success');

        this.clearAll();
        this.uhid = '';
        this.patient = null;
      }
    });
  }
}