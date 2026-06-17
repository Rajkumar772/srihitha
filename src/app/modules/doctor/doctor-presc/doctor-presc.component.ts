import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DoctorserviceService } from '../doctorservice.service';
import Swal from 'sweetalert2';
import { el } from 'date-fns/locale';

@Component({
  selector: 'app-doctor-presc',
  templateUrl: './doctor-presc.component.html',
  styleUrls: ['./doctor-presc.component.scss']
})
export class DoctorPrescComponent implements OnInit {

  
voiceMedicineSuggestions: any[] = [];
  showSpinner: boolean = false

  doctor_frm: FormGroup
  typesubmit: boolean = false
  uh_id: any
  patients_data: any = [];
  medicine_data: any = []
  data: any = []
  addMedicineForm: FormGroup
  medicaltest: any;
  xrayForm: FormGroup
  lab_test: FormGroup;
  Medical_test: any;
  labGrouptestsdata: any;
  grouptestDts: FormGroup

  finlDignForm: FormGroup;
isListening: boolean = false;
voiceText: string = '';
recognition: any = null;

  constructor(public formbuilder: FormBuilder, public router: Router, public service: DoctorserviceService, private cd: ChangeDetectorRef) {
    this.doctor_frm = this.formbuilder.group({
      uh_id: [''],
      patient_type: ['', Validators.required],
      date: ['', Validators.required],
      name: ['', Validators.required],
      full_name: ['', Validators.required],
      age: ['', Validators.required],
      gender: ['', Validators.required],
      history: ['',],
      complaint: ['', Validators.required],
      diagnosis: ['',],
      labs_total: [''],
      diagnostic_total: [''],
      examination: ['', Validators.required],
      advice: ['', Validators.required],
      phone_number: [''],
      next_visit_duration: [0,],
      op_date: ['', Validators.required],
      // d_name: ['', Validators.required]

    })
    this.addMedicineForm = this.formbuilder.group({
      id: [''],
      medicine_name: ['', [Validators.required]],
      instruction: ["", [Validators.required]],
      days: ["", [Validators.required]],
      time_options: ["", [Validators.required]],
      composition_name: ['', [Validators.required]],
      remarks: [''],
    })
    this.xrayForm = this.formbuilder.group({
      id: [''],
      d_test_name: ["", [Validators.required]],
      d_test_amount: ["", [Validators.required]],
      reported_image: [''],
      filetype: [''],
      test_brief: ['']
    })
    this.grouptestDts = this.formbuilder.group({
      group_name: ['', [Validators.required]],
      group_amount: ['', [Validators.required]]
    })
    this.lab_test = this.formbuilder.group({
      labtest_id: [''],
      labtest: ['', Validators.required],
      category_id: ['', Validators.required],
      category_name: ['', Validators.required],
      amount: ['', Validators.required]
    });

    this.finlDignForm = this.formbuilder.group({
      formfield: ['-']
    })

  }

  get type() {
    return this.doctor_frm.controls
  }

  submitt: boolean = false
  get valid() {
    return this.addMedicineForm.controls
  }

  submitted: boolean = false
  get validatee() {
    return this.xrayForm.controls
  }

  ngOnInit(): void {
    this.setupAutoRemarks();
    this.getpatients()
    this.getmadallogindata()
    this.getTestnames()
    this.getmediclatest()

  }
  getmediclatest() {
    this.service.get_labtest().subscribe((res: any) => {
      this.medicaltest = res.data;

    })
  }
  totalLabtestforGroup: any = [];
  fixedGroupLabTests: any = [];


  doctorData: any = [];

  getpatients() {
    this.service.getpatients().subscribe((res: any) => {
      this.patients_data = res.data;

    })
    this.service.maingetCallforGroupTests().subscribe((res: any) => {
      this.labGrouptestsdata = res.data
    })

    this.service.getDoctorsData().subscribe((res) => {
      this.doctorData = res.data;
    });

  }


  getmadallogindata() {
    this.service.getmedicinename().subscribe((res) => {
      this.medicine_data = res.data;


      // this.func(res.data)
    });

  }

  medicalarray: any = []

  // Accept Input As a Number Only
  numericOnly(event): boolean {
    let patt = /^([0-9,/,.])$/;
    let result = patt.test(event.key);
    return result;
  }

