import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {AuthService} from './auth.service';
import {SettingsService} from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private settings: SettingsService
  ) {
  }

  async sendMail(content: { subject: string, message: string }) {
    const headers = await this.auth.getAuthHeaders();
    if (headers) {
      const url = await this.settings.get('api-url');
      return firstValueFrom(this.http.post(url + '/mail', content, {headers}));
    } else {
      return null;
    }
  }

}
