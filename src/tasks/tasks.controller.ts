import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query, UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {TasksService} from "./tasks.service";
import {TaskStatus} from "./task-status.enum";
import {CreateTaskDto} from "./dto/create-task.dto";
import {GetTasksFilterDto} from "./dto/get-tasks-filter.dto";
import {TaskStatusValidationPipe} from "./pipes/task-status-validation.pipe";
import {Task} from "./task.entity";
import {AuthGuard} from "@nestjs/passport";
import {GetUser} from "../auth/get-user.decoorator";
import {User} from "../auth/user.entity";

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private tasksService: TasksService) {
    }

    @Get()
    async getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto, @GetUser() user: User): Promise<Task[]> {
        return this.tasksService.getTasks(filterDto, user)
    }

    @Get("/:id")
    getTaskById(@Param("id", ParseIntPipe) id: number, @GetUser() user: User): Promise<Task> {
        return this.tasksService.getTaskById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User): Promise<Task> {
        return this.tasksService.createTask(createTaskDto, user);
    }

    @Delete("/:id")
    deleteTask(@Param("id", ParseIntPipe) id: number, @GetUser() user: User): Promise<void> {
        return this.tasksService.deleteTask(id, user);
    }

    @Patch("/:id/status")
    updateTasksStatus(
        @Param("id", ParseIntPipe) id: number,
        @Body("status", TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user: User)
        : Promise<Task> {
        return this.tasksService.updateTasksStatus(id, status, user);
    }
}
