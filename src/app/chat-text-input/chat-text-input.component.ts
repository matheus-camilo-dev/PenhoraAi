import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-text-input',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './chat-text-input.component.html',
  styleUrl: './chat-text-input.component.css'
})
export class ChatTextInputComponent {
  @Output() onMessageSent = new EventEmitter<any>();

  applyForm = new FormGroup({
    field: new FormControl('')
  });
  
  submitApplication() {
    this.onMessageSent.emit(this.applyForm.value.field ?? '');
    this.applyForm.reset()
  }
}
