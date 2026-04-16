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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiQuestionsController = void 0;
// ai-questions.controller.ts
var common_1 = require("@nestjs/common");
var rxjs_1 = require("rxjs");
var AiQuestionsController = function () {
    var _classDecorators = [(0, common_1.Controller)('ai-questions')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _generate_decorators;
    var _generateStream_decorators;
    var _streamGeneration_decorators;
    var _getAllGenerations_decorators;
    var _getGenerationById_decorators;
    var _subscribeToEvents_decorators;
    var AiQuestionsController = _classThis = /** @class */ (function () {
        function AiQuestionsController_1(aiService) {
            this.aiService = (__runInitializers(this, _instanceExtraInitializers), aiService);
        }
        AiQuestionsController_1.prototype.generate = function (question) {
            return this.aiService.generateQuestion(question)
                .then(function (res) { return ({ result: res, timestamp: new Date() }); });
        };
        AiQuestionsController_1.prototype.generateStream = function (question) {
            return this.aiService.generateQuestion(question)
                .then(function (res) { return ({ result: res, timestamp: new Date() }); });
        };
        AiQuestionsController_1.prototype.streamGeneration = function (prompt) {
            return this.aiService.generateQuestionStream(decodeURIComponent(prompt))
                .pipe((0, rxjs_1.map)(function (event) { return ({
                data: event,
                type: 'generation-update'
            }); }));
        };
        AiQuestionsController_1.prototype.getAllGenerations = function () {
            return this.aiService.getAllGenerations();
        };
        AiQuestionsController_1.prototype.getGenerationById = function (id) {
            var generation = this.aiService.getGenerationById(id);
            if (!generation) {
                return { error: 'Generation not found' };
            }
            return generation;
        };
        AiQuestionsController_1.prototype.subscribeToEvents = function () {
            return this.aiService.subscribeToGenerations().pipe((0, rxjs_1.map)(function (event) { return ({
                data: event,
                type: 'generation-event'
            }); }));
        };
        return AiQuestionsController_1;
    }());
    __setFunctionName(_classThis, "AiQuestionsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _generate_decorators = [(0, common_1.Post)('generate')];
        _generateStream_decorators = [(0, common_1.Post)('generate-stream')];
        _streamGeneration_decorators = [(0, common_1.Get)('stream/:prompt'), (0, common_1.Sse)('stream')];
        _getAllGenerations_decorators = [(0, common_1.Get)('generations')];
        _getGenerationById_decorators = [(0, common_1.Get)('generations/:id')];
        _subscribeToEvents_decorators = [(0, common_1.Sse)('events')];
        __esDecorate(_classThis, null, _generate_decorators, { kind: "method", name: "generate", static: false, private: false, access: { has: function (obj) { return "generate" in obj; }, get: function (obj) { return obj.generate; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateStream_decorators, { kind: "method", name: "generateStream", static: false, private: false, access: { has: function (obj) { return "generateStream" in obj; }, get: function (obj) { return obj.generateStream; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _streamGeneration_decorators, { kind: "method", name: "streamGeneration", static: false, private: false, access: { has: function (obj) { return "streamGeneration" in obj; }, get: function (obj) { return obj.streamGeneration; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAllGenerations_decorators, { kind: "method", name: "getAllGenerations", static: false, private: false, access: { has: function (obj) { return "getAllGenerations" in obj; }, get: function (obj) { return obj.getAllGenerations; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getGenerationById_decorators, { kind: "method", name: "getGenerationById", static: false, private: false, access: { has: function (obj) { return "getGenerationById" in obj; }, get: function (obj) { return obj.getGenerationById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _subscribeToEvents_decorators, { kind: "method", name: "subscribeToEvents", static: false, private: false, access: { has: function (obj) { return "subscribeToEvents" in obj; }, get: function (obj) { return obj.subscribeToEvents; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AiQuestionsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AiQuestionsController = _classThis;
}();
exports.AiQuestionsController = AiQuestionsController;
