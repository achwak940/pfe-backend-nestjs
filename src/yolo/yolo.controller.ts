import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { YoloService } from './yolo.service';
import { CreateYoloDto } from './dto/create-yolo.dto';
import { UpdateYoloDto } from './dto/update-yolo.dto';

@Controller('yolo')
export class YoloController {
  constructor(private readonly yoloService: YoloService) {}

  @Post()
  create(@Body() createYoloDto: CreateYoloDto) {
    return this.yoloService.create(createYoloDto);
  }

  @Get()
  findAll() {
    return this.yoloService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.yoloService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateYoloDto: UpdateYoloDto) {
    return this.yoloService.update(+id, updateYoloDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.yoloService.remove(+id);
  }

  // ✅ Endpoint predict avec dossier "nom_de_images"
  @Post('/predict')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './nom_de_images', // dossier pour stocker temporairement
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async predict(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return { error: 'Aucun fichier uploadé' };
    }
    return this.yoloService.predict(file.path, file.originalname);
  }
}