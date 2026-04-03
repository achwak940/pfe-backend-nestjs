import { PartialType } from '@nestjs/mapped-types';
import { CreateYoloDto } from './create-yolo.dto';

export class UpdateYoloDto extends PartialType(CreateYoloDto) {}
