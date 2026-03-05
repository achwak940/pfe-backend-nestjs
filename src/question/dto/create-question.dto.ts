import { CreateOptionDto } from "src/option/dto/create-option.dto"

export class CreateQuestionDto {
    texte:string
    type:string
    obligatoire:boolean
    active:boolean
    options:CreateOptionDto[]
}
