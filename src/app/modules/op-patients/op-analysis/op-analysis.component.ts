import { Component, OnInit } from '@angular/core';
import { OpServicesService } from '../op-services.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-op-analysis',
  templateUrl: './op-analysis.component.html',
  styleUrls: ['./op-analysis.component.scss']
})


export class OpAnalysisComponent implements OnInit {
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

  chartOptions: any;

  constructor(public service: OpServicesService) { }
  // bread crumb items
  breadCrumbItems: Array<{}>;
  ngOnInit(): void {
    this.toatlcntsorders();
    this.getusersanalysis();
    this.getweekdatawiseFuntion();
    this.getsitetraficgraph();
    this.vsgraph1();

  }
  orders_count_array: any
  toatlcntsorders() {
    this.service.toatlcntsorders().subscribe((res: any) => {
      this.orders_count_array = res.data[0];
      this.amount_aary = res.data[1]
    });

  }

  getweekdatawiseFuntion() {
    this.showSpinner = true;
    this.service.getweekdatawise().subscribe(res => {

      this.showSpinner = false;

      let graph1Count = [];
      let graph2Count = [];
      let graph3Count = [];
      let categories = [];
      let bcnt = 0;

      res.data.map(obj => {
        graph1Count.push(obj.graph1_count);
        graph2Count.push(obj.graph2_count);
        graph3Count.push(obj.graph3_count);
        categories.push(obj.currentdate);
        bcnt++;

        if (res.data.length === bcnt) {
          const chartOptions = {
            series: [{
              name: "Renewal",
              data: graph1Count
            }, {
              name: "New",
              data: graph2Count
            }, {
              name: "Old",
              data: graph3Count
            }],
            chart: {
              foreColor: "#6c757d",
              type: "bar",
              height: 390,
              toolbar: {
                show: false
              },
              zoom: {
                enabled: false
              },
              dropShadow: {
                enabled: false,
                top: 3,
                left: 10,
                blur: 3,
                opacity: 0.1,
                color: "#258eae"
              },
              sparkline: {
                enabled: false
              }
            },
            plotOptions: {
              bar: {
                horizontal: false,
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
              enabled: false
            },
            stroke: {
              show: true,
              width: 3,
              curve: "smooth"
            },
            // Updated colors as per your request
            colors: ["#008ffb", "#00e396", "#fd445f"],
            xaxis: {
              categories: categories
            },
            fill: {
              opacity: 1
            }
          };

          // Render the chart
          new ApexCharts(document.querySelector("#chart21"), chartOptions).render();
        }
      });
    });
  }
  getusersanalysis() {
    this.showSpinner = true
    this.service.getusersanalysis().subscribe((res: any) => {
      this.showSpinner = false
      this.userarray = res.data;
      var ctx = document.getElementById("chart2") as HTMLCanvasElement;;
      var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ["Today Patients ", "Male", "Female"],
          datasets: [{
            backgroundColor: [
              "#42d1f5",
              "#f57542",
              "#42f572",

            ],
            data: [this.userarray[0].total, this.userarray[0].male, this.userarray[0].female],
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
  getsitetraficgraph() {
    this.showSpinner = true
    this.service.getdatewiseAnalysis().subscribe(res => {
      this.showSpinner = false
      this.caralldataarray = res.data;

      var id = 0;
      res.data.map((res: any) => {
        res.i = id + 1;
        id++;
      })
      this.labelsdata = res.data.map(function (obj) {
        return obj.network;
      });;
      this.daycounts = res.data.map(function (obj) {
        return obj.MAU;
      });
      var ctx = document.getElementById('chart1') as HTMLCanvasElement;
      var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.labelsdata,
          datasets: [{
            label: 'count',
            data: this.daycounts,
            backgroundColor: '#f3a8b5',
            borderColor: "transparent",
            pointRadius: "0",
            borderWidth: 4
          },]
        },
        options: {
          maintainAspectRatio: false,
          legend: {
            display: false,
            labels: {
              fontColor: '#585757',
              boxWidth: 50
            }
          },
          tooltips: {
            displayColors: false
          },
          scales: {
            xAxes: [{
              ticks: {
                beginAtZero: true,
                fontColor: '#585757'
              },
              gridLines: {
                display: true,
                color: "rgba(0, 0, 0, 0.05)"
              },
            }],
            yAxes: [{
              ticks: {
                beginAtZero: true,
                fontColor: '#585757'
              },
              gridLines: {
                display: true,
                color: "707070"
              },
            }]
          }

        }
      });
    });
  }
  vsgraph1() {
    this.showSpinner = true
    this.service.gettotalappointmentdata().subscribe((res: any) => {
      this.rjyarray = []
      this.showSpinner = false
      res.data.forEach(item => {
        this.rjyarray.push(Math.round(item.total_bills));
      });

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
          name: 'Count',
          data: this.rjyarray
        }],
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            gradientToColors: ['#009efd', '#ff6a00', '#000428', '#e021a8'],
            shadeIntensity: 1,
            type: 'vertical',
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100, 100, 100]
          },
        },
        colors: ["#093579", '#00d4ff', '#b2c2c6'],
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
