import { TaskCreatorPopupComponent } from '../task-creator-popup/task-creator-popup.component';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Task } from '../../services/model/task';
import { DataTaskService } from '../../services/shared/data-task.service';
import { Observer, map } from 'rxjs';
import { DataCategoryService } from '../../services/shared/data-category.service';
import { DataPriorityService } from '../../services/shared/data-priority.service';
import { Category } from '../../services/model/category';
import { Priority } from '../../services/model/priority';
import { DocumentReference } from '@angular/fire/compat/firestore';
import { coerceStringArray } from '@angular/cdk/coercion';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  hide: boolean = true;
  loginForm!: FormGroup;

  taskList: Task[] = [];
  categoriesList: Category[] = [];
  priorityList: Priority[] = [];

  taskObj: Task = {
    id: '',
    title: '',
    description: '',
    priority: {} as DocumentReference<Priority>,
    category: {} as DocumentReference<Category>,
    dueDate: new Date(""),
    userId: ''
  };
  id : string = '';
  title : string = '';
  description : string = '';
  priority : DocumentReference<Priority> = {} as DocumentReference<Priority>;
  category : DocumentReference<Category> = {} as DocumentReference<Category>;
  dueDate : Date = new Date("");;
  userId : string = '';
  

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
    public dialog: MatDialog,
    private router: Router,
    private data_task: DataTaskService,
    private data_category: DataCategoryService,
    private data_priority: DataPriorityService
  ) {

    this.getAllCategories();
    this.getAllPriorities();
    console.log(this.categoriesList);
    console.log(this.priorityList);
  }

  ngOnInit(): void {
    console.log(this.authService.isLoggedIn());
    if(this.authService.isLoggedIn() == false) {
        this.router.navigate(['/login']);
      }
  
  }


  logoutUser() {
    this.authService.logout();
  }

  openTaskCreator(): void {
    const dialogRef = this.dialog.open(TaskCreatorPopupComponent, {
      width: '300px', // adjust width as needed
      data: {} // you can pass data to the dialog if needed
    });

    dialogRef.afterClosed().subscribe(result => {
              console.log(result);
              this.title = result.title;
              this.description = result.description;
              this.priority = this.data_priority.getPriorityByIdRef(this.getPriorityFromName(result.priority ?? '') ?? '') as DocumentReference<Priority>;
              this.category = this.data_category.getCategoryByIdRef(this.getCategoryFromName(result.category ?? '') ?? '') as DocumentReference<Category>;
              this.dueDate = result.dueDate;
              this.userId = localStorage['token'] ?? '';
              this.addTask();
              
          // Call getAllTasks and update this.taskList after the subscription completes
          this.getAllTasks().subscribe(taskList => {
            this.taskList = taskList;
            console.log(this.taskList);
          });
    });
  }

  getAllTasks() {
    return this.data_task.getAllTasks().pipe(
      map((res: any) => {
        return res.map((e: any) => {
          const data = e.payload.doc.data();
          data.id = e.payload.doc.id;
          console.log(data);
          data.category = data.category.get();
          return data;
        });
      })
    );
  }

  getAllTasks4() {
    const observer: Observer<any> = {
      next: (res: any) => {
        console.log("res"+res)
        this.taskList = res.map((e: any) => {
          console.log("e"+e)
          console.log("p"+e.payload)
          console.log("Document ID:", e.payload.doc.id);
          console.log("Document Data:", e.payload.doc.data());
          const data = e.payload.doc.data();
          data.category=data.category.get();
          console.log("data"+ data);
          data.id = e.payload.doc.id;
          // Fetch category details based on categoryId
          //this.data_category.getCategoryById(data.category).subscribe((category: any) => {
          //console.log(category);
          //data.category = category; // Assign category details to the task
          //});
          console.log(data.category)
          return data;
        });
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {} // You can provide a complete handler if needed
    };

    
  
    return this.data_task.getAllTasks().subscribe(observer);
  }

  getAllTasks3(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.data_task.getAllTasks().subscribe(
        (res: any) => {
          const tasks = res.map((e: any) => {
            const data = e.payload.doc.data();
            data.id = e.payload.doc.id;
            const categoryRef = data.category;
            return categoryRef.get().then((categorySnapshot: any) => {
              if (categorySnapshot.exists) {
                const categoryData = categorySnapshot.data();
                data.category = categoryData;
                console.log("Category data:", categoryData);
                return data;
              } else {
                console.log("Category does not exist."+ data.doc.id);
                return null;
              }
            }).catch((error: any) => {
              console.error("Error fetching category:", error);
              return null;
            });
          });
  
          Promise.all(tasks).then((resolvedTasks: any[]) => {
            const filteredTasks = resolvedTasks.filter(task => task !== null);
            resolve(filteredTasks);
          });
        },
        (error: any) => {
          console.log("Error:", error);
          reject(error);
        }
      );
    });
  }
  

  getAllTasks2() {
    this.data_task.getAllTasks().subscribe(
      (res: any) => {
        this.taskList = res.map((e: any) => {
          const data = e.payload.doc.data();
          data.id = e.payload.doc.id;
          // Fetch category details based on categoryId
          this.data_category.getCategoryById(data.category).subscribe((category: any) => {
            // Process category data if needed
          });
          return data;
        });
      },
      (error: any) => {
        // Handle errors if needed
      },
      () => {
        // Handle completion if needed
      }
    );
  }
  
  addTask() {
    this.taskObj = {
      id: this.id,
      title: this.title,
      description: this.description,
      priority: this.priority,
      category: this.category,
      dueDate: this.dueDate,
      userId: this.userId
    };
    console.log("task"+this.taskObj);
    this.data_task.addTask(this.taskObj).then(() => {
      console.log('Task added successfully!');
    });

    this.resetForm();
  }

  resetForm() {
    this.id = '';
    this.title = '';
    this.description = '';
    this.priority = {} as DocumentReference<Priority>;
    this.category = {} as DocumentReference<Category>;
    this.dueDate = new Date("");
    this.userId = '';
  }

  deleteTask(task: Task) {
    if(window.confirm('Are you sure you want to delete this task?')) {
    this.data_task.deleteTask(task).then(() => {
      console.log('Task deleted successfully!');
    });
   }
  }

  updateTask(task: Task) {
    // Update the task TO DO Should Add button that Opens the New Task window but uses the id of the task clicked on
    this.data_task.updateTask(task).then(() => {
      console.log('Task updated successfully!');
    });
  }


  getAllCategories() {
    this.data_category.getAllCategories().subscribe(res=> {
      this.categoriesList = res.map((e: any) => {
      console.log(e.payload.doc.data());
      console.log(this.data_category.getCategoryByIdRef(e.payload.doc.id));
        return {
          id: e.payload.doc.id,
          name: e.payload.doc.data()['name'],
          color: e.payload.doc.data()['color']
        };
      });
    });
  }

  getAllPriorities() {
    this.data_priority.getAllPriorities().subscribe(res=> {
      this.priorityList = res.map((e: any) => {
        console.log(e.payload.doc.data());
        return {
          id: e.payload.doc.id,
          name: e.payload.doc.data()['name'],
          color: e.payload.doc.data()['color']
        };
      });
    });
  }


  getCategoryFromName(categoryName: string) {
    const category = this.categoriesList.find(category => category.name.toLowerCase() === categoryName);
    return category ? category.id : null;
  }

  getPriorityFromName(priorityName: string) {
    const priority = this.priorityList.find(priority => priority.name.toLowerCase() === priorityName);
    return priority ? priority.id : null;
  }

}

