import { Routes } from '@angular/router';


// pages
import { AppIconsComponent } from './icons/icons.component';
import { AppSamplePageComponent } from './sample-page/sample-page.component';
import { InsightPageComponent } from './insight-page/insight-page.component';
import { ReviewUploadPageComponent } from './review-upload-page/review-upload-page.component';

export const ExtraRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'icons',
        component: AppIconsComponent,
      },
      {
        path: 'sample-page',
        component: AppSamplePageComponent,
      },
      {
        path: 'insight-page',
        component: InsightPageComponent,
      },
      {
        path: 'review-upload-page',
        component: ReviewUploadPageComponent,
      },
    ],
  },
];
