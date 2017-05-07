import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../services/authentication.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})


/*<li><a [routerLink]="['home']" skipLocationChange >Home</a></li>
 <li><a [routerLink]="['new']" skipLocationChange >New bag</a></li>
 <li><a [routerLink]="['orders']" >Orders</a></li>
 <li><a [routerLink]="['about']" >About</a></li>
 <li><a [routerLink]="['help']" >Help</a></li>
 <li><a [routerLink]="['test']" >Test</a></li>
 <li><a [routerLink]="['testform']" >Test-form</a></li>*/

export class MenuComponent implements OnInit {

  private urls: Route[] = [];

  constructor(private authenticationService: AuthenticationService) {
    authenticationService.init();
  }

  init() {
  }

  ngOnInit() {
    //For anonymus
    this.urls = [new Route("home", "Home")];
    this.authenticationService.roleEmiter.subscribe((role: string ) => {
        console.log("---------" + role);
        switch (role) {
          case 'Customer' :
            this.urls = [
              new Route("home", "Home"),
              new Route("orders", "Orders"),
              new Route("test", "Test"),
              new Route("testform", "TEST FORM"),
              new Route("about", "About"),
            ];
            break;
          case 'Moderator' :
            this.urls = [
              new Route("moderator", "MODERATOR")
            ];
            break;
          case 'Factory' :
            this.urls = [
              new Route("factory", "FACTORY")
            ];
            break;
          case 'Administrator' :
            console.log("draw admin menu")
            this.urls = [
              new Route("admin", "ADMIN")
            ];
            break;
          case 'Guest' :
            console.log("draw GUEST menu")
            this.urls = [
              new Route("home", "Home"),
              new Route("orders", "Orders"),
              new Route("test", "Test"),
              new Route("testform", "TEST FORM"),
            ];
            break;
          default :
            console.log("draw DEFAULT menu");
            this.urls = [
              new Route("home", "Home"),
              new Route("orders", "Orders"),
              new Route("test", "Test"),
              new Route("testform", "TEST FORM"),
            ];
        }
      }
    );

  }
}

class Route {
  value: string;
  url: string;

  constructor(url: string, value: string) {
    this.value = value;
    this.url = url;
  }
}


/*
 {path: 'home', component: HomeComponent},
 {path: 'new', component: NewComponent},
 {path: 'orders', component: OrdersComponent, canActivate: [AuthGuard]},
 {path: 'about', component: AboutComponent},
 {path: 'help', component: HelpComponent},
 {path: 'test', component: TestComponent},
 { path: 'login', component: LoginComponent },
 { path: 'register', component: UserCreateComponent },
 {path: 'testform', component: TestformComponent},
 { path: '',   redirectTo: '/home', pathMatch: 'full' },
 { path: '**', component: PageNotFoundComponent }*/
