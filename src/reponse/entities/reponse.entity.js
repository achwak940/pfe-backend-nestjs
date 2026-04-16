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
exports.Reponse = void 0;
var enquete_entity_1 = require("../../enquete/entities/enquete.entity");
var question_entity_1 = require("../../question/entities/question.entity");
var utilisateur_entity_1 = require("../../utilisateur/entities/utilisateur.entity");
var typeorm_1 = require("typeorm");
var option_entity_1 = require("../../option/entities/option.entity");
var Reponse = function () {
    var _classDecorators = [(0, typeorm_1.Entity)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _utilisateur_decorators;
    var _utilisateur_initializers = [];
    var _utilisateur_extraInitializers = [];
    var _question_decorators;
    var _question_initializers = [];
    var _question_extraInitializers = [];
    var _option_decorators;
    var _option_initializers = [];
    var _option_extraInitializers = [];
    var _enquete_decorators;
    var _enquete_initializers = [];
    var _enquete_extraInitializers = [];
    var _reponseTexte_decorators;
    var _reponseTexte_initializers = [];
    var _reponseTexte_extraInitializers = [];
    var _dateReponse_decorators;
    var _dateReponse_initializers = [];
    var _dateReponse_extraInitializers = [];
    var Reponse = _classThis = /** @class */ (function () {
        function Reponse_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            //chaque user admet un seul reponse 
            this.utilisateur = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _utilisateur_initializers, void 0));
            //chaque reponse liee a un seul question
            this.question = (__runInitializers(this, _utilisateur_extraInitializers), __runInitializers(this, _question_initializers, void 0));
            // option_id si c’est question choix multiple/unique, sinon null
            this.option = (__runInitializers(this, _question_extraInitializers), __runInitializers(this, _option_initializers, void 0));
            // chaque reponse liee a une seul enquete
            this.enquete = (__runInitializers(this, _option_extraInitializers), __runInitializers(this, _enquete_initializers, void 0));
            this.reponseTexte = (__runInitializers(this, _enquete_extraInitializers), __runInitializers(this, _reponseTexte_initializers, void 0));
            // waqt li jawweb utilisateur
            this.dateReponse = (__runInitializers(this, _reponseTexte_extraInitializers), __runInitializers(this, _dateReponse_initializers, void 0));
            __runInitializers(this, _dateReponse_extraInitializers);
        }
        return Reponse_1;
    }());
    __setFunctionName(_classThis, "Reponse");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _utilisateur_decorators = [(0, typeorm_1.ManyToOne)(function () { return utilisateur_entity_1.Utilisateur; }, { onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'utilisateur_id' })];
        _question_decorators = [(0, typeorm_1.ManyToOne)(function () { return question_entity_1.Question; }, { onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'question_id' })];
        _option_decorators = [(0, typeorm_1.ManyToOne)(function () { return option_entity_1.Option; }, { nullable: true }), (0, typeorm_1.JoinColumn)({ name: 'option_id' })];
        _enquete_decorators = [(0, typeorm_1.ManyToOne)(function () { return enquete_entity_1.Enquete; }, { onDelete: 'CASCADE' }), (0, typeorm_1.JoinColumn)({ name: 'enquete_id' })];
        _reponseTexte_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _dateReponse_decorators = [(0, typeorm_1.Column)({ type: 'timestamp', default: function () { return 'NOW()'; } })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _utilisateur_decorators, { kind: "field", name: "utilisateur", static: false, private: false, access: { has: function (obj) { return "utilisateur" in obj; }, get: function (obj) { return obj.utilisateur; }, set: function (obj, value) { obj.utilisateur = value; } }, metadata: _metadata }, _utilisateur_initializers, _utilisateur_extraInitializers);
        __esDecorate(null, null, _question_decorators, { kind: "field", name: "question", static: false, private: false, access: { has: function (obj) { return "question" in obj; }, get: function (obj) { return obj.question; }, set: function (obj, value) { obj.question = value; } }, metadata: _metadata }, _question_initializers, _question_extraInitializers);
        __esDecorate(null, null, _option_decorators, { kind: "field", name: "option", static: false, private: false, access: { has: function (obj) { return "option" in obj; }, get: function (obj) { return obj.option; }, set: function (obj, value) { obj.option = value; } }, metadata: _metadata }, _option_initializers, _option_extraInitializers);
        __esDecorate(null, null, _enquete_decorators, { kind: "field", name: "enquete", static: false, private: false, access: { has: function (obj) { return "enquete" in obj; }, get: function (obj) { return obj.enquete; }, set: function (obj, value) { obj.enquete = value; } }, metadata: _metadata }, _enquete_initializers, _enquete_extraInitializers);
        __esDecorate(null, null, _reponseTexte_decorators, { kind: "field", name: "reponseTexte", static: false, private: false, access: { has: function (obj) { return "reponseTexte" in obj; }, get: function (obj) { return obj.reponseTexte; }, set: function (obj, value) { obj.reponseTexte = value; } }, metadata: _metadata }, _reponseTexte_initializers, _reponseTexte_extraInitializers);
        __esDecorate(null, null, _dateReponse_decorators, { kind: "field", name: "dateReponse", static: false, private: false, access: { has: function (obj) { return "dateReponse" in obj; }, get: function (obj) { return obj.dateReponse; }, set: function (obj, value) { obj.dateReponse = value; } }, metadata: _metadata }, _dateReponse_initializers, _dateReponse_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Reponse = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Reponse = _classThis;
}();
exports.Reponse = Reponse;
