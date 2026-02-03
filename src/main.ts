import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { initializeMockData } from './app/core/init/mock-init';

initializeMockData();

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
