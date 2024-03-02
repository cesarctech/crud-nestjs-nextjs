// import { PartialType } from '@nestjs/mapped-types';
// import { CreateCatDto } from './create-cat.dto';
import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import { CreateCatDto } from './create-cat.dto';

export class UpdateCatDto extends PartialType(CreateCatDto){
    // @IsString()
    // @IsOptional()
    // name?: string;

    // @IsInt()
    // @IsPositive()
    // @IsOptional()
    // age?: number;

    // @IsString()
    // @IsOptional()
    // breed?: string;

}
