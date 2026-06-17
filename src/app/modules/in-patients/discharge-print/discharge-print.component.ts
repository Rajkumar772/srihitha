import { Location } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { NumToWordsServicesService } from '../../num-to-words-services.service';
import numWords from 'num-words';
import { InPatienrservicesService } from '../in-patienrservices.service';



@Component({
  selector: 'app-discharge-print',
  templateUrl: './discharge-print.component.html',
  styleUrls: ['./discharge-print.component.scss']
})
export class DischargePrintComponent implements OnInit {


  diagnosis: any;
  complaints: any;
  history: any;
  physical_examination: any;
  key_investigations: any;
  procedures_performed: any;
  course_hospital: any;
  discharge_condition: any;

  post_instructions: any;
  follow_up_care: any;

  summary_data: any = [];

  medications: any[]; // Updated type

  showTime: boolean = false;

  user_id: any;
  usr_nm: any;
  constructor(private location: Location, private convertTowords: NumToWordsServicesService, private service: InPatienrservicesService) { }

  ngOnInit(): void {

    this.user_id = localStorage.getItem("user_id");
    this.usr_nm = localStorage.getItem("usr_nm");

    this.summary_data = [];
    const sessionData = sessionStorage.getItem('summary_data');
    this.summary_data = JSON.parse(sessionData);
    this.getOrginalDat();
    if (this.summary_data.payment_types === 'CASHLESS' && this.summary_data.med_claim === 'Yes') {
      this.showTime = false
    }
    else {
      this.showTime = true
    }
  }

  showSpinner: boolean = false

  getOrginalDat() {
    const data = {
      uh_id: this.summary_data?.uh_id,
      ip_number: this.summary_data?.ip_number,
    };
    this.showSpinner = true;
    this.medications = [];
    this.service.getDischargeSumdata(data).subscribe((res) => {
      this.showSpinner = false;
      if (res.data && res.data.length > 0) {
        const firstData = res.data[0];
        this.diagnosis = firstData?.diagnosis || '';
        this.complaints = firstData?.complaints || '';
        this.history = firstData?.history || '';
        this.physical_examination = firstData?.physical_examination || '';
        this.key_investigations = firstData?.key_investigations || '';
        this.procedures_performed = firstData?.procedures_performed || '';
        this.course_hospital = firstData?.course_hospital || '';
        this.discharge_condition = firstData?.discharge_condition || '';
        this.post_instructions = firstData?.post_instructions || '';
        this.follow_up_care = firstData?.follow_up_care || '';
        const medicationsString = firstData?.medications || '[]';
        try {
          const cleanedString = medicationsString.replace(/\\\"/g, '"');
          this.medications = JSON.parse(cleanedString);
        } catch (error) {
          this.medications = [];
        }
      }
    });
  }

  submitSummary() {
    const data = {
      uh_id: this.summary_data?.uh_id,
      ip_number: this.summary_data?.ip_number,
      date_of_admit: this.summary_data?.date_of_admission || '',
      name: this.summary_data?.name,
      age_gender: `${this.summary_data?.age || ''} ${this.summary_data?.gender || ''}`,
      address: this.summary_data?.address || '',
      phone_number: this.summary_data?.phone_number || '',
      payment_types: this.summary_data?.payment_types || '',
      med_claim: this.summary_data?.med_claim || '',
      insurance_name: this.summary_data?.insurance_name || '',
      date_of_discharge: this.summary_data?.date_of_discharge || '',
      doo_operations:this.summary_data?.doo_operations||'',
      name_of_consultant: this.summary_data?.referred_by || '',
      diagnosis: this.diagnosis,
      complaints: this.complaints,
      history: this.history,
      physical_examination: this.physical_examination,
      key_investigations: this.key_investigations,
      procedures_performed: this.procedures_performed,
      course_hospital: this.course_hospital,
      discharge_condition: this.discharge_condition,
      medications: JSON.stringify(this.medications),
      post_instructions: this.post_instructions,
      follow_up_care: this.follow_up_care,
      user_id: localStorage.getItem('user_id'),
      usr_nm: localStorage.getItem('usr_nm'),
    };
    this.showSpinner = true;
    this.service.saveDischargeSumamry(data).subscribe((res) => {
      this.showSpinner = false;
      if (res.status === 200) {
        alert('Success');
        this.getOrginalDat();
      }
    });
  }

  addRow(): void {
    this.medications.push({ id: '', description: '', details: '', quantity: '' });
  }

  updateData(rowIndex: number, key: string, value: string): void {
    if (this.medications[rowIndex]) {
      this.medications[rowIndex][key] = value;
    }
  }

  print() {
    setTimeout(() => {
      window.print();
    }, 200);
  }

  Back() {
    this.location.back();
  }



  // formatDate(dateString: string, includeTime: boolean = true): string {
  //   const date = new Date(dateString);
  //   const options: Intl.DateTimeFormatOptions = {
  //     day: '2-digit',
  //     month: '2-digit',
  //     year: 'numeric',
  //     ...(includeTime ? { hour: '2-digit', minute: '2-digit', hour12: true } : {})
  //   };
  //   return date.toLocaleString('en-US', options).replace(',', ' at');
  // }

  formatDate(dateString: string, includeTime: boolean = true): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      ...(includeTime ? { hour: '2-digit', minute: '2-digit', hour12: true } : {})
    };

    // Get the formatted date string in 'MM/DD/YYYY' format
    const formattedDate = date.toLocaleDateString('en-GB', options);

    // If includeTime is true, add the time component


    return formattedDate;
  }


  formatDate2(dateString: string, includeTime: boolean = true): string {
    if (!dateString || dateString === 'null') {
      return '-';
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    const dateOptions: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };

    const formattedDate = date.toLocaleDateString('en-GB', dateOptions);

    if (includeTime) {
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      const formattedTime = date.toLocaleTimeString('en-GB', timeOptions);
      return `${formattedDate} ${formattedTime}`;
    } else {
      return formattedDate;
    }
  }

  formatDate3(dateString: string, includeTime: boolean = true): string {
    if (!dateString || dateString === 'null') {
      return '-';
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    const dateOptions: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };

    const formattedDate = date.toLocaleDateString('en-GB', dateOptions);

    if (includeTime) {
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      const formattedTime = date.toLocaleTimeString('en-GB', timeOptions);
      return `${formattedDate} ${formattedTime}`;
    } else {
      return formattedDate;
    }
  }

}
