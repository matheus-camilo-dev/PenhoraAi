import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  private requestData : { [key: string]: string } = {};

  addData(dataKey:string, dataValue:string){
    this.requestData[dataKey] = dataValue;
  }

  getData(){
    return this.requestData;
  }
}
