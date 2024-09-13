import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-date-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './chat-date-input.component.html',
  styleUrl: './chat-date-input.component.css'
})
export class ChatDateInputComponent {
  @Output() onMessageSent = new EventEmitter<any>();

  applyForm = new FormGroup({
    field: new FormControl('')
  });
  
  sendInput() {
    this.onMessageSent.emit(this.applyForm.value.field ?? '');
    this.applyForm.reset()
  }
}
