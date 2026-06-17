import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GoogleMeetService } from './../googlemeet.service';
// import { MatTableDataSource } from '@angular/material/table';
import { TableUtil } from 'src/app/tableUtil';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-googlemeet',
  templateUrl: './googlemeet.component.html',
  styleUrls: ['./googlemeet.component.scss']
})
export class GooglemeetComponent implements OnInit, OnDestroy {
  ////choose time format code starts
  // hours12 = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  // minutes = ['00','05','10','15','20','25','30','35','40','45','50','55'];

  // startHour = '09';
  // startMinute = '00';
  // startAmPm: 'AM' | 'PM' = 'AM';

  // private getStartTime24(): string {
  //   let h = parseInt(this.startHour, 10); 
  //   if (this.startAmPm === 'PM' && h < 12) h += 12;
  //   if (this.startAmPm === 'AM' && h === 12) h = 0;
  //   return String(h).padStart(2, '0') + ':' + this.startMinute;
  // }


  // startTime12 = ''; // value like "09:05 PM"

  timeOptions: { label: string; value: string }[] = [];




  ////choose time format code ends





  dataSource: MatTableDataSource<any>;     // Datasource For Mable to assign array
  @ViewChild(MatPaginator) paginator: MatPaginator;      // Mat Table Pagination selector
  @ViewChild(MatSort) sort: MatSort;

  updateform: FormGroup;

  doctorId = 1; // TODO: set from logged-in doctor user (session/localStorage)
  patientEmail = '';
  title = 'Tele Consultation';
  description = '';
  date = '';      // yyyy-mm-dd
  startTime = ''; // HH:mm
  name='';
  gender = '';
  durationMin = 15;
  amount='';

  createdMeetLink: string | null = null;
  createdEventId: string | null = null;

  meetings: any[] = [];
  loadingMeetings = false;
  creatingMeeting = false;


  //table code starts
  displayedColumns: string[] = ['i','name','gender', 'number', 'patient_email', 'description', 'start_time', 'end_time', 'meet_link','doctor_note'];
  selectColumns: string[] = ['selectSlno', 'select1', 'select2', 'select3', 'select4', 'select5', 'select6','select7','select8','select9'];
  hideselect: boolean = false;
  reset: any = ''
  masterdata: any = [];
  appointmentreport: any;
  clonedata: any[] = [];
  cust_color: string = 'blue';
  variable: any;
  newOccupationForm: any;
  age: any;
  headerclass = {
    fontSize: '17px',
    fontWeight: '500',
    backgroundColor: 'dodgerblue',
    color: 'white',
    paddingTop: '4px',
    paddingBottom: '4px',
    lineHeight: '1.1'
  };

  number = ''

  private msgHandler = (ev: MessageEvent) => {
    // When OAuth callback closes popup, it sends this message from backend callback HTML
    if (ev?.data?.type === 'GOOGLE_CONNECTED' && ev.data.doctorId === this.doctorId) {
      this.showToast('Google Calendar connected successfully ✅');
      this.loadMeetings();
    }
  };


  /////search code starts
  googlemeet: FormGroup; submitt: boolean = false;
  get validDate() {
    return this.googlemeet.controls;
  }
  constructor(private api: GoogleMeetService, private modalService: NgbModal, private formBuilder: FormBuilder) {
    this.googlemeet = this.formBuilder.group({
      from_date: [''],
      to_date: [''],
      ind: [1]   // ✅ default ALL
    });
    // const startTime24 = this.getStartTime24();
    // const startISO = this.toISO(this.date, startTime24);
    const startTime24 = this.time12To24(this.startTime);
    const startISO = this.toISO(this.date, startTime24);
  }
  private buildTimeOptions() {
    const list: { label: string; value: string }[] = [];

    for (let minutes = 0; minutes < 24 * 60; minutes++) {
      const h24 = Math.floor(minutes / 60);
      const m = minutes % 60;

      const ampm = h24 >= 12 ? 'PM' : 'AM';
      let h12 = h24 % 12;
      if (h12 === 0) h12 = 12;

      const hh = String(h12).padStart(2, '0');
      const mm = String(m).padStart(2, '0');

      const label = `${hh}:${mm} ${ampm}`;
      list.push({ label, value: label });
    }

    this.timeOptions = list;
  }

