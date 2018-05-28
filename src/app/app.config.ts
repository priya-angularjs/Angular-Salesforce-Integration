import { InjectionToken  } from "@angular/core";

export let APP_CONFIG = new InjectionToken ("app.config");

export interface IAppConfig {
  apiEndpoint: string;
}

export const AppConfig: IAppConfig = {
  /*salesforce connection endpoint*/
   apiEndpoint: 'https://calendar5-dev-ed.my.salesforce.com/services/data/v37.0'
};