  gotodoctor() {
    this.router.navigate(['/doctor/doctor-list']);
  }

  //patient details
changepn(value: any) {
  const searchValue = (value || '').toString().trim();

  if (!searchValue) return;

  console.log('SEARCH:', searchValue);
  console.log('PATIENTS COUNT:', this.patients_data?.length);
  console.log('FIRST PATIENT:', this.patients_data?.[0]);

  const result = (this.patients_data || []).find((o: any) =>
    (o.uh_id || '').toString().trim().toUpperCase() === searchValue.toUpperCase() ||
    (o.phone_number || '').toString().trim() === searchValue
  );

  console.log('MATCHED PATIENT:', result);

  if (!result) {
    Swal.fire({
      icon: 'warning',
      title: 'Patient not found',
      text: 'Patient not loaded in dropdown data. Check getpatientsdata API response.',
      timer: 1800,
      showConfirmButton: false
    });
    return;
  }

this.doctor_frm.patchValue({
  uh_id: result.uh_id || '',
  patient_type: result.patient_type || '',
  name: result.title || '',
  full_name: result.name || '',
  age: result.age || '',
  gender: result.gender || '',
  phone_number: result.phone_number || '',

  date: this.getTodayDate(),
  op_date: ''
});
}
  //pharma
  medicinedata: any = []
  addMedicineFields() {
    this.submitt = true
    if (this.addMedicineForm.invalid) {
      Swal.fire({
        position: 'top-end',
        icon: 'question',
        title: 'Please Give Details',
        showConfirmButton: false,
        timer: 1500
      });
    }
    else {
      this.medicinedata.push({
        'medicine_name': this.addMedicineForm.value.medicine_name,
        'instruction': this.addMedicineForm.value.instruction,
        'days': this.addMedicineForm.value.days,
        'time_options': this.addMedicineForm.value.time_options,
        'remarks': this.addMedicineForm.value.remarks,
        'composition_name': this.addMedicineForm.value.composition_name,
      })


      this.addMedicineForm.reset()
      this.remarksManual = false;
      this.submitt = false
    }

  }


  getCompositionAndBrands(item: any) {
    const [composition, brands] = item.medicine_name;
    return { composition, brands };
  }


  getFormattedBrands(brands): string {
    return brands.join(' / ');
  }


  //diagnostic/////////////////////////////////////////

  xraydata: any = []
  grandtotal1: any
  addxrayFields() {
    this.submitted = true
    if (this.xrayForm.invalid) {
      Swal.fire({
        position: 'top-end',
        icon: 'question',
        title: 'Please Give Details',
        showConfirmButton: false,
        timer: 1500
      });
    }
    else {
      var xrayName = this.xrayForm.value.d_test_name
      var findMedicine = this.xraydata.find((i => i.d_test_name == xrayName))
      if (!findMedicine) {
        this.xraydata.push({
          'd_test_name': this.xrayForm.value.d_test_name,
          'd_test_amount': this.xrayForm.value.d_test_amount,
          'd_test_report': this.xrayForm.value.reported_image,
          'd_test_report_type': this.xrayForm.value.filetype,
          'd_test_brief': this.xrayForm.value.test_brief
        })
        let sum = 0;
        this.xraydata.forEach((element) => {
          sum += (element.d_test_amount * 1);
        });
        this.report_image = "";
        const removeIMage = document.getElementById("RptImg") as HTMLInputElement;
        removeIMage.value = '';
        this.grandtotal1 = sum;
        this.xrayForm.reset()
        this.submitted = false
      }
      else {
        Swal.fire({
          position: 'top-end',
          icon: 'question',
          title: `Test ${xrayName} already exists.`,
          showConfirmButton: false,
          timer: 1500
        });
      }

    }

  }




  report_image: any;

