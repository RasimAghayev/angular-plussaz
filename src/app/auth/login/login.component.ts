import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalService } from 'src/app/local.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  baseurl=environment.baseurl
  public loginForm!: FormGroup;
  public loginIn: boolean = false;
  constructor(
    private formBuilder : FormBuilder,
    private localStore: LocalService,
    private http: HttpClient,
    private router: Router
    ) { }

  ngOnInit(): void {
    let user=this.localStore.getData(false,'username');
    if (user) {
      this.loginIn=true;
    }
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
    })
  }
  login(){

    this.http.get<any>(this.baseurl + '/users/' )
    .subscribe(res=>{
      const user = res.find((a:any) =>{
        return a.username === this.loginForm.value.username
      });
      if (user) {
        console.log(user)
        alert(user+"Login Success!");
        this.loginForm.reset();
        this.localStore.saveData(false,'username', user.username);
        this.router.navigate(['posts-list'])
      } else {
        alert("User Not found. Create account !!");
        this.router.navigate(['login']);
      }
    }, err=>{
      alert("Something Went Wrong");
    })
  }
}
