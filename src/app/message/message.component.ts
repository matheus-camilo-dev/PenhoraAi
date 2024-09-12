import { Component, Input } from '@angular/core';
import { SpeakerIconComponent } from '../speaker-icon/speaker-icon.component';
import { ChatMessageComponent } from '../chat-message/chat-message.component';
import { Message } from '../models/message';
import { CommonModule } from '@angular/common';
import { Owner } from '../models/owner';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, SpeakerIconComponent, ChatMessageComponent],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {
  @Input() message!: Message;

  system_owner = Owner.system;
}
