import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  hide: boolean = true;
  hideConfirmedPassword: boolean = true;
  registerForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    confirmedPassword: new FormControl('', Validators.required),
  });

  constructor() {}
  ngOnInit(): void {
  }

}
