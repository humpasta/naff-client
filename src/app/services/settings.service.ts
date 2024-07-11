import { Injectable } from '@angular/core';
import {firstValueFrom} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import localForage from 'localforage';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    private http: HttpClient
  ) { }

  async loadConfig() {
    const configLoaded = await this.get('config-loaded');
    if (!configLoaded) {
      const data: any = await firstValueFrom(this.http.get('/assets/config.json'));
      if (data && data.apiUrl) {
        await this.set('api-url', data.apiUrl);
        console.log('config loaded');
      }
      await this.set('config-loaded', true);
    }
  }

  get(key: string) {
    return localForage.getItem(key);
  }

  set(key: string, value: any) {
    return localForage.setItem(key, value);
  }

  remove(key: string) {
    return localForage.removeItem(key);
  }
}
