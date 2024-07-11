import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {MailService} from '../../services/mail.service';

@Component({
  selector: 'app-mail-composer',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './mail-composer.component.html',
  styleUrl: './mail-composer.component.scss'
})
export class MailComposerComponent implements AfterViewInit {

  @ViewChild('subject') subjectInput: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('message') messageText: ElementRef<HTMLTextAreaElement> | undefined;

  newsletter: {subject: string, message: string, signature: string};
  sent: boolean = false;

  constructor(private mail: MailService) {
    this.newsletter = {
      subject: '',
      message: '',
      signature: 'K.A.F.F.\n' +
        'Am Speicher 3a\n' +
        '49090 Osnabrück\n' +
        '\n' +
        'https://www.kaff-os.de'
    };
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit');
  }

  async sendNewsletter() {
    const response: any = await this.mail.sendMail(this.newsletter);
    if (response.message && response.message === 'ok') {
      this.sent = true;
    }
  }
}
