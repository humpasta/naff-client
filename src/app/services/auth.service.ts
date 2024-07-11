import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {jwtToken} from '../globals';
import {firstValueFrom, map} from 'rxjs';
import {SettingsService} from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private settings: SettingsService
  ) {
    this.settings.get('tokenObj').then(async (tokenObj: any) => {
      if (tokenObj) {
        const now = new Date();
        if (tokenObj.accessTokenExpiresAt > now) {
          jwtToken.next(tokenObj);
        } else {
          if (tokenObj.refreshTokenExpiresAt > now) {
            await this.refresh(tokenObj);
          }
        }
      }
    });

    jwtToken.pipe(
      map(tokenObj => {
        if (tokenObj) {
          tokenObj.accessTokenExpiresAt = new Date(tokenObj.accessTokenExpiresAt);
          tokenObj.refreshTokenExpiresAt = new Date(tokenObj.refreshTokenExpiresAt);
        }
        return tokenObj;
      })
    ).subscribe(async tokenObj => {
      if (tokenObj) {
        await this.settings.set('tokenObj', tokenObj);
      } else {
        await this.settings.remove('tokenObj');
      }
    });
  }


  async login(credentials: { username: string; password: string }) {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    const url = await this.settings.get('api-url');

    this.http.post(url + '/auth/login', credentials, {headers}).subscribe({
      next: tokenObj => {
        jwtToken.next(tokenObj);
      },
      error: err => {
        console.log(err);
      }
    });
  }

  async refresh(tokenObj: any) {
    const now = new Date();
    if (tokenObj.refreshTokenExpiresAt && tokenObj.refreshTokenExpiresAt > now) {
      const headers = new HttpHeaders()
        .append('Content-Type', 'application/json')
        .append('refresh-token', tokenObj.refreshToken);

      const url = await this.settings.get('api-url');

      this.http.post(url + '/auth/refresh', null, {headers}).subscribe({
        next: tokenObj => {
          jwtToken.next(tokenObj);
        },
        error: err => {
          console.log(err);
        }
      });
    }
  }

  async getAuthHeaders(): Promise<HttpHeaders | null> {
    const token = await firstValueFrom(jwtToken);
    if (token && token.accessToken) {
      return new HttpHeaders()
        .append('Content-Type', 'application/json')
        .append('Accept', 'application/json')
        .append('Authorization', `Bearer ${token.accessToken}`);
    }
    return null;
  }

}
