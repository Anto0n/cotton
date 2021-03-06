import {Component, OnInit,  ChangeDetectorRef, OnDestroy, ViewChild} from '@angular/core';
import {RestService} from "../../services/rest.service";
import {IModel, CreateModel, ModelStatus} from "../../models/model";
import {UserRoleService} from "../../services/user/user-role.service";
import {AuthenticationService} from "../../services/authentication.service";
import {Subscription} from "rxjs";
import {CardOrderService} from "../../services/order/card-order.service";
import {mItems, OrderResp, OrderStatusNameEnum} from "../../models/order";
import {AlertService} from "../../services/alert.service";
import {ModelConfig} from "../../models/modelConfig";
import {IConfigurator} from "app/configurator/configurator.model";
import {Configurator3DComponent} from "app/configurator/3DConfigurator/configurator3d.component";
import {ConfiguratorComponent, ConfiguratorType} from "../../configurator/configurator.component";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styles:[`
      .modoverflow {
        height:350px;
        overflow-y: scroll;
      }
      .ordverflow{
        height:550px;
        overflow-y: scroll;
      }
`]
})
export class OrdersComponent implements OnInit, OnDestroy {
  private uId: string;
  private haveOrders: boolean;
  private createModelobj: CreateModel;
  private uModels: IModel[] = [];
  private selectedModel:IModel;
  private myOrders : OrderResp[];
  private subsOrderResp: Subscription;
  private currentOrder : OrderResp = new OrderResp();
  ShowView = ShowView; // allow to use enum in template
  private showWhat : ShowView = ShowView.ORDERS; //models first
   configView = ConfiguratorType.D2;
  @ViewChild('config') //old for 3d
  private configurator: Configurator3DComponent;

  selectModelId: number;

  constructor(private restService: RestService, private roleService: UserRoleService, private cd: ChangeDetectorRef,
              private authService : AuthenticationService, private cardOrderService : CardOrderService, private alertService : AlertService) {
    this.cardOrderService.sendEmitReloadBucket();
  }

  ngOnInit(): void {
    if(this.authService.isAuthenticated()){
      this.getModelsByUserId();
    }
    this.cd.markForCheck();

    this.authService.isAuthenticatedSubject.subscribe((auth: boolean ) => {
      if(auth){
        this.getModelsByUserId();  //refresh models on login
      }else{
      }
    });

    this.subsOrderResp = this.cardOrderService.getMessage().subscribe(orderResp => {
      this.currentOrder = orderResp;

    });
    this.reloadMyOrdersList();
  }

  showModels(){
    this.showWhat = ShowView.MODELS;
    this.getModelsByUserId();
    this.selectedModel = null;
    this.alertService.clearMeessage();
  }

  showOrders(){
    this.showWhat = ShowView.ORDERS;
    this.reloadMyOrdersList();
    this.selectedModel = null;
    this.getModelsByUserId();
    this.alertService.clearMeessage();
    //refresh orders ent
  }

  showModelsInOrder(ord : OrderResp){
    this.showWhat = ShowView.MODELS;
    // this.showWhat = ShowView.MODELS_IN_ORDER;
    this.uModels = [];  //clean arr
    for (let it  of ord.items){
      this.uModels.push(it.model);
    }
  }

  reloadMyOrdersList(){
    let id = this.roleService.getUserId();
    this.restService.getData('./api/order/findall' + `/${id}`).subscribe(
      (data: OrderResp[]) => {
        this.myOrders = data;

        this.myOrders = this.myOrders.filter(o => o.status.code != OrderStatusNameEnum[OrderStatusNameEnum.BUCKET]); //Filter Bucket
        this.myOrders =  this.myOrders.sort((a, b): number => {   //sor array by
          if (a.status.code < b.status.code) return -1;
          if (a.status.code > b.status.code) return 1;
          return 0;
        });
        this.haveOrders=this.myOrders.length > 0;
        }, () => console.log('err')
    );

    // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    // console.log(data);
    // console.log(data.length > 0);
  }


  private getModelsByUserId() {
    this.uId = this.roleService.getUserId();
    this.restService.getData(`./api/models/${this.uId}/list`)
      .subscribe((data: IModel[]) => {
        this.uModels = data;
        if(data[0]) this.selectModelId = data[0].id;
        // this.configurator.loadModel(this.uModels[0]);
      }, () => console.log('err'));
  }

  private getOrdersByUserId() {
    this.uId = this.roleService.getUserId();
    this.restService.getData(`./api/findall/${this.uId}`)
      .subscribe((data: IModel[]) => {
        this.uModels = data;
        if(data[0]) this.selectModelId = data[0].id;
      }, () => console.log('err'));
  }


  deleteModel(model: IModel) { //done
    this.restService.deleteData('./api/models/delete' + `/${model.id}`).subscribe(
      () => {
          this.uModels = this.uModels.filter(m => m !== model); //selectedModel - null
          /*if (this.selectedModel === model) {
            this.selectedModel = null;      }*/
        }, () => {console.log('err')
      this.alertService.error("can't delete model, used in orders");
    });

  }


  addModelToBucket(quantity: number, model:IModel){
    let modelid:number = model.id;
    if(quantity > 0){
      this.cardOrderService.sendEmitReloadBucket();  //reload bucket
    let iid = this.roleService.getUserId();
    //console.log(this.currentOrder.idOrder + "--")
    let oid : number = this.currentOrder.idOrder;
    let data = {
      "userId": iid,
      "orderId": oid,
      "items": [
        {
          "modelId": modelid,
          "count": quantity
        }
      ]
    }
    this.restService.putData("./api/order/additems", data).subscribe(
      () => {
         this.alertService.success(quantity + " items added to bucket", false)
        this.cardOrderService.sendEmitReloadBucket();  //reload bucket after order added
      }, () => {console.log('err')
                this.alertService.error("error");
      });

    } else{
      this.alertService.error("set items quantity");
    }
  }

  selectModel(model: IModel) {   //old for 3d
    console.log(model);
    this.selectedModel=model;
    this.configurator.loadModel(model);

  }
  selectModel3d(){
   this.configView = ConfiguratorType.D3;
  }

   ngOnDestroy() {

  }

}

export enum ShowView{
  MODELS, ORDERS, MODELS_IN_ORDER
}


