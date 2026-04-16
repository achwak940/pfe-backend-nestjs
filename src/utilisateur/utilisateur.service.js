"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilisateurService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("typeorm");
var status_enum_1 = require("./status.enum");
var role_enum_1 = require("./role.enum");
var status_enum_2 = require("../enquete/entities/status.enum");
var ExcelJS = require("exceljs");
var jspdf_1 = require("jspdf");
var jspdf_autotable_1 = require("jspdf-autotable");
var json2csv_1 = require("json2csv");
var UtilisateurService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var UtilisateurService = _classThis = /** @class */ (function () {
        function UtilisateurService_1(utilisateurRepository, enqueteRepo, reponseRepo) {
            this.utilisateurRepository = utilisateurRepository;
            this.enqueteRepo = enqueteRepo;
            this.reponseRepo = reponseRepo;
        }
        UtilisateurService_1.prototype.create = function (createUtilisateurDto) {
            return __awaiter(this, void 0, void 0, function () {
                var prenom, nom, email, mot_de_passe, bcrypt, mot_de_passe_hache, token, token_expiration, utilisateur, lienverification, creationemail, nodemailer, transporter, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prenom = createUtilisateurDto.prenom;
                            nom = createUtilisateurDto.nom;
                            email = createUtilisateurDto.email;
                            mot_de_passe = createUtilisateurDto.mot_de_passe;
                            if (!(prenom === null || prenom === void 0 ? void 0 : prenom.trim())) {
                                return [2 /*return*/, { erreur: 'Le prenom est obligatoire' }];
                            }
                            if (!(nom === null || nom === void 0 ? void 0 : nom.trim())) {
                                return [2 /*return*/, { erreur: 'Le nom est obligatoire' }];
                            }
                            if (!(email === null || email === void 0 ? void 0 : email.trim())) {
                                return [2 /*return*/, { erreur: "L'email est obligatoire" }];
                            }
                            if (!(mot_de_passe === null || mot_de_passe === void 0 ? void 0 : mot_de_passe.trim())) {
                                return [2 /*return*/, { erreur: 'Le mot de passe est obligatoire' }];
                            }
                            if (!email.includes('@')) {
                                return [2 /*return*/, { erreur: "L'email doit contenir @" }];
                            }
                            if (!email.includes('.')) {
                                return [2 /*return*/, { erreur: "L'email doit contenir ." }];
                            }
                            if (email.indexOf('@') == 0) {
                                return [2 /*return*/, { erreur: "L'email doit contenir des caractères avant @" }];
                            }
                            if (email.lastIndexOf('.') == email.length - 1) {
                                return [2 /*return*/, { erreur: "L'email doit contenir des caractères après ." }];
                            }
                            if (mot_de_passe.length < 8) {
                                return [2 /*return*/, { erreur: 'Le mot de passe doit contenir au moins 8 caractères' }];
                            }
                            if (!/[A-Z]/.test(mot_de_passe)) {
                                return [2 /*return*/, { erreur: 'Le mot de passe doit contenir au moins une majuscule' }];
                            }
                            if (!/[0-9]/.test(mot_de_passe)) {
                                return [2 /*return*/, { erreur: 'Le mot de passe doit contenir au moins un chiffre' }];
                            }
                            if (!/[@$!%*?&]/.test(mot_de_passe)) {
                                return [2 /*return*/, {
                                        erreur: 'Le mot de passe doit contenir au moins un caractère spécial (@$!%*?&)',
                                    }];
                            }
                            return [4 /*yield*/, this.utilisateurRepository.findOne({ where: { email: email } })];
                        case 1:
                            if (_a.sent()) {
                                return [2 /*return*/, { erreur: "L'email existe déjà" }];
                            }
                            bcrypt = require('bcrypt');
                            return [4 /*yield*/, bcrypt.hash(mot_de_passe, 10)];
                        case 2:
                            mot_de_passe_hache = _a.sent();
                            token = require('crypto').randomBytes(16).toString('hex');
                            token_expiration = new Date(Date.now() + 5 * 60 * 1000);
                            utilisateur = this.utilisateurRepository.create({
                                prenom: prenom,
                                nom: nom,
                                email: email,
                                mot_de_passe: mot_de_passe_hache,
                                code_verification: token,
                                token_expiration: token_expiration,
                                statut: status_enum_1.Status.INACTIF,
                            });
                            return [4 /*yield*/, this.utilisateurRepository.save(utilisateur)];
                        case 3:
                            _a.sent();
                            lienverification = "https://intactly-leal-beverley.ngrok-free.dev/utilisateur/verification?token=".concat(token);
                            creationemail = {
                                from: 'belliliachwek@gmail.com',
                                to: email,
                                subject: 'Vérification de votre compte',
                                html: "<p>Bonjour ".concat(prenom, ",</p>\n    <p>Veuillez cliquer sur le lien suivant pour v\u00E9rifier votre compte : <a href=\"").concat(lienverification, "\">V\u00E9rifier mon compte</a></p>\n    <p>Ce lien exprie dans 5 minutes.</p>\n    <p>Si vous n'avez pas cr\u00E9\u00E9 de compte, veuillez ignorer cet email.</p>"),
                            };
                            nodemailer = require('nodemailer');
                            transporter = nodemailer.createTransport({
                                service: 'gmail',
                                auth: {
                                    user: 'belliliachwek@gmail.com',
                                    pass: 'ujgu vylh uuiz yhzh',
                                },
                            });
                            _a.label = 4;
                        case 4:
                            _a.trys.push([4, 6, , 7]);
                            return [4 /*yield*/, transporter.sendMail(creationemail)];
                        case 5:
                            _a.sent();
                            return [3 /*break*/, 7];
                        case 6:
                            error_1 = _a.sent();
                            console.error("Erreur lors de l'envoi de l'email de vérification :", error_1);
                            return [3 /*break*/, 7];
                        case 7: return [2 /*return*/, { message: 'Utilisateur créé avec succès' }];
                    }
                });
            });
        };
        UtilisateurService_1.prototype.verificationToken = function (token) {
            return __awaiter(this, void 0, void 0, function () {
                var utilisateur;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.utilisateurRepository.findOne({
                                where: { code_verification: token },
                            })];
                        case 1:
                            utilisateur = _a.sent();
                            if (!utilisateur) {
                                return [2 /*return*/, { erreur: 'Token de vérification invalide' }];
                            }
                            if (!utilisateur.token_expiration ||
                                utilisateur.token_expiration < new Date()) {
                                return [2 /*return*/, { erreur: 'Token de vérification expiré' }];
                            }
                            utilisateur.est_verifie = true;
                            utilisateur.code_verification = null;
                            utilisateur.statut = status_enum_1.Status.ACTIF;
                            utilisateur.token_expiration = null;
                            return [4 /*yield*/, this.utilisateurRepository.save(utilisateur)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, { message: 'Compte vérifié avec succès' }];
                    }
                });
            });
        };
        UtilisateurService_1.prototype.getAllusers = function () {
            return this.utilisateurRepository.find();
        };
        UtilisateurService_1.prototype.FindUserById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.utilisateurRepository.findOne({ where: { id: id } })];
                });
            });
        };
        UtilisateurService_1.prototype.changeStatus = function (id, statut) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.FindUserById(id)];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                return [2 /*return*/, { erreur: 'Utilisateur inconnu' }];
                            }
                            user.statut = statut;
                            return [4 /*yield*/, this.utilisateurRepository.save(user)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, { message: "Statut modifi\u00E9 vers ".concat(statut), utilisateur: user }];
                    }
                });
            });
        };
        UtilisateurService_1.prototype.chnageRole = function (id, role) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.FindUserById(id)];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                return [2 /*return*/, {
                                        erreur: 'Utilisateur inconnu',
                                    }];
                            }
                            user.role = role;
                            return [4 /*yield*/, this.utilisateurRepository.save(user)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, { message: "Role modifi\u00E9 vers ".concat(role), utilisateur: user }];
                    }
                });
            });
        };
        UtilisateurService_1.prototype.searchUsers = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var qb;
                return __generator(this, function (_a) {
                    qb = this.utilisateurRepository.createQueryBuilder('user');
                    if (query) {
                        qb.where('user.prenom ILIKE :q', { q: "%".concat(query, "%") })
                            .orWhere('user.nom ILIKE :q', { q: "%".concat(query, "%") })
                            .orWhere('user.email ILIKE :q', { q: "%".concat(query, "%") })
                            .orWhere('user.role ILIKE :q', { q: "%".concat(query, "%") });
                    }
                    return [2 /*return*/, qb.getMany()];
                });
            });
        };
        UtilisateurService_1.prototype.update = function (id, updateUtilisateurDto) {
            return "This action updates a #".concat(id, " utilisateur");
        };
        UtilisateurService_1.prototype.remove = function (id) {
            return "This action removes a #".concat(id, " utilisateur");
        };
        UtilisateurService_1.prototype.findEnquetesByUser = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.enqueteRepo.find({
                            where: { user: { id: userId } },
                            order: { createAt: 'DESC' },
                        })];
                });
            });
        };
        UtilisateurService_1.prototype.findEnqueteAvecStatutBrouillonByUser = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.enqueteRepo.find({
                            where: { user: { id: userId }, statut: status_enum_2.StatusEnquete.Brouillon },
                            order: { createAt: 'DESC' },
                        })];
                });
            });
        };
        UtilisateurService_1.prototype.findEnqueteAvecStatutFermeByUser = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.enqueteRepo.find({
                            where: { user: { id: userId }, statut: status_enum_2.StatusEnquete.Fermee },
                            order: { createAt: 'DESC' },
                        })];
                });
            });
        };
        UtilisateurService_1.prototype.findEnqueteAvecStatutPublieeByUser = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.enqueteRepo.find({
                            where: { user: { id: userId }, statut: status_enum_2.StatusEnquete.Publiee },
                            order: { createAt: 'DESC' },
                        })];
                });
            });
        };
        UtilisateurService_1.prototype.findNumberEnquetesByUser = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.enqueteRepo.count({
                            where: { user: { id: userId } },
                        })];
                });
            });
        };
        UtilisateurService_1.prototype.findEnquetesByUserDetailles = function (userId, enqueteId) {
            return __awaiter(this, void 0, void 0, function () {
                var enquete;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.enqueteRepo.findOne({
                                where: {
                                    id: enqueteId,
                                    user: { id: userId },
                                },
                                relations: ['questions', 'questions.options'],
                                order: { createAt: 'DESC' },
                            })];
                        case 1:
                            enquete = _a.sent();
                            if (!enquete) {
                                throw new Error('Enquête non trouvée');
                            }
                            return [2 /*return*/, __assign(__assign({}, enquete), { nombreQuestions: enquete.questions ? enquete.questions.length : 0 })];
                    }
                });
            });
        };
        UtilisateurService_1.prototype.countallUsersRoleConnecte = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.utilisateurRepository.count({
                            where: {
                                role: role_enum_1.Role.USER_CONNECTE,
                            },
                        })];
                });
            });
        };
        UtilisateurService_1.prototype.countallUsersRoleConnecteNouveau = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.utilisateurRepository.count({
                            where: {
                                role: role_enum_1.Role.USER_CONNECTE,
                            },
                        })];
                });
            });
        };
        UtilisateurService_1.prototype.getAllUsersRoleConnecte = function () {
            return __awaiter(this, void 0, void 0, function () {
                var users;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.utilisateurRepository.query("\n    SELECT u.*, \n           MAX(r.\"dateReponse\") AS derniere_activite,\n           COUNT(r.id) FILTER (WHERE r.\"dateReponse\" IS NOT NULL) AS total_repondues,\n           COUNT(r.id) FILTER (WHERE r.\"dateReponse\" IS NULL) AS total_en_attente\n    FROM utilisateur u\n    LEFT JOIN reponse r ON r.utilisateur_id = u.id\n    WHERE u.role = 'ROLE_USER_CONNECTE'\n    GROUP BY u.id\n  ")];
                        case 1:
                            users = _a.sent();
                            return [2 /*return*/, {
                                    message: users.length
                                        ? 'voici liste des utilisateurs'
                                        : 'aucun utilisateur trouvée',
                                    data: users,
                                }];
                    }
                });
            });
        };
        //api pour transfert liste des des users connecte en excel
        UtilisateurService_1.prototype.exportUtilisateursConnecte = function () {
            return __awaiter(this, void 0, void 0, function () {
                var users, workbook, worksheet;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getAllUsersRoleConnecte()];
                        case 1:
                            users = (_a.sent()).data;
                            workbook = new ExcelJS.Workbook();
                            worksheet = workbook.addWorksheet('Users');
                            // Définition des colonnes
                            worksheet.columns = [
                                { header: 'Nom', key: 'nom', width: 20 },
                                { header: 'Prénom', key: 'prenom', width: 20 },
                                { header: 'Email', key: 'email', width: 30 },
                                { header: 'Statut', key: 'statut', width: 15 },
                                { header: 'Réponses', key: 'total_repondues', width: 15 },
                                { header: 'Dernière activité', key: 'derniere_activite', width: 25 },
                            ];
                            // Style pour l'entête
                            worksheet.getRow(1).eachCell(function (cell) {
                                cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
                                cell.fill = {
                                    type: 'pattern',
                                    pattern: 'solid',
                                    fgColor: { argb: 'FF6A0DAD' }, // violet purpre
                                };
                                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                                cell.border = {
                                    top: { style: 'thin' },
                                    left: { style: 'thin' },
                                    bottom: { style: 'thin' },
                                    right: { style: 'thin' },
                                };
                            });
                            // Ajouter les données
                            users.forEach(function (user) {
                                var _a;
                                worksheet.addRow({
                                    nom: user.nom,
                                    prenom: user.prenom,
                                    email: user.email,
                                    statut: user.est_verifie ? 'ACTIF' : 'INACTIF',
                                    total_repondues: (_a = user.total_repondues) !== null && _a !== void 0 ? _a : 0,
                                    derniere_activite: user.derniere_activite
                                        ? new Date(user.derniere_activite).toLocaleDateString()
                                        : '-',
                                });
                            });
                            // Style pour toutes les cellules (bordures + centrage)
                            worksheet.eachRow({ includeEmpty: false }, function (row, rowNumber) {
                                row.eachCell({ includeEmpty: true }, function (cell) {
                                    cell.border = {
                                        top: { style: 'thin' },
                                        left: { style: 'thin' },
                                        bottom: { style: 'thin' },
                                        right: { style: 'thin' },
                                    };
                                    if (rowNumber !== 1) {
                                        cell.alignment = { horizontal: 'center', vertical: 'middle' };
                                    }
                                });
                            });
                            // Ajustement width safe
                            worksheet.columns.forEach(function (col) {
                                var _a;
                                col.width = ((_a = col.width) !== null && _a !== void 0 ? _a : 15) * 1.2; // width safe
                            });
                            return [2 /*return*/, workbook];
                    }
                });
            });
        };
        //pour exporter en pdf 
        //api pour les nouvelles users
        UtilisateurService_1.prototype.getAllUsersNouveaux = function () {
            return __awaiter(this, void 0, void 0, function () {
                var deuxdernierJours;
                return __generator(this, function (_a) {
                    deuxdernierJours = new Date();
                    deuxdernierJours.setDate(deuxdernierJours.getDate() - 2);
                    return [2 /*return*/, this.utilisateurRepository.count({
                            where: {
                                role: role_enum_1.Role.USER_CONNECTE,
                                date_creation: (0, typeorm_1.MoreThan)(deuxdernierJours),
                            },
                        })];
                });
            });
        };
        //nombre de reponse par jour et par utilsateur
        UtilisateurService_1.prototype.nombreReponseMoyParJours = function (date) {
            return __awaiter(this, void 0, void 0, function () {
                var debut, fin, reponses, userMap, totalRep, totalUsers;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            debut = new Date(date);
                            debut.setHours(0, 0, 0, 0);
                            fin = new Date(date);
                            fin.setHours(23, 59, 59, 999);
                            return [4 /*yield*/, this.reponseRepo.find({
                                    where: { dateReponse: (0, typeorm_1.Between)(debut, fin) },
                                    relations: ['utilisateur'],
                                })];
                        case 1:
                            reponses = _a.sent();
                            if (!reponses || reponses.length === 0)
                                return [2 /*return*/, 0];
                            userMap = new Map();
                            reponses.forEach(function (r) {
                                var userId = r.utilisateur.id;
                                console.log(userId);
                                if (typeof userId === 'number' && !isNaN(userId)) {
                                    userMap.set(userId, (userMap.get(userId) || 0) + 1);
                                }
                            });
                            totalRep = reponses.length;
                            totalUsers = userMap.size;
                            return [2 /*return*/, totalUsers > 0 ? totalRep / totalUsers : 0];
                    }
                });
            });
        };
        UtilisateurService_1.prototype.exportPDF = function (users) {
            return __awaiter(this, void 0, void 0, function () {
                var doc, date, columns, rows, arrayBuffer;
                return __generator(this, function (_a) {
                    doc = new jspdf_1.default();
                    // Titre principal
                    doc.setFontSize(16);
                    doc.setTextColor(109, 16, 173); // violet
                    doc.text('Liste des utilisateurs', 14, 20);
                    date = new Date().toLocaleString();
                    doc.setFontSize(10);
                    doc.setTextColor(100);
                    doc.text("Export\u00E9 le : ".concat(date), 150, 20);
                    columns = ['Nom', 'Prénom', 'Email', 'Statut', 'Réponses', 'Dernière activité'];
                    rows = users.map(function (u) {
                        var _a;
                        return [
                            u.nom,
                            u.prenom,
                            u.email,
                            u.est_verifie ? 'ACTIF' : 'INACTIF',
                            (_a = u.total_repondues) !== null && _a !== void 0 ? _a : 0,
                            u.derniere_activite ? new Date(u.derniere_activite).toLocaleDateString() : '-',
                        ];
                    });
                    // Génération de la table
                    (0, jspdf_autotable_1.default)(doc, {
                        head: [columns],
                        body: rows,
                        startY: 30, // commencer après le titre
                        theme: 'striped', // lignes alternées
                        headStyles: {
                            fillColor: [109, 16, 173], // violet purpre
                            textColor: 255,
                            fontStyle: 'bold',
                        },
                        bodyStyles: {
                            fontSize: 10,
                            textColor: 50,
                            cellPadding: 4,
                        },
                        columnStyles: {
                            0: { cellWidth: 30 }, // Nom
                            1: { cellWidth: 30 }, // Prénom
                            2: { cellWidth: 50 }, // Email
                            3: { cellWidth: 20, halign: 'center' }, // Statut
                            4: { cellWidth: 20, halign: 'center' }, // Réponses
                            5: { cellWidth: 35 }, // Dernière activité
                        },
                        styles: { font: 'helvetica' },
                        margin: { left: 14, right: 14 },
                    });
                    arrayBuffer = doc.output('arraybuffer');
                    return [2 /*return*/, Buffer.from(arrayBuffer)]; // ← Conversion correcte
                });
            });
        };
        UtilisateurService_1.prototype.exportCSV = function () {
            return __awaiter(this, void 0, void 0, function () {
                var utilisateurs, fields, data, parser;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getAllUsersRoleConnecte()];
                        case 1:
                            utilisateurs = (_a.sent()).data;
                            fields = ['nom', 'prenom', 'email', 'statut', 'total_repondues', 'derniere_activite'];
                            data = utilisateurs.map(function (u) {
                                var _a;
                                return ({
                                    nom: u.nom,
                                    prenom: u.prenom,
                                    email: u.email,
                                    statut: u.est_verifie ? 'ACTIF' : 'INACTIF',
                                    total_repondues: (_a = u.total_repondues) !== null && _a !== void 0 ? _a : 0,
                                    derniere_activite: u.derniere_activite ? new Date(u.derniere_activite).toLocaleDateString() : '-',
                                });
                            });
                            parser = new json2csv_1.Parser({ fields: fields });
                            return [2 /*return*/, parser.parse(data)];
                    }
                });
            });
        };
        UtilisateurService_1.prototype.consulterProfil = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var utilisateur;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.utilisateurRepository.findOne({ where: { id: userId } })];
                        case 1:
                            utilisateur = _a.sent();
                            if (!utilisateur) {
                                return [2 /*return*/, {
                                        erreur: "user pas connecté"
                                    }];
                            }
                            return [2 /*return*/, {
                                    message: "Voici les détails de votre profil",
                                    profil: utilisateur
                                }];
                    }
                });
            });
        };
        UtilisateurService_1.prototype.modifierProfil = function (userId, userModifier) {
            return __awaiter(this, void 0, void 0, function () {
                var user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.utilisateurRepository.findOne({ where: { id: userId } })];
                        case 1:
                            user = _a.sent();
                            if (!user) {
                                return [2 /*return*/, {
                                        erreur: "Utilisateur pas trouvé"
                                    }];
                            }
                            user.prenom = userModifier.prenom;
                            user.nom = userModifier.nom;
                            user.email = userModifier.email;
                            user.telephone = userModifier.telephone;
                            user.photo_profil = userModifier.photo_profil;
                            user.mot_de_passe = userModifier.mot_de_passe;
                            user.date_modification = new Date();
                            /* this.utilisateurRepository.update({id:userId},{
                               prenom:user.prenom,
                               nom:user.nom,
                               email:user.email,
                               telephone:user.telephone,
                               photo_profil:user.photo_profil,
                               mot_de_passe:user.mot_de_passe
                             })*/
                            this.utilisateurRepository.save(user);
                            return [2 /*return*/, {
                                    message: "Profil modifié avec succès"
                                }];
                    }
                });
            });
        };
        UtilisateurService_1.prototype.countAllUsers = function () {
            return __awaiter(this, void 0, void 0, function () {
                var nombreUsersTotal;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.utilisateurRepository.count()];
                        case 1:
                            nombreUsersTotal = _a.sent();
                            return [2 /*return*/, { nombreUsersTotal: nombreUsersTotal }];
                    }
                });
            });
        };
        UtilisateurService_1.prototype.countAllUsersActifs = function () {
            return __awaiter(this, void 0, void 0, function () {
                var nombresUsersActifs;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.utilisateurRepository.count({
                                where: {
                                    statut: status_enum_1.Status.ACTIF
                                }
                            })];
                        case 1:
                            nombresUsersActifs = _a.sent();
                            return [2 /*return*/, {
                                    NombreUsersActifs: nombresUsersActifs
                                }];
                    }
                });
            });
        };
        UtilisateurService_1.prototype.countAllUsersInActifs = function () {
            return __awaiter(this, void 0, void 0, function () {
                var nombresUsersInActifs;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.utilisateurRepository.count({
                                where: {
                                    statut: status_enum_1.Status.INACTIF
                                }
                            })];
                        case 1:
                            nombresUsersInActifs = _a.sent();
                            return [2 /*return*/, {
                                    NombreUsersInActifs: nombresUsersInActifs
                                }];
                    }
                });
            });
        };
        UtilisateurService_1.prototype.getNomreAdmins = function () {
            return __awaiter(this, void 0, void 0, function () {
                var nombreAdmins;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.utilisateurRepository.count({
                                where: {
                                    role: role_enum_1.Role.ADMIN
                                }
                            })];
                        case 1:
                            nombreAdmins = _a.sent();
                            return [2 /*return*/, {
                                    NombreAdmins: nombreAdmins
                                }];
                    }
                });
            });
        };
        return UtilisateurService_1;
    }());
    __setFunctionName(_classThis, "UtilisateurService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UtilisateurService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UtilisateurService = _classThis;
}();
exports.UtilisateurService = UtilisateurService;
