import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DoctorserviceService } from '../doctorservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assign-lab-tests',
  templateUrl: './assign-lab-tests.component.html',
  styleUrls: ['./assign-lab-tests.component.scss']
})
export class AssignLabTestsComponent implements OnInit {

  @Output() selectedTestsChange = new EventEmitter<any[]>();

  labTests: any[] = [];
  selectedTests: any[] = [];
  searchText: string = '';

  patient: any = null;
  uhid: string = '';

  constructor(private service: DoctorserviceService) { }

  ngOnInit(): void {
    this.getLabTests();
  }

  getLabTests() {
    this.service.get_labtest().subscribe((res: any) => {
      this.labTests = res.data || [];
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
      if (res.status === 200 && res.data && res.data.length > 0) {
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

  get filteredLabTests() {
    const text = this.searchText.toLowerCase().trim();

    if (!text) {
      return this.labTests;
    }

    return this.labTests.filter((t: any) =>
      (t.labtest || '').toLowerCase().includes(text) ||
      (t.category_name || '').toLowerCase().includes(text)
    );
  }

  isSelected(test: any): boolean {
    return this.selectedTests.some((x: any) => x.labtest_id === test.id);
  }

  toggleTest(test: any, event: any) {
    if (event.target.checked) {
      const exists = this.selectedTests.some((x: any) => x.labtest_id === test.id);

      if (!exists) {
        this.selectedTests.push({
          labtest_id: test.id,
          category_id: test.category_id,
          category_name: test.category_name,
          labtest: test.labtest,
          amount: test.amount,
          group_name: null
        });
      }
    } else {
      this.selectedTests = this.selectedTests.filter((x: any) => x.labtest_id !== test.id);
    }

    this.selectedTestsChange.emit(this.selectedTests);
  }

  removeTest(index: number) {
    this.selectedTests.splice(index, 1);
    this.selectedTestsChange.emit(this.selectedTests);
  }

  clearAll() {
    this.selectedTests = [];
    this.selectedTestsChange.emit(this.selectedTests);
  }

  get totalAmount(): number {
    return this.selectedTests.reduce((sum: number, item: any) => {
      return sum + Number(item.amount || 0);
    }, 0);
  }

  submitLabOrders() {
    if (!this.patient) {
      Swal.fire('Search patient first');
      return;
    }

    if (!this.selectedTests.length) {
      Swal.fire('Select at least one lab test');
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
        complaint: 'LAB TEST ORDER',
        examination: 'LAB TEST ORDER',
        advice: 'LAB TEST ORDER',
        labs_total: this.totalAmount,
        diagnostic_total: 0,
        op_date: ''
      },
      medicinearry: [],
      medicallistArr_lab: this.selectedTests,
      xarrayData: [],
      groupTestdts: null,
      final_diagnoss: '-'
    };

    this.service.post_doctor_patient(data).subscribe((res: any) => {
      if (res.status === 200) {
        Swal.fire('Success', 'Lab tests assigned successfully', 'success');

        this.clearAll();
        this.uhid = '';
        this.patient = null;
      }
    });
  }
}
