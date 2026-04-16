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
exports.QuestionService = void 0;
var common_1 = require("@nestjs/common");
var QuestionService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var QuestionService = _classThis = /** @class */ (function () {
        function QuestionService_1(questionrepo) {
            this.questionrepo = questionrepo;
        }
        QuestionService_1.prototype.create = function (createQuestionDto) {
            // Cette méthode n'est pas utilisée, on utilise ajoutQuestionAvecOption
        };
        QuestionService_1.prototype.getAllQuestions = function () {
            return __awaiter(this, void 0, void 0, function () {
                var questions;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.questionrepo.find({
                                relations: ['options']
                            })];
                        case 1:
                            questions = _a.sent();
                            if (questions.length === 0) {
                                return [2 /*return*/, {
                                        message: 'aucun question trouvée',
                                        data: [],
                                    }];
                            }
                            return [2 /*return*/, {
                                    message: 'voici liste des questions',
                                    data: questions,
                                }];
                    }
                });
            });
        };
        QuestionService_1.prototype.findOne = function (id) {
            return "This action returns a #".concat(id, " question");
        };
        QuestionService_1.prototype.getQuestionUser = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var questions;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.questionrepo
                                .createQueryBuilder('question')
                                .leftJoinAndSelect('question.options', 'option')
                                .leftJoin('question.enquetes', 'enquete')
                                .leftJoin('enquete.user', 'user')
                                .where('user.id = :userId', { userId: userId })
                                .getMany()];
                        case 1:
                            questions = _a.sent();
                            if (questions.length === 0) {
                                return [2 /*return*/, {
                                        message: 'Aucune question trouvée pour cet utilisateur',
                                        data: [],
                                    }];
                            }
                            return [2 /*return*/, {
                                    message: "Voici les questions de l'utilisateur",
                                    data: questions,
                                }];
                    }
                });
            });
        };
        QuestionService_1.prototype.update = function (id, updateQuestionDto) {
            return "This action updates a #".concat(id, " question");
        };
        QuestionService_1.prototype.remove = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                var questionAsupprimer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.questionrepo.delete(id)];
                        case 1:
                            questionAsupprimer = _a.sent();
                            if (questionAsupprimer.affected === 0) {
                                return [2 /*return*/, {
                                        message: 'Question non trouvée',
                                    }];
                            }
                            return [2 /*return*/, {
                                    message: 'Question supprimée avec succès',
                                    data: questionAsupprimer,
                                }];
                    }
                });
            });
        };
        QuestionService_1.prototype.ajoutQuestionAvecOption = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var questionData, question, saveQuestion;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            questionData = {
                                texte: dto.texte,
                                type: dto.type,
                                obligatoire: dto.obligatoire,
                                active: dto.active,
                            };
                            // Gérer les options selon le type
                            if (dto.type === 'multiple' || dto.type === 'unique') {
                                questionData.options = dto.options || [];
                            }
                            else {
                                questionData.options = [];
                            }
                            // Ajouter la configuration pour le type rating (étoiles)
                            if (dto.type === 'rating') {
                                questionData.ratingConfig = dto.ratingConfig || {
                                    maxStars: 5,
                                    minValue: 1,
                                    maxValue: 5
                                };
                                questionData.scaleConfig = null;
                            }
                            // Ajouter la configuration pour le type scale (échelle)
                            else if (dto.type === 'scale') {
                                questionData.scaleConfig = dto.scaleConfig || {
                                    minLabel: 'Pas satisfait',
                                    maxLabel: 'Très satisfait',
                                    steps: 5
                                };
                                questionData.ratingConfig = null;
                            }
                            // Pour les autres types, supprimer les configurations
                            else {
                                questionData.ratingConfig = null;
                                questionData.scaleConfig = null;
                            }
                            question = this.questionrepo.create(questionData);
                            return [4 /*yield*/, this.questionrepo.save(question)];
                        case 1:
                            saveQuestion = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Question ajoutée avec succès',
                                    data: saveQuestion,
                                }];
                    }
                });
            });
        };
        QuestionService_1.prototype.modifierQuestion = function (dto, id) {
            return __awaiter(this, void 0, void 0, function () {
                var existingQuestion, updateData, finalType, question, saveQuestion;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.questionrepo.findOne({
                                where: { id: id },
                                relations: ['options']
                            })];
                        case 1:
                            existingQuestion = _a.sent();
                            if (!existingQuestion) {
                                return [2 /*return*/, {
                                        message: 'Question non trouvée',
                                    }];
                            }
                            updateData = {
                                id: id,
                                texte: dto.texte !== undefined ? dto.texte : existingQuestion.texte,
                                type: dto.type !== undefined ? dto.type : existingQuestion.type,
                                obligatoire: dto.obligatoire !== undefined ? dto.obligatoire : existingQuestion.obligatoire,
                                active: dto.active !== undefined ? dto.active : existingQuestion.active,
                                update_at: new Date(),
                            };
                            finalType = updateData.type;
                            // Gérer les options selon le type
                            if (finalType === 'multiple' || finalType === 'unique') {
                                if (dto.options !== undefined) {
                                    updateData.options = dto.options;
                                }
                                else {
                                    updateData.options = existingQuestion.options;
                                }
                            }
                            else {
                                updateData.options = [];
                            }
                            // Gérer les configurations selon le type
                            if (finalType === 'rating') {
                                updateData.ratingConfig = dto.ratingConfig !== undefined
                                    ? dto.ratingConfig
                                    : (existingQuestion.ratingConfig || { maxStars: 5, minValue: 1, maxValue: 5 });
                                updateData.scaleConfig = null;
                            }
                            else if (finalType === 'scale') {
                                updateData.scaleConfig = dto.scaleConfig !== undefined
                                    ? dto.scaleConfig
                                    : (existingQuestion.scaleConfig || { minLabel: 'Pas satisfait', maxLabel: 'Très satisfait', steps: 5 });
                                updateData.ratingConfig = null;
                            }
                            else {
                                updateData.ratingConfig = null;
                                updateData.scaleConfig = null;
                            }
                            return [4 /*yield*/, this.questionrepo.preload(updateData)];
                        case 2:
                            question = _a.sent();
                            if (!question) {
                                return [2 /*return*/, {
                                        message: 'Question non trouvée',
                                    }];
                            }
                            return [4 /*yield*/, this.questionrepo.save(question)];
                        case 3:
                            saveQuestion = _a.sent();
                            return [2 /*return*/, {
                                    message: 'Question modifiée avec succès',
                                    data: saveQuestion,
                                }];
                    }
                });
            });
        };
        return QuestionService_1;
    }());
    __setFunctionName(_classThis, "QuestionService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        QuestionService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return QuestionService = _classThis;
}();
exports.QuestionService = QuestionService;
