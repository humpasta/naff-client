import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom, Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {SettingsService} from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class SubscribersService {

  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private settings: SettingsService
  ) {
  }

  async getSubscribers(): Promise<string[]> {
    const headers = await this.auth.getAuthHeaders();
    if (headers) {
      const url = await this.settings.get('api-url');
      return firstValueFrom(this.http.get(url + '/subscriber/all', {headers}) as Observable<string[]>);
    } else {
      return [];
    }
  }

  async deleteSubscriber(email: string): Promise<boolean> {
    const headers = await this.auth.getAuthHeaders();
    if (headers) {
      const body = {email};
      const url = await this.settings.get('api-url');
      const response: any = await firstValueFrom(this.http.delete(url + '/subscriber', {headers, body}));
      return response.message === 'ok';
    } else {
      return false;
    }
  }

  async addSubscriber(email: string) {
    const headers = await this.auth.getAuthHeaders();
    if (headers) {
      const body = {email};
      const url = await this.settings.get('api-url');
      const response: any = await firstValueFrom(this.http.post(url + '/subscriber', body, {headers}));
      return response.message === 'ok';
    } else {
      return false;
    }
  }
}
