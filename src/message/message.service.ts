// src/message/message.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Utilisateur } from '../utilisateur/entities/utilisateur.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Utilisateur)
    private utilisateurRepository: Repository<Utilisateur>,
  ) {}

  // Envoyer un message
  async create(createMessageDto: CreateMessageDto) {
    try {
      // Vérifier si l'expéditeur existe
      const expediteur = await this.utilisateurRepository.findOne({
        where: { id: createMessageDto.expediteurId }
      });
      if (!expediteur) {
        return { success: false, message: 'Expéditeur non trouvé' };
      }

      // Vérifier si le destinataire existe
      const destinataire = await this.utilisateurRepository.findOne({
        where: { id: createMessageDto.destinataireId }
      });
      if (!destinataire) {
        return { success: false, message: 'Destinataire non trouvé' };
      }

      // Créer le message
      const message = this.messageRepository.create({
        expediteurId: createMessageDto.expediteurId,
        destinataireId: createMessageDto.destinataireId,
        sujet: createMessageDto.sujet,
        contenu: createMessageDto.contenu,
        lu: false,
      });

      await this.messageRepository.save(message);

      return {
        success: true,
        message: 'Message envoyé avec succès',
        data: {
          id: message.id,
          sujet: message.sujet,
          contenu: message.contenu,
          dateEnvoi: message.dateEnvoi
        }
      };
    } catch (error) {
      console.error('Erreur envoi message:', error);
      return { success: false, message: 'Erreur lors de l\'envoi du message' };
    }
  }

  // Récupérer tous les messages d'un utilisateur
  async findAllByUser(userId: number) {
    try {
      const messages = await this.messageRepository.find({
        where: [
          { expediteurId: userId },
          { destinataireId: userId }
        ],
        relations: ['expediteur', 'destinataire'],
        order: { dateEnvoi: 'DESC' }
    });

      const formattedMessages = messages.map(msg => ({
        id: msg.id,
        sujet: msg.sujet,
        contenu: msg.contenu,
        lu: msg.lu,
        dateEnvoi: msg.dateEnvoi,
        estEnvoyeur: msg.expediteurId === userId,
        interlocuteur: msg.expediteurId === userId ? {
          id: msg.destinataire.id,
          prenom: msg.destinataire.prenom,
          nom: msg.destinataire.nom,
          email: msg.destinataire.email,
          photo_profil: msg.destinataire.photo_profil
        } : {
          id: msg.expediteur.id,
          prenom: msg.expediteur.prenom,
          nom: msg.expediteur.nom,
          email: msg.expediteur.email,
          photo_profil: msg.expediteur.photo_profil
        }
      }));

      return { success: true, data: formattedMessages };
    } catch (error) {
      return { success: false, message: 'Erreur lors de la récupération des messages' };
    }
  }
  // src/message/message.service.ts
// Ajoutez cette méthode après la méthode markAsRead (ou n'importe où dans la classe)

// Mettre à jour un message
async update(id: number, updateMessageDto: UpdateMessageDto) {
  try {
    const message = await this.messageRepository.findOne({ where: { id } });
    if (!message) {
      return { success: false, message: 'Message non trouvé' };
    }

    // Mettre à jour les champs
    if (updateMessageDto.sujet) message.sujet = updateMessageDto.sujet;
    if (updateMessageDto.contenu) message.contenu = updateMessageDto.contenu;
    if (updateMessageDto.lu !== undefined) {
      message.lu = updateMessageDto.lu;
      if (updateMessageDto.lu === true) {
        message.dateLecture = new Date();
      }
    }

    await this.messageRepository.save(message);

    return {
      success: true,
      message: 'Message mis à jour avec succès',
      data: {
        id: message.id,
        sujet: message.sujet,
        contenu: message.contenu,
        lu: message.lu,
        dateEnvoi: message.dateEnvoi
      }
    };
  } catch (error) {
    console.error('Erreur mise à jour message:', error);
    return { success: false, message: 'Erreur lors de la mise à jour du message' };
  }
}

  // Récupérer les messages reçus
  async getReceivedMessages(userId: number) {
    try {
      const messages = await this.messageRepository.find({
        where: { destinataireId: userId },
        relations: ['expediteur'],
        order: { dateEnvoi: 'DESC' }
      });

      const formattedMessages = messages.map(msg => ({
        id: msg.id,
        sujet: msg.sujet,
        contenu: msg.contenu,
        lu: msg.lu,
        dateEnvoi: msg.dateEnvoi,
        expediteur: {
          id: msg.expediteur.id,
          prenom: msg.expediteur.prenom,
          nom: msg.expediteur.nom,
          email: msg.expediteur.email,
          photo_profil: msg.expediteur.photo_profil
        }
      }));

      return { success: true, data: formattedMessages };
    } catch (error) {
      return { success: false, message: 'Erreur lors de la récupération des messages reçus' };
    }
  }

  // Récupérer les messages envoyés
  async getSentMessages(userId: number) {
    try {
      const messages = await this.messageRepository.find({
        where: { expediteurId: userId },
        relations: ['destinataire'],
        order: { dateEnvoi: 'DESC' }
      });

      const formattedMessages = messages.map(msg => ({
        id: msg.id,
        sujet: msg.sujet,
        contenu: msg.contenu,
        lu: msg.lu,
        dateEnvoi: msg.dateEnvoi,
        destinataire: {
          id: msg.destinataire.id,
          prenom: msg.destinataire.prenom,
          nom: msg.destinataire.nom,
          email: msg.destinataire.email,
          photo_profil: msg.destinataire.photo_profil
        }
      }));

      return { success: true, data: formattedMessages };
    } catch (error) {
      return { success: false, message: 'Erreur lors de la récupération des messages envoyés' };
    }
  }

  // src/message/message.service.ts - Méthode getConversation
