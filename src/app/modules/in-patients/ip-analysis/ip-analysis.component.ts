import { Component, OnInit } from '@angular/core';
import { InPatienrservicesService } from '../in-patienrservices.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-ip-analysis',
  templateUrl: './ip-analysis.component.html',
  styleUrls: ['./ip-analysis.component.scss']
})

export class IpAnalysisComponent implements OnInit {

  showSpinner: Boolean = false
  barChart: any;
  basicRadialBarChart: any;
  lineBarChart: any;
  columnlabelChart: any;
  simplePieChart: any;
  basicColumChart: any;
  class = 'spl';
  userarray: any = [];
  caralldataarray: any = [];
  labelsdata: any;
  daycounts: any;
  appointmentarray1: any
  rjyarray: any = [];

  amount_aary: any = [];
  constructor(public service:InPatienrservicesService) { }

  ngOnInit(): void {
    this.toatlrooms();
    this.getroomsanalysis();
    this.getweekdataroomFuntion();
    // this.getsitetraficgraph();
    this.vsgraph1();
  }

  orders_count_array: any
  toatlrooms() {
    this.service.toatlrooms().subscribe((res: any) => {
      this.orders_count_array = res.data[0];
      this.amount_aary = res.data[1];
    }, error => {
    })
  }
  
  getweekdataroomFuntion() {
    this.showSpinner = true
    this.service.getweekdataroom().subscribe(res => {
      this.showSpinner = false
      var datacount = [];
      var categories = [];
      var bcnt = 0;
      res.data.map(obj => {
        datacount.push(obj.tcnt);
        categories.push(obj.currentdate);
        bcnt++;
        if (res.data.length == bcnt) {
          var e = {
            series: [{
              name: "Visitors",
              data: datacount
            }],
            chart: {
              foreColor: "#6c757d",
              type: "bar",
              height: 390,
              toolbar: {
                show: !1
              },
              zoom: {
                enabled: !1
              },
              dropShadow: {
                enabled: !1,
                top: 3,
                left: 10,
                blur: 3,
                opacity: .1,
                color: "#0d6efd"
              },
              sparkline: {
                enabled: !1
              }
            },
            plotOptions: {
              radialBar: {
                hollow: {
                  size: "70%"
                }
              },
              bar: {
                horizontal: !1,
                columnWidth: "40%",
                endingShape: "rounded"
              }
            },
            markers: {
              size: 0,
              colors: ["#0d6efd"],
              strokeColors: "#fff",
              strokeWidth: 2,
              hover: {
                size: 7
              }
            },
            dataLabels: {
              enabled: !1
            },
            stroke: {
              show: !0,
              width: 3,
              curve: "smooth"
            },
            colors: ["#DA70D6"],
            xaxis: {
              categories: categories
            },
            fill: {
              opacity: 1
            }
          };
          new ApexCharts(document.querySelector("#chart21"), e).render()
        }
      })
    })
  }