  // ✅ Convert "hh:mm AM/PM" to "HH:mm" (24h)
  private time12To24(time12: string): string {
    const m = (time12 || '').trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!m) return '';

    let hh = parseInt(m[1], 10);
    const mm = m[2];
    const ap = m[3].toUpperCase();

    if (ap === 'PM' && hh < 12) hh += 12;
    if (ap === 'AM' && hh === 12) hh = 0;

    return String(hh).padStart(2, '0') + ':' + mm;
  }

  ngOnInit(): void {
    this.buildTimeOptions();
    this.SearchDATE();
    // this.getroomtypedata();
    window.addEventListener('message', this.msgHandler);


    this.dataSource = new MatTableDataSource<any>([]);
    this.dataSource.filterPredicate = (data: any, filter: string) =>
      JSON.stringify(data).toLowerCase().includes(filter);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;



    // ✅ init form
    this.updateform = this.formBuilder.group({
      update_roomtype: ['']
    });

    // ✅ init datasource (empty first)
    this.dataSource = new MatTableDataSource<any>([]);
    this.dataSource.filterPredicate = (data: any, filter: string) =>
      JSON.stringify(data).toLowerCase().includes(filter);

    this.loadMeetings();
  }



  ngOnDestroy(): void {
    window.removeEventListener('message', this.msgHandler);
  }

  connectGoogle() {
    this.api.getAuthUrl(this.doctorId).subscribe({
      next: (r) => {
        // popup OAuth
        window.open(r.url, 'google_oauth', 'width=520,height=650');
      },
      error: (e) => {
        
        alert(this.getErrMsg(e, 'Failed to get auth url'));
      }
    });
  }
  // showSpinner:boolean= false;
  // createMeet() {
  //   this.showSpinner = true;
  //   if (!this.date || !this.startTime || !this.patientEmail || !this.title || !this.durationMin || !this.number || !this.description || !this.name || !this.gender) {
  //     alert('Please fill all the details');
  //     this.showSpinner = false;
  //     return;
  //   }
  //   if (!this.doctorId || Number.isNaN(+this.doctorId)) {
  //     alert('Doctor ID missing');
  //     return;
  //   }
  //   const startISO = this.toISO(this.date, this.startTime);
  //   if (!startISO) {
  //     alert('Invalid date/time selected');
  //     return;
  //   }
  //   const endISO = new Date(new Date(startISO).getTime() + (Number(this.durationMin) || 15) * 60000).toISOString();
  //   const payload = {
  //     doctor_id: Number(this.doctorId),
  //     patient_email: this.patientEmail?.trim() ? this.patientEmail.trim() : undefined,
  //     title: this.title?.trim() ? this.title.trim() : 'Tele Consultation',
  //     description: this.description?.trim() ? this.description.trim() : '',
  //     startISO,
  //     endISO,
  //     number: this.number,
  //     name:this.name,
  //     gender:this.gender
  //   };
   
  //   this.creatingMeeting = true;
  //   this.api.createMeeting(payload).subscribe({
  //     next: (r) => {
  //       this.creatingMeeting = false;
        
  //       this.createdMeetLink = r?.meetLink || null;
  //       this.createdEventId = r?.eventId || null;
  //       // ✅ SweetAlert success
  //       Swal.fire({
  //         icon: 'success',
  //         title: 'Meeting Created!',
  //         text: 'Tele consultation meeting created successfully.',
  //         timer: 1800,
  //         showConfirmButton: false
  //       });
  //       this.patientEmail = '';
  //       this.title = 'Tele Consultation';   // keep default
  //       this.description = '';
  //       this.date = '';
  //       this.startTime = '';
  //       this.durationMin = 15;              // keep default
  //       this.number = '';
  //       this.showSpinner = false;
    
  //       this.loadMeetings();
  //     },
  //     error: (e) => {
  //       this.creatingMeeting = false;
  //       this.showSpinner = false;
        
  //       const msg = this.getErrMsg(e, 'Failed to create meeting');
  //       if (msg.toLowerCase().includes('not connected')) {
  //         alert(msg + '\n\nPlease click "Connect Google Calendar" first.');
  //         return;
  //       }
  //       alert(msg);
  //     }
  //   });
  // }
  createMeet() {
    this.showSpinner = true;
    if (!this.date || !this.startTime || !this.patientEmail || !this.title || !this.durationMin || !this.number || !this.description || !this.name || !this.gender || !this.amount) {
      alert('Please fill all the details');
      this.showSpinner = false;
      return;
    }
    if (!this.doctorId || Number.isNaN(+this.doctorId)) {
      alert('Doctor ID missing');
      return;
    }
    const startISO = this.toISO(this.date, this.startTime);
    if (!startISO) {
      alert('Invalid date/time selected');
      return;
    }
    const endISO = new Date(new Date(startISO).getTime() + (Number(this.durationMin) || 15) * 60000).toISOString();
    const payload = {
      doctor_id: Number(this.doctorId),
      patient_email: this.patientEmail?.trim() ? this.patientEmail.trim() : undefined,
      title: this.title?.trim() ? this.title.trim() : 'Tele Consultation',
      description: this.description?.trim() ? this.description.trim() : '',
      amount: this.amount,
      startISO,
      endISO,
      number: this.number,
      name: this.name,
      gender: this.gender
    };
  
    this.creatingMeeting = true;
    this.api.createMeeting(payload).subscribe({
      next: (r) => {
        this.creatingMeeting = false;
        this.createdMeetLink = r?.meetLink || null;
        this.createdEventId = r?.eventId || null;
        this.patientEmail = '';
        this.title = 'Tele Consultation';   // keep default
        this.description = '';
        this.date = '';
        this.startTime = '';
        this.durationMin = 15;              // keep default
        this.number = '';
        this.showSpinner = false;
       
        this.loadMeetings();
      
        this.initiateRazorpayPayment(r, Number(this.amount))
      },
      error: (e) => {
        this.creatingMeeting = false;
        this.showSpinner = false;
        
        const msg = this.getErrMsg(e, 'Failed to create meeting');
        if (msg.toLowerCase().includes('not connected')) {
          alert(msg + '\n\nPlease click "Connect Google Calendar" first.');
          return;
        }
        alert(msg);
      }
    });
  }

  // openLink(url: string) {
  //   window.open(url, '_blank');
  // }

  openLink(m: any) {
    if (!m?.meetLink) return;

    const start = new Date(m?.start?.dateTime);
    const end = new Date(m?.end?.dateTime);
    const now = new Date();

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Meeting Time',
        text: 'Please check meeting start/end time.'
      });
      return;
    }

    const startIST = start.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });

    const endIST = end.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });

    // ✅ Not started
    if (now < start) {
      Swal.fire({
        icon: 'info',
        title: 'Meeting Not Started',
        text: `Meeting will start at ${startIST}`
      });
      return;
    }

    // ✅ Ended
    if (now > end) {
      Swal.fire({
        icon: 'warning',
        title: 'Meeting Ended',
        text: `Meeting ended at ${endIST}. You cannot join now.`
      });
      return;
    }

    // ✅ Join allowed
    Swal.fire({
      icon: 'success',
      title: 'Joining Meeting...',
      text: 'Opening Google Meet link',
      timer: 1200,
      showConfirmButton: false
    }).then(() => {
      window.open(m.meetLink, "_blank");
    });
  }



  loadMeetings() {
    if (!this.doctorId || Number.isNaN(+this.doctorId)) return;
    this.loadingMeetings = true;
    const now = new Date();
    const timeMin = now.toISOString();
    const timeMax = new Date(now.getTime() + 7 * 86400000).toISOString();
    

    this.api.listMeetings(Number(this.doctorId), timeMin, timeMax).subscribe({
      next: (r) => {
        this.loadingMeetings = false;
       
        this.meetings = r?.items || [];
        // this.dataSource.data = this.meetings;
        this.clonedata = this.meetings;
        
      },
      error: (e) => {
        this.loadingMeetings = false;
        
        const msg = this.getErrMsg(e, 'Failed to load meetings');
        if (msg.toLowerCase().includes('not connected')) {
          this.meetings = [];
          this.showToast('Connect Google Calendar to view meetings.');
          return;
        }
        this.meetings = [];
      }
    });
  }

  private toISO(dateYYYYMMDD: string, timeHHMM: string) {
    try {
      const [y, m, d] = dateYYYYMMDD.split('-').map(Number);
      const [hh, mm] = timeHHMM.split(':').map(Number);

      if (!y || !m || !d || Number.isNaN(hh) || Number.isNaN(mm)) return '';

      // Local date-time -> ISO string (UTC)
      const dt = new Date(y, m - 1, d, hh, mm, 0);

      // Invalid date check
      if (isNaN(dt.getTime())) return '';

      return dt.toISOString();
    } catch {
      return '';
    }
  }

  // Extract backend error message safely
  private getErrMsg(e: any, fallback: string) {
    return e?.error?.message || e?.message || fallback;
  }
  private showToast(msg: string) {
    
  }


  showSpinner: boolean = false;
  casefiledata: any;
  filterValue = '';

  SearchDATE() {
    this.showSpinner = true;

    this.api.getconsultancyreport(this.googlemeet.value).subscribe((res: any) => {
      this.showSpinner = false;

      const data = res?.data || [];

      if (data.length === 0) {
        Swal.fire({ icon: 'error', title: 'Oops...', text: 'NO DATA FOUND' });
        this.masterdata = [];
        this.clonedata = [];
        this.dataSource.data = [];
        return;
      }

      data.forEach((item: any, index: number) => item.i = index + 1);

      this.masterdata = data;
      this.clonedata = [...data];

      this.dataSource.data = this.clonedata;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.paginator?.firstPage();
    }, (err: any) => {
      this.showSpinner = false;
      
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value || '';
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.paginator?.firstPage();
  }
  originalandtoggle(index: any) {
    if (index) this.hideselect = !this.hideselect;
    else {
      this.hideselect = false;
      this.headerclass['background-color'] = 'blue';
      this.reset = '';
    }

    this.clonedata = [...this.masterdata];
    this.dataSource.data = this.clonedata;   // ✅
    this.paginator?.firstPage();
  }

  columnfilterdata(object: any, index: number) {
    if (!object) {
      this.clonedata = [...this.masterdata];
      this.reset = '';
    } else {
      this.clonedata = this.masterdata.filter((x: any) => x[object.key] === object.value);
    }

    this.dataSource.data = this.clonedata;   // ✅
    this.paginator?.firstPage();
  }


  changecolor(colorclass) {
    this.headerclass['background-color'] = colorclass;
  }

  changeCustomColor(event) {
    this.cust_color = event.target.value;
    this.headerclass['background-color'] = event.target.value;
  }
  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }

  // originalandtoggle(index) {
  //   if (index) {
  //     this.hideselect = !this.hideselect;
  //   } else {
  //     this.hideselect = false;
  //     this.headerclass['background-color'] = 'blue';
  //     this.reset = '';
  //   }
  //   this.clonedata = this.masterdata;
  //   this.dataSource = new MatTableDataSource(this.clonedata);
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = null;
  //   this.dataSource.sort = this.sort;
  // }

  // columnfilterdata(object, index) {
  //   if (object == undefined) {
  //     this.clonedata = this.masterdata;
  //     this.reset = '';
  //   } else {
  //     if (index == 0) {
  //       this.clonedata = this.clonedata.filter(self => {
  //         return self[object.key] === object.value;
  //       })
  //     }
  //   }
  //   this.dataSource = new MatTableDataSource(this.clonedata);
  // }
  // exportColumns: string[] = ['i', 'roomtype'];                           // Excel table

  exportTable() {
    TableUtil.exportTableToExcel('exportTable', 'Tele-Consultancy'); // table id, file name
  }


  //////add notess code starts
  // openLink(url: string) {
  //     window.open(url, '_blank');
  // }


  @ViewChild('notesModal') notesModal: any;

  selectedMeeting: any = null;
  noteText: string = '';

  openNotesModal(meeting: any) {
    this.selectedMeeting = meeting;
    this.noteText = meeting?.doctor_note || '';
    this.modalService.open(this.notesModal, { size: 'lg', centered: true });
  }
  saveNotes(modal: any) {
    this.showSpinner = true;
    if (!this.selectedMeeting) return;

    const meetingId = this.selectedMeeting.id; // ensure this is DB id (see note below)
    if (!this.noteText.trim()) {
      alert("Please enter notes");
      return;
    }
    this.api.saveDoctorNote({
      id: meetingId,
      doctor_note: this.noteText.trim()
    }).subscribe({
      next: () => {
        modal.close();
        this.showToast("Notes saved ✅");
        Swal.fire({
          icon: 'success',
          title: 'Notes Created!',
          text: 'Added Patient Notes successfully.',
          timer: 1800,
          showConfirmButton: false
        });
        this.loadMeetings(); // refresh list
        this.showSpinner = false;
      },
      error: (e) => alert(this.getErrMsg(e, "Failed to save notes"))
    });
  }

  ///////////razorpay 
  loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {

    if ((window as any).Razorpay) {
      resolve();
      return;
    }

    const existingScript = document.getElementById('razorpay-sdk');
    if (existingScript) {
      existingScript.onload = () => resolve();
      return;
    }

    const script = document.createElement('script');
    script.id = 'razorpay-sdk';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;

    script.onload = () => resolve();
    script.onerror = () => reject('Razorpay SDK load failed');

    document.body.appendChild(script);
  });
}


