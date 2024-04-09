import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
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
        localStorage.setItem('token', JSON.stringify(res.user?.uid));
      }, err => {
        alert('Something went wrong: ');
      })
  }

  login(username: string, password: string) {
    return this.afs.signInWithEmailAndPassword(username, password).then( res => {
      localStorage.setItem('token', 'true');
      if(res.user?.emailVerified == true) {
        this.router.navigate(['dashboard']);
      } else {
        this.router.navigate(['/varify-email']);
      }
    }, err => {
      alert('Something went wrong: ');
      this.router.navigate(['/login']);
    });
  }

  register(username : string, password : string) {
    return this.afs.createUserWithEmailAndPassword(username, password).then( res => {
      alert('Registration Successful');
      this.sendEmailForVerification(res.user);

      // this.router.navigate(['/login']);
      
    }, err => {
      alert(err.message);
      this.router.navigate(['/register']);
    });
  }

  logout() {
    this.afs.signOut().then(() => {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }, err => {
      alert(err.message);
    })
  }

  forgotPassword(username: string) {
    this.afs.sendPasswordResetEmail(username).then(() => {
      this.router.navigate(['/verify-email']);
    }, err => {
      alert("Something went wrong");
    });
  }

  sendEmailForVerification(user : any) {
    user.sendEmailVerification().then((res : any) => {
      this.router.navigate(['/verify-email']);
    }, (err : any) => {
      alert("Something went wrong. Not able to send verification email.");
    });
  }

}
