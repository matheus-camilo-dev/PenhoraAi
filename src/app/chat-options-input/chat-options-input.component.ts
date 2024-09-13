import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ChatMessageOptions } from '../models/message';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-options-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './chat-options-input.component.html',
  styleUrl: './chat-options-input.component.css'
})
export class ChatOptionsInputComponent {
  @Input() options? : ChatMessageOptions[];

  @Output() onMessageSent = new EventEmitter<any>();

  applyForm = new FormGroup({
    field: new FormControl('')
  });
  
  sendInput(key: number, value:string) {
    this.onMessageSent.emit({id: key, value: value});
    this.applyForm.reset()
  }
}