  //image data
  onImageChange(e) {

    const reader = new FileReader();
    if (e.target.files && e.target.files.length) {
      const [file] = e.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        var imgFile = reader.result as string;
        var bfile_typeEmpl = e.target.files[0].name.split('.');
        var imgtype = bfile_typeEmpl[1];
        this.report_image = imgFile;
        this.xrayForm.patchValue({
          reported_image: imgFile,
          filetype: imgtype
        })

      }
    }
  }

  deleteImage() {
    this.report_image = "";
    this.xrayForm.patchValue({
      reported_image: "",
    })
    const removeIMage = document.getElementById("RptImg") as HTMLInputElement;
    removeIMage.value = '';
  }

  diagnosticTests: any;
  getTestnames() {
    this.service.getdiagnosticTests().subscribe((res) => {
      this.diagnosticTests = res.data
    })
  }

  getTestamnt(e) {
    this.diagnosticTests.map((res) => {
      if (res.d_test_name == e) {
        this.xrayForm.patchValue({
          d_test_amount: res.d_test_amount,
        })
      }
    })
  }

  delete(index, medicine_price) {
    this.grandtotal1 = (this.grandtotal1 * 1) - medicine_price;
    this.xraydata.splice(index, 1);

  }




  // ///////////////////////////////////////////////////////// lab 

  medicallistArr: any = []
  grandtotal: any;
  addmedicaltest() {
    if (this.lab_test.invalid) {
      Swal.fire('Please Give Lab Test Details');
    }
    else {
      var lastTest = this.lab_test.value.labtest_id
      var findLabTstName = this.medicallistArr.find((i => i.labtest_id == lastTest))
      if (!findLabTstName) {
        this.medicallistArr.push({
          'labtest_id': this.lab_test.value.labtest_id,
          'category_id': this.lab_test.value.category_id,
          'category_name': this.lab_test.value.category_name,
          'labtest': this.lab_test.value.labtest,
          'amount': this.lab_test.value.amount
        })
        let sum = 0;
        this.medicallistArr.forEach((element) => {
          sum += parseInt(element.amount);
        });
        this.grandtotal = sum;
        this.lab_test.reset();
      }
      else {
        Swal.fire({
          position: 'top-end',
          icon: 'question',
          title: `Test ${this.lab_test.value.labtest} already exists.`,
          showConfirmButton: false,
          timer: 1500
        });
      }
    }
  }

  changetets(event) {
    var result = this.medicaltest.filter((o: any) => o.id == event);
    this.lab_test.patchValue({
      labtest_id: result[0].id,
      amount: result[0].amount,
      category_id: result[0].category_id,
      category_name: result[0].category_name,
      labtest: result[0].labtest,
    })
  }

  ///////////////////////////////////////////////////// group tests (lab)

  PackageAmount: any;
  groupId: any;

  group_select(event) {
    this.groupId = event;
    var result = this.labGrouptestsdata.find(o => o.id == event);
    this.grouptestDts.patchValue({
      group_name: result.group_name,
      group_amount: result.group_package_amount
    })
    var data = {
      'group_id': this.groupId
    };
    this.showSpinner = true
    this.totalLabtestforGroup = []
    this.service.findandGetGroupCategoryTests(data).subscribe((res) => {
      res.data.map((res) => {
        res.amount = 0
      })
      this.totalLabtestforGroup = res.data;
      this.showSpinner = false
    })

  }



  MutipleGroupsdata: any = [];

  addGrouptestPtnt() {
    if (this.grouptestDts.invalid) {
      Swal.fire('Please Give Group Test Details');
    }
    else {


      var group_name = this.grouptestDts.value.group_name
      var groupExists = this.MutipleGroupsdata.find((i => i.group_name == group_name))


      if (!groupExists) {
        this.MutipleGroupsdata.push(this.grouptestDts.value)
        this.totalLabtestforGroup.forEach(obj => {
          this.fixedGroupLabTests.push(obj);
        });

        let sum = 0;
        this.MutipleGroupsdata.forEach((element) => {
          sum += parseInt(element.group_amount);
        });
        this.PackageAmount = sum;
        this.grouptestDts.reset()
      }
      else {
        Swal.fire({
          position: 'top-end',
          icon: 'question',
          title: `Test ${group_name} already exists.`,
          showConfirmButton: false,
          timer: 1500
        });
      }


    }
  }


  remove(index) {
    this.medicinedata.splice(index, 1);
  }



  deleteGroupLbtests(i) {
    this.fixedGroupLabTests.splice(i, 1);

  }

  delete1(i, medicine_price) {
    this.grandtotal = (this.grandtotal * 1) - medicine_price;
    this.medicallistArr.splice(i, 1);
  }


  addBtnsv(): void {
    const enteredValue = this.finlDignForm.get('formfield')?.value;
    if (enteredValue) {
      this.finlDignForm.get('formfield')?.setValue(enteredValue);
      alert("Point Added")
    }
    else {
      alert("Please Add Something")
    }
  }

  restfunc(): void {
    // Reset the form when the reset button is clicked
    this.finlDignForm.reset();
  }

  //main submit
  finalSubmissionArray: any = []
  typeSubmit() {
    this.typesubmit = true;
    this.doctor_frm.value.diagnostic_total = this.grandtotal1
    this.finalSubmissionArray = this.medicallistArr.concat(this.fixedGroupLabTests);
    this.finalSubmissionArray = this.finalSubmissionArray.map(item => {
      if (!item.hasOwnProperty('group_name')) {
        item.group_name = null;
      }
      return item;
    });
    if (this.doctor_frm.invalid) {
      Swal.fire({
        position: 'top-end',
        title: 'enter details',
        icon: 'error',
        timer: 1500,
        showConfirmButton: false
      })
    }
    else if (this.medicinedata.length == 0 && this.finalSubmissionArray.length == 0 && this.xraydata.length == 0) {
      Swal.fire({
        position: 'top-end',
        title: 'Please give any one department data',
        icon: 'question',
        timer: 1500,
        showConfirmButton: false
      })
    }
    else {
      if (this.MutipleGroupsdata.length == 0) {
        var data
        this.doctor_frm.value.labs_total = this.grandtotal
        this.medicinedata.map((res) => { res.medicine_name = JSON.stringify(res.medicine_name) })
        data = {
          doctor_frm: this.doctor_frm.value,
          medicinearry: this.medicinedata,
          xarrayData: this.xraydata,
          groupTestdts: null,
          medicallistArr_lab: this.finalSubmissionArray,
          final_diagnoss: this.finlDignForm.value.formfield
        }
      }
      else {
        let sum = 0;
        this.MutipleGroupsdata.forEach((element) => {
          sum += parseInt(element.group_amount);
        });
        var combinedTotal = sum + this.grandtotal
        this.doctor_frm.value.labs_total = combinedTotal
        this.medicinedata.map((res) => { res.medicine_name = JSON.stringify(res.medicine_name) })
        data = {
          doctor_frm: this.doctor_frm.value,
          medicinearry: this.medicinedata,
          groupTestdts: JSON.stringify(this.MutipleGroupsdata),
          xarrayData: this.xraydata,
          medicallistArr_lab: this.finalSubmissionArray,
          final_diagnoss: this.finlDignForm.value.formfield
        }
      }
      this.showSpinner = true
      this.service.post_doctor_patient(data).subscribe((res: any) => {
        this.showSpinner = false
        if (res.status == 200) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Successfully Submitted',
            showConfirmButton: false,
            timer: 1500
          });
          this.typesubmit = false
          this.doctor_frm.reset()
          this.finlDignForm.reset()
          this.medicinedata = []
          this.xraydata = []
          this.medicallistArr = []
          this.fixedGroupLabTests = []
          this.finalSubmissionArray = []
          this.MutipleGroupsdata = []
          this.grandtotal = 0
          this.grandtotal1 = 0
          this.getmadallogindata();
        }
      })
    }

  }



  /////

  groupedMedicines: any;

  //   func(data) {

  //     const grouped = data.reduce((acc, medicine) => {
  //       const { medicine_composition, medicine_name } = medicine;

  //       if (!acc[medicine_composition]) {
  //         acc[medicine_composition] = { composition: medicine_composition, medicine_names: [] };
  //       }

  //       acc[medicine_composition].medicine_names.push(medicine_name);

  //       return acc;
  //     }, {});


  //     this.groupedMedicines = Object.values(grouped);

  //   }

  remarksManual = false;

  markRemarksManual() {
    this.remarksManual = true; // if user types, stop auto-overwrite
  }

  // call this once after form creation (constructor or ngOnInit)
  setupAutoRemarks() {
    const insCtrl = this.addMedicineForm.get('instruction');
    const daysCtrl = this.addMedicineForm.get('days');
    const timeCtrl = this.addMedicineForm.get('time_options');

    // whenever these change, rebuild remarks
    insCtrl?.valueChanges.subscribe(() => this.autoFillRemarks());
    daysCtrl?.valueChanges.subscribe(() => this.autoFillRemarks());
    timeCtrl?.valueChanges.subscribe(() => this.autoFillRemarks());
  }

  autoFillRemarks() {
    if (this.remarksManual) return; // don't overwrite manual edits
    const instruction = (this.addMedicineForm.value.instruction || '').toString().trim();
    const days = (this.addMedicineForm.value.days || '').toString().trim();


    const timeOpt = (this.addMedicineForm.value.time_options || '').toString().trim();

    const txt = this.buildTeluguRemark(instruction, timeOpt, days);

    this.addMedicineForm.patchValue(
      { remarks: txt },
      { emitEvent: false }
    );
  }

  private buildTeluguRemark(instruction: string, timeOpt: string, days: string): string {
    const freqTxt = this.instructionToTelugu(instruction);
    const timingTxt = this.timeOptionToTelugu(timeOpt);
    const daysTxt = days ? `${days} రోజులు` : '';

    return [freqTxt, timingTxt, daysTxt].filter(Boolean).join(', ');
  }

  private instructionToTelugu(ins: string): string {
    const v = (ins || '')
      .toString()
      .toUpperCase()
      .replace(/\s+/g, ' ')
      .trim();

    if (v === 'ONCE DAILY') return 'రోజుకు 1 సారి';
    if (v === 'TWICE DAILY') return 'రోజుకు 2 సార్లు';
    if (v === 'THRICE DAILY') return 'రోజుకు 3 సార్లు';

    if (v === 'FOURTH HOURLY') return 'ప్రతి 4 గంటలకు ఒకసారి';
    if (v === 'SIXTH HOURLY') return 'ప్రతి 6 గంటలకు ఒకసారి';
    if (v === 'EIGHTH HOURLY') return 'ప్రతి 8 గంటలకు ఒకసారి';
    if (v === 'TWELVTH HOURLY') return 'ప్రతి 12 గంటలకు ఒకసారి';

    return v;
  }

  private timeOptionToTelugu(opt: string): string {
    // ✅ raw value from form


    const t = (opt || '')
      .toString()
      .toUpperCase()
      .replace(/\s+/g, ' ')
      .trim();



    const map: Record<string, string> = {
      'BEFORE BREAKFAST': 'ఉపాహారం ముందు',
      'MORNING': 'ఉదయం',
      'BEFORE LUNCH': 'మధ్యాహ్న భోజనం ముందు',
      'AFTERNOON': 'మధ్యాహ్నం',
      'BEFORE DINNER': 'రాత్రి భోజనం ముందు',
      'NIGHT': 'రాత్రి',

      'MOR-NT': 'ఉదయం, రాత్రి',
      'MOR-AFT': 'ఉదయం, మధ్యాహ్నం',
      'MOR-AFT-NT': 'ఉదయం, మధ్యాహ్నం, రాత్రి',

      '1D-EMPTY STOMACH': 'ఖాళీ కడుపు'
    };



    const result = map[t] || t;



    return result;
  }



  composition: any;
  getcomposition: any = []
  selectedtabletwithcomposi(event: any) {

    this.composition = event;
    var data = {
      'composition': this.composition
    }
    this.service.getcompositonwisetabletsdata(data).subscribe((res) => {

      this.getcomposition = res.data;



    })
  }

