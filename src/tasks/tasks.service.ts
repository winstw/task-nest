import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './create-task.dto';
import { TaskStatus } from './task-status.enum';
import { DeleteResult } from 'typeorm';
import { GetTasksFilterDto } from './get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';


@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) { }

    async getTask(id: number, user: User): Promise<Task> {
        const found = await this.taskRepository.findOne({ where: { id, userId: user.id } });

        if (!found) {
            throw new NotFoundException('This task does not exist');
        }
        return found;
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);

    }
    async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
        let task = await this.getTask(id, user);
        task.status = status;
        task.save();
        return task;
    }

    // update<K extends keyof Task>(id: string, update: { (key: K): Task[K] }) {
    //     let task = this.getTask(id);
    //     Object.assign(task, update);
    //     return task;
    // }


    async deleteTask(id: number, user: User): Promise<void> {
        const result = await this.taskRepository.delete({ id, userId: user.id });
        if (result.affected === 0) {
            throw new NotFoundException(`No task with id ${id}`);
        }
    }

    // getname() {
    //     return "its me";
    // }

    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto, user);
    }

    // getTasksWithFilters(filter: GetTasksFilterDto) {
    //     let { status, search } = filter;
    //     let tasks = this.getAllTasks();
    //     if (status) {
    //         tasks = tasks.filter(task => task.status === status);
    //     }
    //     if (search) {
    //         tasks = tasks.filter(task =>
    //             task.title.includes(search) ||
    //             task.description.includes(search)
    //         )
    //     }
    //     return tasks;
    // }

}
