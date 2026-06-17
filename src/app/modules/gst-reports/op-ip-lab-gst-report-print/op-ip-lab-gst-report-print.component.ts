import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { GstreportssesrviceService } from '../gstreportssesrvice.service';

@Component({
  selector: 'app-op-ip-lab-gst-report-print',
  templateUrl: './op-ip-lab-gst-report-print.component.html',
  styleUrls: ['./op-ip-lab-gst-report-print.component.scss']
})
export class OpIpLabGstReportPrintComponent implements OnInit {

  current_date: any;
  showname: any;
  Op_Gst_data: any;
  Ip_Gst_data: any;
  Lab_Gst_data: any;
  dateRangeDisplay: any
  combined_sum: any = [];
  combined_sum_op_ip_lab: any = [];

  constructor(private location: Location, private service: GstreportssesrviceService) {
    this.Op_Gst_data = JSON.parse(sessionStorage.getItem('op-gst-reports-print'))
    this.Ip_Gst_data = JSON.parse(sessionStorage.getItem('ip-gst-reports-print'))
    this.Lab_Gst_data = JSON.parse(sessionStorage.getItem('lab-sales-print'))
    this.dateRangeDisplay = JSON.parse(sessionStorage.getItem('gst-op-ip-lab-date'))
    this.current_date = new Date().toDateString()
  }

  ngOnInit(): void {
    this.mergeOpIpSumData();
    this.mergeOpIpLabSumData();
  }

  print() {
    setTimeout(() => {
      window.print();
    }, 200);
  }

  Back() {
    this.location.back();
  }

  public openPDF(): void {
    var x = this.showname;
    setTimeout(() => {
      x = this.showname;
      document.title = x;
      window.print();
    }, 200);
  }

  mergeOpIpSumData() {
    this.combined_sum = {
      total_5_percent: 0,
      total_8_percent: 0,
      total_12_percent: 0,
      total_18_percent: 0,
      total_28_percent: 0,
      tax_5_percent: 0,
      tax_8_percent: 0,
      tax_12_percent: 0,
      tax_18_percent: 0,
      tax_28_percent: 0,
      net_total: 0,
      total_month_sum_zeros: 0,
      total_month_sum: 0,
      total_combined_sum: 0
    };
    const safeNumber = (value: any): number => {
      const num = Number(value);
      if (isNaN(num)) {
      
        return 0;
      }
      return num;
    };

    this.Op_Gst_data.forEach(item => {
      this.combined_sum.total_5_percent += safeNumber(item.total_5_percent);
      this.combined_sum.total_8_percent += safeNumber(item.total_8_percent);
      this.combined_sum.total_12_percent += safeNumber(item.total_12_percent);
      this.combined_sum.total_18_percent += safeNumber(item.total_18_percent);
      this.combined_sum.total_28_percent += safeNumber(item.total_28_percent);
      this.combined_sum.tax_5_percent += safeNumber(item.tax_5_percent);
      this.combined_sum.tax_8_percent += safeNumber(item.tax_8_percent);
      this.combined_sum.tax_12_percent += safeNumber(item.tax_12_percent);
      this.combined_sum.tax_18_percent += safeNumber(item.tax_18_percent);
      this.combined_sum.tax_28_percent += safeNumber(item.tax_28_percent);
      this.combined_sum.net_total += safeNumber(item.net_total);
      this.combined_sum.total_month_sum_zeros += safeNumber(item.total_month_sum_zeros);
      this.combined_sum.total_month_sum += safeNumber(item.total_month_sum);
    });

    this.Ip_Gst_data.forEach(item => {
      this.combined_sum.total_5_percent += safeNumber(item.total_5_percent);
      this.combined_sum.total_8_percent += safeNumber(item.total_8_percent);
      this.combined_sum.total_12_percent += safeNumber(item.total_12_percent);
      this.combined_sum.total_18_percent += safeNumber(item.total_18_percent);
      this.combined_sum.total_28_percent += safeNumber(item.total_28_percent);
      this.combined_sum.tax_5_percent += safeNumber(item.tax_5_percent);
      this.combined_sum.tax_8_percent += safeNumber(item.tax_8_percent);
      this.combined_sum.tax_12_percent += safeNumber(item.tax_12_percent);
      this.combined_sum.tax_18_percent += safeNumber(item.tax_18_percent);
      this.combined_sum.tax_28_percent += safeNumber(item.tax_28_percent);
      this.combined_sum.net_total += safeNumber(item.net_total);
      this.combined_sum.total_month_sum_zeros += safeNumber(item.total_month_sum_zeros);
      this.combined_sum.total_month_sum += safeNumber(item.total_month_sum);
    });

    this.combined_sum.total_sum_both = this.combined_sum.total_5_percent +
      this.combined_sum.total_8_percent +
      this.combined_sum.total_12_percent +
      this.combined_sum.total_18_percent +
      this.combined_sum.total_28_percent;

    this.combined_sum.total_tax_sum = this.combined_sum.tax_5_percent +
      this.combined_sum.tax_8_percent +
      this.combined_sum.tax_12_percent +
      this.combined_sum.tax_18_percent +
      this.combined_sum.tax_28_percent;

    this.combined_sum.total_combined_sum = this.combined_sum.total_5_percent +
      this.combined_sum.total_8_percent +
      this.combined_sum.total_12_percent +
      this.combined_sum.total_18_percent +
      this.combined_sum.total_28_percent +
      this.combined_sum.tax_5_percent +
      this.combined_sum.tax_8_percent +
      this.combined_sum.tax_12_percent +
      this.combined_sum.tax_18_percent +
      this.combined_sum.tax_28_percent;
  }

  mergeOpIpLabSumData() {
    this.combined_sum_op_ip_lab = {
      total_month_sum_zeros: 0,
      after_discount_total: 0,// For final combined sum
    };

    const safeNumber = (value: any): number => {
      const num = Number(value);
      if (isNaN(num)) {
        
        return 0;
      }
      return num;
    };

    this.Op_Gst_data.forEach(item => {
      this.combined_sum_op_ip_lab.total_month_sum_zeros += safeNumber(item.total_month_sum_zeros);
    });

    this.Ip_Gst_data.forEach(item => {
      this.combined_sum_op_ip_lab.total_month_sum_zeros += safeNumber(item.total_month_sum_zeros);
    });

    this.Lab_Gst_data.forEach(item => {
      this.combined_sum_op_ip_lab.after_discount_total += safeNumber(item.after_discount_total);
    });

    this.combined_sum_op_ip_lab.total_combined_sum_op_ip_lab = this.combined_sum_op_ip_lab.total_month_sum_zeros + this.combined_sum_op_ip_lab.after_discount_total;

  }

}
