import { Component, OnInit, ViewChild } from '@angular/core';
import { PharmaserviceService } from '../pharmaservice.service';
import { Chart } from 'chart.js';
import { FormGroup } from '@angular/forms';
import { ChartComponent } from "ng-apexcharts";
import {
  ApexChart,
  ApexPlotOptions,
  ApexFill,
  ApexStroke,
} from "ng-apexcharts";




export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  colors: string[];
  legend: ApexLegend;
  title: ApexTitleSubtitle;

};

export type SecondChartOptions = {
  series: number[];
  chart: {
    height: number;
    type: string;
    offsetY?: number;
  };
  labels: string[];
  plotOptions: {
    radialBar: {
      startAngle: number;
      endAngle: number;
      dataLabels: {
        name: {
          fontSize: string;
          color?: string;
          offsetY: number;
        };
        value: {
          offsetY: number;
          fontSize: string;
          color?: string;
          formatter: (val: number) => string;
        };
      };
    };
  };
  fill: {
    type: string;
    gradient: {
      shade: string;
      shadeIntensity: number;
      inverseColors: boolean;
      opacityFrom: number;
      opacityTo: number;
      stops: number[];
    };
  };
  stroke: {
    dashArray: number;
  };
};


export type ThirdChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};



@Component({
  selector: 'app-pharma-analysis',
  templateUrl: './pharma-analysis.component.html',
  styleUrls: ['./pharma-analysis.component.scss']
})

export class PharmaAnalysisComponent implements OnInit {

  @ViewChild("chart2") chart2: ChartComponent
  public secondOptions: SecondChartOptions;

  @ViewChild('chart3', { static: false }) chart3: ChartComponent; // Make sure this matches the template
  public ThirdOptions: any; // Define your options type appropriately

  showSpinner: Boolean = false

  class = 'spl';
  userarray: any = [];
  caralldataarray: any = [];
  labelsdata: any;
  daycounts: any;
  appointmentarray1: any
  datefilter: FormGroup
  showOverlay: Boolean = true;
  SmallHead: string;
  array: any = [];
  month_start_date: any;
  month_end_date: any;
  currentDate: any;
  constructor(public service: PharmaserviceService) {
    this.initializeChart();
  }

  ngOnInit(): void {
    // this.totalIncome();
    this.vsgraph1();
    this.gotGettopThreeSuppliers()
  }

  ngAfterViewInit() {
    this.thirdGrph();

  }

  // main_data: any
  // totalIncome() {
  //   this.service.totalIncome().subscribe((res: any) => {
  //     this.main_data = res.data[0];
  //   })
  // }



  rjyarray: any = [];

  vsgraph1() {
    this.showSpinner = true;

    // this.service.getmonthlyincome().subscribe((res: any) => {
    //   this.showSpinner = false;

    //   this.rjyarray = [];
    //   res.data.forEach(item => {
    //     this.rjyarray.push(Math.round(item.total_sales));
    //   });

    //   const options = {
    //     chart: {
    //       height: 320,
    //       type: 'bar',
    //       toolbar: { show: false },
    //       animations: {
    //         enabled: true,
    //         easing: 'easeinout',
    //         speed: 800
    //       }
    //     },

    //     series: [{
    //       name: 'Income',
    //       data: this.rjyarray
    //     }],

    //     plotOptions: {
    //       bar: {
    //         borderRadius: 10,
    //         columnWidth: '45%',
    //         distributed: false
    //       }
    //     },

    //     colors: ['#4e73df'],

    //     fill: {
    //       type: 'gradient',
    //       gradient: {
    //         shade: 'light',
    //         type: 'vertical',
    //         shadeIntensity: 0.4,
    //         gradientToColors: ['#1cc88a'],
    //         opacityFrom: 0.9,
    //         opacityTo: 0.7,
    //         stops: [0, 100]
    //       }
    //     },

    //     dataLabels: {
    //       enabled: false
    //     },

    //     grid: {
    //       borderColor: '#e9ecef',
    //       strokeDashArray: 4
    //     },

    //     xaxis: {
    //       categories: [
    //         'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    //         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    //       ],
    //       axisBorder: { show: false },
    //       axisTicks: { show: false },
    //       labels: {
    //         style: {
    //           fontSize: '12px',
    //           colors: '#6c757d'
    //         }
    //       }
    //     },

    //     yaxis: {
    //       labels: {
    //         formatter: (val) => '₹' + val.toLocaleString('en-IN'),
    //         style: {
    //           colors: '#6c757d'
    //         }
    //       }
    //     },

    //     tooltip: {
    //       theme: 'light',
    //       y: {
    //         formatter: (val) => '₹ ' + val.toLocaleString('en-IN')
    //       }
    //     }
    //   };

    //   document.querySelector("#recruitment-cost")!.innerHTML = '';
    //   const chart = new ApexCharts(
    //     document.querySelector("#recruitment-cost"),
    //     options
    //   );
    //   chart.render();
    // });
  }

  // Last 15 Days Day Wise Sale's
  // Last 15 Days – Day Wise Sales (Beautiful Chart)


  initializeChart() {
    this.ThirdOptions = {
      series: [
        {
          name: 'Sales Revenue',
          data: []
        }
      ],

      chart: {
        height: 350,
        type: 'area',
        toolbar: { show: false },
        zoom: { enabled: false },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 900
        }
      },

      colors: ['#4e73df'],

      stroke: {
        curve: 'smooth',
        width: 3
      },

      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          gradientToColors: ['#1cc88a'],
          opacityFrom: 0.65,
          opacityTo: 0.12,
          stops: [0, 100]
        }
      },

      markers: {
        size: 5,
        colors: ['#4e73df'],
        strokeColors: '#fff',
        strokeWidth: 2,
        hover: {
          size: 8
        }
      },

      dataLabels: {
        enabled: false
      },

      title: {
        text: 'Last 15 Days – Day Wise Sales',
        align: 'left',
        style: {
          fontSize: '16px',
          fontWeight: '600',
          color: '#4e73df'
        }
      },

      grid: {
        borderColor: '#e9ecef',
        strokeDashArray: 4,
        padding: {
          left: 10,
          right: 10
        }
      },

      xaxis: {
        categories: [],
        labels: {
          style: {
            fontSize: '12px',
            colors: '#6c757d'
          }
        },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },

      yaxis: {
        labels: {
          formatter: (val) => '₹ ' + val.toLocaleString('en-IN'),
          style: {
            colors: '#6c757d'
          }
        }
      },

      tooltip: {
        theme: 'light',
        y: {
          formatter: (val) => '₹ ' + val.toLocaleString('en-IN')
        }
      }
    };
  }



  thirdGrph() {
    this.service.getMonthlySalesData().subscribe(
      (res: any) => {

        const sales: number[] = [];
        const days: string[] = [];

        // Take last 15 days only
        res.data.slice(-15).forEach(item => {
          sales.push(Math.round(item.total_sales));

          const date = new Date(item.sales_date);
          days.push(
            date.toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short'
            })
          );
        });

        this.ThirdOptions.series[0].data = sales;
        this.ThirdOptions.xaxis.categories = days;

        if (this.chart3) {
          this.chart3.updateOptions(this.ThirdOptions, true, true);
        }
      },
      error => {
       
      }
    );
  }

  ThreeSupplData: any = [];

  gotGettopThreeSuppliers() {
    this.service.GettopThreeSuppliers().subscribe((res: any) => {
      this.ThreeSupplData = res.data
    })
  }

}



