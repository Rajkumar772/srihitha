import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { LabsServicesService } from '../labs-services.service';

@Component({
  selector: 'app-perform-lab-tests',
  templateUrl: './perform-lab-tests.component.html',
  styleUrls: ['./perform-lab-tests.component.scss']
})

export class PerformLabTestsComponent {

  form: FormGroup
  myform: FormGroup

  patients_data: any;
  labsdata: any;
  showSpinner: boolean = false
  category: any
  value1: any;

  user_id: any;
  usr_nm: any;

  constructor(public formBuilder: FormBuilder, public myservice: LabsServicesService, public route: ActivatedRoute, private router: Router, public datePipe: DatePipe, public modalService: NgbModal) {

    this.user_id = localStorage.getItem("user_id");
    this.usr_nm = localStorage.getItem("usr_nm");

    this.getpatients();
    this.form = this.formBuilder.group({
      uh_id: [''],
      name: [''],
      age: [''],
      number: ['']
    });

    this.myservice.getCategory().subscribe((res: any) => {
      this.category = res.data;
    });
  }

  getpatients() {
    this.myservice.getlabreportsnum().subscribe((res: any) => {
      this.patients_data = res.data;
      console.log(this.patients_data,50);
    })
  }


  clcick() {
    this.router.navigate(['/labsmdl/Lab-tests-reports'])
  }

  selectId(data) {
    this.patients_data.map((res: any) => {
      if (res.id == data.id) {
        this.form.patchValue({
          uh_id: data.pid,
          name: res.name,
          age: res.age,
          number: res.number
        })
      }
    })
    this.gettestnames(data.id)
  }

  show: boolean = false;


  resultArrays: any;
  current_test_id: any;


  gettestnames(event) {
    this.current_test_id = event
    var data = {
      id: event
    }
    this.showSpinner = true
    this.myservice.getlabtestnames(data).subscribe((res: any) => {
      this.showSpinner = false
      if (res.data.length > 0) {
        this.show = true
      }
      this.resultArrays = res.data

      res.data.forEach(test => {
        test['value'] = 0;
      });
      this.groupDataByCategoryAndLabTest()
    })
  }


  forOneTestLab: any = [];

  preventLeadingTrailingSpace(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    // Allow space if it is between characters
    if (event.key === ' ' && (value.length === 0 || value.endsWith(' '))) {
      event.preventDefault();
    }
  }

  submitOneTest(group) {
    Swal.fire({
      title: "Only Non-Zero Test Fields will be Added",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`
    }).then((result) => {
      if (result.isConfirmed) {
        var onlyTests = group;
        const everyFieldZero = onlyTests.some(item => item.value != 0 || item.value != "")
        const NothasZeroValue = onlyTests.filter(item => item.value != 0 || item.value != "");
        if (!everyFieldZero) {
          Swal.fire("Atleast Anyone of the Field Value should be Entered");
        }
        else {
          for (let item of onlyTests) {
            item.submitted = true;
            item.status = true;
          }
          this.forOneTestLab.push(...NothasZeroValue); // Use spread operator to flatten array
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Category Fields are Added',
            showConfirmButton: false,
            timer: 1500
          });
        }

      } else if (result.isDenied) {
        Swal.fire("Category Fields are not Added");
      }
    });
  }


  canSubmitTest(group): boolean {
    if (group && Array.isArray(group)) {
      var onlyTests = group;
      return onlyTests.some(item => !item.submitted);
    } else {
      return false;
    }
  }

  getButtonLabel(group): string {
    if (group && Array.isArray(group)) {
      return this.canSubmitTest(group) ? 'ADD TEST' : 'TEST ADDED';
    } else {
      return 'ADD TEST'; // Default label if group is invalid
    }
  }
  uniqueCategories: any[];
  displayedColumns: any[] = ['field', 'value', 'ranges', 'units'];
  groupDataByCategoryAndLabTest() {
    const categories: any = {};

    this.resultArrays.forEach(item => {
      // Check if the category exists, if not, create it
      if (!categories[item.category_name]) {
        categories[item.category_name] = {
          category_name: item.category_name,
          labTests: {}
        };
      }

      // Check if the lab test exists under the category, if not, create it
      if (!categories[item.category_name].labTests[item.labtest_name]) {
        categories[item.category_name].labTests[item.labtest_name] = {
          labtest_name: item.labtest_name,
          fields: []
        };
      }

      // Push the current item into the fields array of the respective lab test
      categories[item.category_name].labTests[item.labtest_name].fields.push(item);
    });

    // Convert the categories object into an array for easier iteration in the template
    this.uniqueCategories = Object.keys(categories).map(key => {
      const category = categories[key];
      category.labTests = Object.keys(category.labTests).map(labTestKey => category.labTests[labTestKey]);
      return category;
    });
  }




  MegaSubmit() {
    // Step 1: Extract unique labtest_name values from the first array
    const uniquelabestNames = [...new Set(this.resultArrays.map(item => item.labtest_name))];
    // Step 2: Check if every unique labtest_name from the first array is in the second array

    const allCategoriesExist = uniquelabestNames.every(labest =>
      this.forOneTestLab.some(item => item.labtest_name === labest)
    );

    if (this.forOneTestLab.length === 0) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Please Add Lab Tests',
        showConfirmButton: false,
        timer: 1500
      });
    }
    else if (!allCategoriesExist) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Please Add All Lab Test Results',
        showConfirmButton: false,
        timer: 1500
      });
    }
    else {
      const data = {
        update_id: this.current_test_id,
        patient_details: this.form.value,
        completeTest: JSON.stringify(this.forOneTestLab),
        user_id: localStorage.getItem('user_id'),
        usr_nm: localStorage.getItem('usr_nm'),
      };
      this.showSpinner = true
      this.myservice.postCall(data).subscribe((res: any) => {
        this.showSpinner = false
        if (res.status === 200) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Successfully Submitted',
            showConfirmButton: false,
            timer: 1500
          });
          this.form.reset();
          this.forOneTestLab = [];
          this.uniqueCategories = [];
          this.show = false;
          this.getpatients();
        }
      }, (error) => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'An error occurred',
          showConfirmButton: false,
          timer: 1500
        });
      });
    }
  }

}