import { DocumentReference } from "@angular/fire/compat/firestore";
import { Category } from "./category";
import { Priority } from "./priority";

export interface Task {
    id: string,
    title: string,
    description: string,
    priority: DocumentReference<Priority>,
    category: DocumentReference<Category>,
    dueDate: Date,
    userId: string
}
