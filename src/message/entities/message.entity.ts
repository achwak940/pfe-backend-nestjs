// src/message/entities/message.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Utilisateur } from '../../utilisateur/entities/utilisateur.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'expediteur_id' })
  expediteurId: number;

  @Column({ name: 'destinataire_id' })
  destinataireId: number;

  @Column({ length: 255 })
  sujet: string;

  @Column({ type: 'text' })
  contenu: string;

  @Column({ default: false })
  lu: boolean;

  @Column({ name: 'date_lecture', nullable: true, type: 'timestamp' })
  dateLecture: Date;

  @CreateDateColumn({ name: 'date_envoi' })
  dateEnvoi: Date;

  @UpdateDateColumn({ name: 'date_modification' })
  dateModification: Date;

  @ManyToOne(() => Utilisateur)
  @JoinColumn({ name: 'expediteur_id' })
  expediteur: Utilisateur;

  @ManyToOne(() => Utilisateur)
  @JoinColumn({ name: 'destinataire_id' })
  destinataire: Utilisateur;
}