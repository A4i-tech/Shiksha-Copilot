import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { DropDownConfig } from 'src/app/shared/interfaces/dropdown.interface';
import { QUESTION_TYPE_MAPPER } from 'src/app/shared/utility/constant.util';

@Component({
  selector: 'app-question-bank-blue-print',
  templateUrl: './question-bank-blue-print.component.html',
  styleUrls: ['./question-bank-blue-print.component.scss'],
})
export class QuestionBankBluePrintComponent implements OnInit, OnChanges {
  // Inputs from Parent
  @Input() questionBankBluePrintData!: any[];
  @Input() objectiveChartMapper: any = {};
  @Input() currentStep: number = 1;
  @Input() bluePrintChapterDropdownOptions: any[] = [];
  @Input() bluePrintObjectiveDropdownOptions: any[] = [];

  // Outputs to Parent
  @Output() backClick = new EventEmitter<boolean>();

  // Chart Properties
  objectivesChartData!: ChartData<'doughnut'>;
  totalSteps: number = 3;
  questionTypeMapper = QUESTION_TYPE_MAPPER;

  // Dropdown Configurations
  bluePrintChapterDropdownConfig: DropDownConfig = {
    isBackground: false,
    placeHolderTxt: 'Topic',
    height: 'auto',
    bindLabel: 'name',
    bindValue: 'name',
    required: true,
    clearableOff: true,
  };

  bluePrintObjectiveDropdownConfig: DropDownConfig = {
    isBackground: false,
    placeHolderTxt: 'Objective',
    height: 'auto',
    bindLabel: 'objective',
    bindValue: 'objective',
    required: true,
    clearableOff: true,
  };

  // Chart Options & Tooltip Logic
  objectivesChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const value = tooltipItem.raw as number;
            const dataset = tooltipItem.chart.data.datasets[0];
            
            // Calculate sum of all data points
            const total = dataset.data.reduce((sum: number, val: any) => sum + val, 0);
            
            // Calculate percentage
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

            return tooltipItem.label + ': ' + percentage + '%';
          },
        },
      },
    },
  };

  ngOnInit(): void {
    this.updateChartData();
  }

  // CRITICAL: Detects when API data arrives and refreshes the chart
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['questionBankBluePrintData'] || changes['objectiveChartMapper']) {
      this.updateChartData();
    }
  }

  // Triggered when user changes a dropdown value
  bluePrintObjectiveChange() {
    this.updateChartData();
  }

  updateChartData() {
    // 1. Safety Check
    if (!this.questionBankBluePrintData) {
      return;
    }

    // 2. Initialize the Mapper
    // We try to use the input from the parent first
    let chartMapper = { ...this.objectiveChartMapper };

    // [SELF-HEALING FIX]
    // If the parent sent an empty mapper, we extract objectives directly from the data.
    if (Object.keys(chartMapper).length === 0) {
      this.questionBankBluePrintData.forEach((item) => {
        if (item.question_distribution) {
          item.question_distribution.forEach((dist: any) => {
            if (dist.objective) {
              // Create the key with 0 count if it doesn't exist
              chartMapper[dist.objective] = 0;
            }
          });
        }
      });
    }

    // 3. Count the Objectives
    this.questionBankBluePrintData.forEach((item) => {
      if (item.question_distribution) {
        item.question_distribution.forEach((innerObj: any) => {
          // If the objective exists in our mapper (or we just added it), increment
          if (innerObj.objective) {
            // Safety check: ensure key exists before incrementing
            if (!chartMapper.hasOwnProperty(innerObj.objective)) {
               chartMapper[innerObj.objective] = 0;
            }
            chartMapper[innerObj.objective]++;
          }
        });
      }
    });

    // 4. Prepare Arrays for Chart.js
    let labelValues: string[] = [];
    let dataValues: number[] = [];

    for (let key in chartMapper) {
      if (chartMapper.hasOwnProperty(key)) {
        labelValues.push(key);
        dataValues.push(chartMapper[key]);
      }
    }

    // 5. Update the Chart Data Object
    this.objectivesChartData = {
      labels: labelValues,
      datasets: [{
        data: dataValues,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF'
        ],
        hoverOffset: 4
      }],
    };
  }

  previousStep() {
    this.backClick.emit(true);
  }
}