startMedicineVoice() {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    Swal.fire('Voice not supported', 'Please use Google Chrome browser.', 'warning');
    return;
  }

  this.voiceText = '';
  this.recognition = new SpeechRecognition();
  this.recognition.lang = 'en-IN';
  this.recognition.continuous = true;
  this.recognition.interimResults = true;

  this.isListening = true;

  let finalText = '';

  this.recognition.onresult = (event: any) => {
    let interimText = '';

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript || '';

      if (event.results[i].isFinal) {
        finalText += ' ' + transcript;
      } else {
        interimText += ' ' + transcript;
      }
    }

    this.voiceText = (finalText + ' ' + interimText).trim();

    const normalized = this.normalizeVoiceText(this.voiceText);

    if (
      normalized.includes(' DONE') ||
      normalized.endsWith('DONE') ||
      normalized.includes(' FINISH') ||
      normalized.endsWith('FINISH') ||
      normalized.includes(' COMPLETE') ||
      normalized.endsWith('COMPLETE')
    ) {
      this.stopMedicineVoice();

      const commandText = normalized
        .replace(/\bDONE\b/g, '')
        .replace(/\bFINISH\b/g, '')
        .replace(/\bCOMPLETE\b/g, '')
        .trim();

      this.voiceText = commandText;
      this.processMedicineVoice(commandText);
    }

    this.cd.detectChanges();
  };

  this.recognition.onerror = () => {
    this.isListening = false;
    Swal.fire('Voice Error', 'Please try again clearly.', 'error');
    this.cd.detectChanges();
  };

  this.recognition.onend = () => {
    this.isListening = false;
    this.cd.detectChanges();
  };

  this.recognition.start();
}

