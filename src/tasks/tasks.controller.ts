import { Controller, Get, Body, Post, Param, Delete, Patch, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './create-task.dto';
import { GetTasksFilterDto } from './get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) { };

    @Get('')
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Task[] {
        if (Object.keys(filterDto).length > 0) {
            return this.tasksService.getTasksWithFilters(filterDto);
        } else {
            return this.tasksService.getAllTasks();
        }
    }

    @Get('/:id')
    getTaskById(@Param('id') id: string): Task {
        return this.tasksService.getTask(id);
    }

    @Post('')
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: CreateTaskDto) {
        return this.tasksService.create(createTaskDto);
    }

    @Delete('/:id')
    deleteTaskById(@Param('id') id: string): void {
        this.tasksService.delete(id);
    }

    // @Patch('/:id/:field')
    // updateTaskById<K extends keyof Task>(@Body() body, @Param('field') field: string, @Param('id') id: string): Task {
    //     let update: { (key: K): Task[K] };
    //     update[field] = body[field];
    //     return this.tasksService.update(id, update);
    // }

    @Patch('/:id/status')
    updateTaskStatus(@Body('status', TaskStatusValidationPipe) status: TaskStatus, @Param('id') id: string) {
        this.tasksService.updateTaskStatus(id, status);
    }

}
