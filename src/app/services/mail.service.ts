import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {jwtToken} from '../globals';
import {environment} from '../../environments/environment';
import {firstValueFrom} from 'rxjs';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  constructor(
    private auth: AuthService,
    private http: HttpClient
  ) {
  }

  async sendMail(content: {subject: string, message: string}) {
    const headers = await this.auth.getAuthHeaders();
    if (headers) {
      return firstValueFrom(this.http.post(environment.server_url + '/mail', content, {headers}));
    } else {
      return null;
    }
  }

}
