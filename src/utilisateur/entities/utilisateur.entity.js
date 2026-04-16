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
exports.Utilisateur = void 0;
var typeorm_1 = require("typeorm");
var role_enum_1 = require("../role.enum");
var status_enum_1 = require("../status.enum");
var enquete_entity_1 = require("../../enquete/entities/enquete.entity");
var feedback_entity_1 = require("../../feedback/entities/feedback.entity");
var Utilisateur = function () {
    var _classDecorators = [(0, typeorm_1.Entity)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _prenom_decorators;
    var _prenom_initializers = [];
    var _prenom_extraInitializers = [];
    var _nom_decorators;
    var _nom_initializers = [];
    var _nom_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _telephone_decorators;
    var _telephone_initializers = [];
    var _telephone_extraInitializers = [];
    var _photo_profil_decorators;
    var _photo_profil_initializers = [];
    var _photo_profil_extraInitializers = [];
    var _mot_de_passe_decorators;
    var _mot_de_passe_initializers = [];
    var _mot_de_passe_extraInitializers = [];
    var _role_decorators;
    var _role_initializers = [];
    var _role_extraInitializers = [];
    var _statut_decorators;
    var _statut_initializers = [];
    var _statut_extraInitializers = [];
    var _est_verifie_decorators;
    var _est_verifie_initializers = [];
    var _est_verifie_extraInitializers = [];
    var _code_verification_decorators;
    var _code_verification_initializers = [];
    var _code_verification_extraInitializers = [];
    var _code_reset_decorators;
    var _code_reset_initializers = [];
    var _code_reset_extraInitializers = [];
    var _token_expiration_decorators;
    var _token_expiration_initializers = [];
    var _token_expiration_extraInitializers = [];
    var _google_id_decorators;
    var _google_id_initializers = [];
    var _google_id_extraInitializers = [];
    var _date_creation_decorators;
    var _date_creation_initializers = [];
    var _date_creation_extraInitializers = [];
    var _date_modification_decorators;
    var _date_modification_initializers = [];
    var _date_modification_extraInitializers = [];
    var _enquetes_decorators;
    var _enquetes_initializers = [];
    var _enquetes_extraInitializers = [];
    var _feedbacks_decorators;
    var _feedbacks_initializers = [];
    var _feedbacks_extraInitializers = [];
    var Utilisateur = _classThis = /** @class */ (function () {
        function Utilisateur_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.prenom = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _prenom_initializers, void 0));
            this.nom = (__runInitializers(this, _prenom_extraInitializers), __runInitializers(this, _nom_initializers, void 0));
            this.email = (__runInitializers(this, _nom_extraInitializers), __runInitializers(this, _email_initializers, void 0));
            this.telephone = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _telephone_initializers, void 0));
            this.photo_profil = (__runInitializers(this, _telephone_extraInitializers), __runInitializers(this, _photo_profil_initializers, void 0));
            this.mot_de_passe = (__runInitializers(this, _photo_profil_extraInitializers), __runInitializers(this, _mot_de_passe_initializers, void 0));
            this.role = (__runInitializers(this, _mot_de_passe_extraInitializers), __runInitializers(this, _role_initializers, void 0));
            this.statut = (__runInitializers(this, _role_extraInitializers), __runInitializers(this, _statut_initializers, void 0));
            this.est_verifie = (__runInitializers(this, _statut_extraInitializers), __runInitializers(this, _est_verifie_initializers, void 0));
            this.code_verification = (__runInitializers(this, _est_verifie_extraInitializers), __runInitializers(this, _code_verification_initializers, void 0));
            this.code_reset = (__runInitializers(this, _code_verification_extraInitializers), __runInitializers(this, _code_reset_initializers, void 0));
            this.token_expiration = (__runInitializers(this, _code_reset_extraInitializers), __runInitializers(this, _token_expiration_initializers, void 0));
            this.google_id = (__runInitializers(this, _token_expiration_extraInitializers), __runInitializers(this, _google_id_initializers, void 0));
            this.date_creation = (__runInitializers(this, _google_id_extraInitializers), __runInitializers(this, _date_creation_initializers, void 0));
            this.date_modification = (__runInitializers(this, _date_creation_extraInitializers), __runInitializers(this, _date_modification_initializers, void 0));
            this.enquetes = (__runInitializers(this, _date_modification_extraInitializers), __runInitializers(this, _enquetes_initializers, void 0));
            this.feedbacks = (__runInitializers(this, _enquetes_extraInitializers), __runInitializers(this, _feedbacks_initializers, void 0));
            __runInitializers(this, _feedbacks_extraInitializers);
        }
        return Utilisateur_1;
    }());
    __setFunctionName(_classThis, "Utilisateur");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _prenom_decorators = [(0, typeorm_1.Column)()];
        _nom_decorators = [(0, typeorm_1.Column)()];
        _email_decorators = [(0, typeorm_1.Column)({ unique: true })];
        _telephone_decorators = [(0, typeorm_1.Column)({ nullable: true, length: 8 })];
        _photo_profil_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _mot_de_passe_decorators = [(0, typeorm_1.Column)()];
        _role_decorators = [(0, typeorm_1.Column)({
                type: 'enum',
                enum: role_enum_1.Role,
                default: role_enum_1.Role.USER_CONNECTE
            })];
        _statut_decorators = [(0, typeorm_1.Column)({
                type: 'enum',
                enum: status_enum_1.Status,
                default: status_enum_1.Status.INACTIF
            })];
        _est_verifie_decorators = [(0, typeorm_1.Column)({ default: false })];
        _code_verification_decorators = [(0, typeorm_1.Column)({ type: 'varchar', nullable: true })];
        _code_reset_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _token_expiration_decorators = [(0, typeorm_1.Column)({ type: 'timestamp', nullable: true })];
        _google_id_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _date_creation_decorators = [(0, typeorm_1.Column)({ default: function () { return 'NOW()'; } })];
        _date_modification_decorators = [(0, typeorm_1.Column)({ nullable: true })];
        _enquetes_decorators = [(0, typeorm_1.OneToMany)(function () { return enquete_entity_1.Enquete; }, function (enquete) { return enquete.user; })];
        _feedbacks_decorators = [(0, typeorm_1.OneToMany)(function () { return feedback_entity_1.Feedback; }, function (feedback) { return feedback.utilisateur; })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _prenom_decorators, { kind: "field", name: "prenom", static: false, private: false, access: { has: function (obj) { return "prenom" in obj; }, get: function (obj) { return obj.prenom; }, set: function (obj, value) { obj.prenom = value; } }, metadata: _metadata }, _prenom_initializers, _prenom_extraInitializers);
        __esDecorate(null, null, _nom_decorators, { kind: "field", name: "nom", static: false, private: false, access: { has: function (obj) { return "nom" in obj; }, get: function (obj) { return obj.nom; }, set: function (obj, value) { obj.nom = value; } }, metadata: _metadata }, _nom_initializers, _nom_extraInitializers);
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
        __esDecorate(null, null, _telephone_decorators, { kind: "field", name: "telephone", static: false, private: false, access: { has: function (obj) { return "telephone" in obj; }, get: function (obj) { return obj.telephone; }, set: function (obj, value) { obj.telephone = value; } }, metadata: _metadata }, _telephone_initializers, _telephone_extraInitializers);
        __esDecorate(null, null, _photo_profil_decorators, { kind: "field", name: "photo_profil", static: false, private: false, access: { has: function (obj) { return "photo_profil" in obj; }, get: function (obj) { return obj.photo_profil; }, set: function (obj, value) { obj.photo_profil = value; } }, metadata: _metadata }, _photo_profil_initializers, _photo_profil_extraInitializers);
        __esDecorate(null, null, _mot_de_passe_decorators, { kind: "field", name: "mot_de_passe", static: false, private: false, access: { has: function (obj) { return "mot_de_passe" in obj; }, get: function (obj) { return obj.mot_de_passe; }, set: function (obj, value) { obj.mot_de_passe = value; } }, metadata: _metadata }, _mot_de_passe_initializers, _mot_de_passe_extraInitializers);
        __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: function (obj) { return "role" in obj; }, get: function (obj) { return obj.role; }, set: function (obj, value) { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
        __esDecorate(null, null, _statut_decorators, { kind: "field", name: "statut", static: false, private: false, access: { has: function (obj) { return "statut" in obj; }, get: function (obj) { return obj.statut; }, set: function (obj, value) { obj.statut = value; } }, metadata: _metadata }, _statut_initializers, _statut_extraInitializers);
        __esDecorate(null, null, _est_verifie_decorators, { kind: "field", name: "est_verifie", static: false, private: false, access: { has: function (obj) { return "est_verifie" in obj; }, get: function (obj) { return obj.est_verifie; }, set: function (obj, value) { obj.est_verifie = value; } }, metadata: _metadata }, _est_verifie_initializers, _est_verifie_extraInitializers);
        __esDecorate(null, null, _code_verification_decorators, { kind: "field", name: "code_verification", static: false, private: false, access: { has: function (obj) { return "code_verification" in obj; }, get: function (obj) { return obj.code_verification; }, set: function (obj, value) { obj.code_verification = value; } }, metadata: _metadata }, _code_verification_initializers, _code_verification_extraInitializers);
        __esDecorate(null, null, _code_reset_decorators, { kind: "field", name: "code_reset", static: false, private: false, access: { has: function (obj) { return "code_reset" in obj; }, get: function (obj) { return obj.code_reset; }, set: function (obj, value) { obj.code_reset = value; } }, metadata: _metadata }, _code_reset_initializers, _code_reset_extraInitializers);
        __esDecorate(null, null, _token_expiration_decorators, { kind: "field", name: "token_expiration", static: false, private: false, access: { has: function (obj) { return "token_expiration" in obj; }, get: function (obj) { return obj.token_expiration; }, set: function (obj, value) { obj.token_expiration = value; } }, metadata: _metadata }, _token_expiration_initializers, _token_expiration_extraInitializers);
        __esDecorate(null, null, _google_id_decorators, { kind: "field", name: "google_id", static: false, private: false, access: { has: function (obj) { return "google_id" in obj; }, get: function (obj) { return obj.google_id; }, set: function (obj, value) { obj.google_id = value; } }, metadata: _metadata }, _google_id_initializers, _google_id_extraInitializers);
        __esDecorate(null, null, _date_creation_decorators, { kind: "field", name: "date_creation", static: false, private: false, access: { has: function (obj) { return "date_creation" in obj; }, get: function (obj) { return obj.date_creation; }, set: function (obj, value) { obj.date_creation = value; } }, metadata: _metadata }, _date_creation_initializers, _date_creation_extraInitializers);
        __esDecorate(null, null, _date_modification_decorators, { kind: "field", name: "date_modification", static: false, private: false, access: { has: function (obj) { return "date_modification" in obj; }, get: function (obj) { return obj.date_modification; }, set: function (obj, value) { obj.date_modification = value; } }, metadata: _metadata }, _date_modification_initializers, _date_modification_extraInitializers);
        __esDecorate(null, null, _enquetes_decorators, { kind: "field", name: "enquetes", static: false, private: false, access: { has: function (obj) { return "enquetes" in obj; }, get: function (obj) { return obj.enquetes; }, set: function (obj, value) { obj.enquetes = value; } }, metadata: _metadata }, _enquetes_initializers, _enquetes_extraInitializers);
        __esDecorate(null, null, _feedbacks_decorators, { kind: "field", name: "feedbacks", static: false, private: false, access: { has: function (obj) { return "feedbacks" in obj; }, get: function (obj) { return obj.feedbacks; }, set: function (obj, value) { obj.feedbacks = value; } }, metadata: _metadata }, _feedbacks_initializers, _feedbacks_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Utilisateur = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Utilisateur = _classThis;
}();
exports.Utilisateur = Utilisateur;
