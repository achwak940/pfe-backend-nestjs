import { Option } from "src/option/entities/option.entity";
import { text } from "stream/consumers";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Question {
      @PrimaryGeneratedColumn()
        id :number
        @Column()
        texte:string
        @Column({default: 'text'})
        type:string
        @Column({default:false})
        obligatoire:boolean
        @Column({default:true})
        active:boolean
        @Column({default:() => 'NOW()'})
        create_at:Date
        @Column({default:null})
        update_at:Date
          @OneToMany(() => Option, option => option.question, { cascade: true })
  options: Option[];

       
}

