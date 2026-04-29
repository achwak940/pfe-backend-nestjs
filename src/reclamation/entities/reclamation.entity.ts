import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Utilisateur } from '../../utilisateur/entities/utilisateur.entity';

@Entity({ name: 'reclamation' })
export class Reclamation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, type: 'varchar' })
  titre: string | null;

  @Column({ nullable: true, type: 'text' })
  description: string | null;

  @Column({ name: 'typeDommage', nullable: true, type: 'varchar' })
  typeDommage: string | null;

  @Column({ type: 'float', default: 0 })
  totalSeverite: number;

  @Column({ type: 'int', default: 0 })
  dommagesDetectes: number;

  @Column({ type: 'float', default: 0 })
  gravite: number;

  @Column({ type: 'float', default: 0 })
  confiance: number;

  @Column({ type: 'varchar', default: 'DETECTE' })
  statut: string;

  @Column({ nullable: true, type: 'varchar' })
  imageUrl: string | null;

  @Column({ nullable: true, type: 'varchar' })
  imageName: string | null;

  @Column({ nullable: true, type: 'int' })
  userId: number | null;

  // ✅ Ajoutez ces propriétés pour éviter les erreurs
  @Column({ nullable: true, type: 'text' })
  reponseAdmin: string | null;

  @Column({ nullable: true, type: 'timestamp' })
  dateReponse: Date | null;

  @ManyToOne(() => Utilisateur)
  user: Utilisateur | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}