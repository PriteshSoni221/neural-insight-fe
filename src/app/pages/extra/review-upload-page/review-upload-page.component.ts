import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AppProfitExpensesComponent, profitExpanceChart } from 'src/app/components/profit-expenses/profit-expenses.component';
import { AppTrafficDistributionComponent, trafficdistributionChart } from 'src/app/components/traffic-distribution/traffic-distribution.component';
import { MaterialModule } from 'src/app/material.module';
import { TextSummaryService, UploadReviewInterface } from 'src/app/services/text-summary.service';

interface ProductCategoryInterface {
  value: number;
  viewValue: string;
}

interface ProductNameInterface {
  value: number;
  category: number;
  viewValue: string;
}

interface AspectSentiment {
  text: string;
  sentiment: string;
}

interface ReviewOutput {
  delivery: AspectSentiment;
  quality: AspectSentiment;
  price: AspectSentiment;
  packaging: AspectSentiment;
  service: AspectSentiment;
}

export interface Review {
  input: string;
  output: ReviewOutput;
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
  public selectedProductName: number;

  public fileContent: Review[] | null = null;

  public productCategories: ProductCategoryInterface[] = [
    { value: 1, viewValue: 'Mouse' },
    { value: 2, viewValue: 'Phone' },
    { value: 3, viewValue: 'Laptop' },
  ];

  public productNames: ProductNameInterface[] = [
    { value: 1, category: 3, viewValue: 'Macbook pro' },
    { value: 1, category: 3, viewValue: 'iPhone 16 pro' },
    { value: 1, category: 3, viewValue: 'AirPods pro max' },
  ];

  constructor(private textSummaryService: TextSummaryService) { }

  public onUpload(): void {
    if (this.selectedProductCategory && this.selectedProductName && this.fileContent) {
      const body: UploadReviewInterface = {
        productID: this.selectedProductName,
        fileContent: this.fileContent
      }
      this.textSummaryService.uploadReviews(body).subscribe({
        next: (response) => {
          this.summary = response.summary;
          this.loadChart()
          this.loadDistributionChart()
        },
        error: (error) => {
          console.error("error fetching summary", error);
          this.summary = "An error occurred while fetching the summary."
        }
      })
    } else {
      alert("Please enter a Product category, name and upload valid reviews")
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
