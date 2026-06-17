import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { DoctorserviceService } from '../doctorservice.service';



@Component({
  selector: 'app-doc-medicine-print',
  templateUrl: './doc-medicine-print.component.html',
  styleUrls: ['./doc-medicine-print.component.scss']
})
export class DocMedicinePrintComponent implements OnInit {
  constructor(private location: Location, private service: DoctorserviceService) {

  }

  patient_mdcn_dts: any;

  ngOnInit(): void {
    var dta = JSON.parse(sessionStorage.getItem('doctor-medicines'));

    this.patient_mdcn_dts = dta

    this.func(this.patient_mdcn_dts.id)
  }

  print() {
    setTimeout(() => {
      window.print();
    }, 200);
  }

  Back() {
    this.location.back();
  }



  medicalData: any




  func(id) {
    var data = {
      'pharma_id': id
    }

    this.service.getmedicalFields(data).subscribe((res) => {
      this.medicalData = res.data.map(item => this.processMedicineName(item));
    });

  }


  processMedicineName(item: any): any {
    let parsedData;
    try {
      // Check if medicine_name is a string that needs parsing
      if (typeof item.medicine_name === 'string' && this.isJsonString(item.medicine_name)) {
        parsedData = JSON.parse(item.medicine_name);
        if (Array.isArray(parsedData) && parsedData.length === 2) {
          return {
            ...item,
            isParsed: true,
            composition: parsedData[0],
            brands: parsedData[1]
          };
        }
      }
      // If not JSON, treat as plain string
      return {
        ...item,
        isParsed: false,
        composition: item.medicine_name,
        brands: []
      };
    } catch (e) {

      return {
        ...item,
        isParsed: false,
        composition: item.medicine_name,
        brands: []
      };
    }
  }

  isJsonString(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  getFormattedBrands(brands): string {
    return brands.join(' / ');
  }
splitToBullets(value: string | null | undefined): string[] {
if (!value) {
    return [];
}
return value
    .split(/,|\n/)
    .map(v => v.trim())
    .filter(v => v.length > 0);
}
}
