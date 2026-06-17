import { Component, OnInit } from '@angular/core';
import { NumToWordsServicesService } from '../../num-to-words-services.service';
import { InPatienrservicesService } from '../../in-patients/in-patienrservices.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-finalbillprint',
  templateUrl: './finalbillprint.component.html',
  styleUrls: ['./finalbillprint.component.scss']
})
export class FinalbillprintComponent implements OnInit {

  constructor(private location: Location, private convertTowords: NumToWordsServicesService, private service: InPatienrservicesService) {

   }
  bill_data: any;

  ngOnInit(): void {
    this.bill_data = []
    this.bill_data = [JSON.parse(sessionStorage.getItem('finalbillprints'))]
    this.getOrginalDat();
  }
  print() {
    setTimeout(() => {
      window.print();
    }, 200);
  }
  Back() {
    this.location.back();
  }
  // formatDate(dateString: string): string {
  //   const date = new Date(dateString);
  //   const options: Intl.DateTimeFormatOptions = {
  //     day: '2-digit',
  //     month: '2-digit',
  //     year: 'numeric',
  //     hour: '2-digit',
  //     minute: '2-digit',
  //     hour12: true
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

  final_bill_no: any;
  getOrginalDat() {
  
    var data = {
      uh_id: this.bill_data[0].old_uhid_no,
    }
    
    
    this.showSpinner = true
    this.service.getopfinalpatntBilldata(data).subscribe((res) => {
      this.showSpinner = false
      this.final_bill_no = res.data[0]?.final_bill_no || "",
        this.rent_room = res.data[0]?.stentremove || 0,
        this.treatment_charges = res.data[0]?.consultantcharge || 0,
        this.operation_theatre = res.data[0]?.crystoscopy || 0,
        this.theatre_assistant = res.data[0]?.guidewire || 0,
        this.oxygen_charges = res.data[0]?.anesthesia || 0,
        this.dressing_charges = res.data[0]?.d2echo || 0,
        this.nursing_charges = res.data[0]?.discharge || 0,
        this.nebuliser = res.data[0]?.procedurecharge || 0,
        this.legal_charges = res.data[0]?.circumsion || 0,
        this.laboratory = res.data[0]?.circumcisionstaper || 0,
        this.anaesthesia = res.data[0]?.uroflowmetry,
        this.grandTotal = res.data[0]?.grandTotal || 0
    })
  }
  rent_room: any = 0;
  treatment_charges: any = 0;
  anaesthesia: any = 0;
  operation_theatre: any = 0;
  theatre_assistant: any = 0;
  oxygen_charges: any = 0;
  dressing_charges: any = 0;
  nursing_charges: any = 0;
  monitor: any = 0;
  nebuliser: any = 0;
  legal_charges: any = 0;
  laboratory: any = 0;
  medicines: any = 0;
  ac_charges: any = 0;
  special_charges: any = 0;
  grandTotal: any = 0;

  calculateGrandTotal() {
    this.grandTotal =
      (this.rent_room || 0) +
      (this.treatment_charges || 0) +
      (this.anaesthesia || 0) +
      (this.operation_theatre || 0) +
      (this.theatre_assistant || 0) +
      (this.oxygen_charges || 0) +
      (this.dressing_charges || 0) +
      (this.nursing_charges || 0) +
      (this.nebuliser || 0) +
      (this.legal_charges || 0) +
      (this.laboratory || 0) +
      // Add all other fields similarly
      0;
    this.grandTotal = this.grandTotal.toFixed(2)
  }


  showSpinner: boolean = false;

  submitFinallBill() {
    var data = {
      id: this.bill_data[0].id,
      uh_id: this.bill_data[0].old_uhid_no,
      date_of_admit: this.bill_data[0].date_of_admission || '',
      date_of_discharge: this.bill_data[0].date_of_discharge,
      name: this.bill_data[0].name,
      payment_types: this.bill_data[0].payment_types,
      med_claim: this.bill_data[0].med_claim,
      insurance_name: this.bill_data[0].insurance_name,
      stentremove: this.rent_room,
      consultantcharges: this.treatment_charges,
      uroflowmetry: this.anaesthesia,
      cystoscopy: this.operation_theatre,
      guidewire: this.theatre_assistant,
      anesthesia: this.oxygen_charges,
      d2echo: this.dressing_charges,
      discharge: this.nursing_charges,
      // monitor: this.monitor,
      procedurecharge: this.nebuliser,
      circumcision: this.legal_charges,
      circumisionstapler: this.laboratory,
      grandTotal: this.grandTotal,

    }
    
    this.showSpinner = true
    this.service.saveopfinalpatntBill(data).subscribe((res) => {
      this.showSpinner = false
      if (res.status == 200) {
        alert("Success")
        this.getOrginalDat();
      }
    })
  }

}
