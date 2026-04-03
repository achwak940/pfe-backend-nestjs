import { Enquete } from "src/enquete/entities/enquete.entity";
import { Option } from "src/option/entities/option.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Question {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    texte: string
    
    @Column({ default: 'text' })
    type: string
    
    @Column({ default: false })
    obligatoire: boolean
    
    @Column({ default: true })
    active: boolean
    
    @Column({ default: () => 'NOW()' })
    create_at: Date
    
    @Column({ default: null, nullable: true })
    update_at: Date
    
    @OneToMany(() => Option, option => option.question, { cascade: true })
    options: Option[];
    
    @ManyToMany(() => Enquete, (enquete) => enquete.questions, {
        cascade: true,
        onDelete: 'CASCADE' 
    })
    enquetes: Enquete[];
    
    // Ajouter ces colonnes pour les nouveaux types
    @Column({ type: 'json', nullable: true })
    ratingConfig: {
        maxStars: number;
        minValue: number;
        maxValue: number;
    }
    
    @Column({ type: 'json', nullable: true })
    scaleConfig: {
        minLabel: string;
        maxLabel: string;
        steps: number;
    }
}