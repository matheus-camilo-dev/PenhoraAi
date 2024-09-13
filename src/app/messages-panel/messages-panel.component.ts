import { Component, inject, OnInit } from '@angular/core';
import { MessageComponent } from '../message/message.component';
import { CommonModule } from '@angular/common';
import { ChatTextInputComponent } from '../chat-text-input/chat-text-input.component';
import { ChatMessageOptions, Message } from '../models/message';
import { Owner } from '../models/owner';
import { ChatFileInputComponent } from '../chat-file-input/chat-file-input.component';
import { GetMessagesService } from '../services/get-messages.service';
import { Observable, Subject } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ChatDateInputComponent } from '../chat-date-input/chat-date-input.component';
import { MessageOptions } from 'child_process';
import { ChatOptionsInputComponent } from '../chat-options-input/chat-options-input.component';

@Component({
  selector: 'app-messages-panel',
  standalone: true,
  imports: [
    CommonModule, 
    MessageComponent,
    ChatTextInputComponent,
    ChatFileInputComponent,
    ReactiveFormsModule,
    ChatDateInputComponent,
    ChatOptionsInputComponent
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
  options? : ChatMessageOptions[] = [];
  
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
          this.options = value.options;
        });
  }

  system_owner = Owner.system;

  sendMessage(event:any){
    if(this.toSubmit){
      console.log(this.userService.getData());
    }
    if(event.id != null){
      this.userService.addData(this.last_message_field, event.id);
      event = event.value;
    }else{
      this.userService.addData(this.last_message_field, event)
    }

    this.messageList.next([{owner: Owner.user, content: event}]);
    this.messages.push({owner: Owner.user, content: event})
    this.getMessagesService.addUserText(event)
    .subscribe(value => {
        this.messages.push(value)
        this.messageList.next([value]);
          this.last_message_type = value.responseType ?? 'none';
          this.last_message_field = value.requestKey ?? '';
          this.toSubmit = value.isSubmit ?? false;
          this.options = value.options;
        });
        
    }
  }