stopMedicineVoice() {
  if (this.recognition) {
    this.recognition.stop();
  }
  this.isListening = false;
}

processMedicineVoice(text: string) {
  const cleanText = this.normalizeVoiceText(text);

  const medicine = this.findMedicineFromVoice(cleanText);
if (!medicine) {

  if (
    this.voiceMedicineSuggestions &&
    this.voiceMedicineSuggestions.length > 0
  ) {

  Swal.fire({
  title: 'Did you mean?',
  html: this.voiceMedicineSuggestions
    .map((m: any, i: number) => `
      <button
        id="voice-suggest-${i}"
        class="voice-swal-medicine-btn">
        ${m.medicine_name}
      </button>
    `)
    .join('') +

    `
    <div class="voice-swal-note">
      Please select the correct medicine from the suggestions below.
    </div>
    `,

  customClass: {
    popup: 'voice-swal-popup',
    title: 'voice-swal-title'
  },

  showConfirmButton: false,
  showCancelButton: true,
  cancelButtonText: 'Cancel',
  allowOutsideClick: false,
  allowEscapeKey: true
});

setTimeout(() => {

  this.voiceMedicineSuggestions.forEach((m: any, i: number) => {

    const btn = document.getElementById(
      `voice-suggest-${i}`
    );

    if (btn) {

      btn.onclick = () => {

        Swal.close();

        this.selectVoiceSuggestion(m);

        const instruction =
          this.findInstructionFromVoice(cleanText);

        const days =
          this.findDaysFromVoice(cleanText);

        const timing =
          this.findTimingFromVoice(cleanText);

        this.addMedicineForm.patchValue({
          instruction: instruction || '',
          days: days || '',
          time_options: timing || ''
        });

        this.remarksManual = false;
        this.autoFillRemarks();

        Swal.fire({
          icon: 'success',
          title: 'Medicine Selected',
          text: m.medicine_name,
          timer: 1200,
          showConfirmButton: false
        });

      };

    }

  });

}, 100);

    return;
  }

  Swal.fire(
    'Medicine not found',
    'Please select medicine manually.',
    'warning'
  );

  return;
}

  const instruction = this.findInstructionFromVoice(cleanText);
  const days = this.findDaysFromVoice(cleanText);
  const timing = this.findTimingFromVoice(cleanText);

if (!instruction || !timing) {    Swal.fire(
      'Incomplete voice command',
      'Medicine detected, but instruction/days/timing missing. Please verify manually.',
      'warning'
    );
  }

  this.addMedicineForm.patchValue({
    medicine_name: medicine.medicine_name,
    instruction: instruction || '',
    days: days || '',
    time_options: timing || ''
  });

  this.selectedtabletwithcomposi(medicine.medicine_name);

  setTimeout(() => {
    if (this.getcomposition && this.getcomposition.length === 1) {
      this.addMedicineForm.patchValue({
        composition_name: this.getcomposition[0].composition_name
      });
    }
    this.remarksManual = false;
    this.autoFillRemarks();
  }, 500);

  Swal.fire({
    icon: 'info',
    title: 'Verify Medicine Details',
    html: `
      <b>Medicine:</b> ${medicine.medicine_name}<br>
      <b>Instruction:</b> ${instruction || '-'}<br>
      <b>Days:</b> ${days || '-'}<br>
      <b>Timing:</b> ${timing || '-'}<br><br>
      Please verify and click ADD manually.
    `,
    confirmButtonText: 'OK'
  });
}

