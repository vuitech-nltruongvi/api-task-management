// Libraries
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm';

// Type Orm config
import { typeOrmConfig } from './config/typeorm.config';

// Module
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        TasksModule,
        TypeOrmModule.forRoot(typeOrmConfig),
        AuthModule
    ]
})

export class AppModule { }