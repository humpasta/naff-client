import {Routes} from '@angular/router';
import {MailComposerComponent} from "./components/mail-composer/mail-composer.component";
import {SubscribersComponent} from './components/subscribers/subscribers.component';

export const routes: Routes = [{
  path: 'newsletter',
  component: MailComposerComponent
}, {
  path: 'subscribers',
  component: SubscribersComponent
}, {
  path: '',
  redirectTo: '/newsletter',
  pathMatch: 'full'
}];
