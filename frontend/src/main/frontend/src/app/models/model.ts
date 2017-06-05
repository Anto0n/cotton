export class IModel {
  "id": number;
  "userId": number;
  "bagTypeId": number;
  "materialId":number;
  "mname": string;
  "approved": ModelStatus;
  "modelCreate": number;
  "modelUpdate": number;
  "config" : string;
  "config2d" : string;
}


export class CreateModel{
  //"id"?:number;
  "approved": ModelStatus;
  "bagTypeId": number;
  "materialId": number;
  "mname": string;
  "userId": number;
  "config" : string;
  "config2d" : string;


  constructor(approved: ModelStatus, bagTypeId: number, materialId: number, mname: string, userId: number, config : string,  config2d : string) {
    this.approved = approved;
    this.bagTypeId = bagTypeId;
    this.materialId = materialId;
    this.mname = mname;
    this.userId = userId;
    this.config = config;
    this.config2d = config2d;
  }
}


// 0 1 2
export enum ModelStatus {
  NEW, APPROVED,  REJECTED
}


/*
{ Enum in javascript
  0: "Green"
  1: "Red"
  2: "Blue"
  "Blue": 2
  "Green": 0
  "Red": 1
}*/
