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
exports.Enquete = void 0;
var typeorm_1 = require("typeorm");
var status_enum_1 = require("./status.enum");
var utilisateur_entity_1 = require("../../utilisateur/entities/utilisateur.entity");
var TypeParticipation_enum_1 = require("./TypeParticipation.enum");
var question_entity_1 = require("../../question/entities/question.entity");
var reponse_entity_1 = require("../../reponse/entities/reponse.entity");
var feedback_entity_1 = require("../../feedback/entities/feedback.entity");
var Enquete = function () {
    var _classDecorators = [(0, typeorm_1.Entity)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _titre_decorators;
    var _titre_initializers = [];
    var _titre_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _statut_decorators;
    var _statut_initializers = [];
    var _statut_extraInitializers = [];
    var _typeParticipation_decorators;
    var _typeParticipation_initializers = [];
    var _typeParticipation_extraInitializers = [];
    var _createAt_decorators;
    var _createAt_initializers = [];
    var _createAt_extraInitializers = [];
    var _dateFin_decorators;
    var _dateFin_initializers = [];
    var _dateFin_extraInitializers = [];
    var _user_decorators;
    var _user_initializers = [];
    var _user_extraInitializers = [];
    var _questions_decorators;
    var _questions_initializers = [];
    var _questions_extraInitializers = [];
    var _reponses_decorators;
    var _reponses_initializers = [];
    var _reponses_extraInitializers = [];
    var _feedbacks_decorators;
    var _feedbacks_initializers = [];
    var _feedbacks_extraInitializers = [];
    var Enquete = _classThis = /** @class */ (function () {
        function Enquete_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.titre = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _titre_initializers, void 0));
            this.description = (__runInitializers(this, _titre_extraInitializers), __runInitializers(this, _description_initializers, void 0));
            this.statut = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _statut_initializers, void 0));
            this.typeParticipation = (__runInitializers(this, _statut_extraInitializers), __runInitializers(this, _typeParticipation_initializers, void 0));
            this.createAt = (__runInitializers(this, _typeParticipation_extraInitializers), __runInitializers(this, _createAt_initializers, void 0));
            this.dateFin = (__runInitializers(this, _createAt_extraInitializers), __runInitializers(this, _dateFin_initializers, void 0));
            this.user = (__runInitializers(this, _dateFin_extraInitializers), __runInitializers(this, _user_initializers, void 0));
            this.questions = (__runInitializers(this, _user_extraInitializers), __runInitializers(this, _questions_initializers, void 0));
            this.reponses = (__runInitializers(this, _questions_extraInitializers), __runInitializers(this, _reponses_initializers, void 0));
            // 🔹 Relation Feedback
            this.feedbacks = (__runInitializers(this, _reponses_extraInitializers), __runInitializers(this, _feedbacks_initializers, void 0));
            __runInitializers(this, _feedbacks_extraInitializers);
        }
        return Enquete_1;
    }());
    __setFunctionName(_classThis, "Enquete");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _titre_decorators = [(0, typeorm_1.Column)()];
        _description_decorators = [(0, typeorm_1.Column)({ type: "text", nullable: true })];
        _statut_decorators = [(0, typeorm_1.Column)({
                type: "enum",
                enum: status_enum_1.StatusEnquete,
                default: status_enum_1.StatusEnquete.Brouillon
            })];
        _typeParticipation_decorators = [(0, typeorm_1.Column)({
                type: 'enum',
                enum: TypeParticipation_enum_1.TypeParticipation,
                default: TypeParticipation_enum_1.TypeParticipation.connecte
            })];
        _createAt_decorators = [(0, typeorm_1.Column)({ type: "date", default: function () { return "CURRENT_DATE"; } })];
        _dateFin_decorators = [(0, typeorm_1.Column)({ type: "date", nullable: true })];
        _user_decorators = [(0, typeorm_1.ManyToOne)(function () { return utilisateur_entity_1.Utilisateur; }, function (user) { return user.enquetes; }), (0, typeorm_1.JoinColumn)({ name: 'userId' })];
        _questions_decorators = [(0, typeorm_1.ManyToMany)(function () { return question_entity_1.Question; }, function (question) { return question.enquetes; }), (0, typeorm_1.JoinTable)()];
        _reponses_decorators = [(0, typeorm_1.OneToMany)(function () { return reponse_entity_1.Reponse; }, function (reponse) { return reponse.enquete; })];
        _feedbacks_decorators = [(0, typeorm_1.OneToMany)(function () { return feedback_entity_1.Feedback; }, function (feedback) { return feedback.enquete; })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _titre_decorators, { kind: "field", name: "titre", static: false, private: false, access: { has: function (obj) { return "titre" in obj; }, get: function (obj) { return obj.titre; }, set: function (obj, value) { obj.titre = value; } }, metadata: _metadata }, _titre_initializers, _titre_extraInitializers);
        __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
        __esDecorate(null, null, _statut_decorators, { kind: "field", name: "statut", static: false, private: false, access: { has: function (obj) { return "statut" in obj; }, get: function (obj) { return obj.statut; }, set: function (obj, value) { obj.statut = value; } }, metadata: _metadata }, _statut_initializers, _statut_extraInitializers);
        __esDecorate(null, null, _typeParticipation_decorators, { kind: "field", name: "typeParticipation", static: false, private: false, access: { has: function (obj) { return "typeParticipation" in obj; }, get: function (obj) { return obj.typeParticipation; }, set: function (obj, value) { obj.typeParticipation = value; } }, metadata: _metadata }, _typeParticipation_initializers, _typeParticipation_extraInitializers);
        __esDecorate(null, null, _createAt_decorators, { kind: "field", name: "createAt", static: false, private: false, access: { has: function (obj) { return "createAt" in obj; }, get: function (obj) { return obj.createAt; }, set: function (obj, value) { obj.createAt = value; } }, metadata: _metadata }, _createAt_initializers, _createAt_extraInitializers);
        __esDecorate(null, null, _dateFin_decorators, { kind: "field", name: "dateFin", static: false, private: false, access: { has: function (obj) { return "dateFin" in obj; }, get: function (obj) { return obj.dateFin; }, set: function (obj, value) { obj.dateFin = value; } }, metadata: _metadata }, _dateFin_initializers, _dateFin_extraInitializers);
        __esDecorate(null, null, _user_decorators, { kind: "field", name: "user", static: false, private: false, access: { has: function (obj) { return "user" in obj; }, get: function (obj) { return obj.user; }, set: function (obj, value) { obj.user = value; } }, metadata: _metadata }, _user_initializers, _user_extraInitializers);
        __esDecorate(null, null, _questions_decorators, { kind: "field", name: "questions", static: false, private: false, access: { has: function (obj) { return "questions" in obj; }, get: function (obj) { return obj.questions; }, set: function (obj, value) { obj.questions = value; } }, metadata: _metadata }, _questions_initializers, _questions_extraInitializers);
        __esDecorate(null, null, _reponses_decorators, { kind: "field", name: "reponses", static: false, private: false, access: { has: function (obj) { return "reponses" in obj; }, get: function (obj) { return obj.reponses; }, set: function (obj, value) { obj.reponses = value; } }, metadata: _metadata }, _reponses_initializers, _reponses_extraInitializers);
        __esDecorate(null, null, _feedbacks_decorators, { kind: "field", name: "feedbacks", static: false, private: false, access: { has: function (obj) { return "feedbacks" in obj; }, get: function (obj) { return obj.feedbacks; }, set: function (obj, value) { obj.feedbacks = value; } }, metadata: _metadata }, _feedbacks_initializers, _feedbacks_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Enquete = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Enquete = _classThis;
}();
exports.Enquete = Enquete;
