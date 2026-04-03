import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestionDto } from './create-question.dto';
import { CreateOptionDto } from '../../option/dto/create-option.dto';

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {}
