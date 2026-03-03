import { Question } from "src/question/entities/question.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Option {
    @PrimaryGeneratedColumn()
    id:number
    @Column()
    texte:string
    @Column()
    order:number
    @Column({default:true})
    active:boolean
    @Column({default:()=>'NOW()'})
    create_at:Date
    @Column({default:null})
    update_at:Date
    // Relation vers Question
  @ManyToOne(() => Question, question => question.options, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' }) // colonne FK dans Option
  question: Question;
}
