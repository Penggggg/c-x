"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nacos_1 = require("./app/util/nacos");
nacos_1.getConfig()
    .then(function () { return process.exit(); });
