import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide: boolean = true;
  loginForm!: FormGroup;

  constructor(
    private authService: AuthService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  loginWithGoogle() {
    this.authService.signInWithGoogle().then((res: any) => {
      console.log(res);
    }).catch((error: any) => {
      console.log(error);
    });
  }

  loginWithEmailAndPassword() {
    console.log(this.loginForm.value);
    this.authService.login(this.loginForm.value.username, this.loginForm.value.password).then((res: any) => {
      console.log(res);
    }).catch((error: any) => {
    });
  }
}
