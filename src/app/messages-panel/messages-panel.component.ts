import { Component, inject, OnInit } from '@angular/core';
import { MessageComponent } from '../message/message.component';
import { CommonModule } from '@angular/common';
import { ChatTextInputComponent } from '../chat-text-input/chat-text-input.component';
import { Message } from '../models/message';
import { Owner } from '../models/owner';
import { ChatFileInputComponent } from '../chat-file-input/chat-file-input.component';
import { GetMessagesService } from '../services/get-messages.service';
import { Observable, Subject } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-messages-panel',
  standalone: true,
  imports: [
    CommonModule, 
    MessageComponent,
    ChatTextInputComponent,
    ChatFileInputComponent,
    ReactiveFormsModule
  ],
  templateUrl: './messages-panel.component.html',
  styleUrl: './messages-panel.component.css'
})
export class MessagesPanelComponent implements OnInit {
  messageList = new Subject<Message[]>();
  messageList$: Observable<Message[]> = this.messageList.asObservable();
  
  private getMessagesService = inject(GetMessagesService);
  private userService = inject(UserService);
  
  message$ = this.getMessagesService.message$;
  messages : Message[] = []
  last_message_type : string = "none"
  last_message_field = ''
  toSubmit = false
  
  constructor(){
  }
  
  ngOnInit(): void {
    this.getMessagesService.getMessageWithDelay()
    .subscribe(value => {
          this.messages.push(value)
          this.messageList.next([value]);
          this.last_message_type = value.responseType ?? 'none';
          this.last_message_field = value.requestKey ?? '';
          this.toSubmit = value.isSubmit ?? false;
        });
  }

  system_owner = Owner.system;

  sendMessage(event:any){
  
  if(this.toSubmit){
    this.userService.showData();
  }
    this.userService.addData(this.last_message_field, event)

    this.messageList.next([{owner: Owner.user, content: event}]);
    this.messages.push({owner: Owner.user, content: event})
    this.getMessagesService.addUserText(event)
    .subscribe(value => {
      this.messages.push(value)
      this.messageList.next([value]);
          this.last_message_type = value.responseType ?? 'none';
          this.last_message_field = value.requestKey ?? '';
          this.toSubmit = value.isSubmit ?? false;
        });
        
    }
  }