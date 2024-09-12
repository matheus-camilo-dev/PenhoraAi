import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatFileInputComponent } from './chat-file-input.component';

describe('ChatFileInputComponent', () => {
  let component: ChatFileInputComponent;
  let fixture: ComponentFixture<ChatFileInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatFileInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatFileInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
