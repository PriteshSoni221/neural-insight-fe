import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable } from 'rxjs';
import { AppProfitExpensesComponent, profitExpanceChart } from 'src/app/components/profit-expenses/profit-expenses.component';
import { AppTrafficDistributionComponent, trafficdistributionChart } from 'src/app/components/traffic-distribution/traffic-distribution.component';
import { MaterialModule } from 'src/app/material.module';
import { TextSummaryService } from 'src/app/services/text-summary.service';


interface InputInterface {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-review-upload-page',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, CommonModule, AppProfitExpensesComponent, AppTrafficDistributionComponent, MatSelectModule, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './review-upload-page.component.html',
  styleUrl: './review-upload-page.component.scss'
})

export class ReviewUploadPageComponent {
  public productCategory: FormControl<string | null> = new FormControl('');
  public productName: FormControl<string | null> = new FormControl('');
  public summary: string = ""
  public aspectSentimentChart!: Partial<profitExpanceChart> | any
  public trafficdistributionChart!: Partial<trafficdistributionChart> | any;
  
  public selectedProductCategory: string;
  public selectedProductName: string;

  public fileContent: any = null; 

  public productCategories: InputInterface[] = [
    { value: 'mouse', viewValue: 'Mouse' },
    { value: 'phone', viewValue: 'Phone' },
    { value: 'laptop', viewValue: 'Laptop' },
  ];

  public productNames: InputInterface[] = [
    { value: 'macbook pro', viewValue: 'Macbook pro' },
    { value: 'iphone 16 pro', viewValue: 'iPhone 16 pro' },
    { value: 'airpods pro max', viewValue: 'AirPods pro max' },
  ];

  constructor(private textSummaryService: TextSummaryService) { }

  public onSummarize(): void {

    if (this.selectedProductCategory && this.selectedProductName) {
      console.log("categoty", this.selectedProductCategory, "name", this.selectedProductName)
    } else {
      alert("Please enter a product category and name first.")
    }
  }

  public onFileUpload(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validate file type
      if (file.type !== 'application/json') {
        alert('Please upload a valid JSON file.');
        return;
      }

      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          this.fileContent = JSON.parse(e.target?.result as string); // Parse JSON
          console.log('File Content:', this.fileContent); // Debug
        } catch (err) {
          console.error('Error parsing JSON:', err);
          alert('Invalid JSON file.');
        }
      };

      reader.onerror = () => {
        console.error('Error reading file.');
        alert('Error reading file.');
      };

      reader.readAsText(file); // Read file as text
    }
  }

  private loadChart(): void {
    this.aspectSentimentChart = {
      series: [
        {
          name: 'Number of positive ratings',
          data: [1, 1, 0, 0, 1],
          color: '#0085db',
        },
        {
          name: 'Number of negative ratings',
          data: [0, 1, 1, 1, 1],
          color: '#fb977d',
        },
      ],

      grid: {
        borderColor: 'rgba(0,0,0,0.1)',
        strokeDashArray: 3,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '30%',
          borderRadius: 4,
          endingShape: "rounded",
        },
      },
      chart: {
        type: 'bar',
        height: 390,
        offsetY: 10,
        foreColor: '#adb0bb',
        fontFamily: 'inherit',
        toolbar: { show: false },
      },
      dataLabels: { enabled: false },
      markers: { size: 0 },
      legend: { show: true },
      xaxis: {
        type: 'category',
        categories: ['Price', 'Quality', 'Delivery', 'Packaging', 'Service'],
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          style: { cssClass: 'grey--text lighten-2--text fill-color' },
        },
      },
      stroke: {
        show: true,
        width: 5,
        colors: ['transparent'],
      },
      tooltip: { theme: 'light' },

      responsive: [
        {
          breakpoint: 600,
          options: {
            plotOptions: {
              bar: {
                borderRadius: 3,
              },
            },
          },
        },
      ],
    }
  }

  private loadDistributionChart(): void {
    this.trafficdistributionChart = {
      series: [12, 8, 15],
      labels: ['neutral', 'negative', 'positive'],
      chart: {
        type: 'donut',
        fontFamily: "'Plus Jakarta Sans', sans-serif;",
        foreColor: '#adb0bb',
        toolbar: {
          show: false,
        },
        height: 160,
      },
      colors: ['#f8c076', '#fb977d', '#0085db'],
      plotOptions: {
        pie: {
          donut: {
            size: '80%',
            background: 'none',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '12px',
                color: undefined,
                offsetY: 5,
              },
              value: {
                show: true,
                color: '#98aab4',
              },
            },
          },
        },
      },
      stroke: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: true,
      },
      responsive: [
        {
          breakpoint: 491,
          options: {
            chart: {
              width: 120,
            },
          },
        },
      ],
      tooltip: {
        enabled: false,
      },
    };
  }
}
