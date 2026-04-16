"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEnqueteDto = void 0;
// create-enquete.dto.ts
var status_enum_1 = require("../entities/status.enum");
var TypeParticipation_enum_1 = require("../entities/TypeParticipation.enum");
var CreateEnqueteDto = /** @class */ (function () {
    function CreateEnqueteDto() {
        this.statut = status_enum_1.StatusEnquete.Brouillon;
        this.typeParticipation = TypeParticipation_enum_1.TypeParticipation.connecte; // Ajouter cette ligne
    }
    return CreateEnqueteDto;
}());
exports.CreateEnqueteDto = CreateEnqueteDto;
