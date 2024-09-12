import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  requestData : { [key: string]: string } = {};

  addData(dataKey:string, dataValue:string){
    this.requestData[dataKey] = dataValue;
  }

  showData(){
    console.log(this.requestData)
  }
}
