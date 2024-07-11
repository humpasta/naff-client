import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {jwtToken} from "./globals";
import {AsyncPipe, NgClass, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthService} from "./services/auth.service";
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, AsyncPipe, ReactiveFormsModule, FormsModule, RouterLink, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'NAFF - Newsletter am K.A.F.F.';
  loggedIn$ = jwtToken;
  credentials: {username: string; password: string};

  constructor(
    private backend: AuthService,
    public router: Router
  ) {
    this.credentials = {
      username: 'kaff',
      password: '#Ln*!N*QnQ29mZL7KLue'
    }
  }

  login() {
    this.backend.login(this.credentials);
  }

  logout() {
    jwtToken.next(null);
  }

  protected readonly environment = environment;
}
