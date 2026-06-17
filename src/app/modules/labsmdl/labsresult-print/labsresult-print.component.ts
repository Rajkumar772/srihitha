import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { LabsServicesService } from '../labs-services.service';


@Component({
  selector: 'app-labsresult-print',
  templateUrl: './labsresult-print.component.html',
  styleUrls: ['./labsresult-print.component.scss']
})
export class LabsresultPrintComponent {
  gotLabResults: any;
  showname: any;
  cEmail: any;
  cLogo: any;

  id: any;
  name: any;
  age: any;
  number: any;
  current_date: any;
  singleData: any;
  assigned_date: any;
  d_name: any;
  gender: any

  completed_date: any;
  constructor(private location: Location, private service: LabsServicesService) {
    this.gotLabResults = JSON.parse(sessionStorage.getItem('labresults'))
    this.current_date = new Date().toDateString()
    this.assigned_date = sessionStorage.getItem('assigned_date');
    this.completed_date = sessionStorage.getItem('completed_date');
    this.d_name = sessionStorage.getItem('d_name');
    this.gender = sessionStorage.getItem('gender')
    this.singleData = this.gotLabResults[0]

    this.gotLabResults.forEach(item => {
      // Parse value to float
      const value = parseFloat(item.value.replace(/,/g, '')); // Remove commas from value

      // Initialize status to 0 (not within range)
      item.status = 0;

      // Check if ranges contains a dash '-' to split into parts
      if (item.ranges.includes('-')) {
        const rangeParts = item.ranges.split('-').map(part => part.trim());

        if (rangeParts.length === 2) {
          const firstRange = parseFloat(rangeParts[0].replace(/,/g, '')); // Remove commas from range part
          const secondRange = parseFloat(rangeParts[1].replace(/,/g, '')); // Remove commas from range part

          // Handle numeric ranges
          if (!isNaN(firstRange) && !isNaN(secondRange)) {
            // Check if value is within the range
            if (value >= firstRange && value <= secondRange) {
              item.status = 1;
            }
          }
        }
      }
      if (item.ranges.includes('<')) {
        item.status = 1;
      }
      if (item.ranges.includes('>')) {
        item.status = 1;
      }
      // Check if value is 'positive'
      if (typeof item.value === 'string') {
        const normalizedValue = item.value.toLowerCase().trim();
        if (normalizedValue === 'positive' || normalizedValue === 'reactive' || normalizedValue === 'abnormal') {
          item.status = 0;
        }
      }
      if (typeof item.value === 'string') {
        const normalizedValue = item.value.toLowerCase().trim();
        if (normalizedValue === 'negative' || normalizedValue === 'normal' || normalizedValue === 'non reactive' ||
          normalizedValue === 'nil' || normalizedValue === 'thin' || normalizedValue === 'yellow') {
          item.status = 1;
        }
      }


    });


    this.groupTestResults();

  }


  hideheader: boolean = false;




  print() {
    setTimeout(() => {
      window.print();
    }, 200);
  }

  public openPDF(): void {
    var x = this.showname;
    setTimeout(() => {
      x = this.showname;
      document.title = x;
      window.print();
    }, 200);
  }

  Back() {
    this.location.back();
  }

  groupedData: any;
  resultArrays: any;
  nestedResults: any;

  groupTestResults() {
    const resultMap = this.gotLabResults.reduce((acc, result) => {
      const { category_name, labtest_name } = result;

      if (!acc[category_name]) {
        acc[category_name] = {};
      }

      if (!acc[category_name][labtest_name]) {
        acc[category_name][labtest_name] = [];
      }

      acc[category_name][labtest_name].push(result);

      return acc;
    }, {});

    // Convert resultMap to nested array structure
    this.nestedResults = Object.keys(resultMap).map(category_name => {
      return {
        category_name,
        labTests: Object.keys(resultMap[category_name]).map(labtest_name => {
          return {
            labtest_name,
            results: resultMap[category_name][labtest_name]
          };
        })
      };
    });


  }



}
