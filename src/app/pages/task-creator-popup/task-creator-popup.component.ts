import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-popup',
  templateUrl: './task-creator-popup.component.html',
  styleUrls: ['./task-creator-popup.component.css']
})
export class TaskCreatorPopupComponent implements OnInit {
  taskForm!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<TaskCreatorPopupComponent>,
    private formBuilder: FormBuilder
  ) {
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: [''],
      priority: ['', Validators.required], // Adding validators for priority
      category: ['', Validators.required], // Adding validators for priority
      dueDate: ['']
    });
  }
  

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: [''],
      priority: ['', Validators.required], // Adding validators for priority
      category: ['', Validators.required], // Adding validators for priority
      dueDate: ['']
    });
  }

  saveTask(): void {
    if (this.taskForm.valid) {
      const taskData = this.taskForm.value;
      // Send task data to the service to save
      // Close the dialog
      this.dialogRef.close();
    } else {
      // Form is invalid, mark all fields as touched to display validation errors
      this.markFormGroupTouched(this.taskForm);
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  // Helper function to mark all form controls as touched
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
