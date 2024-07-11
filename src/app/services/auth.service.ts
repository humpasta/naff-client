import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from '../../environments/environment';
import {jwtToken} from '../globals';
import localForage from 'localforage';
import {firstValueFrom, map} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
    localForage.getItem('tokenObj').then((tokenObj: any) => {
      if (tokenObj) {
        const now = new Date();
        if (tokenObj.accessTokenExpiresAt > now) {
          jwtToken.next(tokenObj);
        } else {
          if (tokenObj.refreshTokenExpiresAt > now) {
            this.refresh(tokenObj);
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
        await localForage.setItem('tokenObj', tokenObj);
      } else {
        await localForage.removeItem('tokenObj');
      }
    });
  }



  login(credentials: { username: string; password: string }) {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');

    this.http.post(environment.server_url + '/auth/login', credentials, {headers}).subscribe({
      next: tokenObj => {
        jwtToken.next(tokenObj);
      },
      error: err => {
        console.log(err);
      }
    });
  }

  refresh(tokenObj: any) {
    const now = new Date();
    if (tokenObj.refreshTokenExpiresAt && tokenObj.refreshTokenExpiresAt > now) {
      const headers = new HttpHeaders()
        .append('Content-Type', 'application/json')
        .append('refresh-token', tokenObj.refreshToken);

      this.http.post(environment.server_url + '/auth/refresh', null, {headers}).subscribe({
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
