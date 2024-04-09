import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  hide: boolean = true;
  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });
  

  constructor(private authService : AuthService) {}
  ngOnInit(): void {}

  loginWithGoogle() {
    this.authService.signInWithGoogle().then((res: any) => {
      console.log(res);
    }).catch((error: any) => {
      console.log(error);
   });
  }
}
