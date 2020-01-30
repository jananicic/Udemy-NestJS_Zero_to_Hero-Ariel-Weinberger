import {TaskStatus} from "../task.model";
import {IsIn, IsNotEmpty, IsOptional} from "class-validator";

export class GetTasksFilterDto {
    @IsOptional()
    @IsIn([TaskStatus.DONE, TaskStatus.IN_PROGRESS, TaskStatus.OPEN])
    status: TaskStatus;

    @IsOptional()
    @IsNotEmpty()
    search: string;
}