async initiateRazorpayPayment(res: any, amount: number) {
  await this.loadRazorpayScript();
  const razorpay = res?.razorpay;
  if (!razorpay || !razorpay.orderId) {
    Swal.fire('Error', 'Invalid Razorpay order');
    return;
  }
  const options = {
    key: razorpay.key_id,   
    order_id: razorpay.orderId,
    name: 'Hospital Management Information System',
    description: 'Tele Consultation Payment',

    handler: (response: any) => {
      this.paymentSuccess(response, res.meetingId);
    },

    modal: {
      ondismiss: () => {
        this.paymentCancelled(res.meetingId);
      }
    },

    prefill: {
      name: this.name,
      email: this.patientEmail,
      contact: this.number
    },

    theme: { color: '#0d6efd' }
  };

  const rzp = new (window as any).Razorpay(options);
  rzp.open();
}
paymentSuccess(response: any, meetingId: number) {
  const payload = {
    id: meetingId,
    razorpay_payment_id: response.razorpay_payment_id,
    razorpay_order_id: response.razorpay_order_id,
    razorpay_signature: response.razorpay_signature,
    payment_status: 'PAID'
  };
  this.api.updatePaymentSuccess(payload).subscribe(
    (res: any) => {
      if (res.status === 200) {
        Swal.fire('Success', 'Payment Successful', 'success');
      }
    },
    () => Swal.fire('Error', 'Payment update failed')
  );
}
paymentCancelled(meetingId: number) {
  const payload = {
    id: meetingId,
    payment_status: 'CANCELLED'
  };
  this.api.updatePaymentCancelled(payload).subscribe(() => console.error('Cancel update failed')
  );
}

}
