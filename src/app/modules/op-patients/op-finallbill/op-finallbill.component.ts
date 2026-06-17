import { Component, OnInit } from '@angular/core';
import { NumToWordsServicesService } from '../../num-to-words-services.service';
import { InPatienrservicesService } from '../../in-patients/in-patienrservices.service';
import { Location } from '@angular/common';
import numWords from 'num-words';
@Component({
  selector: 'app-op-finallbill',
  templateUrl: './op-finallbill.component.html',
  styleUrls: ['./op-finallbill.component.scss']
})
export class OpFinallbillComponent implements OnInit {

  constructor(private location: Location, private convertTowords: NumToWordsServicesService, private service: InPatienrservicesService) {

  }
  bill_data: any;

  StentRemove: string = 'Stent Remove';
  ConsultantCharges: string = 'Consultant Charges';
  Uroflowmetry: string = 'Uroflowmetry';
  Cystoscopy: string = 'Cystoscopy';
  Guidewire: string = 'Guide wire';
  Anaesthesia: string = 'Anesthesia';
  DEcho: string = '2D-Echo';
  Discharge: string = 'Discharge';
  ProcedureCharge: string = 'Procedure Charge';
  Circumcision: string = 'Circumcision';
  CircumcisionStapler: string = 'CircumcisionStapler';

  user_id: any;
  usr_nm: any;

  ngOnInit(): void {
    this.bill_data = []
    this.bill_data = [JSON.parse(sessionStorage.getItem('finalbillprints'))]
    this.getOrginalDat();

    // const res = { data: [{ grandTotal:123 }] }; 
    // this.grandTotal = res.data[0]?.grandTotal || 0; 

    // this.numberInWords = numWords(this.grandTotal);

    this.user_id = localStorage.getItem("user_id");
    this.usr_nm = localStorage.getItem("usr_nm");

  }

  print() {
    setTimeout(() => {
      window.print();
    }, 200);
  }
  Back() {
    this.location.back();
  }

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
  totalBill: any;
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
        this.anaesthesia = res.data[0]?.uroflowmetry

      const billDetailsStr = res.data[0]?.billDetails || "[]";
      try {
        this.totalBill = JSON.parse(billDetailsStr);

      } catch (error) {

        this.totalBill = [];
      }
      this.totalBill.forEach(item => {
        switch (item.statement) {
          case "Stent Remove":
            this.StentRemove = item.statement;
            this.Stent_Remove_qty = item.qty;
            this.Stent_Remove_rate = item.rate;
            this.Stent_Remove_total = item.totalAmount;
            break;
          case "Consultant Charges":
            this.ConsultantCharges = item.statement;
            this.Consultant_Charges_qty = item.qty;
            this.Consultant_Charges_rent = item.rate;
            this.Consultant_Charges_total = item.totalAmount;
            break;
          case "Uroflowmetry":
            this.Uroflowmetry = item.statement;
            this.Uroflow_metry_qty = item.qty;
            this.Uroflow_metry_rate = item.rate;
            this.Uroflow_metry_total = item.totalAmount;
            break;
          case "Cystoscopy":
            this.Cystoscopy = item.statement;
            this.Cystos_copy_qty = item.qty;
            this.Cystos_copy_rate = item.rate;
            this.Cystos_copy_total = item.totalAmount;
            break;
          case "Guide wire":
            this.Guidewire = item.statement;
            this.Guide_wire_qty = item.qty;
            this.Guide_wire_rate = item.rate;
            this.Guide_wire_total = item.totalAmount;
            break;
          case "Anesthesia":
            this.Anaesthesia = item.statement;
            this.anaesthesia_qty = item.qty;
            this.anaesthesia_rate = item.rate;
            this.rent_anaesthesia_total = item.totalAmount;
            break;
          case "2D-Echo":
            this.DEcho = item.statement;
            this.rent_DEcho_qty = item.qty;
            this.rent_DEcho_rate = item.rate;
            this.rent_DEcho_total = item.totalAmount;
            break;
          case "Discharge":
            this.Discharge = item.statement;
            this.Discharge_qty = item.qty;
            this.Discharge_rent = item.rate;
            this.Discharge_total = item.totalAmount;
            break;
          case "Procedure Charge":
            this.ProcedureCharge = item.statement;
            this.Procedure_Charge_qty = item.qty;
            this.Procedure_Charge_rent = item.rate;
            this.Procedure_Charge_total = item.totalAmount;
            break;
          case "Circumcision":
            this.Circumcision = item.statement;
            this.Circumcision_qty = item.qty;
            this.Circumcision_rent = item.rate;
            this.Circumcision_rent_total = item.totalAmount;
            break;
          case "CircumcisionStapler":
            this.CircumcisionStapler = item.statement;
            this.Circumcision_Stapler_rent_qty = item.qty;
            this.Circumcision_Stapler_rent = item.rate;
            this.Circumcision_Stapler_total = item.totalAmount;
            break;
          default:
           
            break;
        }
      });
      this.grandTotal = res.data[0]?.grandTotal || 0,
        this.numberInWords = numWords(this.grandTotal);
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
  Stent_Remove_total: number = 0;
  Stent_Remove_qty: number = 0;
  Stent_Remove_rate: number = 0;
  Consultant_Charges_total: number = 0;
  Consultant_Charges_qty: number = 0; Consultant_Charges_rent: number = 0;
  Uroflow_metry_total: number = 0; Uroflow_metry_qty: number = 0; Uroflow_metry_rate: number = 0;
  Cystos_copy_total: number = 0; Cystos_copy_qty: number = 0; Cystos_copy_rate: number = 0;
  Guide_wire_total: number = 0; Guide_wire_qty: number = 0; Guide_wire_rate: number = 0;
  anaesthesia_qty: number = 0; anaesthesia_rate: number = 0; rent_anaesthesia_total: number = 0;
  rent_DEcho_total: number = 0; rent_DEcho_rate: number = 0; rent_DEcho_qty: number = 0;
  Discharge_total: number = 0; Discharge_qty: number = 0; Discharge_rent: number = 0;;
  Procedure_Charge_total: number = 0; Procedure_Charge_qty: number = 0; Procedure_Charge_rent: number = 0;
  Circumcision_rent_total: number = 0; Circumcision_qty: number = 0; Circumcision_rent: number = 0;
  Circumcision_Stapler_rent_qty: number = 0;
  Circumcision_Stapler_total: number = 0;
  Circumcision_Stapler_rent: number = 0;

