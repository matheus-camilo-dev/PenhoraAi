import { Injectable } from '@angular/core';
import { Message } from '../models/message';
import { Owner } from '../models/owner';
import { BehaviorSubject, concatMap, map, Observable, of, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetMessagesService {
  first_message : Message = {
    owner: Owner.system,
    content: "Seja bem vindo!"
  };

  current_step = 0

  private messageSubject = new BehaviorSubject<Message>(this.first_message);
  message$: Observable<Message> = this.messageSubject.asObservable();

  constructor() { }

  getTextWithDelay(text: string): Observable<string> {
    // Retorna um Observable que emite o texto após um intervalo de tempo
    return timer(5).pipe(
      map(() => text)
    );
  }

  addUserText(text: string) : Observable<Message> {
    let newMessage = { owner: Owner.user, content: text }
    this.messageSubject.next(newMessage);
    
    if(this.current_step < this.steps.length - 1){
      this.current_step += 1;
      return this.getMessageWithDelay();
    }
    return new Observable();
  }

  getMessageWithDelay(): Observable<Message> {
    return of(...this.steps[this.current_step]).pipe(
      concatMap(message => {
        return timer(500).pipe(concatMap(() => of(message)))
      }
    )
    );
  }

  steps : Message[][] = [
    [
      {
        owner : Owner.system,
        content: "Olá! Seja bem vindo ao nosso Sistema!"
      },
      {
        owner : Owner.system,
        content: "Digite o seu nome para iniciarmos a conversa!",
        responseType : "text",
        requireData : true,
        requestKey: "name"
      }
    ],
    [
      {
        owner : Owner.system,
        content: "Certo! Agora seu CPF!",
        responseType : "text",
        requireData : true,
        requestKey: "cpf"
      },
    ],
    [
      {
        owner : Owner.system,
        content: "OK! Agora seu email!",
        responseType : "text",
        requireData : true,
        requestKey: "email"
      },
    ],
    [
      {
        owner : Owner.system,
        content: "Ultimo! Agora seu telefone!",
        responseType : "text",
        requireData : true,
        requestKey: "telefone",
        isSubmit: true
      },
    ],
    [
      {
        owner : Owner.system,
        content: "Um contrato formal foi enviado para o seu email!"
      },
    ]
  ]
}
