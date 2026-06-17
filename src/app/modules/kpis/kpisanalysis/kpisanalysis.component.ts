import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexNonAxisChartSeries,
  ApexLegend
} from 'ng-apexcharts';
import { OpServicesService } from '../../op-patients/op-services.service';


@Component({
  selector: 'app-kpisanalysis',
  templateUrl: './kpisanalysis.component.html',
  styleUrls: ['./kpisanalysis.component.scss']
})
export class KpisanalysisComponent implements OnInit {

  loading = false;
  analysisList: any[] = [];

  totalKpis = 0;
  achievedCount = 0;
  attentionCount = 0;
  criticalCount = 0;
  noDataCount = 0;

  barChartOptions: any;
  pieChartOptions: any;

  constructor(private nabhService: OpServicesService) { }

  ngOnInit(): void {
    this.loadFormulaAnalysis();
  }

  loadFormulaAnalysis() {
    this.loading = true;

    this.nabhService.getKpiFormulaAnalysis().subscribe({
      next: (res: any) => {
        this.loading = false;

        if (res.status === 200) {
          this.analysisList = res.data || [];
          this.prepareSummary();
          this.prepareCharts();
        }
      },
      error: () => {
        this.loading = false;
        alert('Formula analysis loading failed');
      }
    });
  }

  prepareSummary() {
    this.totalKpis = this.analysisList.length;
    this.achievedCount = this.analysisList.filter(x => x.status === 'Achieved').length;
    this.attentionCount = this.analysisList.filter(x => x.status === 'Need Attention').length;
    this.criticalCount = this.analysisList.filter(x => x.status === 'Critical').length;
    this.noDataCount = this.analysisList.filter(x => x.status === 'No Data').length;
  }

  prepareCharts() {
    this.barChartOptions = {
      series: [
        {
          name: 'KPI Value',
          data: this.analysisList.map(x => Number(x.calculated_value || 0))
        }
      ],
      chart: {
        type: 'bar',
        height: 380,
        toolbar: { show: false }
      },
      xaxis: {
        categories: this.analysisList.map(x => `${x.indicator_no}. ${x.indicator_name}`)
      },
      dataLabels: {
        enabled: false
      }
    };

    this.pieChartOptions = {
      series: [
        this.achievedCount,
        this.attentionCount,
        this.criticalCount,
        this.noDataCount
      ],
      chart: {
        type: 'donut',
        height: 330
      },
      labels: ['Achieved', 'Need Attention', 'Critical', 'No Data'],
      legend: {
        position: 'bottom'
      }
    };
  }

  getStatusClass(status: string) {
    if (status === 'Achieved') return 'achieved';
    if (status === 'Need Attention') return 'attention';
    if (status === 'Critical') return 'critical';
    return 'nodata';
  }

  getUnit(type: string) {
    if (type === 'percentage') return '%';
    if (type === 'rate_per_1000') return '/1000';
    if (type === 'average_time') return 'Min';
    if (type === 'ratio') return 'Ratio';
    return '';
  }
}