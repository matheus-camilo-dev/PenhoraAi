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
        content: "Digite o seu Nome Completo para iniciarmos a conversa!",
        responseType : "text",
        requireData : true,
        requestKey: "nome"
      }
    ],
    [
      {
        owner : Owner.system,
        content: "Agora seu CPF!",
        responseType : "text",
        requireData : true,
        requestKey: "cpf"
      },
    ],
    [
      {
        owner : Owner.system,
        content: "Data de nascimento!",
        responseType : "date",
        requireData : true,
        requestKey: "dataNascimento"
      },
    ],
    [
      {
        owner : Owner.system,
        content: "Digite o seu Telefone",
        responseType : "text",
        requireData : true,
        requestKey: "telefone"
      },
    ],
    [
      {
        owner : Owner.system,
        content: "Agora a parte boa, digite a sua chave pix!",
        responseType : "text",
        requireData : true,
        requestKey: "pix",
      },
    ],
    [
      {
        owner : Owner.system,
        content: "Digite o endereço da sua Wallet!",
        responseType : "text",
        requireData : true,
        requestKey: "wallet",
      },
    ],
    [
      {
        owner : Owner.system,
        content: "O que você deseja?",
        responseType : "options",
        requireData : true,
        requestKey: "role",
        options : [
          {id: 1, value: "Investir"},
          {id: 2, value: "Pegar emprestado"}
        ],
        isSubmit: true
      },
    ],
    [
      {
        owner : Owner.system,
        content: "Uhuh!! Um contrato formal foi enviado para o seu email! :)"
      },
    ]
  ]
}