async getConversation(userId1: number, userId2: number) {
  try {
    console.log(`Recherche conversation entre ${userId1} et ${userId2}`);
    
    // Vérifier si les utilisateurs existent
    const user1 = await this.utilisateurRepository.findOne({ where: { id: userId1 } });
    const user2 = await this.utilisateurRepository.findOne({ where: { id: userId2 } });
    
    if (!user1 || !user2) {
      return { 
        success: false, 
        message: 'Un ou plusieurs utilisateurs n\'existent pas',
        data: [] 
      };
    }
    
    const messages = await this.messageRepository.find({
      where: [
        { expediteurId: userId1, destinataireId: userId2 },
        { expediteurId: userId2, destinataireId: userId1 }
      ],
      relations: ['expediteur', 'destinataire'],
      order: { dateEnvoi: 'ASC' }
    });

    console.log(`Messages trouvés: ${messages.length}`);

    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      sujet: msg.sujet,
      contenu: msg.contenu,
      lu: msg.lu,
      dateEnvoi: msg.dateEnvoi,
      expediteurId: msg.expediteurId,
      destinataireId: msg.destinataireId,
      estMoi: msg.expediteurId === userId1
    }));

    return { success: true, data: formattedMessages };
  } catch (error) {
    console.error('Erreur getConversation:', error);
    return { success: false, message: 'Erreur lors de la récupération de la conversation', data: [] };
  }
}
  // Marquer un message comme lu
  async markAsRead(id: number) {
    try {
      const message = await this.messageRepository.findOne({ where: { id } });
      if (!message) {
        return { success: false, message: 'Message non trouvé' };
      }

      message.lu = true;
      message.dateLecture = new Date();
      await this.messageRepository.save(message);

      return { success: true, message: 'Message marqué comme lu' };
    } catch (error) {
      return { success: false, message: 'Erreur lors du marquage du message' };
    }
  }

  // Récupérer le nombre de messages non lus
  async getUnreadCount(userId: number) {
    try {
      const count = await this.messageRepository.count({
        where: { destinataireId: userId, lu: false }
      });
      return { success: true, count };
    } catch (error) {
      return { success: false, count: 0 };
    }
  }

  // Récupérer un message par ID
  async findOne(id: number) {
    try {
      const message = await this.messageRepository.findOne({
        where: { id },
        relations: ['expediteur', 'destinataire']
      });
      
      if (!message) {
        return { success: false, message: 'Message non trouvé' };
      }

      return {
        success: true,
        data: {
          id: message.id,
          sujet: message.sujet,
          contenu: message.contenu,
          lu: message.lu,
          dateEnvoi: message.dateEnvoi,
          expediteur: {
            id: message.expediteur.id,
            prenom: message.expediteur.prenom,
            nom: message.expediteur.nom
          },
          destinataire: {
            id: message.destinataire.id,
            prenom: message.destinataire.prenom,
            nom: message.destinataire.nom
          }
        }
      };
    } catch (error) {
      return { success: false, message: 'Erreur lors de la récupération du message' };
    }
  }

  // Supprimer un message (soft delete)
  async remove(id: number) {
    try {
      const message = await this.messageRepository.findOne({ where: { id } });
      if (!message) {
        return { success: false, message: 'Message non trouvé' };
      }

      await this.messageRepository.remove(message);
      return { success: true, message: 'Message supprimé avec succès' };
    } catch (error) {
      return { success: false, message: 'Erreur lors de la suppression du message' };
    }
  }

  // Récupérer les conversations (dernier message avec chaque interlocuteur)
  async getConversations(userId: number) {
    try {
      const messages = await this.messageRepository.find({
        where: [
          { expediteurId: userId },
          { destinataireId: userId }
        ],
        relations: ['expediteur', 'destinataire'],
        order: { dateEnvoi: 'DESC' }
      });

      const conversationsMap = new Map();

      messages.forEach(msg => {
        const interlocuteur = msg.expediteurId === userId ? msg.destinataire : msg.expediteur;
        const key = interlocuteur.id;

        if (!conversationsMap.has(key)) {
          conversationsMap.set(key, {
            user: {
              id: interlocuteur.id,
              prenom: interlocuteur.prenom,
              nom: interlocuteur.nom,
              email: interlocuteur.email,
              photo_profil: interlocuteur.photo_profil
            },
            dernierMessage: msg.contenu,
            dateDernierMessage: msg.dateEnvoi,
            nonLu: msg.destinataireId === userId && !msg.lu ? 1 : 0
          });
        } else if (msg.destinataireId === userId && !msg.lu) {
          const conv = conversationsMap.get(key);
          conv.nonLu++;
          conversationsMap.set(key, conv);
        }
      });

      const conversations = Array.from(conversationsMap.values());
      conversations.sort((a, b) => new Date(b.dateDernierMessage).getTime() - new Date(a.dateDernierMessage).getTime());

      return { success: true, data: conversations };
    } catch (error) {
      return { success: false, message: 'Erreur lors de la récupération des conversations' };
    }
  }
}