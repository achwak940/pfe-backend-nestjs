import { CreateOptionDto } from "src/option/dto/create-option.dto"

export class CreateQuestionDto {
    texte: string
    type: 'multiple' | 'unique' | 'text' | 'rating' | 'scale' | 'date'
    obligatoire: boolean
    active: boolean
    options?: CreateOptionDto[]
    
    // Configuration pour le type rating (étoiles)
    ratingConfig?: {
        maxStars: number
        minValue: number
        maxValue: number
    }
    
    // Configuration pour le type scale (échelle)
    scaleConfig?: {
        minLabel: string
        maxLabel: string
        steps: number
    }
}