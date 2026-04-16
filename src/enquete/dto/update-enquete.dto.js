"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEnqueteDto = void 0;
var mapped_types_1 = require("@nestjs/mapped-types");
var create_enquete_dto_1 = require("./create-enquete.dto");
var status_enum_1 = require("../entities/status.enum");
var UpdateEnqueteDto = /** @class */ (function (_super) {
    __extends(UpdateEnqueteDto, _super);
    function UpdateEnqueteDto() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.statut = status_enum_1.StatusEnquete.Brouillon;
        return _this;
    }
    return UpdateEnqueteDto;
}((0, mapped_types_1.PartialType)(create_enquete_dto_1.CreateEnqueteDto)));
exports.UpdateEnqueteDto = UpdateEnqueteDto;
