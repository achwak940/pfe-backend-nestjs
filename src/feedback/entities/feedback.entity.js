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
exports.Feedback = void 0;
var enquete_entity_1 = require("../../enquete/entities/enquete.entity");
var utilisateur_entity_1 = require("../../utilisateur/entities/utilisateur.entity");
var typeorm_1 = require("typeorm");
var enum_TypeFeedback_1 = require("./enum.TypeFeedback");
var enum_feedbackStatut_1 = require("./enum.feedbackStatut");
var Feedback = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('feedback')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _utilisateur_decorators;
    var _utilisateur_initializers = [];
    var _utilisateur_extraInitializers = [];
    var _enquete_decorators;
    var _enquete_initializers = [];
    var _enquete_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _message_decorators;
    var _message_initializers = [];
    var _message_extraInitializers = [];
    var _statut_decorators;
    var _statut_initializers = [];
    var _statut_extraInitializers = [];
    var _date_creation_decorators;
    var _date_creation_initializers = [];
    var _date_creation_extraInitializers = [];
    var Feedback = _classThis = /** @class */ (function () {
        function Feedback_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.utilisateur = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _utilisateur_initializers, void 0));
            this.enquete = (__runInitializers(this, _utilisateur_extraInitializers), __runInitializers(this, _enquete_initializers, void 0));
            this.type = (__runInitializers(this, _enquete_extraInitializers), __runInitializers(this, _type_initializers, void 0));
            this.message = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _message_initializers, void 0));
            this.statut = (__runInitializers(this, _message_extraInitializers), __runInitializers(this, _statut_initializers, void 0));
            this.date_creation = (__runInitializers(this, _statut_extraInitializers), __runInitializers(this, _date_creation_initializers, void 0));
            __runInitializers(this, _date_creation_extraInitializers);
        }
        return Feedback_1;
    }());
    __setFunctionName(_classThis, "Feedback");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _utilisateur_decorators = [(0, typeorm_1.ManyToOne)(function () { return utilisateur_entity_1.Utilisateur; }, function (user) { return user.feedbacks; }, { nullable: true })];
        _enquete_decorators = [(0, typeorm_1.ManyToOne)(function () { return enquete_entity_1.Enquete; }, function (enquete) { return enquete.feedbacks; }, { nullable: true })];
        _type_decorators = [(0, typeorm_1.Column)({
                type: 'enum',
                enum: enum_TypeFeedback_1.FeedbackType,
                default: enum_TypeFeedback_1.FeedbackType.SUGGESTION,
            })];
        _message_decorators = [(0, typeorm_1.Column)('text')];
        _statut_decorators = [(0, typeorm_1.Column)({
                type: 'enum',
                enum: enum_feedbackStatut_1.FeedbackStatut,
                default: enum_feedbackStatut_1.FeedbackStatut.NOUVEAU,
            })];
        _date_creation_decorators = [(0, typeorm_1.CreateDateColumn)({ type: 'timestamp' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _utilisateur_decorators, { kind: "field", name: "utilisateur", static: false, private: false, access: { has: function (obj) { return "utilisateur" in obj; }, get: function (obj) { return obj.utilisateur; }, set: function (obj, value) { obj.utilisateur = value; } }, metadata: _metadata }, _utilisateur_initializers, _utilisateur_extraInitializers);
        __esDecorate(null, null, _enquete_decorators, { kind: "field", name: "enquete", static: false, private: false, access: { has: function (obj) { return "enquete" in obj; }, get: function (obj) { return obj.enquete; }, set: function (obj, value) { obj.enquete = value; } }, metadata: _metadata }, _enquete_initializers, _enquete_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _message_decorators, { kind: "field", name: "message", static: false, private: false, access: { has: function (obj) { return "message" in obj; }, get: function (obj) { return obj.message; }, set: function (obj, value) { obj.message = value; } }, metadata: _metadata }, _message_initializers, _message_extraInitializers);
        __esDecorate(null, null, _statut_decorators, { kind: "field", name: "statut", static: false, private: false, access: { has: function (obj) { return "statut" in obj; }, get: function (obj) { return obj.statut; }, set: function (obj, value) { obj.statut = value; } }, metadata: _metadata }, _statut_initializers, _statut_extraInitializers);
        __esDecorate(null, null, _date_creation_decorators, { kind: "field", name: "date_creation", static: false, private: false, access: { has: function (obj) { return "date_creation" in obj; }, get: function (obj) { return obj.date_creation; }, set: function (obj, value) { obj.date_creation = value; } }, metadata: _metadata }, _date_creation_initializers, _date_creation_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Feedback = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Feedback = _classThis;
}();
exports.Feedback = Feedback;
