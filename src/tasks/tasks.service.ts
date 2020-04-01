import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import * as uuid from 'uuid/v1';
import { CreateTaskDto } from './create-task.dto';
import { GetTasksFilterDto } from './get-tasks-filter.dto';

@Injectable()
export class TasksService {
    updateTaskStatus(id: string, status: TaskStatus) {
        let task = this.getTask(id);
        task.status = status;
    }

    update<K extends keyof Task>(id: string, update: { (key: K): Task[K] }) {
        let task = this.getTask(id);
        Object.assign(task, update);
        return task;
    }

    private tasks: Task[] = [];

    delete(id: string): void {
        const found = this.getTask(id);
        this.tasks = this.tasks.filter(task => task.id !== found.id);
    }

    getName() {
        return "its me";
    }

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTasksWithFilters(filter: GetTasksFilterDto) {
        let { status, search } = filter;
        let tasks = this.getAllTasks();
        if (status) {
            tasks = tasks.filter(task => task.status === status);
        }
        if (search) {
            tasks = tasks.filter(task =>
                task.title.includes(search) ||
                task.description.includes(search)
            )
        }
        return tasks;
    }

    getTask(id: string): Task {
        const found = this.tasks.find(task => task.id === id);

        if (!found) {
            throw new NotFoundException('This task does not exist');
        }
        return found;
    }
    create(createTaskDto: CreateTaskDto): Task {
        const { title, description } = createTaskDto;
        let task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN,
        }
        this.tasks.push(task);
        return task;
    }
}
