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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Option = void 0;
var question_entity_1 = require("../../question/entities/question.entity");
var typeorm_1 = require("typeorm");
var Option = function () {
    var _classDecorators = [(0, typeorm_1.Entity)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _texte_decorators;
    var _texte_initializers = [];
    var _texte_extraInitializers = [];
    var _order_decorators;
    var _order_initializers = [];
    var _order_extraInitializers = [];
    var _active_decorators;
    var _active_initializers = [];
    var _active_extraInitializers = [];
    var _create_at_decorators;
    var _create_at_initializers = [];
    var _create_at_extraInitializers = [];
    var _update_at_decorators;
    var _update_at_initializers = [];
    var _update_at_extraInitializers = [];
    var _question_decorators;
    var _question_initializers = [];
    var _question_extraInitializers = [];
    var Option = _classThis = /** @class */ (function () {
        function Option_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.texte = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _texte_initializers, void 0));
            this.order = (__runInitializers(this, _texte_extraInitializers), __runInitializers(this, _order_initializers, void 0));
            this.active = (__runInitializers(this, _order_extraInitializers), __runInitializers(this, _active_initializers, void 0));
            this.create_at = (__runInitializers(this, _active_extraInitializers), __runInitializers(this, _create_at_initializers, void 0));
            this.update_at = (__runInitializers(this, _create_at_extraInitializers), __runInitializers(this, _update_at_initializers, void 0));
            // Relation vers Question
            this.question = (__runInitializers(this, _update_at_extraInitializers), __runInitializers(this, _question_initializers, void 0));
            __runInitializers(this, _question_extraInitializers);
        }
        return Option_1;
    }());
    __setFunctionName(_classThis, "Option");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _texte_decorators = [(0, typeorm_1.Column)()];
        _order_decorators = [(0, typeorm_1.Column)()];
        _active_decorators = [(0, typeorm_1.Column)({ default: true })];
        _create_at_decorators = [(0, typeorm_1.Column)({ default: function () { return 'NOW()'; } })];
        _update_at_decorators = [(0, typeorm_1.Column)({ default: null })];
        _question_decorators = [(0, typeorm_1.ManyToOne)(function () { return question_entity_1.Question; }, function (question) { return question.options; }, { onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'question_id' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _texte_decorators, { kind: "field", name: "texte", static: false, private: false, access: { has: function (obj) { return "texte" in obj; }, get: function (obj) { return obj.texte; }, set: function (obj, value) { obj.texte = value; } }, metadata: _metadata }, _texte_initializers, _texte_extraInitializers);
        __esDecorate(null, null, _order_decorators, { kind: "field", name: "order", static: false, private: false, access: { has: function (obj) { return "order" in obj; }, get: function (obj) { return obj.order; }, set: function (obj, value) { obj.order = value; } }, metadata: _metadata }, _order_initializers, _order_extraInitializers);
        __esDecorate(null, null, _active_decorators, { kind: "field", name: "active", static: false, private: false, access: { has: function (obj) { return "active" in obj; }, get: function (obj) { return obj.active; }, set: function (obj, value) { obj.active = value; } }, metadata: _metadata }, _active_initializers, _active_extraInitializers);
        __esDecorate(null, null, _create_at_decorators, { kind: "field", name: "create_at", static: false, private: false, access: { has: function (obj) { return "create_at" in obj; }, get: function (obj) { return obj.create_at; }, set: function (obj, value) { obj.create_at = value; } }, metadata: _metadata }, _create_at_initializers, _create_at_extraInitializers);
        __esDecorate(null, null, _update_at_decorators, { kind: "field", name: "update_at", static: false, private: false, access: { has: function (obj) { return "update_at" in obj; }, get: function (obj) { return obj.update_at; }, set: function (obj, value) { obj.update_at = value; } }, metadata: _metadata }, _update_at_initializers, _update_at_extraInitializers);
        __esDecorate(null, null, _question_decorators, { kind: "field", name: "question", static: false, private: false, access: { has: function (obj) { return "question" in obj; }, get: function (obj) { return obj.question; }, set: function (obj, value) { obj.question = value; } }, metadata: _metadata }, _question_initializers, _question_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Option = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Option = _classThis;
}();
exports.Option = Option;
