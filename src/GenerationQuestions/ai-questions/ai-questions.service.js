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
exports.AiQuestionsService = void 0;
// ai-questions.service.ts
var common_1 = require("@nestjs/common");
var axios_1 = require("axios");
var rxjs_1 = require("rxjs");
var AiQuestionsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AiQuestionsService = _classThis = /** @class */ (function () {
        function AiQuestionsService_1() {
            this.logger = new common_1.Logger(AiQuestionsService.name);
            this.activeGenerations = new Map();
            this.generationEvents = new rxjs_1.Subject();
        }
        // Détection de langue simple
        AiQuestionsService_1.prototype.detectLanguage = function (text) {
            var arabicPattern = /[\u0600-\u06FF]/;
            var frenchPattern = /[éèêëàâçîïôûùüÿñ]/i;
            if (arabicPattern.test(text))
                return 'ar';
            if (frenchPattern.test(text))
                return 'fr';
            return 'en';
        };
        // Amélioration du prompt pour support multilingue
        AiQuestionsService_1.prototype.enhancePrompt = function (prompt, language) {
            var languageInstruction = {
                'ar': 'الرجاء الإجابة باللغة العربية الفصحى. قم بتوليد سؤال مناسب بالعربية.',
                'fr': 'Veuillez répondre en français. Générez une question pertinente en français.',
                'en': 'Please answer in English. Generate a relevant question in English.'
            };
            var basePrompt = "Generate a relevant survey question based on this context: ".concat(prompt);
            return "".concat(languageInstruction[language] || languageInstruction.en, "\n\nContexte: ").concat(prompt, "\n\nQuestion g\u00E9n\u00E9r\u00E9e:");
        };
        AiQuestionsService_1.prototype.generateQuestion = function (prompt, generationId) {
            return __awaiter(this, void 0, void 0, function () {
                var id, detectedLanguage, event, enhancedPrompt, response, result, completedEvent, error_1, errorEvent;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            id = generationId || this.generateId();
                            detectedLanguage = this.detectLanguage(prompt);
                            event = {
                                id: id,
                                status: 'generating',
                                prompt: prompt,
                                timestamp: new Date(),
                                detectedLanguage: detectedLanguage
                            };
                            this.activeGenerations.set(id, event);
                            this.generationEvents.next(event);
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            enhancedPrompt = this.enhancePrompt(prompt, detectedLanguage);
                            return [4 /*yield*/, axios_1.default.post('http://localhost:11434/api/generate', {
                                    model: 'phi',
                                    prompt: enhancedPrompt,
                                    stream: false,
                                    options: {
                                        temperature: 0.7,
                                        top_p: 0.9
                                    }
                                })];
                        case 2:
                            response = _b.sent();
                            result = (_a = response.data) === null || _a === void 0 ? void 0 : _a.response;
                            // Nettoyage du résultat
                            result = this.cleanResponse(result);
                            completedEvent = __assign(__assign({}, event), { status: 'completed', result: result, timestamp: new Date() });
                            this.activeGenerations.set(id, completedEvent);
                            this.generationEvents.next(completedEvent);
                            return [2 /*return*/, result];
                        case 3:
                            error_1 = _b.sent();
                            this.logger.error("OLLAMA ERROR: ".concat(error_1.message));
                            errorEvent = __assign(__assign({}, event), { status: 'error', error: error_1.message, timestamp: new Date() });
                            this.activeGenerations.set(id, errorEvent);
                            this.generationEvents.next(errorEvent);
                            throw error_1;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        AiQuestionsService_1.prototype.cleanResponse = function (response) {
            // Supprimer les instructions en trop
            var cleaned = response.replace(/^(Question générée:|Generated question:|السؤال المولد:)/i, '');
            cleaned = cleaned.trim();
            // S'assurer que la question se termine par un point d'interrogation
            if (!cleaned.match(/[?؟]\s*$/)) {
                cleaned += '?';
            }
            return cleaned;
        };
        AiQuestionsService_1.prototype.generateQuestionStream = function (prompt) {
            var _this = this;
            var id = this.generateId();
            var subject = new rxjs_1.Subject();
            this.generateQuestion(prompt, id).catch(function (error) {
                subject.error(error);
            });
            var interval = setInterval(function () {
                var event = _this.activeGenerations.get(id);
                if (event) {
                    subject.next(event);
                    if (event.status !== 'generating') {
                        clearInterval(interval);
                        subject.complete();
                    }
                }
            }, 500);
            return subject.asObservable();
        };
        AiQuestionsService_1.prototype.getAllGenerations = function () {
            return Array.from(this.activeGenerations.values())
                .sort(function (a, b) { return b.timestamp.getTime() - a.timestamp.getTime(); });
        };
        AiQuestionsService_1.prototype.getGenerationById = function (id) {
            return this.activeGenerations.get(id);
        };
        AiQuestionsService_1.prototype.subscribeToGenerations = function () {
            return this.generationEvents.asObservable();
        };
        AiQuestionsService_1.prototype.generateId = function () {
            return "".concat(Date.now(), "-").concat(Math.random().toString(36).substr(2, 9));
        };
        AiQuestionsService_1.prototype.cleanupOldGenerations = function () {
            var oneHourAgo = Date.now() - 3600000;
            for (var _i = 0, _a = this.activeGenerations.entries(); _i < _a.length; _i++) {
                var _b = _a[_i], id = _b[0], event_1 = _b[1];
                if (event_1.timestamp.getTime() < oneHourAgo) {
                    this.activeGenerations.delete(id);
                }
            }
        };
        return AiQuestionsService_1;
    }());
    __setFunctionName(_classThis, "AiQuestionsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AiQuestionsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AiQuestionsService = _classThis;
}();
exports.AiQuestionsService = AiQuestionsService;
