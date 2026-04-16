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
exports.ReponseController = void 0;
// reponse.controller.ts - Version corrigée
var common_1 = require("@nestjs/common");
var ReponseController = function () {
    var _classDecorators = [(0, common_1.Controller)('reponse')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _create_decorators;
    var _findAll_decorators;
    var _findOne_decorators;
    var _update_decorators;
    var _remove_decorators;
    var _getAllReponse_decorators;
    var _getAllReponses_decorators;
    var _exportUtilisateursConnecte_decorators;
    var _exportPDFReponses_decorators;
    var _exportCSV_decorators;
    var _countReponses_decorators;
    var _deatilleReponse_decorators;
    var _getStatsParEnquete_decorators;
    var _getTopUtilisateurs_decorators;
    var _getTauxCompletionGlobal_decorators;
    var _getParticipationParPeriode_decorators;
    var _getEvolutionReponses_decorators;
    var _getSurveyStatusStats_decorators;
    var _getParticipationParEnquete_decorators;
    var _getTopEnquetes_decorators;
    var _getRecentEnquetes_decorators;
    var _getRecentActivities_decorators;
    var ReponseController = _classThis = /** @class */ (function () {
        function ReponseController_1(reponseService) {
            this.reponseService = (__runInitializers(this, _instanceExtraInitializers), reponseService);
        }
        ReponseController_1.prototype.create = function (createReponseDto) {
            return this.reponseService.create(createReponseDto);
        };
        ReponseController_1.prototype.findAll = function () {
            return this.reponseService.findAll();
        };
        ReponseController_1.prototype.findOne = function (id) {
            return this.reponseService.findOne(+id);
        };
        ReponseController_1.prototype.update = function (id, updateReponseDto) {
            return this.reponseService.update(+id, updateReponseDto);
        };
        ReponseController_1.prototype.remove = function (id) {
            return this.reponseService.remove(+id);
        };
        ReponseController_1.prototype.getAllReponse = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.reponseService.getReponsesByAdmin(+id)];
                });
            });
        };
        ReponseController_1.prototype.getAllReponses = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.reponseService.getallReponses(+id)];
                });
            });
        };
        ReponseController_1.prototype.exportUtilisateursConnecte = function (res, id) {
            return __awaiter(this, void 0, void 0, function () {
                var fileExcel, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.reponseService.exportExcel(+id)];
                        case 1:
                            fileExcel = _a.sent();
                            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                            res.setHeader('Content-Disposition', 'attachment; filename=reponses.xlsx');
                            return [4 /*yield*/, fileExcel.xlsx.write(res)];
                        case 2:
                            _a.sent();
                            res.end();
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            console.error("EXPORT ERROR ❌", error_1);
                            res.status(500).send("Erreur export");
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        ReponseController_1.prototype.exportPDFReponses = function (id, res) {
            return __awaiter(this, void 0, void 0, function () {
                var pdfBuffer, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.reponseService.exportPDFReponses(+id)];
                        case 1:
                            pdfBuffer = _a.sent();
                            res.set({
                                'Content-Type': 'application/pdf',
                                'Content-Disposition': 'attachment; filename=reponses.pdf',
                                'Content-Length': pdfBuffer.length,
                            });
                            res.end(pdfBuffer);
                            return [3 /*break*/, 3];
                        case 2:
                            error_2 = _a.sent();
                            console.error('PDF ERROR ❌', error_2);
                            res.status(500).send('Erreur export PDF');
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        ReponseController_1.prototype.exportCSV = function (id, res) {
            return __awaiter(this, void 0, void 0, function () {
                var csv, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.reponseService.exportCSV(+id)];
                        case 1:
                            csv = _a.sent();
                            res.setHeader('Content-Type', 'text/csv');
                            res.setHeader('Content-Disposition', 'attachment; filename=reponses.csv');
                            res.send(csv);
                            return [3 /*break*/, 3];
                        case 2:
                            error_3 = _a.sent();
                            console.error('CSV ERROR ❌', error_3);
                            res.status(500).send('Erreur export CSV');
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        ReponseController_1.prototype.countReponses = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.reponseService.countAllReponses(+id)];
                });
            });
        };
        ReponseController_1.prototype.deatilleReponse = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.reponseService.getAllReponsesDetail(+id)];
                });
            });
        };
        ReponseController_1.prototype.getStatsParEnquete = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.reponseService.getStatsParEnquete(+id)];
                });
            });
        };
        ReponseController_1.prototype.getTopUtilisateurs = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.reponseService.getTopUtilisateurs(+id)];
                });
            });
        };
        ReponseController_1.prototype.getTauxCompletionGlobal = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.reponseService.getTauxCompletionGlobal(+id)];
                });
            });
        };
        ReponseController_1.prototype.getParticipationParPeriode = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.reponseService.getParticipationParPeriode(+id)];
                });
            });
        };
        // Nouveaux endpoints pour le dashboard
        ReponseController_1.prototype.getEvolutionReponses = function (id_1) {
            return __awaiter(this, arguments, void 0, function (id, periode) {
                if (periode === void 0) { periode = 'week'; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.reponseService.getEvolutionReponses(+id, periode)];
                });
            });
        };
        ReponseController_1.prototype.getSurveyStatusStats = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.reponseService.getSurveyStatusStats(+id)];
                });
            });
        };
        ReponseController_1.prototype.getParticipationParEnquete = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.reponseService.getParticipationParEnquete(+id)];
                });
            });
        };
        ReponseController_1.prototype.getTopEnquetes = function (id_1) {
            return __awaiter(this, arguments, void 0, function (id, periode, limit) {
                if (periode === void 0) { periode = 'week'; }
                if (limit === void 0) { limit = '5'; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.reponseService.getTopEnquetes(+id, periode, +limit)];
                });
            });
        };
        ReponseController_1.prototype.getRecentEnquetes = function (id_1) {
            return __awaiter(this, arguments, void 0, function (id, limit) {
                if (limit === void 0) { limit = '3'; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.reponseService.getRecentEnquetes(+id, +limit)];
                });
            });
        };
        ReponseController_1.prototype.getRecentActivities = function (id_1) {
            return __awaiter(this, arguments, void 0, function (id, limit) {
                if (limit === void 0) { limit = '5'; }
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.reponseService.getRecentActivities(+id, +limit)];
                });
            });
        };
        return ReponseController_1;
    }());
    __setFunctionName(_classThis, "ReponseController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)()];
        _findAll_decorators = [(0, common_1.Get)()];
        _findOne_decorators = [(0, common_1.Get)(':id')];
        _update_decorators = [(0, common_1.Patch)(':id')];
        _remove_decorators = [(0, common_1.Delete)(':id')];
        _getAllReponse_decorators = [(0, common_1.Get)('GetByAdmin/:id')];
        _getAllReponses_decorators = [(0, common_1.Get)('get/all/:id')];
        _exportUtilisateursConnecte_decorators = [(0, common_1.Get)('exportExcel/all/:id')];
        _exportPDFReponses_decorators = [(0, common_1.Get)('export-pdf/reponses/:id')];
        _exportCSV_decorators = [(0, common_1.Get)('export-csv/reponses/:id')];
        _countReponses_decorators = [(0, common_1.Get)("/count/All/Reponses/:id")];
        _deatilleReponse_decorators = [(0, common_1.Get)("/detailles/:id")];
        _getStatsParEnquete_decorators = [(0, common_1.Get)('stats/enquetes/:id')];
        _getTopUtilisateurs_decorators = [(0, common_1.Get)('top-users/:id')];
        _getTauxCompletionGlobal_decorators = [(0, common_1.Get)('taux-completion/:id')];
        _getParticipationParPeriode_decorators = [(0, common_1.Get)('participation-periode/:id')];
        _getEvolutionReponses_decorators = [(0, common_1.Get)('evolution-reponses/:id')];
        _getSurveyStatusStats_decorators = [(0, common_1.Get)('survey-status/:id')];
        _getParticipationParEnquete_decorators = [(0, common_1.Get)('participation-enquetes/:id')];
        _getTopEnquetes_decorators = [(0, common_1.Get)('top-enquetes/:id')];
        _getRecentEnquetes_decorators = [(0, common_1.Get)('recent-enquetes/:id')];
        _getRecentActivities_decorators = [(0, common_1.Get)('recent-activities/:id')];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: function (obj) { return "update" in obj; }, get: function (obj) { return obj.update; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: function (obj) { return "remove" in obj; }, get: function (obj) { return obj.remove; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAllReponse_decorators, { kind: "method", name: "getAllReponse", static: false, private: false, access: { has: function (obj) { return "getAllReponse" in obj; }, get: function (obj) { return obj.getAllReponse; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAllReponses_decorators, { kind: "method", name: "getAllReponses", static: false, private: false, access: { has: function (obj) { return "getAllReponses" in obj; }, get: function (obj) { return obj.getAllReponses; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _exportUtilisateursConnecte_decorators, { kind: "method", name: "exportUtilisateursConnecte", static: false, private: false, access: { has: function (obj) { return "exportUtilisateursConnecte" in obj; }, get: function (obj) { return obj.exportUtilisateursConnecte; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _exportPDFReponses_decorators, { kind: "method", name: "exportPDFReponses", static: false, private: false, access: { has: function (obj) { return "exportPDFReponses" in obj; }, get: function (obj) { return obj.exportPDFReponses; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _exportCSV_decorators, { kind: "method", name: "exportCSV", static: false, private: false, access: { has: function (obj) { return "exportCSV" in obj; }, get: function (obj) { return obj.exportCSV; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _countReponses_decorators, { kind: "method", name: "countReponses", static: false, private: false, access: { has: function (obj) { return "countReponses" in obj; }, get: function (obj) { return obj.countReponses; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deatilleReponse_decorators, { kind: "method", name: "deatilleReponse", static: false, private: false, access: { has: function (obj) { return "deatilleReponse" in obj; }, get: function (obj) { return obj.deatilleReponse; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getStatsParEnquete_decorators, { kind: "method", name: "getStatsParEnquete", static: false, private: false, access: { has: function (obj) { return "getStatsParEnquete" in obj; }, get: function (obj) { return obj.getStatsParEnquete; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTopUtilisateurs_decorators, { kind: "method", name: "getTopUtilisateurs", static: false, private: false, access: { has: function (obj) { return "getTopUtilisateurs" in obj; }, get: function (obj) { return obj.getTopUtilisateurs; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTauxCompletionGlobal_decorators, { kind: "method", name: "getTauxCompletionGlobal", static: false, private: false, access: { has: function (obj) { return "getTauxCompletionGlobal" in obj; }, get: function (obj) { return obj.getTauxCompletionGlobal; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getParticipationParPeriode_decorators, { kind: "method", name: "getParticipationParPeriode", static: false, private: false, access: { has: function (obj) { return "getParticipationParPeriode" in obj; }, get: function (obj) { return obj.getParticipationParPeriode; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getEvolutionReponses_decorators, { kind: "method", name: "getEvolutionReponses", static: false, private: false, access: { has: function (obj) { return "getEvolutionReponses" in obj; }, get: function (obj) { return obj.getEvolutionReponses; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSurveyStatusStats_decorators, { kind: "method", name: "getSurveyStatusStats", static: false, private: false, access: { has: function (obj) { return "getSurveyStatusStats" in obj; }, get: function (obj) { return obj.getSurveyStatusStats; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getParticipationParEnquete_decorators, { kind: "method", name: "getParticipationParEnquete", static: false, private: false, access: { has: function (obj) { return "getParticipationParEnquete" in obj; }, get: function (obj) { return obj.getParticipationParEnquete; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTopEnquetes_decorators, { kind: "method", name: "getTopEnquetes", static: false, private: false, access: { has: function (obj) { return "getTopEnquetes" in obj; }, get: function (obj) { return obj.getTopEnquetes; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRecentEnquetes_decorators, { kind: "method", name: "getRecentEnquetes", static: false, private: false, access: { has: function (obj) { return "getRecentEnquetes" in obj; }, get: function (obj) { return obj.getRecentEnquetes; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRecentActivities_decorators, { kind: "method", name: "getRecentActivities", static: false, private: false, access: { has: function (obj) { return "getRecentActivities" in obj; }, get: function (obj) { return obj.getRecentActivities; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReponseController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReponseController = _classThis;
}();
exports.ReponseController = ReponseController;
