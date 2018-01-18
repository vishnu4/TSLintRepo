(function ($, window) {
    "use strict";
    if (typeof ($.signalR) !== "function") {
        throw new Error("SignalR: SignalR is not loaded. Please ensure jquery.signalR-x.js is referenced before ~/signalr/js.");
    }
    var signalR = $.signalR;
    function makeProxyCallback(hub, callback) {
        return function () {
            callback.apply(hub, $.makeArray(arguments));
        };
    }
    function registerHubProxies(instance, shouldSubscribe) {
        var key, hub, memberKey, memberValue, subscriptionMethod;
        for (key in instance) {
            if (instance.hasOwnProperty(key)) {
                hub = instance[key];
                if (!(hub.hubName)) {
                    continue;
                }
                if (shouldSubscribe) {
                    subscriptionMethod = hub.on;
                }
                else {
                    subscriptionMethod = hub.off;
                }
                for (memberKey in hub.client) {
                    if (hub.client.hasOwnProperty(memberKey)) {
                        memberValue = hub.client[memberKey];
                        if (!$.isFunction(memberValue)) {
                            continue;
                        }
                        subscriptionMethod.call(hub, memberKey, makeProxyCallback(hub, memberValue));
                    }
                }
            }
        }
    }
    $.hubConnection.prototype.createHubProxies = function () {
        var proxies = {};
        this.starting(function () {
            registerHubProxies(proxies, true);
            this._registerSubscribedHubs();
        }).disconnected(function () {
            registerHubProxies(proxies, false);
        });
        proxies['cobraHub'] = this.createHubProxy('cobraHub');
        proxies['cobraHub'].client = {};
        proxies['cobraHub'].server = {
            broadcastAlarmUpdated: function (alarmGUID, projectGUID) {
                return proxies['cobraHub'].invoke.apply(proxies['cobraHub'], $.merge(["broadcastAlarmUpdated"], $.makeArray(arguments)));
            },
            broadcastmultipleAlarmUpdated: function (alarmGUIDs, projectGUID) {
                return proxies['cobraHub'].invoke.apply(proxies['cobraHub'], $.merge(["broadcastmultipleAlarmUpdated"], $.makeArray(arguments)));
            },
            broadcastmultipleOrgIncidentUpdates: function (prjGUIDs, OrganizationName) {
                return proxies['cobraHub'].invoke.apply(proxies['cobraHub'], $.merge(["broadcastmultipleOrgIncidentUpdates"], $.makeArray(arguments)));
            },
            broadcastmultipleToIncidentWithTool: function (logList, projectGUID) {
                return proxies['cobraHub'].invoke.apply(proxies['cobraHub'], $.merge(["broadcastmultipleToIncidentWithTool"], $.makeArray(arguments)));
            },
            broadcastOrgIncidentUpdates: function (prjGUID, OrganizationName) {
                return proxies['cobraHub'].invoke.apply(proxies['cobraHub'], $.merge(["broadcastOrgIncidentUpdates"], $.makeArray(arguments)));
            },
            broadcastToIncident: function (logGUID, projectGUID) {
                return proxies['cobraHub'].invoke.apply(proxies['cobraHub'], $.merge(["BroadcastToIncident"], $.makeArray(arguments)));
            },
            broadcastToIncidentWithTool: function (logGUID, toolname, projectGUID) {
                return proxies['cobraHub'].invoke.apply(proxies['cobraHub'], $.merge(["broadcastToIncidentWithTool"], $.makeArray(arguments)));
            },
            stopWatchingIncidentChanges: function (id) {
                return proxies['cobraHub'].invoke.apply(proxies['cobraHub'], $.merge(["StopWatchingIncidentChanges"], $.makeArray(arguments)));
            },
            stopWatchingIncidents: function (OrganizationName) {
                return proxies['cobraHub'].invoke.apply(proxies['cobraHub'], $.merge(["StopWatchingIncidents"], $.makeArray(arguments)));
            },
            stopWatchingTool: function (toolname, id) {
                return proxies['cobraHub'].invoke.apply(proxies['cobraHub'], $.merge(["StopWatchingTool"], $.makeArray(arguments)));
            },
            watchIncidentChanges: function (id) {
                return proxies['cobraHub'].invoke.apply(proxies['cobraHub'], $.merge(["WatchIncidentChanges"], $.makeArray(arguments)));
            },
            watchIncidents: function (OrganizationName) {
                return proxies['cobraHub'].invoke.apply(proxies['cobraHub'], $.merge(["WatchIncidents"], $.makeArray(arguments)));
            },
            watchTool: function (toolname, id) {
                return proxies['cobraHub'].invoke.apply(proxies['cobraHub'], $.merge(["WatchTool"], $.makeArray(arguments)));
            }
        };
        proxies['monitorHub'] = this.createHubProxy('monitorHub');
        proxies['monitorHub'].client = {};
        proxies['monitorHub'].server = {};
        return proxies;
    };
    signalR.hub = $.hubConnection(Main.currentUrlPrefix() + "signalr", { useDefaultPath: false });
    $.extend(signalR, signalR.hub.createHubProxies());
}(window.jQuery, window));
//# sourceMappingURL=signalRHubs.js.map