  getroomsanalysis() {
    this.showSpinner = true
    this.service.getroomsanalysis().subscribe((res: any) => {
      this.showSpinner = false
      this.userarray = res.data;
      var ctx = document.getElementById("chart2") as HTMLCanvasElement;;
      var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ["Total Rooms", "Available", "Occupied","Cleaning"],
          datasets: [{
            backgroundColor: [
              "#87CEFA",
              "#42f572",
              "#CD5C5C",
              "#fbd076"

            ],
            data: [this.userarray[0].tot_users, this.userarray[0].male_users, this.userarray[0].female_users,this.userarray[0].cleaning],
            borderWidth: [0, 0, 0, 0]
          }]
        },
        options: {
          maintainAspectRatio: false,
          cutoutPercentage: 60,
          legend: {
            position: "bottom",
            display: false,
            labels: {
              fontColor: '#ddd',
              boxWidth: 15
            }
          }
          ,
          tooltips: {
            displayColors: false
          }
        }
      })
    }, error => {

    })
  }


  // getsitetraficgraph() {
  //   this.showSpinner = true
  //   this.service.getdatewiseAnalysis().subscribe(res => {
  //     this.showSpinner = false
  //     this.caralldataarray = res.data;

  //     var id = 0;
  //     res.data.map((res: any) => {
  //       res.i = id + 1;
  //       id++;
  //     })
  //     this.labelsdata = res.data.map(function (obj) {
  //       return obj.network;
  //     });;
  //     this.daycounts = res.data.map(function (obj) {
  //       return obj.MAU;
  //     });
  //     var ctx = document.getElementById('chart1') as HTMLCanvasElement;
  //     var myChart = new Chart(ctx, {
  //       type: 'bar',
  //       data: {
  //         labels: this.labelsdata,
  //         datasets: [{
  //           label: 'count',
  //           data: this.daycounts,
  //           backgroundColor: '#f3a8b5',
  //           borderColor: "transparent",
  //           pointRadius: "0",
  //           borderWidth: 4
  //         },
  //         ]
  //       },
  //       options: {
  //         maintainAspectRatio: false,
  //         legend: {
  //           display: false,
  //           labels: {
  //             fontColor: '#585757',
  //             boxWidth: 50
  //           }
  //         },
  //         tooltips: {
  //           displayColors: false
  //         },
  //         scales: {
  //           xAxes: [{
  //             ticks: {
  //               beginAtZero: true,
  //               fontColor: '#585757'
  //             },
  //             gridLines: {
  //               display: true,
  //               color: "rgba(0, 0, 0, 0.05)"
  //             },
  //           }],
  //           yAxes: [{
  //             ticks: {
  //               beginAtZero: true,
  //               fontColor: '#585757'
  //             },
  //             gridLines: {
  //               display: true,
  //               color: "707070"
  //             },
  //           }]
  //         }

  //       }
  //     });
  //   },
  //     error => {
  //     });
  // }

  vsgraph1() {
    this.showSpinner = true
    this.service.gettotalroomdata().subscribe((res: any) => {
      this.showSpinner = false
      this.appointmentarray1 = res.data;
      var jan1 = 0;
      var feb1 = 0;
      var mar1 = 0;
      var apr1 = 0;
      var may1 = 0;
      var jun1 = 0;
      var jul1 = 0;
      var aug1 = 0;
      var sep1 = 0;
      var oct1 = 0;
      var nov1 = 0;
      var dec1 = 0;


      for (let j = 0; j < this.appointmentarray1.length; j++) {
        let month = this.appointmentarray1[j].date.slice(3, 5);
        if (this.appointmentarray1[j].date) {
          if (month == '01') {
            var jan1 = (jan1 * 1) + (1 * 1)
          }
          if (month == '02') {
            var feb1 = (feb1 * 1) + (1 * 1)
          }
          if (month == '03') {
            var mar1 = (mar1 * 1) + (1 * 1)
          }
          if (month == '04') {
            var apr1 = (apr1 * 1) + (1 * 1)
          }
          if (month == '05') {
            var may1 = (may1 * 1) + (1 * 1)
          }
          if (month == '06') {
            var jun1 = (jun1 * 1) + (1 * 1)
          }
          if (month == '07') {
            var jul1 = (jul1 * 1) + (1 * 1)
          }
          if (month == '08') {
            var aug1 = (aug1 * 1) + (1 * 1)
          }
          if (month == '09') {
            var sep1 = (sep1 * 1) + (1 * 1)
          }
          if (month == '10') {
            var oct1 = (oct1 * 1) + (1 * 1)
          }
          if (month == '11') {
            var nov1 = (nov1 * 1) + (1 * 1)
          }
          if (month == '12') {
            var dec1 = (dec1 * 1) + (1 * 1)
          }
        }

      }
      this.rjyarray.push(jan1, feb1, mar1, apr1, may1, jun1, jul1, aug1, sep1, oct1, nov1, dec1);

      var options = {
        chart: {
          height: 325,
          type: 'bar',
          stacked: false,
          foreColor: '#4e4e4e',
          toolbar: {
            show: false
          },
          dropShadow: {
            enabled: true,
            opacity: 0.1,
            blur: 3,
            left: -7,
            top: 22,
          }
        },
        plotOptions: {
          bar: {
            columnWidth: '50%',
            endingShape: 'rounded',
            dataLabels: {
              position: 'top', // top, center, bottom
            },
          }
        },
        dataLabels: {
          enabled: false,
          formatter: function (val) {
            return parseInt(val);
          },
          offsetY: -20,
          style: {
            fontSize: '14px',
            colors: ["#304758"]
          }
        },
        stroke: {
          show: true,
          width: [0, 0, 0],
          dashArray: [0, 0, 0],
          curve: 'smooth'
          // colors: ['transparent']
        },
        grid: {
          show: true,
          borderColor: 'rgba(0, 0, 0, 0.10)',
        },
        series: [{
          name: 'Case Files',
          data: this.rjyarray
        }],
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            gradientToColors: ['#E9967A', '#ff6a00', '#000428', '#e021a8'],
            shadeIntensity: 1,
            type: 'vertical',
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100, 100, 100]
          },
        },
        colors: [ "	#E9967A", '#00d4ff' , '#b2c2c6'],
        tooltip: {
          theme: 'dark',
          y: {
            formatter: function (val) {
              return val
            }
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              height: 330,
              stacked: true,
            },
            legend: {
              show: !0,
              position: "top",
              horizontalAlign: "left",
              offsetX: -20,
              fontSize: "10px",
              markers: {
                radius: 50,
                width: 10,
                height: 10
              }
            },
            plotOptions: {
              bar: {
                columnWidth: '30%'
              }
            }
          }
        }]
      }
      var chart = new ApexCharts(document.querySelector("#recruitment-cost"), options);
      chart.render();
    }, error => {
    })
  }

}
