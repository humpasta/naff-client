import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SubscribersService} from '../../services/subscribers.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

const regexMail = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");

@Component({
  selector: 'app-subscribers',
  standalone: true,
  templateUrl: './subscribers.component.html',
  imports: [
    NgIf,
    NgForOf,
    NgClass,
    FormsModule
  ],
  styleUrl: './subscribers.component.scss'
})
export class SubscribersComponent implements OnInit {

  private _emailInput: HTMLInputElement | undefined;

  @ViewChild('emailIn')
  set emailInput(ref: ElementRef<HTMLInputElement>) {
    this._emailInput = ref?.nativeElement;
  };

  get emailInput(): HTMLInputElement | undefined {
    return this._emailInput;
  }

  subscribers: string[] = [];
  filteredSubscribers: string[] = [];
  activeIndex: number = -1;
  mailEdited = false;
  searchTerm: string = '';
  showDeleteDialog = false;
  showAddDialog = false;
  newSubscriber: string = '';

  constructor(private subscribersService: SubscribersService) {
  }

  async ngOnInit() {
    this.subscribers = await this.subscribersService.getSubscribers();
    this.filteredSubscribers = this.subscribers;
  }

  setActiveIndex(index: number) {
    this.activeIndex = index;
    this.mailEdited = false;
  }

  setMailEdited(mail: string) {
    if (this.emailInput) {
      this.mailEdited = this.emailInput.value !== mail;
    }
  }

  filterSubscribers() {
    if (this.searchTerm === '') {
      this.filteredSubscribers = this.subscribers;
    } else {
      this.filteredSubscribers = this.subscribers.filter(email => email.match(new RegExp(this.searchTerm, 'i')));
    }
  }

  onDeleteClicked() {
    this.showDeleteDialog = true;
  }

  cancelDelete() {
    this.showDeleteDialog = false;
  }

  async deleteSubscriber() {
    const subscriber = this.getActiveMail();
    const deleted = await this.subscribersService.deleteSubscriber(subscriber);
    if (deleted) {
      this.subscribers.splice(this.subscribers.indexOf(subscriber), 1);
      this.activeIndex = -1;
    }
    this.showDeleteDialog = false;
  }

  getActiveMail() {
    return this.filteredSubscribers[this.activeIndex];
  }

  onRowClick(event: MouseEvent, i: number) {
    event.preventDefault();
    event.stopPropagation();
    this.setActiveIndex(i);
  }


  onAddClicked() {
    this.showAddDialog = true;
  }

  cancelAdd() {
    this.showAddDialog = false;
  }

  async addSubscriber() {
    if (this.newSubscriber.match(regexMail)) {
      const added = await this.subscribersService.addSubscriber(this.newSubscriber);
      if (added) {
        this.subscribers.push(this.newSubscriber);
      }
      this.showAddDialog = false;
    } else {
      // TODO show hint
    }
  }
}
