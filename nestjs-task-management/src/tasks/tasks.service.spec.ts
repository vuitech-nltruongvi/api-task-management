import { NotFoundException } from '@nestjs/common';
import {Test} from '@nestjs/testing'
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockUser = {id: 12, username: 'Test user'}

const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn(),
    updateTaskStatus: jest.fn()
})

describe('TasksService', () => {
    let tasksService;
    let taskRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                {provide: TaskRepository, useFactory: mockTaskRepository}
            ]
        }).compile();

        tasksService = await module.get<TasksService>(TasksService);
        taskRepository = await module.get<TaskRepository>(TaskRepository);
    })

    describe('getTasks', () => {
        it('get all tasks from the repository', async () => {
            taskRepository.getTasks.mockResolvedValue('someValue');

            expect(taskRepository.getTasks).not.toHaveBeenCalled()

            const filters: GetTaskFilterDto = {status: TaskStatus.IN_PROGRESS, search: 'Some search query'}
            const result = await tasksService.getTasks(filters, mockUser)

            expect(taskRepository.getTasks).toHaveBeenCalled();

            expect(result).toEqual('someValue')
        })
    })

    describe('getTaskById', () => {
        it('Call taskRepository.findOne() and successfully retrieve and return the task', async () => {
            const mockTask = {title: 'Test task', description: 'Test desc'}

            taskRepository.findOne.mockResolvedValue(mockTask)

            const result = await tasksService.getTaskById(1, mockUser)

            expect(result).toEqual(mockTask)

            expect(taskRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: 1,
                    userId: mockUser.id
                }
            })
        })

        it('Throw an error as task is not found', () => {
            taskRepository.findOne.mockResolvedValue(null);
            expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
        })
    })

    describe('createTask', () => {
        it('Test create task is success', async () => {
            taskRepository.createTask.mockResolvedValue('someTask')

            const mockTask = {
                title: "Hello mấy cục cưng",
                description: "Khóc làm cái gì nữa"
            }

            expect(taskRepository.createTask).not.toHaveBeenCalled();
            const result = await tasksService.createTask(mockTask, mockUser);
            expect(taskRepository.createTask).toHaveBeenCalledWith(mockTask, mockUser)

            expect(result).toEqual('someTask')
        })
    })

    describe('deleteTask', () => {
        it('calls repository.deleteTask() to delete task', async () => {
            taskRepository.delete.mockResolvedValue({affected: 1})
            expect(taskRepository.delete).not.toHaveBeenCalled();
            await tasksService.deleteTaskById(1, mockUser)
            expect(taskRepository.delete).toHaveBeenCalledWith({
                id: 1,
                userId: mockUser.id
            });
        })

        it('throws an error as task could not be found', () => {
            taskRepository.delete.mockResolvedValue({affected: 0})
            expect(tasksService.deleteTaskById(1, mockUser)).rejects.toThrow(NotFoundException)
        })
    })

    describe('updateTask', () => {
        it('calls repository.updateTask() to update task successfully', async () => {
            const save = jest.fn().mockResolvedValue(true);

            tasksService.getTaskById = jest.fn().mockResolvedValue({
                status: TaskStatus.OPEN,
                save
            })

            expect(tasksService.getTaskById).not.toHaveBeenCalled();
            expect(save).not.toHaveBeenCalled()

            const result = await tasksService.updateTaskStatus(1, TaskStatus.DONE, mockUser)
            expect(tasksService.getTaskById).toHaveBeenCalled()
            expect(save).toHaveBeenCalled()
            expect(result.status).toEqual(TaskStatus.DONE)

        })
    })
})