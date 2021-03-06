import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class UserRoleService {
  public roleEmiter;

  constructor() {
    this.roleEmiter = new EventEmitter<{ role: string }>();
  }

/*  reloadMenuForUserRole() {
    if (localStorage.getItem('currentUserRole')) {
      let user = localStorage.getItem('currentUserRole');
      this.roleEmiter.emit(user);
    } else {
      this.roleEmiter.emit("Guest");
    }
  }*/

  getUserRole() {
    let user: string = localStorage.getItem('currentUserRole');
    if (user) {
      return user;
    } else {
      return "Guest";
    }
  }

  getUserId() : string{
    let userId:string = localStorage.getItem('currentUserId');
    return userId;
  }

  isAdmin() : boolean{
    if(this.getUserRole() === 'Administrator')
    return true;
  }
  isModerator() : boolean{
    if(this.getUserRole() === 'Moderator')
      return true;
  }
  isFactory() : boolean{
    if(this.getUserRole() === 'Factory')
      return true;
  }
}
