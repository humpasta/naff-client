import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {firstValueFrom, Observable} from 'rxjs';
import {jwtToken} from '../globals';
import {environment} from '../../environments/environment';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SubscribersService {

  constructor(
    private auth: AuthService,
    private http: HttpClient
  ) {
  }

  async getSubscribers(): Promise<string[]> {
    const headers = await this.auth.getAuthHeaders();
    if (headers) {
      return firstValueFrom(this.http.get(environment.server_url + '/subscriber/all', {headers}) as Observable<string[]>);
    } else {
      return [];
    }
  }

  async deleteSubscriber(email: string): Promise<boolean> {
    const headers = await this.auth.getAuthHeaders();
    if (headers) {
      const body = {email};
      const response: any = await firstValueFrom(this.http.delete(environment.server_url + '/subscriber', {headers, body}));
      return response.message === 'ok';
    } else {
      return false;
    }
  }

  async addSubscriber(email: string) {
    const headers = await this.auth.getAuthHeaders();
    if (headers) {
      const body = {email};
      const response: any = await firstValueFrom(this.http.post(environment.server_url + '/subscriber', body, {headers}));
      return response.message === 'ok';
    } else {
      return false;
    }
  }
}
