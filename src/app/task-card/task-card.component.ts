import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../services/model/task';
import { DataCategoryService } from '../services/shared/data-category.service';
import { DataPriorityService } from '../services/shared/data-priority.service';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css'
})

export class TaskCardComponent {
  @Input() task: Task | null = null;

  constructor() {}

  get isTaskInitialized(): boolean {
    console.log("task",this.task)
    return this.task !== null;
  }
}

/* export class TaskCardComponent implements OnInit {
  @Input() task: Task= {} as Task;
  priorityName: string = '';
  categoryName: string = '';

  constructor(private categoryService: DataCategoryService, private priorityService: DataPriorityService) {}

  async ngOnInit(): Promise<void> {
    console.log("card task", this.task);
    //await this.fetchPriorityName();
    //await this.fetchCategoryName();
  } */

 /*  private fetchPriorityName(): void {
    console.log("card task"+this.task)
    this.priorityService.getPriorityById(this.task.priority.id).subscribe((priority: any) => {
      console.log("cardddddddddd"+priority)
      console.log("cardddddddddd"+priority.name)
      console.log("cardddddddddd"+this.task.priority.id)

      this.priorityName = priority.name;
    });
  }

  private fetchCategoryName(): void {
    this.categoryService.getCategoryById(this.task.category.id).subscribe((category: any) => {
      this.categoryName = category.name;
    });
  } */
//}
