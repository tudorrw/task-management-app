import { TaskCreatorPopupComponent } from '../task-creator-popup/task-creator-popup.component';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent{
  hide: boolean = true;
  loginForm!: FormGroup;
  tasks = {
    todo: ['Task 1', 'Task 2', 'Task 3'],
    planned: ['Task 4'],
    inProgress: [],
    finished: [],
    verified: []
  };
  navbarCollapsed = false;

  toggleNavbar() {
    this.navbarCollapsed = !this.navbarCollapsed;
  }
  constructor(
    private authService: AuthService,
    public dialog: MatDialog
  ) {}

  openTaskCreator(): void {
    const dialogRef = this.dialog.open(TaskCreatorPopupComponent, {
      width: '300px', // adjust width as needed
      data: {} // you can pass data to the dialog if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle result if needed
    });
  }
}

