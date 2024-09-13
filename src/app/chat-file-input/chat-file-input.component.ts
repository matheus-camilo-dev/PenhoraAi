import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-file-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './chat-file-input.component.html',
  styleUrl: './chat-file-input.component.css'
})
export class ChatFileInputComponent {
  @Output() onMessageSent = new EventEmitter<any>();

  applyForm = new FormGroup({
    field: new FormControl('')
  });
  
  sendInput() {
    this.onMessageSent.emit(this.applyForm.value.field ?? '');
    this.applyForm.reset()
  }
}
