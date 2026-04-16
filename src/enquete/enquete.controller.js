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
exports.EnqueteController = void 0;
var common_1 = require("@nestjs/common");
var status_enum_1 = require("./entities/status.enum");
var EnqueteController = function () {
    var _classDecorators = [(0, common_1.Controller)('enquete')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _create_decorators;
    var _findAll_decorators;
    var _findOne_decorators;
    var _update_decorators;
    var _remove_decorators;
    var _findenquetebyUser_decorators;
    var _changeStatut_decorators;
    var _findAllEnqueteBrullion_decorators;
    var _findAllEnqueteFerme_decorators;
    var _findallEnquetePubliee_decorators;
    var _getallEnqueteArchive_decorators;
    var _changeTypeParticipation_decorators;
    var _getNombreuserByAdmin_decorators;
    var _getTauxReponseAdmin_decorators;
    var _getEnqueteStats_decorators;
    var _getEvolutionReponses_decorators;
    var _getReponsesByQuestion_decorators;
    var _generateQRCode_decorators;
    var _publishEnquete_decorators;
    var _archiveEnquete_decorators;
    var _getOneWithQuestions_decorators;
    var EnqueteController = _classThis = /** @class */ (function () {
        function EnqueteController_1(enqueteService) {
            this.enqueteService = (__runInitializers(this, _instanceExtraInitializers), enqueteService);
        }
        EnqueteController_1.prototype.create = function (createEnqueteDto) {
            return this.enqueteService.create(createEnqueteDto);
        };
        EnqueteController_1.prototype.findAll = function () {
            return this.enqueteService.findAll();
        };
        EnqueteController_1.prototype.findOne = function (id) {
            return this.enqueteService.findEnqueteByid(+id);
        };
        EnqueteController_1.prototype.update = function (id, updateEnqueteDto) {
            return this.enqueteService.update(+id, updateEnqueteDto);
        };
        EnqueteController_1.prototype.remove = function (id) {
            return this.enqueteService.remove(+id);
        };
        EnqueteController_1.prototype.findenquetebyUser = function (id) {
            return this.enqueteService.findByUser(id);
        };
        EnqueteController_1.prototype.changeStatut = function (id, statut) {
            return this.enqueteService.changeStatut(+id, statut);
        };
        EnqueteController_1.prototype.findAllEnqueteBrullion = function () {
            return __awaiter(this, void 0, void 0, function () {
                var allEnqueteBrullion;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.enqueteService.getAllenqueteEnBrullion()];
                        case 1:
                            allEnqueteBrullion = _a.sent();
                            if (!allEnqueteBrullion || allEnqueteBrullion.length === 0) {
                                return [2 /*return*/, {
                                        message: 'Aucune enquête en brouillon trouvée',
                                        data: []
                                    }];
                            }
                            return [2 /*return*/, {
                                    message: 'Voici la liste des enquêtes avec le statut brouillon',
                                    data: allEnqueteBrullion
                                }];
                    }
                });
            });
        };
        EnqueteController_1.prototype.findAllEnqueteFerme = function () {
            return __awaiter(this, void 0, void 0, function () {
                var allEnqueteFerme;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.enqueteService.getAllEnqueteFerme()];
                        case 1:
                            allEnqueteFerme = _a.sent();
                            if (!allEnqueteFerme || allEnqueteFerme.length === 0) {
                                return [2 /*return*/, {
                                        message: 'Aucune enquête ferme trouvée',
                                        data: []
                                    }];
                            }
                            return [2 /*return*/, {
                                    message: 'Voici la liste des enquêtes avec le statut ferme',
                                    data: allEnqueteFerme
                                }];
                    }
                });
            });
        };
        EnqueteController_1.prototype.findallEnquetePubliee = function () {
            return __awaiter(this, void 0, void 0, function () {
                var allEnquetePubliee;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.enqueteService.getAllEnquetePubliee()];
                        case 1:
                            allEnquetePubliee = _a.sent();
                            if (!allEnquetePubliee || allEnquetePubliee.length === 0) {
                                return [2 /*return*/, {
                                        message: "Aucune enquête Publiée trouvée",
                                        data: []
                                    }];
                            }
                            return [2 /*return*/, {
                                    message: "Voici liste des enuqêtes avec le statu Publiée",
                                    data: allEnquetePubliee
                                }];
                    }
                });
            });
        };
        EnqueteController_1.prototype.getallEnqueteArchive = function () {
            return __awaiter(this, void 0, void 0, function () {
                var allEnqueteArchive;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.enqueteService.getAllEnqueteArchive()];
                        case 1:
                            allEnqueteArchive = _a.sent();
                            if (!allEnqueteArchive || allEnqueteArchive.length === 0) {
                                return [2 /*return*/, {
                                        message: "Aucune enquête Archivée trouvée",
                                        data: []
                                    }];
                            }
                            return [2 /*return*/, {
                                    message: "Voici liste des enuqêtes avec le statu Archivée",
                                    data: allEnqueteArchive
                                }];
                    }
                });
            });
        };
        EnqueteController_1.prototype.changeTypeParticipation = function (id, type) {
            return this.enqueteService.changeTypedeParticipation(id, type);
        };
        EnqueteController_1.prototype.getNombreuserByAdmin = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.enqueteService.getNombreParticipantByAdmin(userId)];
                });
            });
        };
        EnqueteController_1.prototype.getTauxReponseAdmin = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var id;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            id = parseInt(userId);
                            if (isNaN(id)) {
                                throw new common_1.BadRequestException('UserId invalide');
                            }
                            _a = {};
                            return [4 /*yield*/, this.enqueteService.getTauxReponseByAdmin(id)];
                        case 1: return [2 /*return*/, (_a.taux_reponse = _b.sent(),
                                _a)];
                    }
                });
            });
        };
        EnqueteController_1.prototype.getEnqueteStats = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.enqueteService.getEnqueteStats(+id)];
                });
            });
        };
        EnqueteController_1.prototype.getEvolutionReponses = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.enqueteService.getEvolutionReponses(+id)];
                });
            });
        };
        EnqueteController_1.prototype.getReponsesByQuestion = function (id, questionId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.enqueteService.getReponsesByQuestion(+id, +questionId)];
                });
            });
        };
        EnqueteController_1.prototype.generateQRCode = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var qrBuffer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.enqueteService.generateQRCode(+id)];
                        case 1:
                            qrBuffer = _a.sent();
                            return [2 /*return*/, new Response(qrBuffer, {
                                    headers: {
                                        'Content-Type': 'image/png',
                                        'Content-Disposition': "attachment; filename=\"qrcode_enquete_".concat(id, ".png\"")
                                    }
                                })];
                    }
                });
            });
        };
        EnqueteController_1.prototype.publishEnquete = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.enqueteService.changeStatut(+id, status_enum_1.StatusEnquete.Publiee)];
                });
            });
        };
        EnqueteController_1.prototype.archiveEnquete = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.enqueteService.changeStatut(+id, status_enum_1.StatusEnquete.archive)];
                });
            });
        };
        EnqueteController_1.prototype.getOneWithQuestions = function (id) {
            return this.enqueteService.getEnqueteByDetailesQuestions(+id);
        };
        return EnqueteController_1;
    }());
    __setFunctionName(_classThis, "EnqueteController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)('/creation')];
        _findAll_decorators = [(0, common_1.Get)("/all")];
        _findOne_decorators = [(0, common_1.Get)(':id')];
        _update_decorators = [(0, common_1.Patch)('/update/:id')];
        _remove_decorators = [(0, common_1.Delete)('/delete/:id')];
        _findenquetebyUser_decorators = [(0, common_1.Get)('/findbyuser/:id')];
        _changeStatut_decorators = [(0, common_1.Patch)('/change-statut/:id')];
        _findAllEnqueteBrullion_decorators = [(0, common_1.Get)("/all/EnBrullion")];
        _findAllEnqueteFerme_decorators = [(0, common_1.Get)("/all/Ferme")];
        _findallEnquetePubliee_decorators = [(0, common_1.Get)("/all/Publiee")];
        _getallEnqueteArchive_decorators = [(0, common_1.Get)("/all/Archivee")];
        _changeTypeParticipation_decorators = [(0, common_1.Patch)("/changeTypeParticipation/:id")];
        _getNombreuserByAdmin_decorators = [(0, common_1.Get)("participants/:userId")];
        _getTauxReponseAdmin_decorators = [(0, common_1.Get)('taux-reponse-admin/:userId')];
        _getEnqueteStats_decorators = [(0, common_1.Get)(':id/stats')];
        _getEvolutionReponses_decorators = [(0, common_1.Get)(':id/evolution')];
        _getReponsesByQuestion_decorators = [(0, common_1.Get)(':id/question/:questionId/reponses')];
        _generateQRCode_decorators = [(0, common_1.Get)(':id/qrcode')];
        _publishEnquete_decorators = [(0, common_1.Patch)(':id/publier')];
        _archiveEnquete_decorators = [(0, common_1.Patch)(':id/archiver')];
        _getOneWithQuestions_decorators = [(0, common_1.Get)('/detailes/:id')];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: function (obj) { return "update" in obj; }, get: function (obj) { return obj.update; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: function (obj) { return "remove" in obj; }, get: function (obj) { return obj.remove; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findenquetebyUser_decorators, { kind: "method", name: "findenquetebyUser", static: false, private: false, access: { has: function (obj) { return "findenquetebyUser" in obj; }, get: function (obj) { return obj.findenquetebyUser; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _changeStatut_decorators, { kind: "method", name: "changeStatut", static: false, private: false, access: { has: function (obj) { return "changeStatut" in obj; }, get: function (obj) { return obj.changeStatut; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAllEnqueteBrullion_decorators, { kind: "method", name: "findAllEnqueteBrullion", static: false, private: false, access: { has: function (obj) { return "findAllEnqueteBrullion" in obj; }, get: function (obj) { return obj.findAllEnqueteBrullion; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAllEnqueteFerme_decorators, { kind: "method", name: "findAllEnqueteFerme", static: false, private: false, access: { has: function (obj) { return "findAllEnqueteFerme" in obj; }, get: function (obj) { return obj.findAllEnqueteFerme; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findallEnquetePubliee_decorators, { kind: "method", name: "findallEnquetePubliee", static: false, private: false, access: { has: function (obj) { return "findallEnquetePubliee" in obj; }, get: function (obj) { return obj.findallEnquetePubliee; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getallEnqueteArchive_decorators, { kind: "method", name: "getallEnqueteArchive", static: false, private: false, access: { has: function (obj) { return "getallEnqueteArchive" in obj; }, get: function (obj) { return obj.getallEnqueteArchive; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _changeTypeParticipation_decorators, { kind: "method", name: "changeTypeParticipation", static: false, private: false, access: { has: function (obj) { return "changeTypeParticipation" in obj; }, get: function (obj) { return obj.changeTypeParticipation; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getNombreuserByAdmin_decorators, { kind: "method", name: "getNombreuserByAdmin", static: false, private: false, access: { has: function (obj) { return "getNombreuserByAdmin" in obj; }, get: function (obj) { return obj.getNombreuserByAdmin; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTauxReponseAdmin_decorators, { kind: "method", name: "getTauxReponseAdmin", static: false, private: false, access: { has: function (obj) { return "getTauxReponseAdmin" in obj; }, get: function (obj) { return obj.getTauxReponseAdmin; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getEnqueteStats_decorators, { kind: "method", name: "getEnqueteStats", static: false, private: false, access: { has: function (obj) { return "getEnqueteStats" in obj; }, get: function (obj) { return obj.getEnqueteStats; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getEvolutionReponses_decorators, { kind: "method", name: "getEvolutionReponses", static: false, private: false, access: { has: function (obj) { return "getEvolutionReponses" in obj; }, get: function (obj) { return obj.getEvolutionReponses; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getReponsesByQuestion_decorators, { kind: "method", name: "getReponsesByQuestion", static: false, private: false, access: { has: function (obj) { return "getReponsesByQuestion" in obj; }, get: function (obj) { return obj.getReponsesByQuestion; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateQRCode_decorators, { kind: "method", name: "generateQRCode", static: false, private: false, access: { has: function (obj) { return "generateQRCode" in obj; }, get: function (obj) { return obj.generateQRCode; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _publishEnquete_decorators, { kind: "method", name: "publishEnquete", static: false, private: false, access: { has: function (obj) { return "publishEnquete" in obj; }, get: function (obj) { return obj.publishEnquete; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _archiveEnquete_decorators, { kind: "method", name: "archiveEnquete", static: false, private: false, access: { has: function (obj) { return "archiveEnquete" in obj; }, get: function (obj) { return obj.archiveEnquete; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getOneWithQuestions_decorators, { kind: "method", name: "getOneWithQuestions", static: false, private: false, access: { has: function (obj) { return "getOneWithQuestions" in obj; }, get: function (obj) { return obj.getOneWithQuestions; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        EnqueteController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return EnqueteController = _classThis;
}();
exports.EnqueteController = EnqueteController;
