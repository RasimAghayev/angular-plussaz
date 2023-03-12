import { Component, OnInit } from '@angular/core';
import { LocalService } from 'src/app/local.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  title ='Home';
  public loginIn: boolean = false;
  getTitle(){
    return this.title;
  }
  ngOnInit():void{

    let user=this.localStore.getData(false,'username');
    if (user) {
      this.loginIn=true;
    }
  }
  constructor(
    private localStore: LocalService,
    private router: Router
    ){}
    logout(event: MouseEvent){
      event.preventDefault;
      let user=this.localStore.getData(false,'username');
      if (user) {
        this.loginIn=false;
        this.localStore.removeItem('username');
        console.log(user)
        this.router.navigate(['posts-list'])
      }
    }
}
