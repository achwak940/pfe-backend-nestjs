"use strict";
import { ReclamationModule } from './reclamation/reclamation.module';
import { MessageModule } from './message/message.module';
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
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var app_controller_1 = require("./app.controller");
var app_service_1 = require("./app.service");
var utilisateur_module_1 = require("./utilisateur/utilisateur.module");
var config_1 = require("@nestjs/config");
var typeorm_1 = require("@nestjs/typeorm");
var utilisateur_entity_1 = require("./utilisateur/entities/utilisateur.entity");
var authentification_module_1 = require("./authentification/authentification.module");
var enquete_module_1 = require("./enquete/enquete.module");
var enquete_entity_1 = require("./enquete/entities/enquete.entity");
var question_module_1 = require("./question/question.module");
var question_entity_1 = require("./question/entities/question.entity");
var option_module_1 = require("./option/option.module");
var option_entity_1 = require("./option/entities/option.entity");
var reponse_module_1 = require("./reponse/reponse.module");
var reponse_entity_1 = require("./reponse/entities/reponse.entity");
var yolo_module_1 = require("./yolo/yolo.module");
var feedback_module_1 = require("./feedback/feedback.module");
var feedback_entity_1 = require("./feedback/entities/feedback.entity");
var ai_questions_module_1 = require("./GenerationQuestions/ai-questions/ai-questions.module");
var AppModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                config_1.ConfigModule.forRoot({ isGlobal: true }),
                typeorm_1.TypeOrmModule.forRootAsync({
                    imports: [config_1.ConfigModule],
                    inject: [config_1.ConfigService],
                    useFactory: function (ConfigService) { return ({
                        type: 'postgres',
                        host: ConfigService.get('DB_HOST'),
                        prot: ConfigService.get('DB_PORT'),
                        username: ConfigService.get("DB_USERNAME"),
                        password: ConfigService.get("DB_PASSWORD"),
                        database: ConfigService.get("DB_NAME"),
                        entities: [utilisateur_entity_1.Utilisateur, enquete_entity_1.Enquete, question_entity_1.Question, option_entity_1.Option, reponse_entity_1.Reponse, feedback_entity_1.Feedback],
                        synchronize: true, //creation auto de table si n'existe pas 
                    }); }
                }),
                utilisateur_module_1.UtilisateurModule,
                authentification_module_1.AuthentificationModule,
                enquete_module_1.EnqueteModule,
                question_module_1.QuestionModule,
                option_module_1.OptionModule,
                reponse_module_1.ReponseModule,
                yolo_module_1.YoloModule,
                feedback_module_1.FeedbackModule,
                ai_questions_module_1.AiQuestionsModule
            ],
            controllers: [app_controller_1.AppController],
            providers: [app_service_1.AppService],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AppModule = _classThis = /** @class */ (function () {
        function AppModule_1() {
        }
        return AppModule_1;
    }());
    __setFunctionName(_classThis, "AppModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppModule = _classThis;
}();
exports.AppModule = AppModule;
