import { Controller, Get, Body, Post, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './create-task.dto';
import { GetTasksFilterDto } from './get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController');
    constructor(private tasksService: TasksService) { };

    @Get('')
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto, @GetUser() user: User): Promise<Task[]> {
        this.logger.verbose(`User "${user.username}" retriving all tasks. Filter: ${JSON.stringify(filterDto)} `);
        return this.tasksService.getTasks(filterDto, user);
    }

    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<Task> {
        return this.tasksService.getTask(id, user);
    }

    @Post('')
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
        this.logger.verbose(`User "${user.username}" creating a task. Data: ${JSON.stringify(createTaskDto)} `);
        return this.tasksService.createTask(createTaskDto, user);
    }

    @Delete('/:id')
    deleteTaskById(
        @Param('id', ParseIntPipe)
        id: number,
        @GetUser()
        user: User): Promise<void> {
        return this.tasksService.deleteTask(id, user);
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Body('status', TaskStatusValidationPipe)
        status: TaskStatus,
        @Param('id', ParseIntPipe)
        id: number,
        @GetUser() user: User
    ): Promise<Task> {
        return this.tasksService.updateTaskStatus(id, status, user);
    }

}
