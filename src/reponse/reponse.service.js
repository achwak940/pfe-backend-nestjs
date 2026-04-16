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
exports.ReponseService = void 0;
// reponse.service.ts - Version corrigée complète
var common_1 = require("@nestjs/common");
var ExcelJS = require("exceljs");
var jspdf_1 = require("jspdf");
var jspdf_autotable_1 = require("jspdf-autotable");
var json2csv_1 = require("json2csv");
var status_enum_1 = require("../enquete/entities/status.enum");
var ReponseService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ReponseService = _classThis = /** @class */ (function () {
        function ReponseService_1(ReponseRepo, enqueteRepository) {
            this.ReponseRepo = ReponseRepo;
            this.enqueteRepository = enqueteRepository;
        }
        ReponseService_1.prototype.create = function (createReponseDto) {
            return 'This action adds a new reponse';
        };
        ReponseService_1.prototype.findAll = function () {
            return "This action returns all reponse";
        };
        ReponseService_1.prototype.findOne = function (id) {
            return "This action returns a #".concat(id, " reponse");
        };
        ReponseService_1.prototype.update = function (id, updateReponseDto) {
            return "This action updates a #".concat(id, " reponse");
        };
        ReponseService_1.prototype.remove = function (id) {
            return "This action removes a #".concat(id, " reponse");
        };
        ReponseService_1.prototype.getReponsesByAdmin = function (adminId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.enqueteRepository.find({
                                where: { user: { id: adminId } },
                                relations: ['reponses', 'reponses.utilisateur', 'reponses.question'],
                            })];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        ReponseService_1.prototype.getallReponses = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var listResponses;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.ReponseRepo.query("\n      SELECT DISTINCT ON (u.id)\n        u.id AS user_id,\n        u.nom,\n        u.prenom,\n        u.email,\n        u.photo_profil,\n        u.date_creation,\n        r.id AS reponse_id,\n        r.\"reponseTexte\",\n        r.\"dateReponse\",\n        r.\"enquete_id\",\n        e.titre,\n        e.statut,\n        e.\"dateFin\"\n\n      FROM \"reponse\" r\n      JOIN \"utilisateur\" u ON u.id = r.utilisateur_id\n      JOIN \"enquete\" e ON e.id = r.\"enquete_id\"\n      WHERE r.\"reponseTexte\" IS NOT NULL\n        AND TRIM(r.\"reponseTexte\") <> ''\n        AND e.\"userId\" = $1 \n\n      ORDER BY u.id, LENGTH(r.\"reponseTexte\") DESC; \n      ", [userId])];
                        case 1:
                            listResponses = _a.sent();
                            if (listResponses.length === 0) {
                                return [2 /*return*/, {
                                        msg: 'Aucune réponse trouvée',
                                        data: [],
                                    }];
                            }
                            return [2 /*return*/, {
                                    msg: 'Voici la réponse la plus longue par utilisateur',
                                    data: listResponses,
                                }];
                    }
                });
            });
        };
        ReponseService_1.prototype.countAllReponses = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var enquetes, totalReponses, _i, enquetes_1, enquete;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.getReponsesByAdmin(userId)];
                        case 1:
                            enquetes = _b.sent();
                            totalReponses = 0;
                            for (_i = 0, enquetes_1 = enquetes; _i < enquetes_1.length; _i++) {
                                enquete = enquetes_1[_i];
                                totalReponses += ((_a = enquete.reponses) === null || _a === void 0 ? void 0 : _a.length) || 0;
                            }
                            return [2 /*return*/, {
                                    totalReponses: totalReponses,
                                    nombreEnquetes: enquetes.length,
                                }];
                    }
                });
            });
        };
        ReponseService_1.prototype.getAllReponsesDetail = function (reponseId) {
            return __awaiter(this, void 0, void 0, function () {
                var reponses, mapUser, _i, reponses_1, r, grouped;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.ReponseRepo.query("\n      SELECT\n        r.id AS reponse_id,\n        r.\"reponseTexte\",\n        r.\"dateReponse\",\n        r.utilisateur_id,\n        r.question_id,\n        r.enquete_id,\n        u.nom,\n        u.prenom,\n        u.email,\n        u.photo_profil,\n        u.date_creation,\n        q.texte AS question,\n        q.type AS type,\n        e.titre AS titre_enquete,\n        e.statut\n      FROM \"reponse\" r\n      JOIN \"utilisateur\" u ON u.id = r.utilisateur_id\n      JOIN \"question\" q ON q.id = r.question_id\n      JOIN \"enquete\" e ON e.id = r.enquete_id\n      WHERE r.utilisateur_id = (\n        SELECT utilisateur_id FROM \"reponse\" WHERE id = $1\n      )\n        AND r.enquete_id = (\n        SELECT enquete_id FROM \"reponse\" WHERE id = $1\n      )\n      ORDER BY r.\"dateReponse\" ASC\n      ", [reponseId])];
                        case 1:
                            reponses = _b.sent();
                            if (!reponses.length) {
                                return [2 /*return*/, { msg: 'Aucune réponse trouvée', data: [] }];
                            }
                            mapUser = new Map();
                            for (_i = 0, reponses_1 = reponses; _i < reponses_1.length; _i++) {
                                r = reponses_1[_i];
                                if (!mapUser.has(r.utilisateur_id)) {
                                    mapUser.set(r.utilisateur_id, {
                                        user_id: r.utilisateur_id,
                                        nom: r.nom,
                                        prenom: r.prenom,
                                        email: r.email,
                                        photo_profil: r.photo_profil,
                                        date_creation: r.date_creation,
                                        titre_enquete: r.titre_enquete,
                                        statut: r.statut,
                                        reponses: [],
                                    });
                                }
                                (_a = mapUser.get(r.utilisateur_id)) === null || _a === void 0 ? void 0 : _a.reponses.push({
                                    question: r.question,
                                    reponse: r.reponseTexte,
                                    type: r.type,
                                });
                            }
                            grouped = Array.from(mapUser.values());
                            return [2 /*return*/, {
                                    msg: 'Voici toutes les réponses par utilisateur avec détails',
                                    data: grouped,
                                }];
                    }
                });
            });
        };
        ReponseService_1.prototype.getStatsParEnquete = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var enquetes, stats;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.enqueteRepository.find({
                                where: { user: { id: userId } },
                                relations: ['reponses', 'questions'],
                            })];
                        case 1:
                            enquetes = _a.sent();
                            stats = enquetes.map(function (enquete) {
                                var _a, _b, _c, _d;
                                return ({
                                    id: enquete.id,
                                    titre: enquete.titre,
                                    statut: enquete.statut,
                                    dateFin: enquete.dateFin,
                                    totalReponses: ((_a = enquete.reponses) === null || _a === void 0 ? void 0 : _a.length) || 0,
                                    totalQuestions: ((_b = enquete.questions) === null || _b === void 0 ? void 0 : _b.length) || 0,
                                    tauxCompletude: ((_c = enquete.reponses) === null || _c === void 0 ? void 0 : _c.length) > 0
                                        ? Math.round((enquete.reponses.length / (((_d = enquete.questions) === null || _d === void 0 ? void 0 : _d.length) || 1)) *
                                            100)
                                        : 0,
                                });
                            });
                            return [2 /*return*/, stats];
                    }
                });
            });
        };
        ReponseService_1.prototype.getTopUtilisateurs = function (userId_1) {
            return __awaiter(this, arguments, void 0, function (userId, limit) {
                var topUsers;
                if (limit === void 0) { limit = 5; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.ReponseRepo.query("\n      SELECT \n        u.id,\n        u.nom,\n        u.prenom,\n        u.email,\n        COUNT(r.id) as nombre_reponses\n      FROM \"utilisateur\" u\n      JOIN \"reponse\" r ON u.id = r.utilisateur_id\n      JOIN \"enquete\" e ON e.id = r.enquete_id\n      WHERE e.\"userId\" = $1\n      GROUP BY u.id, u.nom, u.prenom, u.email\n      ORDER BY nombre_reponses DESC\n      LIMIT $2\n      ", [userId, limit])];
                        case 1:
                            topUsers = _a.sent();
                            return [2 /*return*/, topUsers];
                    }
                });
            });
        };
        ReponseService_1.prototype.getTauxCompletionGlobal = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var result, repondants, total, taux;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, this.ReponseRepo.query("\n      SELECT \n        COUNT(DISTINCT r.utilisateur_id) as repondants,\n        COUNT(DISTINCT u.id) as total_utilisateurs\n      FROM \"enquete\" e\n      LEFT JOIN \"reponse\" r ON e.id = r.enquete_id\n      CROSS JOIN (\n        SELECT DISTINCT u.id \n        FROM \"utilisateur\" u\n        WHERE u.role IN ('ROLE_USER_CONNECTE', 'ROLE_USER_ANONYME')\n      ) u\n      WHERE e.\"userId\" = $1\n      ", [userId])];
                        case 1:
                            result = _c.sent();
                            repondants = parseInt((_a = result[0]) === null || _a === void 0 ? void 0 : _a.repondants) || 0;
                            total = parseInt((_b = result[0]) === null || _b === void 0 ? void 0 : _b.total_utilisateurs) || 1;
                            taux = Math.round((repondants / total) * 100);
                            return [2 /*return*/, { taux: taux, repondants: repondants, total: total }];
                    }
                });
            });
        };
        ReponseService_1.prototype.getParticipationParPeriode = function (userId_1) {
            return __awaiter(this, arguments, void 0, function (userId, periode) {
                var groupBy, dateFormat, participation;
                if (periode === void 0) { periode = 'semaine'; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            groupBy = '';
                            dateFormat = '';
                            switch (periode) {
                                case 'semaine':
                                    groupBy = 'EXTRACT(DOW FROM r."dateReponse")';
                                    dateFormat = 'DAY';
                                    break;
                                case 'mois':
                                    groupBy = 'EXTRACT(DAY FROM r."dateReponse")';
                                    dateFormat = 'DAY';
                                    break;
                                default:
                                    groupBy = 'EXTRACT(DOW FROM r."dateReponse")';
                                    dateFormat = 'DAY';
                            }
                            return [4 /*yield*/, this.ReponseRepo.query("\n      SELECT \n        ".concat(groupBy, " as periode,\n        COUNT(*) as nombre\n      FROM \"reponse\" r\n      JOIN \"enquete\" e ON e.id = r.enquete_id\n      WHERE e.\"userId\" = $1\n      GROUP BY ").concat(groupBy, "\n      ORDER BY periode\n      "), [userId])];
                        case 1:
                            participation = _a.sent();
                            return [2 /*return*/, participation];
                    }
                });
            });
        };
        // Nouvelle méthode pour l'évolution des réponses par période
        ReponseService_1.prototype.getEvolutionReponses = function (userId_1) {
            return __awaiter(this, arguments, void 0, function (userId, periode) {
                var dateCondition, groupBy, now, evolution, tauxResult;
                if (periode === void 0) { periode = 'week'; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            dateCondition = '';
                            groupBy = '';
                            now = new Date();
                            switch (periode) {
                                case 'today':
                                    dateCondition = "r.\"dateReponse\" >= CURRENT_DATE";
                                    groupBy = "EXTRACT(HOUR FROM r.\"dateReponse\")";
                                    break;
                                case 'week':
                                    dateCondition = "r.\"dateReponse\" >= CURRENT_DATE - INTERVAL '7 days'";
                                    groupBy = "EXTRACT(DOW FROM r.\"dateReponse\")";
                                    break;
                                case 'month':
                                    dateCondition = "r.\"dateReponse\" >= CURRENT_DATE - INTERVAL '30 days'";
                                    groupBy = "EXTRACT(DAY FROM r.\"dateReponse\")";
                                    break;
                                case 'year':
                                    dateCondition = "r.\"dateReponse\" >= CURRENT_DATE - INTERVAL '365 days'";
                                    groupBy = "EXTRACT(MONTH FROM r.\"dateReponse\")";
                                    break;
                                default:
                                    dateCondition = "r.\"dateReponse\" >= CURRENT_DATE - INTERVAL '7 days'";
                                    groupBy = "EXTRACT(DOW FROM r.\"dateReponse\")";
                            }
                            return [4 /*yield*/, this.ReponseRepo.query("\n      SELECT \n        ".concat(groupBy, " as periode,\n        COUNT(*) as nombre,\n        DATE_TRUNC('day', r.\"dateReponse\") as date_reponse\n      FROM \"reponse\" r\n      JOIN \"enquete\" e ON e.id = r.enquete_id\n      WHERE e.\"userId\" = $1 AND ").concat(dateCondition, "\n      GROUP BY ").concat(groupBy, ", DATE_TRUNC('day', r.\"dateReponse\")\n      ORDER BY periode\n      "), [userId])];
                        case 1:
                            evolution = _a.sent();
                            return [4 /*yield*/, this.getTauxCompletionGlobal(userId)];
                        case 2:
                            tauxResult = _a.sent();
                            return [2 /*return*/, {
                                    evolution: evolution,
                                    totalReponses: evolution.reduce(function (sum, item) { return sum + parseInt(item.nombre); }, 0),
                                    tauxReponse: tauxResult.taux,
                                }];
                    }
                });
            });
        };
        // Nouvelle méthode pour les statistiques des enquêtes par statut
        ReponseService_1.prototype.getSurveyStatusStats = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var enquetes, total, actives, brouillons, terminees;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.enqueteRepository.find({
                                where: { user: { id: userId } },
                            })];
                        case 1:
                            enquetes = _a.sent();
                            total = enquetes.length;
                            actives = enquetes.filter(function (e) { return e.statut === status_enum_1.StatusEnquete.archive; }).length;
                            brouillons = enquetes.filter(function (e) { return e.statut === status_enum_1.StatusEnquete.Brouillon; }).length;
                            terminees = enquetes.filter(function (e) { return e.statut === status_enum_1.StatusEnquete.Terminée; }).length;
                            return [2 /*return*/, {
                                    actives: total > 0 ? Math.round((actives / total) * 100) : 0,
                                    brouillons: total > 0 ? Math.round((brouillons / total) * 100) : 0,
                                    terminees: total > 0 ? Math.round((terminees / total) * 100) : 0,
                                    total: total,
                                }];
                    }
                });
            });
        };
        // Nouvelle méthode pour la participation par enquête
        ReponseService_1.prototype.getParticipationParEnquete = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var enquetes, colors, participation;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.enqueteRepository.find({
                                where: { user: { id: userId } },
                                relations: ['reponses'],
                            })];
                        case 1:
                            enquetes = _a.sent();
                            colors = [
                                '#9D50BB',
                                '#2ecc71',
                                '#3498db',
                                '#f39c12',
                                '#e74c3c',
                                '#1abc9c',
                                '#e84393',
                            ];
                            participation = enquetes.map(function (enquete, index) {
                                var _a;
                                var totalReponses = ((_a = enquete.reponses) === null || _a === void 0 ? void 0 : _a.length) || 0;
                                var maxReponses = 100; // Vous pouvez ajuster cette valeur selon votre logique métier
                                var value = Math.min(Math.round((totalReponses / maxReponses) * 100), 100);
                                return {
                                    label: enquete.titre.length > 20
                                        ? enquete.titre.substring(0, 20) + '...'
                                        : enquete.titre,
                                    value: value,
                                    color: colors[index % colors.length],
                                };
                            });
                            return [2 /*return*/, participation];
                    }
                });
            });
        };
        // Nouvelle méthode pour les top enquêtes
        ReponseService_1.prototype.getTopEnquetes = function (userId_1) {
            return __awaiter(this, arguments, void 0, function (userId, periode, limit) {
                var dateCondition, topEnquetes;
                if (periode === void 0) { periode = 'week'; }
                if (limit === void 0) { limit = 5; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            dateCondition = '';
                            switch (periode) {
                                case 'today':
                                    dateCondition = "r.\"dateReponse\" >= CURRENT_DATE";
                                    break;
                                case 'week':
                                    dateCondition = "r.\"dateReponse\" >= CURRENT_DATE - INTERVAL '7 days'";
                                    break;
                                case 'month':
                                    dateCondition = "r.\"dateReponse\" >= CURRENT_DATE - INTERVAL '30 days'";
                                    break;
                                case 'year':
                                    dateCondition = "r.\"dateReponse\" >= CURRENT_DATE - INTERVAL '365 days'";
                                    break;
                                default:
                                    dateCondition = "r.\"dateReponse\" >= CURRENT_DATE - INTERVAL '7 days'";
                            }
                            return [4 /*yield*/, this.ReponseRepo.query("\n      SELECT \n        e.id,\n        e.titre,\n        COUNT(r.id) as nombre_reponses\n      FROM \"enquete\" e\n      LEFT JOIN \"reponse\" r ON e.id = r.enquete_id AND ".concat(dateCondition, "\n      WHERE e.\"userId\" = $1\n      GROUP BY e.id, e.titre\n      ORDER BY nombre_reponses DESC\n      LIMIT $2\n      "), [userId, limit])];
                        case 1:
                            topEnquetes = _a.sent();
                            return [2 /*return*/, topEnquetes.map(function (enquete) { return ({
                                    nom: enquete.titre.length > 25
                                        ? enquete.titre.substring(0, 25) + '...'
                                        : enquete.titre,
                                    valeur: "".concat(enquete.nombre_reponses, " r\u00E9ponses"),
                                }); })];
                    }
                });
            });
        };
        // Nouvelle méthode pour les enquêtes récentes
        ReponseService_1.prototype.getRecentEnquetes = function (userId_1) {
            return __awaiter(this, arguments, void 0, function (userId, limit) {
                var recentEnquetes;
                if (limit === void 0) { limit = 3; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.enqueteRepository.find({
                                where: { user: { id: userId } },
                                relations: ['reponses'],
                                order: { createAt: 'DESC' },
                                take: limit,
                            })];
                        case 1:
                            recentEnquetes = _a.sent();
                            return [2 /*return*/, recentEnquetes.map(function (enquete) {
                                    var _a;
                                    return ({
                                        id: enquete.id,
                                        titre: enquete.titre,
                                        participants: ((_a = enquete.reponses) === null || _a === void 0 ? void 0 : _a.length) || 0,
                                        dateFin: enquete.dateFin
                                            ? new Date(enquete.dateFin).toLocaleDateString('fr-FR')
                                            : 'Non définie',
                                        statut: enquete.statut === status_enum_1.StatusEnquete.Publiee ? 'Active'
                                            : enquete.statut === status_enum_1.StatusEnquete.Brouillon
                                                ? 'Brouillon'
                                                : 'Terminée',
                                    });
                                })];
                    }
                });
            });
        };
        // Nouvelle méthode pour les activités récentes
        ReponseService_1.prototype.getRecentActivities = function (userId_1) {
            return __awaiter(this, arguments, void 0, function (userId, limit) {
                var activities, types, icons, backgrounds;
                var _this = this;
                if (limit === void 0) { limit = 5; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.ReponseRepo.query("\n      SELECT \n        r.\"dateReponse\" as date,\n        u.nom,\n        u.prenom,\n        e.titre as enquete_titre,\n        r.\"reponseTexte\"\n      FROM \"reponse\" r\n      JOIN \"utilisateur\" u ON u.id = r.utilisateur_id\n      JOIN \"enquete\" e ON e.id = r.enquete_id\n      WHERE e.\"userId\" = $1\n      ORDER BY r.\"dateReponse\" DESC\n      LIMIT $2\n      ", [userId, limit])];
                        case 1:
                            activities = _a.sent();
                            types = [
                                'Nouvelle réponse',
                                'Participation',
                                'Feedback',
                                'Réponse soumise',
                                'Enquête complétée',
                            ];
                            icons = [
                                'fa-reply',
                                'fa-user-check',
                                'fa-comment',
                                'fa-paper-plane',
                                'fa-check-circle',
                            ];
                            backgrounds = [
                                '#9D50BB20',
                                '#2ecc7120',
                                '#3498db20',
                                '#f39c1220',
                                '#e74c3c20',
                            ];
                            return [2 /*return*/, activities.map(function (activity, index) { return ({
                                    message: "".concat(activity.prenom, " ").concat(activity.nom, " a r\u00E9pondu \u00E0 l'enqu\u00EAte \"").concat(activity.enquete_titre, "\""),
                                    time: _this.getTimeAgo(new Date(activity.date)),
                                    type: types[index % types.length],
                                    icon: icons[index % icons.length],
                                    background: backgrounds[index % backgrounds.length],
                                }); })];
                    }
                });
            });
        };
        ReponseService_1.prototype.getTimeAgo = function (date) {
            var now = new Date();
            var diffMs = now.getTime() - date.getTime();
            var diffMins = Math.round(diffMs / 60000);
            var diffHours = Math.round(diffMs / 3600000);
            var diffDays = Math.round(diffMs / 86400000);
            if (diffMins < 60)
                return "il y a ".concat(diffMins, " min");
            if (diffHours < 24)
                return "il y a ".concat(diffHours, " h");
            return "il y a ".concat(diffDays, " j");
        };
        // Export méthodes existantes...
        ReponseService_1.prototype.exportExcel = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var response, reponses, workbook, worksheet;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getallReponses(userId)];
                        case 1:
                            response = _a.sent();
                            reponses = response.data;
                            workbook = new ExcelJS.Workbook();
                            worksheet = workbook.addWorksheet('Reponses');
                            worksheet.columns = [
                                { header: 'Nom', key: 'nom', width: 20 },
                                { header: 'Prénom', key: 'prenom', width: 20 },
                                { header: 'Email', key: 'email', width: 30 },
                                { header: 'Réponse', key: 'reponseTexte', width: 30 },
                                { header: 'Date Réponse', key: 'dateReponse', width: 25 },
                                { header: 'Titre Enquête', key: 'titre', width: 30 },
                            ];
                            worksheet.getRow(1).eachCell(function (cell) {
                                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                                cell.fill = {
                                    type: 'pattern',
                                    pattern: 'solid',
                                    fgColor: { argb: 'FF6A0DAD' },
                                };
                                cell.alignment = { horizontal: 'center' };
                            });
                            reponses.forEach(function (reponse) {
                                var _a, _b, _c, _d, _e;
                                worksheet.addRow({
                                    nom: (_a = reponse.nom) !== null && _a !== void 0 ? _a : '',
                                    prenom: (_b = reponse.prenom) !== null && _b !== void 0 ? _b : '',
                                    email: (_c = reponse.email) !== null && _c !== void 0 ? _c : '',
                                    reponseTexte: (_d = reponse.reponseTexte) !== null && _d !== void 0 ? _d : '',
                                    dateReponse: reponse.dateReponse
                                        ? new Date(reponse.dateReponse).toLocaleString()
                                        : '',
                                    titre: (_e = reponse.titre) !== null && _e !== void 0 ? _e : '',
                                });
                            });
                            return [2 /*return*/, workbook];
                    }
                });
            });
        };
        ReponseService_1.prototype.exportPDFReponses = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var response, reponses, doc, date, columns, rows, arrayBuffer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getallReponses(userId)];
                        case 1:
                            response = _a.sent();
                            reponses = response.data;
                            doc = new jspdf_1.default();
                            doc.setFontSize(16);
                            doc.setTextColor(109, 16, 173);
                            doc.text('Liste des réponses', 14, 20);
                            date = new Date().toLocaleString();
                            doc.setFontSize(10);
                            doc.setTextColor(100);
                            doc.text("Export\u00E9 le : ".concat(date), 140, 20);
                            columns = ['Nom', 'Prénom', 'Email', 'Réponse', 'Date', 'Enquête'];
                            rows = reponses.map(function (r) { return [
                                r.nom,
                                r.prenom,
                                r.email,
                                r.reponseTexte,
                                r.dateReponse ? new Date(r.dateReponse).toLocaleDateString() : '-',
                                r.titre,
                            ]; });
                            (0, jspdf_autotable_1.default)(doc, {
                                head: [columns],
                                body: rows,
                                startY: 30,
                                theme: 'striped',
                                headStyles: {
                                    fillColor: [109, 16, 173],
                                    textColor: 255,
                                    fontStyle: 'bold',
                                },
                                bodyStyles: {
                                    fontSize: 10,
                                    textColor: 50,
                                    cellPadding: 3,
                                },
                                columnStyles: {
                                    0: { cellWidth: 25 },
                                    1: { cellWidth: 25 },
                                    2: { cellWidth: 45 },
                                    3: { cellWidth: 40 },
                                    4: { cellWidth: 25 },
                                    5: { cellWidth: 35 },
                                },
                                styles: { font: 'helvetica' },
                                margin: { left: 14, right: 14 },
                            });
                            arrayBuffer = doc.output('arraybuffer');
                            return [2 /*return*/, Buffer.from(arrayBuffer)];
                    }
                });
            });
        };
        ReponseService_1.prototype.exportCSV = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var response, reponses, fields, data, parser;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getallReponses(userId)];
                        case 1:
                            response = _a.sent();
                            reponses = response.data;
                            fields = [
                                { label: 'Nom', value: 'nom' },
                                { label: 'Prénom', value: 'prenom' },
                                { label: 'Email', value: 'email' },
                                { label: 'Réponse', value: 'reponseTexte' },
                                { label: 'Date Réponse', value: 'dateReponse' },
                                { label: 'Titre Enquête', value: 'titre' },
                            ];
                            data = reponses.map(function (r) {
                                var _a, _b, _c, _d, _e;
                                return ({
                                    nom: (_a = r.nom) !== null && _a !== void 0 ? _a : '',
                                    prenom: (_b = r.prenom) !== null && _b !== void 0 ? _b : '',
                                    email: (_c = r.email) !== null && _c !== void 0 ? _c : '',
                                    reponseTexte: (_d = r.reponseTexte) !== null && _d !== void 0 ? _d : '',
                                    dateReponse: r.dateReponse
                                        ? new Date(r.dateReponse).toLocaleString()
                                        : '',
                                    titre: (_e = r.titre) !== null && _e !== void 0 ? _e : '',
                                });
                            });
                            parser = new json2csv_1.Parser({ fields: fields });
                            return [2 /*return*/, parser.parse(data)];
                    }
                });
            });
        };
        return ReponseService_1;
    }());
    __setFunctionName(_classThis, "ReponseService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReponseService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReponseService = _classThis;
}();
exports.ReponseService = ReponseService;
