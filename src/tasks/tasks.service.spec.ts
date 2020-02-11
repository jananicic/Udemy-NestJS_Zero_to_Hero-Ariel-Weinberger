import {Test} from "@nestjs/testing";
import {TasksService} from "./tasks.service";
import {TaskRepository} from "./task.repository";
import {GetTasksFilterDto} from "./dto/get-tasks-filter.dto";
import {TaskStatus} from "./task-status.enum";
import {NotFoundException} from "@nestjs/common";

const mockUser = {id: 1, username: "Test User"};
const mockTask = {title: "Test task", description: "Test desc"};

const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn(),
});

describe('TasksService', () => {
    let tasksService;
    let taskRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                {provide: TaskRepository, useFactory: mockTaskRepository}
            ],
        }).compile();

        tasksService = await module.get(TasksService);
        taskRepository = await module.get(TaskRepository);
    });

    describe('getTasks', () => {
        it('gets all tasks from the repository', async () => {
            taskRepository.getTasks.mockResolvedValue('someValue');

            expect(taskRepository.getTasks).not.toHaveBeenCalled();
            const filters: GetTasksFilterDto = {status: TaskStatus.IN_PROGRESS, search: "Some search query"};
            const result = await tasksService.getTasks(filters, mockUser);
            expect(taskRepository.getTasks).toHaveBeenCalled();
            expect(result).toEqual('someValue');
        });
    });

    describe('getTaskById', () => {
        it('calls taskRepository.findOne() and successfully retrieve and return the task', async () => {
            taskRepository.findOne.mockResolvedValue(mockTask);

            const result = await tasksService.getTaskById(1, mockUser);
            expect(result).toEqual(mockTask);

            expect(taskRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: 1,
                    userId: mockUser.id,
                },
            });
        });

        it('throws an error as task is not found', () => {
            taskRepository.findOne.mockResolvedValue(null);
            expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
        });
    });

    describe('createTask', () => {
        it('calls taskRepository.create() and returns the result', async () => {
            taskRepository.createTask.mockResolvedValue('SomeTask');
            expect(taskRepository.createTask).not.toHaveBeenCalled();
            const result = await tasksService.createTask(mockUser, mockUser);
            expect(taskRepository.createTask).toHaveBeenCalledWith(mockUser, mockUser);
            expect(result).toEqual('SomeTask');
        });
    });

    describe('deleteTask', () => {
        it('calls repositoryTask.deleteTask() to delete a task', async () => {
            taskRepository.delete.mockResolvedValue('x');
            expect(taskRepository.delete).not.toHaveBeenCalled();
            await tasksService.deleteTask(1, mockUser);
            expect(taskRepository.delete).toHaveBeenCalledWith({id: 1, userId: mockUser.id});
        });

        it('throws an error as task could not be found', () => {
            taskRepository.delete.mockResolvedValue('x');
            expect(tasksService.deleteTask(1, mockUser)).rejects.toThrow(NotFoundException);
        });
    });

    describe('updateTaskStatus', () => {
        it('updates task status and saves it', async () => {
            const save = jest.fn().mockResolvedValue(true);
            tasksService.getTaskById = jest.fn().mockResolvedValue({
                status: TaskStatus.OPEN,
                save,
            });
            expect(tasksService.getTaskById).not.toHaveBeenCalled();
            const result = await tasksService.updateTaskStatus(1, TaskStatus.IN_PROGRESS, mockUser);
            expect(tasksService.getTaskById).toHaveBeenCalled();
            expect(save).toHaveBeenCalled();
            expect(result.status).toEqual(TaskStatus.IN_PROGRESS)
        });
    });
});
