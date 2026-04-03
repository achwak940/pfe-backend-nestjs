import { PartialType } from '@nestjs/mapped-types';
import { CreateReponseDto } from './create-reponse.dto';

export class UpdateReponseDto extends PartialType(CreateReponseDto) {}
