import { Component, OnInit } from '@angular/core';
import {IUser} from "../../models/test.model";
import {RestService} from "../../services/rest.service";
import {IModel} from "../../models/model";

@Component({
  selector: 'app-testform',
  templateUrl: './testform.component.html'
})
export class TestformComponent {

  private users: IUser[] = [];
  private models: IModel[] = [];

  constructor(private restService: RestService) { }


  getUser(){
    this.restService.getData('./api/user/list')
      .subscribe((data: IUser[]) => {
        this.users=data;
        console.log(data);
      }, ()=>console.log('err')); //todo: add Alert service
  }

  getModelsByUserId(){
    this.restService.getData('./api/models/'+2+'/list')
      .subscribe((data: IModel[]) => {
        this.models=data;
        console.log(data);
      }, ()=>console.log('err'));
  }
}
