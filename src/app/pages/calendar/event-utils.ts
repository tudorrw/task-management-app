import { EventInput } from '@fullcalendar/core';
import { TaskInMemory } from '../../services/model/task-in-memory';
import { Observer, flatMap, from, forkJoin } from 'rxjs';
import { Observable } from 'rxjs';
import { DataTaskService } from '../../services/shared/data-task.service';


let eventGuid = 0;
const TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

// export const INITIAL_TASKS: Observable<TaskInMemory[]> = getAllTasks(DataTaskService);

export var INITIAL_TASKS2: EventInput[] = [];


export const INITIAL_EVENTS: EventInput[] = [
  {
    id: createEventId(),
    title: 'All-day event',
    start: TODAY_STR
  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: TODAY_STR + 'T00:00:00',
    end: TODAY_STR + 'T03:00:00'
  },
  {
    id: createEventId(),
    title: 'Timed event',
    start: TODAY_STR + 'T12:00:00',
    end: TODAY_STR + 'T15:00:00'
  }
];

export function createEventId() {
  return String(eventGuid++);
}


export function getAllTasks(dataTaskService: any): Observable<TaskInMemory[]> {
  return dataTaskService.getAllTasks().pipe(
    flatMap((res: any[]) => {
      return forkJoin(
        res.map(async (e: any) => {
          const data = e.payload.doc.data();
          data.id = e.payload.doc.id;

          // Fetch additional data (category, priority, stage)
          const categorySnapshot = await data.category.get();
          const categoryData = categorySnapshot.data();
          data.category = categoryData.name;

          const prioritySnapshot = await data.priority.get();
          const priorityData = prioritySnapshot.data();
          data.priority = priorityData.name;

          const stageSnapshot = await data.stage.get();
          const stageData = stageSnapshot.data();
          data.stage = stageData.name;

          // Convert dueDate to JavaScript Date object
          data.dueDate = data.dueDate.toDate();

          return data as TaskInMemory;
        })
      );
    })
  );
}

export function transformTasksToEvents(tasks: TaskInMemory[]): EventInput[] {
  return tasks.map(task => {
    const startTime = new Date(task.dueDate);
    const startTimeStr = startTime.toISOString().replace(/T.*$/, '');
    const endTimeStr = new Date(startTime.getTime() + 3 * 60 * 60 * 1000).toISOString().replace(/T.*$/, ''); // Add 3 hours
    return {
      id: createEventId(),
      title: task.title,
      start: startTimeStr+'T00:00:00',
      end: endTimeStr+'T3:00:00',
      // Add any other properties you want to include in the event
    };
  });
}