normalizeVoiceText(text: string): string {
  return (text || '')
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, ' ')
    .replace(/\bTABLET\b/g, '')
    .replace(/\bTAB\b/g, '')
    .replace(/\bCAPSULE\b/g, '')
    .replace(/\bCAP\b/g, '')
    .replace(/\bMG\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

findMedicineFromVoice(text: string): any {
  const voice = this.normalizeVoiceText(text);

  if (!this.medicine_data || !this.medicine_data.length) {
    return null;
  }

  const scored = this.medicine_data
    .map((m: any) => {
      const medName = this.normalizeVoiceText(m.medicine_name || '');
      return {
        medicine: m,
        score: this.fuzzyScore(voice, medName)
      };
    })
    .filter(x => x.score >= 45)
    .sort((a, b) => b.score - a.score);

  this.voiceMedicineSuggestions = scored.slice(0, 5).map(x => x.medicine);

  if (!scored.length) {
    return null;
  }

  const best = scored[0];
  const second = scored[1];

  if (best.score >= 85 && (!second || best.score - second.score >= 20)) {
    this.voiceMedicineSuggestions = [];
    return best.medicine;
  }

  return null;
}

fuzzyScore(voice: string, medicine: string): number {
  const voiceWords = voice.split(' ').filter(w => w.length >= 3);
  const medWords = medicine.split(' ').filter(w => w.length >= 3);

  let bestScore = 0;

  for (const vw of voiceWords) {
    for (const mw of medWords) {
      if (vw === mw) bestScore = Math.max(bestScore, 100);
      else if (mw.includes(vw) || vw.includes(mw)) bestScore = Math.max(bestScore, 85);
      else {
        const sim = this.similarityPercent(vw, mw);
        bestScore = Math.max(bestScore, sim);
      }
    }
  }

  return bestScore;
}

similarityPercent(a: string, b: string): number {
  const distance = this.levenshteinDistance(a, b);
  const maxLen = Math.max(a.length, b.length);
  if (!maxLen) return 0;
  return Math.round(((maxLen - distance) / maxLen) * 100);
}

selectVoiceSuggestion(medicine: any) {
  this.addMedicineForm.patchValue({
    medicine_name: medicine.medicine_name
  });

  this.selectedtabletwithcomposi(medicine.medicine_name);

  setTimeout(() => {
    if (this.getcomposition && this.getcomposition.length === 1) {
      this.addMedicineForm.patchValue({
        composition_name: this.getcomposition[0].composition_name
      });
    }
    this.remarksManual = false;
    this.autoFillRemarks();
  }, 500);

  this.voiceMedicineSuggestions = [];
}
findInstructionFromVoice(text: string): string {
  text = this.normalizeVoiceText(text);

  if (text.includes('DAILY') || text.includes('ONCE')) return 'ONCE DAILY';
  if (text.includes('TWICE')) return 'TWICE DAILY';
  if (text.includes('THRICE')) return 'THRICE DAILY';
  if (text.includes('4 HOUR')) return 'FOURTH HOURLY';
  if (text.includes('6 HOUR')) return 'SIXTH HOURLY';
  if (text.includes('8 HOUR')) return 'EIGHTH HOURLY';
  if (text.includes('12 HOUR')) return 'TWELVTH HOURLY';

  return '';
}

findTimingFromVoice(text: string): string {
  text = this.normalizeVoiceText(text);

  if (text.includes('BEFORE BREAKFAST')) return 'BEFORE BREAKFAST';
  if (text.includes('BEFORE LUNCH')) return 'BEFORE LUNCH';
  if (text.includes('BEFORE DINNER')) return 'BEFORE DINNER';
  if (text.includes('EMPTY STOMACH')) return '1D-EMPTY STOMACH';

  if (text.includes('MORNING') && text.includes('AFTERNOON') && text.includes('NIGHT')) return 'MOR-AFT-NT';
  if (text.includes('MORNING') && text.includes('NIGHT')) return 'MOR-NT';
  if (text.includes('MORNING') && text.includes('AFTERNOON')) return 'MOR-AFT';
  if (text.includes('MORNING')) return 'MORNING';
  if (text.includes('AFTERNOON')) return 'AFTERNOON';
  if (text.includes('NIGHT')) return 'NIGHT';

  return '';
}


wordMatchScore(text: string, medName: string): number {
  const medWords = medName.split(' ').filter(Boolean);
  if (!medWords.length) return 0;

  let matched = 0;
  medWords.forEach(w => {
    if (text.includes(w)) matched++;
  });

  return matched / medWords.length;
}



findDaysFromVoice(text: string): string {
  const match = text.match(/(\d+)\s*(DAY|DAYS)/);
  if (match) return match[1];

  const map: any = {
    ONE: '1',
    TWO: '2',
    THREE: '3',
    FOUR: '4',
    FIVE: '5',
    SIX: '6',
    SEVEN: '7',
    TEN: '10',
    FIFTEEN: '15'
  };

  for (const key of Object.keys(map)) {
    if (text.includes(key + ' DAY') || text.includes(key + ' DAYS')) {
      return map[key];
    }
  }

  return '';
}


quickSet(controlName: string, value: string) {

  this.addMedicineForm.patchValue({
    [controlName]: value
  });

  this.remarksManual = false;
  this.autoFillRemarks();
}


smartMedicineScore(voice: string, medName: string): number {
  const voiceWords = voice.split(' ').filter(w => w.length > 2);
  const medWords = medName.split(' ').filter(w => w.length > 2);

  let score = 0;

  medWords.forEach(mw => {
    voiceWords.forEach(vw => {
      if (vw === mw) score += 40;
      else if (mw.includes(vw) || vw.includes(mw)) score += 25;
      else {
        const distance = this.levenshteinDistance(vw, mw);
        const maxLen = Math.max(vw.length, mw.length);
        const similarity = ((maxLen - distance) / maxLen) * 100;

        if (similarity >= 75) score += 20;
        if (similarity >= 85) score += 30;
      }
    });
  });

  if (voice.includes(medWords[0])) score += 30;

  return score;
}

levenshteinDistance(a: string, b: string): number {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}


searchPatientByUhidOrMobile(controlName: string) {
  const searchValue = this.doctor_frm.get(controlName)?.value;

  if (!searchValue || searchValue.toString().trim() === '') {
    return;
  }

  const data = {
    searchValue: searchValue.toString().trim()
  };

  this.showSpinner = true;

  this.service.getPatientByUhidOrMobile(data).subscribe({
    next: (res: any) => {
      this.showSpinner = false;

      if (res.status === 200 && res.data && res.data.length > 0) {
        const patient = res.data[0];

        this.doctor_frm.patchValue({
          uh_id: patient.uh_id || '',
  patient_type: 'Old',
            name: patient.title || '',
          full_name: patient.name || '',
          age: patient.age || '',
          gender: patient.gender || '',
          phone_number: patient.phone_number || patient.mobile || patient.contact_no || '',
date: this.getTodayDate(),    
op_date: '',      
        
        });
setTimeout(() => {
  const el = document.querySelector(
    '[formControlName="complaint"]'
  ) as HTMLTextAreaElement;

  if (el) {
    el.focus();
  }
}, 100);
        Swal.fire({
          icon: 'success',
          title: 'Patient details loaded',
          timer: 1000,
          showConfirmButton: false
        });
      } else {

  this.doctor_frm.patchValue({
    patient_type: 'New',
    name: '',
    full_name: '',
    age: '',
    gender: '',
    phone_number: '',
    op_date: ''
  });

  Swal.fire({
    icon: 'info',
    title: 'New Patient',
    text: 'Patient not found. Please enter patient details.',
    timer: 2000,
    showConfirmButton: false
  });
}
    },
    error: () => {
      this.showSpinner = false;
      Swal.fire('Error', 'Unable to fetch patient details', 'error');
    }
  });
}
getTodayDate(): string {
  const today = new Date();

  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`;
}
formatDateForInput(dateValue: any): string {
  if (!dateValue) return '';

  const value = dateValue.toString().trim();

  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.substring(0, 10);
  }

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    const parts = value.split('/');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  return '';
}


searchTimer: any;

onUhidInput(value: string) {
  clearTimeout(this.searchTimer);

  if (value.length >= 8) {
    this.searchTimer = setTimeout(() => {
      this.searchPatientByUhidOrMobile('uh_id');
    }, 500);
  }
}


}
