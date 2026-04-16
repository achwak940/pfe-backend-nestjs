"use strict";
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
exports.EnqueteService = void 0;
var common_1 = require("@nestjs/common");
var enquete_entity_1 = require("./entities/enquete.entity");
var status_enum_1 = require("./entities/status.enum");
var TypeParticipation_enum_1 = require("./entities/TypeParticipation.enum");
var question_entity_1 = require("../question/entities/question.entity");
var EnqueteService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var EnqueteService = _classThis = /** @class */ (function () {
        function EnqueteService_1(enqueteRepo, questionRepo) {
            this.enqueteRepo = enqueteRepo;
            this.questionRepo = questionRepo;
        }
        EnqueteService_1.prototype.create = function (createEnqueteDto) {
            return __awaiter(this, void 0, void 0, function () {
                var insertResult, savedEnquete, enqueteId, _i, _a, q, questionInsert, questionId, finalEnquete, error_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            // Validation
                            if (!createEnqueteDto.titre || createEnqueteDto.titre.trim() === '') {
                                throw new common_1.BadRequestException('Titre est obligatoire');
                            }
                            if (createEnqueteDto.description && createEnqueteDto.description.length < 10) {
                                throw new common_1.BadRequestException('Description doit avoir au moins 10 caractères');
                            }
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 11, , 12]);
                            console.log('Données reçues:', JSON.stringify(createEnqueteDto, null, 2));
                            return [4 /*yield*/, this.enqueteRepo
                                    .createQueryBuilder()
                                    .insert()
                                    .into(enquete_entity_1.Enquete)
                                    .values({
                                    titre: createEnqueteDto.titre,
                                    description: createEnqueteDto.description,
                                    dateFin: createEnqueteDto.dateFin,
                                    statut: createEnqueteDto.statut || status_enum_1.StatusEnquete.Brouillon,
                                    typeParticipation: TypeParticipation_enum_1.TypeParticipation.connecte,
                                    createAt: createEnqueteDto.createAt || new Date(),
                                    user: { id: createEnqueteDto.userId }
                                })
                                    .returning('*')
                                    .execute()];
                        case 2:
                            insertResult = _b.sent();
                            savedEnquete = insertResult.raw[0];
                            enqueteId = savedEnquete.id;
                            console.log('Enquête créée avec ID:', enqueteId);
                            if (!(createEnqueteDto.questions && createEnqueteDto.questions.length > 0)) return [3 /*break*/, 9];
                            console.log("".concat(createEnqueteDto.questions.length, " questions \u00E0 traiter"));
                            _i = 0, _a = createEnqueteDto.questions;
                            _b.label = 3;
                        case 3:
                            if (!(_i < _a.length)) return [3 /*break*/, 9];
                            q = _a[_i];
                            if (!q.id) return [3 /*break*/, 5];
                            // Question existante
                            return [4 /*yield*/, this.enqueteRepo
                                    .createQueryBuilder()
                                    .relation(enquete_entity_1.Enquete, 'questions')
                                    .of(enqueteId)
                                    .add(q.id)];
                        case 4:
                            // Question existante
                            _b.sent();
                            console.log("Question existante ID: ".concat(q.id, " associ\u00E9e"));
                            return [3 /*break*/, 8];
                        case 5: return [4 /*yield*/, this.questionRepo
                                .createQueryBuilder()
                                .insert()
                                .into(question_entity_1.Question)
                                .values({
                                texte: q.texte,
                                type: q.type,
                                options: q.options || []
                            })
                                .returning('id')
                                .execute()];
                        case 6:
                            questionInsert = _b.sent();
                            questionId = questionInsert.raw[0].id;
                            return [4 /*yield*/, this.enqueteRepo
                                    .createQueryBuilder()
                                    .relation(enquete_entity_1.Enquete, 'questions')
                                    .of(enqueteId)
                                    .add(questionId)];
                        case 7:
                            _b.sent();
                            console.log("Nouvelle question cr\u00E9\u00E9e avec ID: ".concat(questionId, " et associ\u00E9e"));
                            _b.label = 8;
                        case 8:
                            _i++;
                            return [3 /*break*/, 3];
                        case 9: return [4 /*yield*/, this.enqueteRepo.findOne({
                                where: { id: enqueteId },
                                relations: ['user', 'questions']
                            })];
                        case 10:
                            finalEnquete = _b.sent();
                            return [2 /*return*/, {
                                    message: 'Enquête créée avec succès',
                                    data: finalEnquete
                                }];
                        case 11:
                            error_1 = _b.sent();
                            console.error('Erreur détaillée:', error_1);
                            throw new common_1.BadRequestException("Erreur: ".concat(error_1.message));
                        case 12: return [2 /*return*/];
                    }
                });
            });
        };
        EnqueteService_1.prototype.findAll = function () {
            return __awaiter(this, void 0, void 0, function () {
                var listeEnquettes;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.enqueteRepo.find(({
                                order: {
                                    createAt: 'DESC'
                                }
                            }))];
                        case 1:
                            listeEnquettes = _a.sent();
                            if (listeEnquettes.length === 0) {
                                return [2 /*return*/, {
                                        message: "aucun enquete trouve"
                                    }];
                            }
                            return [2 /*return*/, listeEnquettes];
                    }
                });
            });
        };
        EnqueteService_1.prototype.findEnqueteByid = function (id) {
            return this.enqueteRepo.findOne({
                where: { id: id }
            });
        };
        //
        EnqueteService_1.prototype.update = function (id, updateEnqueteDto) {
            return __awaiter(this, void 0, void 0, function () {
                var enquete, updateEnquete;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findEnqueteByid(id)];
                        case 1:
                            enquete = _a.sent();
                            if (!enquete) {
                                throw new common_1.NotFoundException("Enquete avec id ".concat(id, " non trouv\u00E9e"));
                            }
                            if (updateEnqueteDto.description && updateEnqueteDto.description.length < 10) {
                                throw new common_1.BadRequestException("Description doit avoir au moins 10 caractères");
                            }
                            if (updateEnqueteDto.userId) {
                                enquete.user = { id: updateEnqueteDto.userId };
                            }
                            Object.assign(enquete, updateEnqueteDto);
                            //Empêcher que le champ adminId soit sauvegardé ou modifié par l’utilisateur via update.
                            delete enquete.adminId;
                            return [4 /*yield*/, this.enqueteRepo.save(enquete)];
                        case 2:
                            updateEnquete = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Enquête mise à jour avec succés',
                                    data: updateEnquete
                                }];
                    }
                });
            });
        };
        EnqueteService_1.prototype.remove = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var enquete;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findEnqueteByid(id)];
                        case 1:
                            enquete = _a.sent();
                            if (!enquete) {
                                throw new common_1.NotFoundException("Enquete avec id ".concat(id, " non trouv\u00E9e"));
                            }
                            this.enqueteRepo.delete(id);
                            return [2 /*return*/, {
                                    message: 'Enquête supprimée  avec succés',
                                    data: enquete
                                }];
                    }
                });
            });
        };
        //pour return les enquette avec leur utilisateur
        EnqueteService_1.prototype.findByUser = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.enqueteRepo.find({
                            where: { user: { id: userId } },
                            relations: ['user'],
                            order: { createAt: 'DESC' }
                        })];
                });
            });
        };
        EnqueteService_1.prototype.changeStatut = function (id, newStatut) {
            return __awaiter(this, void 0, void 0, function () {
                var enquete;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.enqueteRepo.findOneBy({ id: id })];
                        case 1:
                            enquete = _a.sent();
                            if (!enquete) {
                                return [2 /*return*/, { error: "Enquete non trouvée" }];
                            }
                            enquete.statut = newStatut;
                            return [2 /*return*/, this.enqueteRepo.save(enquete)];
                    }
                });
            });
        };
        EnqueteService_1.prototype.getAllenqueteEnBrullion = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.enqueteRepo.find({
                            where: { statut: status_enum_1.StatusEnquete.Brouillon }
                        })];
                });
            });
        };
        EnqueteService_1.prototype.getAllEnqueteFerme = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.enqueteRepo.find({
                            where: { statut: status_enum_1.StatusEnquete.Fermee }
                        })];
                });
            });
        };
        EnqueteService_1.prototype.getAllEnquetePubliee = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.enqueteRepo.find({
                            where: { statut: status_enum_1.StatusEnquete.Publiee }
                        })];
                });
            });
        };
        EnqueteService_1.prototype.getAllEnqueteArchive = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.enqueteRepo.find({
                            where: { statut: status_enum_1.StatusEnquete.archive }
                        })];
                });
            });
        };
        EnqueteService_1.prototype.changeTypedeParticipation = function (id, type) {
            return __awaiter(this, void 0, void 0, function () {
                var rechEnquete, updateEnquete;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findEnqueteByid(id)];
                        case 1:
                            rechEnquete = _a.sent();
                            if (!rechEnquete) {
                                throw new common_1.NotFoundException("Enquete avec id ".concat(id, " non trouv\u00E9e"));
                            }
                            rechEnquete.typeParticipation = type;
                            return [4 /*yield*/, this.enqueteRepo.save(rechEnquete)];
                        case 2:
                            updateEnquete = _a.sent();
                            return [2 /*return*/, {
                                    message: "Type de participation changé avec succès",
                                    data: updateEnquete,
                                }];
                    }
                });
            });
        };
        EnqueteService_1.prototype.getEnqueteByDetailesQuestions = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var enquete;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.enqueteRepo.findOne({
                                where: { id: id },
                                relations: ['questions', 'questions.options'],
                            })];
                        case 1:
                            enquete = _a.sent();
                            if (!enquete) {
                                return [2 /*return*/, {
                                        message: "Enquête non trouvée",
                                        data: null
                                    }];
                            }
                            return [2 /*return*/, {
                                    message: "Enquête trouvée avec succès",
                                    data: enquete
                                }];
                    }
                });
            });
        };
        EnqueteService_1.prototype.getNombreParticipantByAdmin = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var resultat;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.enqueteRepo.query("select count(distinct r.utilisateur_id) as totalusers\n    from reponse r \n    join enquete e  on r.enquete_id=e.id\n    where e.\"userId\" =$1\n    ", [userId])];
                        case 1:
                            resultat = _a.sent();
                            return [2 /*return*/, resultat[0]];
                    }
                });
            });
        };
        EnqueteService_1.prototype.getTauxReponseByAdmin = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!userId || isNaN(userId)) {
                                throw new common_1.BadRequestException('UserId invalide');
                            }
                            return [4 /*yield*/, this.enqueteRepo.query("\n    SELECT \n      ROUND(\n        (COUNT(DISTINCT r.utilisateur_id)::decimal / \n         NULLIF((SELECT COUNT(*) \n                  FROM utilisateur u \n                  WHERE u.role='ROLE_USER_CONNECTE' OR u.role='ROLE_USER_ANONYME'),0)\n        ) * 100, \n        2\n      ) AS taux_reponse\n    FROM enquete e\n    LEFT JOIN reponse r ON r.enquete_id = e.id\n    WHERE e.\"userId\" = $1\n  ", [userId])];
                        case 1:
                            result = _c.sent();
                            return [2 /*return*/, (_b = (_a = result[0]) === null || _a === void 0 ? void 0 : _a.taux_reponse) !== null && _b !== void 0 ? _b : 0]; // retourne juste un nombre
                    }
                });
            });
        };
        // Ajouter dans la classe EnqueteService
        EnqueteService_1.prototype.getEnqueteStats = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var enquete, reponsesCount, tauxReponse, tempsMoyen;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0: return [4 /*yield*/, this.enqueteRepo.findOne({
                                where: { id: id },
                                relations: ['questions', 'questions.options']
                            })];
                        case 1:
                            enquete = _e.sent();
                            if (!enquete) {
                                throw new common_1.NotFoundException("Enqu\u00EAte avec id ".concat(id, " non trouv\u00E9e"));
                            }
                            return [4 /*yield*/, this.enqueteRepo.query("SELECT COUNT(DISTINCT r.utilisateur_id) as total\n     FROM reponse r\n     WHERE r.enquete_id = $1", [id])];
                        case 2:
                            reponsesCount = _e.sent();
                            tauxReponse = ((_a = reponsesCount[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
                            return [4 /*yield*/, this.enqueteRepo.query("SELECT AVG(EXTRACT(EPOCH FROM (r.date_reponse - e.createAt))/60) as avg_time\n     FROM reponse r\n     JOIN enquete e ON r.enquete_id = e.id\n     WHERE r.enquete_id = $1", [id])];
                        case 3:
                            tempsMoyen = _e.sent();
                            return [2 /*return*/, {
                                    totalReponses: ((_b = reponsesCount[0]) === null || _b === void 0 ? void 0 : _b.total) || 0,
                                    tauxReponse: tauxReponse,
                                    tempsMoyenReponse: Math.round(((_c = tempsMoyen[0]) === null || _c === void 0 ? void 0 : _c.avg_time) || 0),
                                    questionsStats: ((_d = enquete.questions) === null || _d === void 0 ? void 0 : _d.map(function (q) { return ({
                                        questionId: q.id,
                                        questionText: q.texte,
                                        reponsesCount: Math.floor(Math.random() * 50) // À remplacer par une vraie requête
                                    }); })) || []
                                }];
                    }
                });
            });
        };
        EnqueteService_1.prototype.getEvolutionReponses = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var evolution;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.enqueteRepo.query("SELECT \n       DATE(r.date_reponse) as date,\n       COUNT(DISTINCT r.utilisateur_id) as count\n     FROM reponse r\n     WHERE r.enquete_id = $1\n     GROUP BY DATE(r.date_reponse)\n     ORDER BY date ASC", [id])];
                        case 1:
                            evolution = _a.sent();
                            return [2 /*return*/, evolution];
                    }
                });
            });
        };
        EnqueteService_1.prototype.getReponsesByQuestion = function (enqueteId, questionId) {
            return __awaiter(this, void 0, void 0, function () {
                var question, reponses, totalReponses, distribution;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.questionRepo.findOne({
                                where: { id: questionId },
                                relations: ['options']
                            })];
                        case 1:
                            question = _b.sent();
                            if (!question) {
                                throw new common_1.NotFoundException("Question avec id ".concat(questionId, " non trouv\u00E9e"));
                            }
                            return [4 /*yield*/, this.enqueteRepo.query("SELECT \n       r.reponse,\n       COUNT(*) as count\n     FROM reponse r\n     WHERE r.enquete_id = $1 AND r.question_id = $2\n     GROUP BY r.reponse", [enqueteId, questionId])];
                        case 2:
                            reponses = _b.sent();
                            totalReponses = reponses.reduce(function (sum, r) { return sum + parseInt(r.count); }, 0);
                            distribution = ((_a = question.options) === null || _a === void 0 ? void 0 : _a.map(function (opt) {
                                var reponse = reponses.find(function (r) { return r.reponse === opt.texte; });
                                var count = reponse ? parseInt(reponse.count) : 0;
                                return {
                                    label: opt.texte,
                                    count: count,
                                    percentage: totalReponses > 0 ? (count / totalReponses) * 100 : 0
                                };
                            })) || [];
                            return [2 /*return*/, {
                                    totalReponses: totalReponses,
                                    tauxReponse: totalReponses > 0 ? 100 : 0,
                                    distribution: distribution,
                                    moyenne: question.type === 'rating' ? this.calculateAverageRating(reponses) : null
                                }];
                    }
                });
            });
        };
        EnqueteService_1.prototype.calculateAverageRating = function (reponses) {
            if (reponses.length === 0)
                return 0;
            var sum = 0;
            var count = 0;
            for (var _i = 0, reponses_1 = reponses; _i < reponses_1.length; _i++) {
                var r = reponses_1[_i];
                var value = parseInt(r.reponse);
                if (!isNaN(value)) {
                    sum += value * parseInt(r.count);
                    count += parseInt(r.count);
                }
            }
            return count > 0 ? sum / count : 0;
        };
        EnqueteService_1.prototype.generateQRCode = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var enquete, url, QRCode, qrCodeBuffer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.findEnqueteByid(id)];
                        case 1:
                            enquete = _a.sent();
                            if (!enquete) {
                                throw new common_1.NotFoundException("Enqu\u00EAte avec id ".concat(id, " non trouv\u00E9e"));
                            }
                            url = "".concat(process.env.FRONTEND_URL || 'http://localhost:4200', "/repondre/").concat(id);
                            QRCode = require('qrcode');
                            return [4 /*yield*/, QRCode.toBuffer(url)];
                        case 2:
                            qrCodeBuffer = _a.sent();
                            return [2 /*return*/, qrCodeBuffer];
                    }
                });
            });
        };
        return EnqueteService_1;
    }());
    __setFunctionName(_classThis, "EnqueteService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EnqueteService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EnqueteService = _classThis;
}();
exports.EnqueteService = EnqueteService;
