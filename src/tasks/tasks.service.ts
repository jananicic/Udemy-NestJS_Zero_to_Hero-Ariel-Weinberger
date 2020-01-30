import {Injectable, NotFoundException} from '@nestjs/common';
import {Task, TaskStatus} from "./task.model";
import * as uuid from "uuid/v1";
import {CreateTaskDto} from "./dto/create-task.dto";
import {GetTasksFilterDto} from "./dto/get-tasks-filter.dto";

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
        const {status, search} = filterDto;

        let tasks: Task[] = this.getAllTasks();

        if (status) tasks = tasks.filter(task => task.status === status);

        if (search) tasks = tasks.filter(task => task.title.includes(search) || task.description.includes(search));

        return tasks;
    }

    getTaskById(id: string) {
        const found = this.tasks.find(task => task.id === id);

        if (!found) throw new NotFoundException(`Task with ID "${id} was not found"`);

        return found;
    }

    createTask(createTaskDto: CreateTaskDto): Task {
        const {title, description} = createTaskDto;

        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.DONE
        };

        this.tasks.push(task);
        return task;
    }

    deleteTask(id: string): void {
        const found = this.getTaskById(id);
        this.tasks = this.tasks.filter(task => task.id !== found.id);
    }

    updateTasksStatus(id: string, status: TaskStatus): Task {
        const task = this.getTaskById(id);
        task.status = status;
        return task;
    }
}
