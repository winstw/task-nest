import { Task } from './task.entity';
import { Repository, EntityRepository } from 'typeorm';
import { CreateTaskDto } from './create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    private logger = new Logger('Task Repository');

    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');
        query.where('task.userId = :user', { user: user.id });
        if (status) {
            query.andWhere('task.status = :status', { status });
        }
        if (search) {
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` });
        }
        try {
            const tasks = await query.getMany();
            return tasks;
        } catch (error) {
            this.logger.error(`Failed to get tasks for user "${user.username}. Filters : ${JSON.stringify(filterDto)}`, error.stack);
            throw new InternalServerErrorException();
        }
    }
    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const { title, description } = createTaskDto;
        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;
        await task.save();

        delete task.user;
        return task;

    }

    // async deleteTask(id: number): Promise<Task> {
    //     const task = await this.findOne(id);
    //     let response = await this.remove(task);
    //     return response;
    // }
}
