import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InPatienrservicesService } from '../in-patienrservices.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { LoginModel } from 'src/app/core/model/login.model';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {
  splitted: any = [];
  patients_data: any = [];
  form: FormGroup;
  checkoutform: FormGroup;
  checkoutforms: FormGroup;
  uh_id: any
  initialValues: any;
  initialValues1: any;
  currentDate: any;
  user_id_validation: any;
  constructor(private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private service: InPatienrservicesService,
    private router: Router, private datePipe: DatePipe) {
    this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
    this.form = this.formBuilder.group({
      uh_id: ['', [Validators.required]],
      name: [''],
      full_name: ['', [Validators.required]],
      age: ['', [Validators.required]],
      room_type: ['', [Validators.required]],
      room_number: ['', [Validators.required]],
      price: ['', [Validators.required]],
      admin_date: [this.currentDate, [Validators.required]],
      amount: ['', [Validators.required]],
      payment_types: ['CASH', [Validators.required]],
      transaction_id: [''],
      room_id: [''],
      bed_no: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      phone_number: ['', [Validators.required]],
      occupation: [''],
      aadhar: [''],
      address: ['', [Validators.required]],
      complaint: [''],
      doctor_name: ['', [Validators.required]],
      med_claim: ['No', [Validators.required]],
      insurance_name: [''],
      user_id: [''],
      usr_nm: [''],
      reasonforadmission: ['', [Validators.required]],
      significantfindings: ['', [Validators.required]],
      diagnosisofthepatient: ['', [Validators.required]],
    });
    this.initialValues = this.form.value;
    this.initialValues1 = this.form.value;
    this.checkoutform = this.formBuilder.group({
      uh_id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      phone_number: ['',],
      amount: ['', [Validators.required]],
      room_number: [''],
      admin_date: [''],
      discharge_date: ['', [Validators.required]],
      price: [''],
      t_days: [''],
      lessadvance: [''],
      payment_types: ['CASH', [Validators.required]],
      bed_no: [''],
      transaction_id: [''],
      room_id: [''],
      ip_number: [''],
      sheet_indicator: [''],
      admit_record_id: [''],
      patientconditionatthetimeofdischarge: ['', [Validators.required]]
    })

    this.checkoutforms = this.formBuilder.group({
      uh_id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      phone_number: ['',],
      amount: ['', [Validators.required]],
      room_number: [''],
      admin_date: [''],
      discharge_date: ['', [Validators.required]],
      price: [''],
      room_type: [''],
      t_days: [''],
      lessadvance: [''],
      payment_types: ['CASH', [Validators.required]],
      bed_no: [''],
      transaction_id: [''],
      room_id: [''],
      ip_number: [''],
      sheet_indicator: [''],
      id: [''],
      availableRooms: [''],
      roomsnumber: [''],
      tid: [''],
      admit_record_id: ['']
    })
    this.user_id_validation = localStorage.getItem('user_id')
  }

  minDate: any;

  ngOnInit(): void {
    this.getRoomsData(3);
    this.getpatients();
    this.getroomtypedata();
    this.getroomsdatas();
    if (this.user_id_validation == '16') {
      this.minDate = ''
    }
    else {
      this.minDate = this.currentDate
    }
  }

  groupedRooms: any;

  groupBy(array, keyGetter) {
    const map = new Map();
    array.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }

  total_rooms: any = 0;
  available_count: any = 0;
  occupied_count: any = 0;
  cleaning_count: any = 0;

  getRoomsData(num: number) {
    var data = {
      'card_id': num
    };
    this.showSpinner = true;
    this.service.gethospitalrooms(data).subscribe((res: any) => {
      this.showSpinner = false;

      // Group rooms by both floor and room condition (AC/Non-AC)
      const groupedRooms = this.groupBy(res.data, item => `${item.floor_type}-${item.room_condition}`);

      // Now, we sort by the floor and room condition (AC/Non-AC)
      const sortedKeys = Array.from(groupedRooms.keys()).sort((a, b) => a.localeCompare(b));
      const sortedArrayOfArrays = sortedKeys.map(key => groupedRooms.get(key));
      this.groupedRooms = sortedArrayOfArrays;
      // Fetch the count data for the rooms
      this.showSpinner = true;
      this.service.getCountsForRooms().subscribe((res) => {
        this.showSpinner = false;
        this.total_rooms = res.data[0].total_rooms;
        this.available_count = res.data[0].available_count;
        this.occupied_count = res.data[0].occupied_count;
        this.cleaning_count = res.data[0].cleaning_count;
      });
    });
  }


  casefiledata: any;
  getroomtypedata() {
    this.service.getInsurance().subscribe(res => {
      this.casefiledata = res.data;
    })
  }

  name: any
  full_name: any;
  age: any
  gender: any;
  phone_number: any;
  guardian: any;
  occupation: any;
  aadhar: any;
  address: any;
  complaint: any;
  doctor_name: any;
  reasonforadmission: any;
  significantfindings: any;
  diagnosisofthepatient: any

  booking(modal, roomdata) {
    this.form.patchValue({
      room_id: roomdata.id,
      room_type: roomdata.bed_type,
      room_number: roomdata.room_number,
      price: roomdata.price,
      bed_no: roomdata.bed_no
    })
    this.modalService.open(modal, { size: 'lg' })
    this.uh_id = '',
      this.name = '',
      this.full_name = '',
      this.gender = '',
      this.phone_number = '',
      this.guardian = '',
      this.occupation = '',
      this.aadhar = '',
      this.address = '',
      this.complaint = '',
      this.doctor_name = '',
      this.age = ''
    this.reasonforadmission = '';
    this.significantfindings = '';
    this.diagnosisofthepatient = ''
  }

  getpatients() {
    this.service.getpatients().subscribe((res: any) => {
      this.patients_data = res.data;
    })
  }

  // Accept Input As a Number Only

  numericOnly(event): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  paymentload: boolean = false;
  paymentslot(event: any) {
    var as = event.value
    if (as == 'UPI') {
      this.paymentload = true
    } else if (as == 'CASH' || as == 'CASHLESS') {
      this.paymentload = false
    }
  }

  paymentload1: boolean = false;
  paymentslot1(event: any) {
    var as = event.value
    if (as == 'UPI') {
      this.paymentload1 = true
    } else if (as == 'CASH' || as == 'CASHLESS') {
      this.paymentload1 = false
    }
  }

  changepn(uh_id) {
    var result = this.patients_data.find(o => o.uh_id === uh_id);
    this.form.patchValue({
      // name: result.sur_name,
      full_name: result.name,
      age: result.age,
      phone_number: result.phone_number,
      gender: result.gender,
      occupation: result.occupation,
      aadhar: result.aadhar,
      address: result.address,
      complaint: result.complaint,
      doctor_name: result.doctor_name,
      reasonforadmission: result.reasonforadmission,
      significantfindings: result.significantfindings,
      diagnosisofthepatient: result.diagnosisofthepatient
    })
  }

  typesubmit: boolean = false;
  showSpinner: boolean = false;

  get type() {
    return this.form.controls;
  }

  Submit() {
    this.typesubmit = true;
    if (this.form.invalid) {
      Swal.fire({
        position: 'top-end',
        icon: 'question',
        title: 'Please Fill All Requied Details',
        showConfirmButton: false,
        timer: 1500
      });
    } else if (parseInt(this.form.value.amount) > parseInt(this.form.value.price)) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Advance amount cannot exceed the total price',
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      this.showSpinner = true;
      this.form.value.user_id = localStorage.getItem('user_id'),
        this.form.value.usr_nm = localStorage.getItem('usr_nm'),
        this.service.admitpatient_room(this.form.value).subscribe((res: any) => {
          this.showSpinner = false;
          if (res.status == 200) {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Successfully Submitted',
              showConfirmButton: false,
              timer: 1500
            });
            this.printProforma(this.form.value);
            this.typesubmit = false;
            this.form.reset();
            this.getRoomsData(3);
            this.modalService.dismissAll();
          } else {
            Swal.fire('Failed');
          }
        })
    }
  }

  newORold: boolean = false;
  timeslot(event: any) {
    var as = event.value
    this.form.get('insurance_name').setValue(null);
    if (as == 'Yes') {
      this.newORold = true;
    } else if (as == 'No') {
      this.newORold = false;
    }
  }

  // checkout(checkinmodal, i) {
  //   this.showSpinner = true;
  //   this.service.checkoutpatient_room(i).subscribe((res: any) => {
  //     if (res.status == 200) {
  //       this.checkoutform.patchValue({
  //         uh_id: res.data[0].uh_id,
  //         name: res.data[0].name,
  //         phone_number: res.data[0].phone_number,
  //         amount: res.data[0].amount,
  //         room_number: res.data[0].room_number,
  //         bed_no: res.data[0].bed_no,
  //         admin_date: res.data[0].admin_date,
  //         price: i.price,
  //         ip_number: res.data[0].ip_number,
  //         room_id: i.id,
  //         sheet_indicator: res.data[0].sheet_indicator
  //       })
  //       if (res.data[0].sheet_indicator == 1) {
  //         Swal.fire({
  //           title: "Make sure that in IP case sheet Discharge Date are updated ?",
  //           text: "You won't be able to revert this!",
  //           icon: "warning",
  //           showCancelButton: true,
  //           confirmButtonColor: "#3085d6",
  //           cancelButtonColor: "#d33",
  //           confirmButtonText: "Yes, Updated"
  //         }).then((result) => {
  //           if (result.isConfirmed) {
  //             this.modalService.open(checkinmodal, { size: 'lg' })
  //           }
  //         });
  //       }
  //       else {
  //         this.modalService.open(checkinmodal, { size: 'lg' })
  //       }
  //       this.checkoutform.patchValue({
  //         lessadvance: '',
  //         t_days: '',
  //         discharge_date: ''
  //       })
  //       this.showSpinner = false;
  //     }
  //   })
  // }


  roomid: any;

  checkout(checkinmodal, roomchange, i) {
    this.roomid = i.id
    // Ask user what to do: Discharge or Room Change
    Swal.fire({
      title: 'What would you like to do?',
      text: "Please choose an option.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Discharge',
      cancelButtonText: 'Room Change',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // Discharge path
        this.service.checkoutpatient_room(i).subscribe((res: any) => {
          if (res.status == 200) {
            this.checkoutform.patchValue({
              uh_id: res.data[0].uh_id,
              name: res.data[0].name,
              phone_number: res.data[0].phone_number,
              amount: res.data[0].amount,
              room_number: res.data[0].room_number,
              bed_no: res.data[0].bed_no,
              admin_date: res.data[0].admin_date,
              price: i.price,
              ip_number: res.data[0].ip_number,
              room_id: i.id,
              sheet_indicator: res.data[0].sheet_indicator,
              id: res.data[0].testid,
              admit_record_id: res.data[0].admit_record_id
            });
            if (res.data[0].sheet_indicator == 1) {
              Swal.fire({
                title: "Make sure that in IP case sheet Discharge Date are updated?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Updated"
              }).then((resConfirm) => {
                if (resConfirm.isConfirmed) {
                  this.modalService.open(checkinmodal, { size: 'lg' });
                  this.showSpinner = false;
                } else {
                  this.showSpinner = false;
                }
              });
            } else {
              this.modalService.open(checkinmodal, { size: 'lg' });
              this.showSpinner = false;
            }
            this.checkoutform.patchValue({
              lessadvance: '',
              t_days: '',
              discharge_date: ''
            });
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Room change path
        this.service.checkoutpatient_room(i).subscribe((res: any) => {
          if (res.status == 200) {
            this.checkoutforms.patchValue({
              uh_id: res.data[0].uh_id,
              name: res.data[0].name,
              phone_number: res.data[0].phone_number,
              amount: res.data[0].amount,
              room_number: res.data[0].room_number,
              bed_no: res.data[0].bed_no,
              admin_date: res.data[0].admin_date,
              price: i.price,
              ip_number: res.data[0].ip_number,
              room_id: i.id,
              sheet_indicator: res.data[0].sheet_indicator,
              id: res.data[0].testid,
              admit_record_id: res.data[0].admit_record_id
            });
            this.checkoutforms.patchValue({
              lessadvance: '',
              t_days: '',
              discharge_date: '',
            });
            this.modalService.open(roomchange, { size: 'lg', centered: true });
            this.showSpinner = false;
          }
        });
      } else {
        // User dismissed modal without choosing
        this.showSpinner = false;
      }
    });
  }


  dischargeSubmit: boolean = false

  get dischargeType() {
    return this.checkoutform.controls;
  }

  checkoutsubmit() {
    this.dischargeSubmit = true;
    if (this.checkoutform.invalid) {
      Swal.fire({
        position: 'top-end',
        icon: 'question',
        title: 'Please fill all details',
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      this.showSpinner = true;
      this.service.checkoutpatientsubmit(this.checkoutform.value).subscribe((res: any) => {
        this.showSpinner = false;
        if (res.status == 200) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Successfully Discharged',
            showConfirmButton: false,
            timer: 1500
          });
          this.printProforma1(this.checkoutform.value);
          this.dischargeSubmit = false;
          this.checkoutform.reset();
          this.getRoomsData(3);
          this.modalService.dismissAll();
        } else {
          Swal.fire('Failed');
        }
      })
    }
  }

  // advance print
  printProforma(invoice) {
    Swal.fire({
      title: 'Do You Want Print Proforma Invoice',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Do it!'
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.setItem('proforma', JSON.stringify(invoice))
        this.router.navigate(['print-perfoma']);
      }
      this.modalService.dismissAll();
      this.closeModal();
    })
  }

  closeModal() {
    this.form.reset(this.initialValues);
  }

  // checkout print
  printProforma1(invoice) {
    Swal.fire({
      title: 'Do You Want Print Proforma Invoice',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Do it!'
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.setItem('proforma1', JSON.stringify(invoice))
        this.router.navigate(['checkout-print']);
      }
      this.modalService.dismissAll();
      this.closeModal1();
    })
  }

  closeModal1() {
    this.form.reset(this.initialValues1);
  }

  lessadvance: any;
  totaldays: number | undefined;

  difference(event: Event) {
    const dateOfAdmit = new Date(this.checkoutform.value.admin_date);
    const dischargeDateInput = (event.target as HTMLInputElement).value;
    const otherDate = new Date(dischargeDateInput);

    if (isNaN(otherDate.getTime())) {
      return;
    }

    const timeDifference = Math.abs(otherDate.getTime() - dateOfAdmit.getTime());
    this.totaldays = Math.ceil(timeDifference / (1000 * 3600 * 24));
    this.checkoutform.patchValue({
      t_days: this.totaldays
    });

    const balance = (this.totaldays * this.checkoutform.value.price) - this.checkoutform.value.amount;
    this.lessadvance = balance;

    this.checkoutform.patchValue({
      lessadvance: this.lessadvance
    });
  }

  gotoavaliblity(i) {
    Swal.fire({
      title: i.bed_type + ' room to make available !',
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes"
    }).then((result) => {
      if (result.isConfirmed) {
        this.showSpinner = true;
        this.service.availableroomtype(i).subscribe((res: any) => {
          if (res.status == 200) {
            Swal.fire({
              position: 'top-end',
              title: i.bed_type + ' Room Available ! ',
              icon: "success"
            });
            this.getRoomsData(3);
            this.showSpinner = false;
          }
        })
      }
    });
  }


  showSecondDropdown: boolean
  rromavalble: any
  availableRooms: any = []
  getroomsdatas() {
    this.service.availableroomsdata().subscribe((res: any) => {
      if (res.status === 200) {
        this.rromavalble = res.data;
        this.showSpinner = false;
      }
    });
  }

  onRoomChange(selectedRoomNumber: string) {
    var data = {
      id: selectedRoomNumber
    }
    this.service.availableroomsdatass(data).subscribe((res: any) => {
      if (res.status === 200) {
        this.availableRooms = res.data;
        this.showSecondDropdown = true;
        this.showSpinner = false;
      } else {
        this.showSecondDropdown = false;
      }
    });
  }

  roomchanges() {
    var data123 = this.checkoutforms.value.roomsnumber.split(',');
    var data = {
      admit_record_id: this.checkoutforms.value.admit_record_id,
      room_record_id: this.checkoutforms.value.room_id,
      ip_number: this.checkoutforms.value.ip_number,
      uh_id: this.checkoutforms.value.uh_id,
      room_noo: data123[0],
      bed_num: data123[1],
      room_id: data123[2],
      room_type: data123[3],
      price: data123[4]
    }
    this.service.roomchnagesdatass(data).subscribe((res: any) => {
      if (res.status === 200) {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Successfully Room Changed',
          showConfirmButton: false,
          timer: 1500
        });
        this.getRoomsData(3);
        this.getpatients();
        this.getroomtypedata();
        this.getroomsdatas();
        this.modalService.dismissAll();
        this.showSecondDropdown = true;
        this.showSpinner = false;
        this.checkoutforms.reset()
      } else {
        this.showSecondDropdown = false;
      }
    });
  }

}
