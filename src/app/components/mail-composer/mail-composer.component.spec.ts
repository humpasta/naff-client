import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailComposerComponent } from './mail-composer.component';

describe('MailComposerComponent', () => {
  let component: MailComposerComponent;
  let fixture: ComponentFixture<MailComposerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MailComposerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MailComposerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
