import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { error } from 'console';
import { GoogleAuthProvider } from 'firebase/auth'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afs: AngularFireAuth, private router: Router) {}

  signInWithGoogle() {
    return this.afs.signInWithPopup(new GoogleAuthProvider).then(res => 
      {
        this.router.navigate(['/dashboard']);
        // localStorage.setItem('token', JSON.stringify(res.user));
      }, err => {
        alert('Something went wrong: ');
      })
  }

  login(email: string, password: string) {
    return this.afs.signInWithEmailAndPassword(email, password).then(() => {
      localStorage.setItem('token', 'true');
      this.router.navigate(['/dashboard']);
    }, err => {
      alert('Something went wrong: ');
      this.router.navigate(['/login']);
    })
  }

  register(email : string, password : string) {
    this.afs.createUserWithEmailAndPassword(email, password).then( res => {
      alert('Registration Successful');
      this.router.navigate(['/login']);
    }, err => {
      alert(err.message);
      this.router.navigate(['/register']);
    })
  }

  logout() {
    this.afs.signOut().then(() => {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }, err => {
      alert(err.message);
    })
  }
}
