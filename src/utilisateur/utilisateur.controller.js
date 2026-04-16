"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
exports.UtilisateurController = void 0;
var common_1 = require("@nestjs/common");
var UtilisateurController = function () {
    var _classDecorators = [(0, common_1.Controller)('utilisateur')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getNombreUsers_decorators;
    var _exportCSV_decorators;
    var _create_decorators;
    var _findAll_decorators;
    var _filtrageUsers_decorators;
    var _verificationToken_decorators;
    var _exportUtilisateursConnecte_decorators;
    var _exportPdf_decorators;
    var _getAllconnecte_decorators;
    var _getAllconnecteNouveaux_decorators;
    var _CountAllUsers_decorators;
    var _findOne_decorators;
    var _changeStatus_decorators;
    var _changeRole_decorators;
    var _update_decorators;
    var _remove_decorators;
    var _findenquetebyuser_decorators;
    var _getNumberEnquetesByUser_decorators;
    var _getAllEnqueteStatuBruillon_decorators;
    var _getAllEnqueteFerme_decorators;
    var _getAllEnquetePubliee_decorators;
    var _getEnqueteDetails_decorators;
    var _getMoy_decorators;
    var _ConsulterProfil_decorators;
    var _ModifierProfil_decorators;
    var _getNombreUsersActifs_decorators;
    var _getNombreUsersInActifs_decorators;
    var _getNombreAdmins_decorators;
    var UtilisateurController = _classThis = /** @class */ (function () {
        function UtilisateurController_1(utilisateurService) {
            this.utilisateurService = (__runInitializers(this, _instanceExtraInitializers), utilisateurService);
        }
        UtilisateurController_1.prototype.getNombreUsers = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.utilisateurService.countAllUsers()];
                });
            });
        };
        UtilisateurController_1.prototype.exportCSV = function (res) {
            return __awaiter(this, void 0, void 0, function () {
                var csv;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.utilisateurService.exportCSV()];
                        case 1:
                            csv = _a.sent();
                            res.setHeader('Content-Type', 'text/csv');
                            res.setHeader('Content-Disposition', 'attachment; filename=users_connecte.csv');
                            res.send(csv);
                            return [2 /*return*/];
                    }
                });
            });
        };
        UtilisateurController_1.prototype.create = function (createUtilisateurDto) {
            return this.utilisateurService.create(createUtilisateurDto);
        };
        UtilisateurController_1.prototype.findAll = function () {
            return this.utilisateurService.getAllusers();
        };
        UtilisateurController_1.prototype.filtrageUsers = function (query) {
            return this.utilisateurService.searchUsers(query);
        };
        UtilisateurController_1.prototype.verificationToken = function (token) {
            if (!token)
                return { erreur: 'Le token est manquant' };
            return this.utilisateurService.verificationToken(token);
        };
        // ✅ Routes statiques avant routes dynamiques
        UtilisateurController_1.prototype.exportUtilisateursConnecte = function (res) {
            return __awaiter(this, void 0, void 0, function () {
                var fileExcel, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.utilisateurService.exportUtilisateursConnecte()];
                        case 1:
                            fileExcel = _a.sent();
                            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                            res.setHeader('Content-Disposition', 'attachment; filename=users_connecte.xlsx');
                            return [4 /*yield*/, fileExcel.xlsx.write(res)];
                        case 2:
                            _a.sent();
                            res.end();
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            console.error('EXPORT ERROR ❌', error_1);
                            res.status(500).send('Erreur export');
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        UtilisateurController_1.prototype.exportPdf = function (res) {
            return __awaiter(this, void 0, void 0, function () {
                var users, pdfBuffer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.utilisateurService.getAllUsersRoleConnecte()];
                        case 1:
                            users = (_a.sent()).data;
                            return [4 /*yield*/, this.utilisateurService.exportPDF(users)];
                        case 2:
                            pdfBuffer = _a.sent();
                            res.setHeader('Content-Type', 'application/pdf');
                            res.setHeader('Content-Disposition', 'attachment; filename="users_connecte.pdf"');
                            res.setHeader('Content-Length', pdfBuffer.length.toString());
                            res.end(pdfBuffer);
                            return [2 /*return*/];
                    }
                });
            });
        };
        UtilisateurController_1.prototype.getAllconnecte = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.utilisateurService.getAllUsersRoleConnecte()];
                });
            });
        };
        UtilisateurController_1.prototype.getAllconnecteNouveaux = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.utilisateurService.getAllUsersNouveaux()];
                });
            });
        };
        UtilisateurController_1.prototype.CountAllUsers = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.utilisateurService.countallUsersRoleConnecte()];
                });
            });
        };
        // ✅ Routes dynamiques avec :id
        UtilisateurController_1.prototype.findOne = function (id) {
            return this.utilisateurService.FindUserById(id);
        };
        UtilisateurController_1.prototype.changeStatus = function (id, statut) {
            return this.utilisateurService.changeStatus(id, statut);
        };
        UtilisateurController_1.prototype.changeRole = function (id, role) {
            return this.utilisateurService.chnageRole(id, role);
        };
        UtilisateurController_1.prototype.update = function (id, updateUtilisateurDto) {
            return this.utilisateurService.update(+id, updateUtilisateurDto);
        };
        UtilisateurController_1.prototype.remove = function (id) {
            return this.utilisateurService.remove(+id);
        };
        UtilisateurController_1.prototype.findenquetebyuser = function (id) {
            return this.utilisateurService.findEnquetesByUser(id);
        };
        UtilisateurController_1.prototype.getNumberEnquetesByUser = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.utilisateurService.findNumberEnquetesByUser(id)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        UtilisateurController_1.prototype.getAllEnqueteStatuBruillon = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var allenqueteBrullion;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.utilisateurService.findEnqueteAvecStatutBrouillonByUser(id)];
                        case 1:
                            allenqueteBrullion = _a.sent();
                            if (!allenqueteBrullion || allenqueteBrullion.length === 0)
                                return [2 /*return*/, { message: 'Aucune enquête en brullion trouvée', data: [] }];
                            return [2 /*return*/, {
                                    message: 'Voici liste des enuqêtes avec le statu brullion',
                                    data: [allenqueteBrullion],
                                }];
                    }
                });
            });
        };
        UtilisateurController_1.prototype.getAllEnqueteFerme = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var listeEnqueteFerme;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.utilisateurService.findEnqueteAvecStatutFermeByUser(id)];
                        case 1:
                            listeEnqueteFerme = _a.sent();
                            if (!listeEnqueteFerme || listeEnqueteFerme.length === 0)
                                return [2 /*return*/, { message: 'Aucune enquête fermée trouvée', data: [] }];
                            return [2 /*return*/, {
                                    message: 'Voici liste des enuqêtes avec le statu fermée',
                                    data: listeEnqueteFerme,
                                }];
                    }
                });
            });
        };
        UtilisateurController_1.prototype.getAllEnquetePubliee = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var allEnquetePublie;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.utilisateurService.findEnqueteAvecStatutPublieeByUser(id)];
                        case 1:
                            allEnquetePublie = _a.sent();
                            if (!allEnquetePublie || allEnquetePublie.length === 0)
                                return [2 /*return*/, { message: 'Aucune enquête Publiée trouvée', data: [] }];
                            return [2 /*return*/, {
                                    message: 'Voici liste des enuqêtes avec le statu Publiée',
                                    data: [],
                                }];
                    }
                });
            });
        };
        UtilisateurController_1.prototype.getEnqueteDetails = function (userId, enqueteId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.utilisateurService.findEnquetesByUserDetailles(userId, enqueteId)];
                });
            });
        };
        UtilisateurController_1.prototype.getMoy = function (datestr) {
            return __awaiter(this, void 0, void 0, function () {
                var date;
                return __generator(this, function (_a) {
                    date = datestr ? new Date(datestr) : new Date();
                    if (isNaN(date.getTime()))
                        return [2 /*return*/, { message: 'Date invalide', moyenne: 0 }];
                    return [2 /*return*/, { date: date.toDateString() }];
                });
            });
        };
        UtilisateurController_1.prototype.ConsulterProfil = function (userId, AncienUser) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.utilisateurService.consulterProfil(userId)];
                });
            });
        };
        UtilisateurController_1.prototype.ModifierProfil = function (userId, userModifier) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.utilisateurService.modifierProfil(userId, userModifier)];
                });
            });
        };
        UtilisateurController_1.prototype.getNombreUsersActifs = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.utilisateurService.countAllUsersActifs()];
                });
            });
        };
        UtilisateurController_1.prototype.getNombreUsersInActifs = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.utilisateurService.countAllUsersInActifs()];
                });
            });
        };
        UtilisateurController_1.prototype.getNombreAdmins = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.utilisateurService.getNomreAdmins()];
                });
            });
        };
        return UtilisateurController_1;
    }());
    __setFunctionName(_classThis, "UtilisateurController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getNombreUsers_decorators = [(0, common_1.Get)('/NombreUsers')];
        _exportCSV_decorators = [(0, common_1.Get)('/export-csv')];
        _create_decorators = [(0, common_1.Post)('/register')];
        _findAll_decorators = [(0, common_1.Get)('/get/all')];
        _filtrageUsers_decorators = [(0, common_1.Get)('/search')];
        _verificationToken_decorators = [(0, common_1.Get)('/verification')];
        _exportUtilisateursConnecte_decorators = [(0, common_1.Get)('export-connecte')];
        _exportPdf_decorators = [(0, common_1.Get)('exportPdf-connecte')];
        _getAllconnecte_decorators = [(0, common_1.Get)('get/all/connecte')];
        _getAllconnecteNouveaux_decorators = [(0, common_1.Get)('get/all/connecte/nouveaux')];
        _CountAllUsers_decorators = [(0, common_1.Get)('/count/all')];
        _findOne_decorators = [(0, common_1.Get)(':id')];
        _changeStatus_decorators = [(0, common_1.Patch)(':id/statuts')];
        _changeRole_decorators = [(0, common_1.Patch)(':id/role')];
        _update_decorators = [(0, common_1.Patch)(':id')];
        _remove_decorators = [(0, common_1.Delete)(':id')];
        _findenquetebyuser_decorators = [(0, common_1.Get)('/enquetes/:id')];
        _getNumberEnquetesByUser_decorators = [(0, common_1.Get)('/enquetes/count/:id')];
        _getAllEnqueteStatuBruillon_decorators = [(0, common_1.Get)('/enquetes/brullion/:id')];
        _getAllEnqueteFerme_decorators = [(0, common_1.Get)('/enquetes/ferme/:id')];
        _getAllEnquetePubliee_decorators = [(0, common_1.Get)('/all/Publiee')];
        _getEnqueteDetails_decorators = [(0, common_1.Get)('/enquetes/:userId/:enqueteId')];
        _getMoy_decorators = [(0, common_1.Get)('/reponseMoyeneJour')];
        _ConsulterProfil_decorators = [(0, common_1.Get)('/profil/:userId')];
        _ModifierProfil_decorators = [(0, common_1.Patch)('/profil/:userId')];
        _getNombreUsersActifs_decorators = [(0, common_1.Get)('/NombreUsers/actifs')];
        _getNombreUsersInActifs_decorators = [(0, common_1.Get)('/NombreUsers/Inactifs')];
        _getNombreAdmins_decorators = [(0, common_1.Get)('/Nombre/Admins')];
        __esDecorate(_classThis, null, _getNombreUsers_decorators, { kind: "method", name: "getNombreUsers", static: false, private: false, access: { has: function (obj) { return "getNombreUsers" in obj; }, get: function (obj) { return obj.getNombreUsers; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _exportCSV_decorators, { kind: "method", name: "exportCSV", static: false, private: false, access: { has: function (obj) { return "exportCSV" in obj; }, get: function (obj) { return obj.exportCSV; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _filtrageUsers_decorators, { kind: "method", name: "filtrageUsers", static: false, private: false, access: { has: function (obj) { return "filtrageUsers" in obj; }, get: function (obj) { return obj.filtrageUsers; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _verificationToken_decorators, { kind: "method", name: "verificationToken", static: false, private: false, access: { has: function (obj) { return "verificationToken" in obj; }, get: function (obj) { return obj.verificationToken; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _exportUtilisateursConnecte_decorators, { kind: "method", name: "exportUtilisateursConnecte", static: false, private: false, access: { has: function (obj) { return "exportUtilisateursConnecte" in obj; }, get: function (obj) { return obj.exportUtilisateursConnecte; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _exportPdf_decorators, { kind: "method", name: "exportPdf", static: false, private: false, access: { has: function (obj) { return "exportPdf" in obj; }, get: function (obj) { return obj.exportPdf; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAllconnecte_decorators, { kind: "method", name: "getAllconnecte", static: false, private: false, access: { has: function (obj) { return "getAllconnecte" in obj; }, get: function (obj) { return obj.getAllconnecte; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAllconnecteNouveaux_decorators, { kind: "method", name: "getAllconnecteNouveaux", static: false, private: false, access: { has: function (obj) { return "getAllconnecteNouveaux" in obj; }, get: function (obj) { return obj.getAllconnecteNouveaux; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _CountAllUsers_decorators, { kind: "method", name: "CountAllUsers", static: false, private: false, access: { has: function (obj) { return "CountAllUsers" in obj; }, get: function (obj) { return obj.CountAllUsers; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _changeStatus_decorators, { kind: "method", name: "changeStatus", static: false, private: false, access: { has: function (obj) { return "changeStatus" in obj; }, get: function (obj) { return obj.changeStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _changeRole_decorators, { kind: "method", name: "changeRole", static: false, private: false, access: { has: function (obj) { return "changeRole" in obj; }, get: function (obj) { return obj.changeRole; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: function (obj) { return "update" in obj; }, get: function (obj) { return obj.update; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: function (obj) { return "remove" in obj; }, get: function (obj) { return obj.remove; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findenquetebyuser_decorators, { kind: "method", name: "findenquetebyuser", static: false, private: false, access: { has: function (obj) { return "findenquetebyuser" in obj; }, get: function (obj) { return obj.findenquetebyuser; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getNumberEnquetesByUser_decorators, { kind: "method", name: "getNumberEnquetesByUser", static: false, private: false, access: { has: function (obj) { return "getNumberEnquetesByUser" in obj; }, get: function (obj) { return obj.getNumberEnquetesByUser; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAllEnqueteStatuBruillon_decorators, { kind: "method", name: "getAllEnqueteStatuBruillon", static: false, private: false, access: { has: function (obj) { return "getAllEnqueteStatuBruillon" in obj; }, get: function (obj) { return obj.getAllEnqueteStatuBruillon; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAllEnqueteFerme_decorators, { kind: "method", name: "getAllEnqueteFerme", static: false, private: false, access: { has: function (obj) { return "getAllEnqueteFerme" in obj; }, get: function (obj) { return obj.getAllEnqueteFerme; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAllEnquetePubliee_decorators, { kind: "method", name: "getAllEnquetePubliee", static: false, private: false, access: { has: function (obj) { return "getAllEnquetePubliee" in obj; }, get: function (obj) { return obj.getAllEnquetePubliee; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getEnqueteDetails_decorators, { kind: "method", name: "getEnqueteDetails", static: false, private: false, access: { has: function (obj) { return "getEnqueteDetails" in obj; }, get: function (obj) { return obj.getEnqueteDetails; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMoy_decorators, { kind: "method", name: "getMoy", static: false, private: false, access: { has: function (obj) { return "getMoy" in obj; }, get: function (obj) { return obj.getMoy; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _ConsulterProfil_decorators, { kind: "method", name: "ConsulterProfil", static: false, private: false, access: { has: function (obj) { return "ConsulterProfil" in obj; }, get: function (obj) { return obj.ConsulterProfil; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _ModifierProfil_decorators, { kind: "method", name: "ModifierProfil", static: false, private: false, access: { has: function (obj) { return "ModifierProfil" in obj; }, get: function (obj) { return obj.ModifierProfil; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getNombreUsersActifs_decorators, { kind: "method", name: "getNombreUsersActifs", static: false, private: false, access: { has: function (obj) { return "getNombreUsersActifs" in obj; }, get: function (obj) { return obj.getNombreUsersActifs; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getNombreUsersInActifs_decorators, { kind: "method", name: "getNombreUsersInActifs", static: false, private: false, access: { has: function (obj) { return "getNombreUsersInActifs" in obj; }, get: function (obj) { return obj.getNombreUsersInActifs; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getNombreAdmins_decorators, { kind: "method", name: "getNombreAdmins", static: false, private: false, access: { has: function (obj) { return "getNombreAdmins" in obj; }, get: function (obj) { return obj.getNombreAdmins; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UtilisateurController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UtilisateurController = _classThis;
}();
exports.UtilisateurController = UtilisateurController;
