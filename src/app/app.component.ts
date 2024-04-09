import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'task-management-app';
  my_text : string = "I'm in love with";

  changeText(): void {
    this.my_text = "Patricia" ;
  }
}
