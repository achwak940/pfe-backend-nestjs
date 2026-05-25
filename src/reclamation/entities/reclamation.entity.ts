// src/reclamation/entities/reclamation.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Utilisateur } from '../../utilisateur/entities/utilisateur.entity';

@Entity({ name: 'reclamation' })
export class Reclamation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  titre: string | null;

  @Column({ nullable: true, type: 'text' })
  description: string | null;

  @Column({ name: 'typeDommage', nullable: true, type: 'varchar', length: 100 })
  typeDommage: string | null;

  @Column({ type: 'float', default: 0 })
  totalSeverite: number;

  @Column({ type: 'int', default: 0 })
  dommagesDetectes: number;

  @Column({ type: 'float', default: 0 })
  gravite: number;

  @Column({ type: 'float', default: 0 })
  confiance: number;

  @Column({ type: 'varchar', default: 'DETECTE', length: 20 })
  statut: string;

  @Column({ nullable: true, type: 'varchar', length: 500 })
  imageUrl: string | null;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  imageName: string | null;

  @Column({ nullable: true, type: 'int' })
  userId: number | null;

  @Column({ nullable: true, type: 'text' })
  reponseAdmin: string | null;

  @Column({ nullable: true, type: 'timestamp' })
  dateReponse: Date | null;

  @Column({ type: 'float', default: 0 })
  coutEstime: number;

  @Column({ nullable: true, type: 'text' })
  notesExpert: string | null;

  @Column({ nullable: true, type: 'varchar', length: 50 })
  reponsePriority: string | null;

  @Column({ default: false })
  reponseEnvoyeEmail: boolean;

  @Column({ default: false })
  reponseEnvoyeSMS: boolean;

  @Column({ nullable: true, type: 'timestamp' })
  resoluLe: Date | null;

  // Dénormalisation des données utilisateur pour éviter les jointures coûteuses
  @Column({ nullable: true, type: 'varchar', length: 100 })
  userNom: string | null;

  @Column({ nullable: true, type: 'varchar', length: 100 })
  userPrenom: string | null;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  userEmail: string | null;

  @Column({ nullable: true, type: 'varchar', length: 20 })
  userTelephone: string | null;

  @Column({ nullable: true, type: 'varchar', length: 500 })
  userPhotoProfil: string | null;

  @ManyToOne(() => Utilisateur, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: Utilisateur | null;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}