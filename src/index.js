"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.cancelAllPendingRequests = exports.api = void 0;
var axios_1 = require("axios");
var cancelTokens = new Map();
function api(url, config, instance) {
    if (config === void 0) { config = {}; }
    var cancelToken = axios_1["default"].CancelToken.source();
    return {
        /**
         * @returns {AxiosPromise}
         */
        exec: function () {
            cancelTokens.set(cancelToken.token, cancelToken);
            return instance(url, __assign(__assign({}, config), { cancelToken: cancelToken }))["finally"](function () { return cancelTokens["delete"](cancelToken.token); });
        },
        /** @param {string} [message] */
        cancel: function (message) { return cancelToken.cancel(message); }
    };
}
exports.api = api;
var cancelAllPendingRequests = function () { return cancelTokens.forEach(function (cancelToken) { return cancelToken.cancel(); }); };
exports.cancelAllPendingRequests = cancelAllPendingRequests;