  numberInWords: any
  calculateTotal(item: string) {
    switch (item) {
      case 'Stent_Remove':
        this.Stent_Remove_total = this.Stent_Remove_qty * this.Stent_Remove_rate;
        break;
      case 'Consultant_Charges':
        this.Consultant_Charges_total = this.Consultant_Charges_qty * this.Consultant_Charges_rent;
        break;
      case 'Uroflow_metry':
        this.Uroflow_metry_total = this.Uroflow_metry_qty * this.Uroflow_metry_rate;
        break;
      case 'Cystos_copy':
        this.Cystos_copy_total = this.Cystos_copy_qty * this.Cystos_copy_rate;
        break;
      case 'Guide_wire':
        this.Guide_wire_total = this.Guide_wire_qty * this.Guide_wire_rate;
        break;
      case 'rent_naesthesia':
        this.rent_anaesthesia_total = this.anaesthesia_qty * this.anaesthesia_rate;
        break
      case 'rent_DEcho':
        this.rent_DEcho_total = this.rent_DEcho_qty * this.rent_DEcho_rate;
        break
      case 'Discharge_rtes':
        this.Discharge_total = this.Discharge_qty * this.Discharge_rent;
        break
      case 'Procedure_Charge':
        this.Procedure_Charge_total = this.Procedure_Charge_qty * this.Procedure_Charge_rent;
        break
      case 'Circumcision_rate':
        this.Circumcision_rent_total = this.Circumcision_qty * this.Circumcision_rent;
        break
      case 'Circumcision_Stapler':
        this.Circumcision_Stapler_total = this.Circumcision_Stapler_rent_qty * this.Circumcision_Stapler_rent;
        break
    }
    this.calculateGrandTotal();
  }

  calculateGrandTotal() {
    this.grandTotal = this.Stent_Remove_total + this.Consultant_Charges_total + this.Uroflow_metry_total + this.Cystos_copy_total + this.Guide_wire_total +
      this.rent_anaesthesia_total + this.rent_DEcho_total + this.Discharge_total + this.Procedure_Charge_total + this.Circumcision_rent_total +
      this.Circumcision_Stapler_total
  }

  showSpinner: boolean = false;
  submitFinallBill() {
    var data = {
      uh_id: this.bill_data[0].old_uhid_no,
      name: this.bill_data[0].name,
      op_date: this.bill_data[0].op_date,
      grandTotal: this.grandTotal,
      doctor_name: this.bill_data[0].d_name,
      user_id: localStorage.getItem('user_id'),
      usr_nm: localStorage.getItem('usr_nm'),
      billDetails: JSON.stringify([
        {
          statement: this.StentRemove,
          qty: this.Stent_Remove_qty,
          rate: this.Stent_Remove_rate,
          totalAmount: this.Stent_Remove_total
        },
        {
          statement: this.ConsultantCharges,
          qty: this.Consultant_Charges_qty,
          rate: this.Consultant_Charges_rent,
          totalAmount: this.Consultant_Charges_total
        },
        {
          statement: this.Uroflowmetry,
          qty: this.Uroflow_metry_qty,
          rate: this.Uroflow_metry_rate,
          totalAmount: this.Uroflow_metry_total
        },
        {
          statement: this.Cystoscopy,
          qty: this.Cystos_copy_qty,
          rate: this.Cystos_copy_rate,
          totalAmount: this.Cystos_copy_total
        }, {
          statement: this.Guidewire,
          qty: this.Guide_wire_qty,
          rate: this.Guide_wire_rate,
          totalAmount: this.Guide_wire_total
        },
        {
          statement: this.Anaesthesia,
          qty: this.anaesthesia_qty,
          rate: this.anaesthesia_rate,
          totalAmount: this.rent_anaesthesia_total
        },
        {
          statement: this.DEcho,
          qty: this.rent_DEcho_qty,
          rate: this.rent_DEcho_rate,
          totalAmount: this.rent_DEcho_total
        },
        {
          statement: this.Discharge,
          qty: this.Discharge_qty,
          rate: this.Discharge_rent,
          totalAmount: this.Discharge_total
        },
        {
          statement: this.ProcedureCharge,
          qty: this.Procedure_Charge_qty,
          rate: this.Procedure_Charge_rent,
          totalAmount: this.Procedure_Charge_total
        },
        {
          statement: this.Circumcision,
          qty: this.Circumcision_qty,
          rate: this.Circumcision_rent,
          totalAmount: this.Circumcision_rent_total,
        },
        {
          statement: this.CircumcisionStapler,
          qty: this.Circumcision_Stapler_rent_qty,
          rate: this.Circumcision_Stapler_rent,
          totalAmount: this.Circumcision_Stapler_total
        }
      ])
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