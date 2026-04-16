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
exports.Question = void 0;
var enquete_entity_1 = require("../../enquete/entities/enquete.entity");
var option_entity_1 = require("../../option/entities/option.entity");
var typeorm_1 = require("typeorm");
var Question = function () {
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
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _obligatoire_decorators;
    var _obligatoire_initializers = [];
    var _obligatoire_extraInitializers = [];
    var _active_decorators;
    var _active_initializers = [];
    var _active_extraInitializers = [];
    var _create_at_decorators;
    var _create_at_initializers = [];
    var _create_at_extraInitializers = [];
    var _update_at_decorators;
    var _update_at_initializers = [];
    var _update_at_extraInitializers = [];
    var _options_decorators;
    var _options_initializers = [];
    var _options_extraInitializers = [];
    var _enquetes_decorators;
    var _enquetes_initializers = [];
    var _enquetes_extraInitializers = [];
    var _ratingConfig_decorators;
    var _ratingConfig_initializers = [];
    var _ratingConfig_extraInitializers = [];
    var _scaleConfig_decorators;
    var _scaleConfig_initializers = [];
    var _scaleConfig_extraInitializers = [];
    var Question = _classThis = /** @class */ (function () {
        function Question_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.texte = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _texte_initializers, void 0));
            this.type = (__runInitializers(this, _texte_extraInitializers), __runInitializers(this, _type_initializers, void 0));
            this.obligatoire = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _obligatoire_initializers, void 0));
            this.active = (__runInitializers(this, _obligatoire_extraInitializers), __runInitializers(this, _active_initializers, void 0));
            this.create_at = (__runInitializers(this, _active_extraInitializers), __runInitializers(this, _create_at_initializers, void 0));
            this.update_at = (__runInitializers(this, _create_at_extraInitializers), __runInitializers(this, _update_at_initializers, void 0));
            this.options = (__runInitializers(this, _update_at_extraInitializers), __runInitializers(this, _options_initializers, void 0));
            this.enquetes = (__runInitializers(this, _options_extraInitializers), __runInitializers(this, _enquetes_initializers, void 0));
            // Ajouter ces colonnes pour les nouveaux types
            this.ratingConfig = (__runInitializers(this, _enquetes_extraInitializers), __runInitializers(this, _ratingConfig_initializers, void 0));
            this.scaleConfig = (__runInitializers(this, _ratingConfig_extraInitializers), __runInitializers(this, _scaleConfig_initializers, void 0));
            __runInitializers(this, _scaleConfig_extraInitializers);
        }
        return Question_1;
    }());
    __setFunctionName(_classThis, "Question");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _texte_decorators = [(0, typeorm_1.Column)()];
        _type_decorators = [(0, typeorm_1.Column)({ default: 'text' })];
        _obligatoire_decorators = [(0, typeorm_1.Column)({ default: false })];
        _active_decorators = [(0, typeorm_1.Column)({ default: true })];
        _create_at_decorators = [(0, typeorm_1.Column)({ default: function () { return 'NOW()'; } })];
        _update_at_decorators = [(0, typeorm_1.Column)({ default: null, nullable: true })];
        _options_decorators = [(0, typeorm_1.OneToMany)(function () { return option_entity_1.Option; }, function (option) { return option.question; }, { cascade: true })];
        _enquetes_decorators = [(0, typeorm_1.ManyToMany)(function () { return enquete_entity_1.Enquete; }, function (enquete) { return enquete.questions; }, {
                cascade: true,
                onDelete: 'CASCADE'
            })];
        _ratingConfig_decorators = [(0, typeorm_1.Column)({ type: 'json', nullable: true })];
        _scaleConfig_decorators = [(0, typeorm_1.Column)({ type: 'json', nullable: true })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _texte_decorators, { kind: "field", name: "texte", static: false, private: false, access: { has: function (obj) { return "texte" in obj; }, get: function (obj) { return obj.texte; }, set: function (obj, value) { obj.texte = value; } }, metadata: _metadata }, _texte_initializers, _texte_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _obligatoire_decorators, { kind: "field", name: "obligatoire", static: false, private: false, access: { has: function (obj) { return "obligatoire" in obj; }, get: function (obj) { return obj.obligatoire; }, set: function (obj, value) { obj.obligatoire = value; } }, metadata: _metadata }, _obligatoire_initializers, _obligatoire_extraInitializers);
        __esDecorate(null, null, _active_decorators, { kind: "field", name: "active", static: false, private: false, access: { has: function (obj) { return "active" in obj; }, get: function (obj) { return obj.active; }, set: function (obj, value) { obj.active = value; } }, metadata: _metadata }, _active_initializers, _active_extraInitializers);
        __esDecorate(null, null, _create_at_decorators, { kind: "field", name: "create_at", static: false, private: false, access: { has: function (obj) { return "create_at" in obj; }, get: function (obj) { return obj.create_at; }, set: function (obj, value) { obj.create_at = value; } }, metadata: _metadata }, _create_at_initializers, _create_at_extraInitializers);
        __esDecorate(null, null, _update_at_decorators, { kind: "field", name: "update_at", static: false, private: false, access: { has: function (obj) { return "update_at" in obj; }, get: function (obj) { return obj.update_at; }, set: function (obj, value) { obj.update_at = value; } }, metadata: _metadata }, _update_at_initializers, _update_at_extraInitializers);
        __esDecorate(null, null, _options_decorators, { kind: "field", name: "options", static: false, private: false, access: { has: function (obj) { return "options" in obj; }, get: function (obj) { return obj.options; }, set: function (obj, value) { obj.options = value; } }, metadata: _metadata }, _options_initializers, _options_extraInitializers);
        __esDecorate(null, null, _enquetes_decorators, { kind: "field", name: "enquetes", static: false, private: false, access: { has: function (obj) { return "enquetes" in obj; }, get: function (obj) { return obj.enquetes; }, set: function (obj, value) { obj.enquetes = value; } }, metadata: _metadata }, _enquetes_initializers, _enquetes_extraInitializers);
        __esDecorate(null, null, _ratingConfig_decorators, { kind: "field", name: "ratingConfig", static: false, private: false, access: { has: function (obj) { return "ratingConfig" in obj; }, get: function (obj) { return obj.ratingConfig; }, set: function (obj, value) { obj.ratingConfig = value; } }, metadata: _metadata }, _ratingConfig_initializers, _ratingConfig_extraInitializers);
        __esDecorate(null, null, _scaleConfig_decorators, { kind: "field", name: "scaleConfig", static: false, private: false, access: { has: function (obj) { return "scaleConfig" in obj; }, get: function (obj) { return obj.scaleConfig; }, set: function (obj, value) { obj.scaleConfig = value; } }, metadata: _metadata }, _scaleConfig_initializers, _scaleConfig_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Question = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Question = _classThis;
}();
exports.Question = Question;
