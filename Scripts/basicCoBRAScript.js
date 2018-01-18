var Main;
(function (Main) {
    function currentUrlPrefix() {
        var pathname = window.location.pathname;
        var sitename = pathname.split('/')[1];
        var ret = window.location.protocol + "//" + window.location.host + "/" + sitename + "/";
        return ret;
    }
    Main.currentUrlPrefix = currentUrlPrefix;
    var alertitemRemoved;
    var lastSignalRUpdate;
})(Main || (Main = {}));
var Guid = (function () {
    function Guid(id) {
        this.id = id.toLowerCase();
    }
    Guid.empty = function () {
        return Guid.emptyGuid;
    };
    Guid.newGuid = function () {
        return new Guid(Guid.s4() + Guid.s4() + "-" + Guid.s4() + "-" + Guid.s4() + "-" +
            Guid.s4() + "-" + Guid.s4() + Guid.s4() + Guid.s4());
    };
    Guid.regex = function (format) {
        switch (format) {
            case "x":
            case "X":
                return (/\{[a-z0-9]{8}(?:-[a-z0-9]{4}){3}-[a-z0-9]{12}\}/i);
            default:
                return (/[a-z0-9]{8}(?:-[a-z0-9]{4}){3}-[a-z0-9]{12}/i);
        }
    };
    Guid.s4 = function () {
        return Math
            .floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    };
    Guid.prototype.toString = function (format) {
        switch (format) {
            case "x":
            case "X":
                return "{" + this.id + "}";
            default:
                return this.id;
        }
    };
    Guid.prototype.valueOf = function () {
        return this.id;
    };
    Guid.emptyGuidString = "00000000-0000-0000-0000-000000000000";
    Guid.emptyGuid = new Guid(Guid.emptyGuidString);
    return Guid;
}());
$(document).ajaxStart(function () {
    $("#imgHeader").attr("style", "animation: blink 2s ease-in infinite");
});
$(document).ajaxStop(function () {
    $("#imgHeader").css("animation", "");
});
jQuery.fn.rotate = function (degrees) {
    $(this).css({
        '-webkit-transform': 'rotate(' + degrees + 'deg)',
        '-moz-transform': 'rotate(' + degrees + 'deg)',
        '-ms-transform': 'rotate(' + degrees + 'deg)',
        'transform': 'rotate(' + degrees + 'deg)'
    });
    return $(this);
};
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (searchString, position) {
        var subjectString = this.toString();
        if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
            position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.lastIndexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };
}
var QueryString = function () {
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = decodeURIComponent(pair[1]);
        }
        else if (typeof query_string[pair[0]] === "string") {
            var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
            query_string[pair[0]] = arr;
        }
        else {
            query_string[pair[0]].push(decodeURIComponent(pair[1]));
        }
    }
    return query_string;
}();
//# sourceMappingURL=basicCoBRAScript.js.map