// Libraries
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';

// Dto
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) { }

    async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto, user);
    }

    async getTaskById(id: number, user: User): Promise<Task> {
        const found = await this.taskRepository.findOne({ where: { id, userId: user.id } });

        if (!found) {
            throw new NotFoundException(`Task with ID "${id}" not found!`)
        }

        return found;
    }

    async deleteTaskById(id: number, user: User): Promise<void> {
        const result = await this.taskRepository.delete({ id, userId: user.id });

        if (result.affected == 0) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
    }

    async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
        const newTask = await this.getTaskById(id, user);
        newTask.status = status;
        await newTask.save();

        return newTask;
    }

    // private tasks: Task[] = [];

    // /**
    //  * Get All Tasks 
    //  */
    // getAllTasks(): Task[] {
    //     return this.tasks;
    // }

    // /**
    //  * 
    //  * @param id 
    //  */
    // getTaskWithFilter(filterDto: GetTaskFilterDto): Task[] {
    //     const {status, search} = filterDto;

    //     let tasks = this.getAllTasks();

    //     if(status) {
    //         tasks = tasks.filter(task => task.status === status);
    //     }

    //     if(search) {
    //         tasks = tasks.filter(task => 
    //             task.title.includes(search) ||
    //             task.description.includes(search)
    //         )
    //     }

    //     return tasks;
    // }

    // /**
    //  * Get task by id
    //  * @param id 
    //  */
    // getTaskById(id: string): Task {
    //     const found =this.tasks.find(task => task.id === id)

    //     if (!found) {
    //         throw new NotFoundException(`Task with ID "${id}" not found!`)
    //     }

    //     return found
    // }

    // /**
    //  * Create Task
    //  * @param createTaskDto 
    //  */
    // createTask(createTaskDto: CreateTaskDto): Task {
    //     const {title, description} = createTaskDto;

    //     const task: Task = {
    //         id: uuidv1(),
    //         title,
    //         description,
    //         status: TaskStatus.OPEN
    //     }

    //     this.tasks.push(task)
    //     return task
    // }

    // /**
    //  * Delete Task by id
    //  * @param id 
    //  */
    // deleteTaskById(id: string): void {
    //     const found = this.getTaskById(id); 
    //     this.tasks = this.tasks.filter(task => task.id !== found.id)
    // }

    // /**
    //  * Update Status of task
    //  */
    // updateStatus(id: string, status: TaskStatus): Task {
    //     const newTask = this.getTaskById(id);
    //     newTask.status = status;

    //     return newTask;
    // }
}
