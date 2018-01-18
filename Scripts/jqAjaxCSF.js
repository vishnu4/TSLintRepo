var $Ajax;
(function ($Ajax) {
    function postJsonWithVerificationToken(options) {
        var token = $('input[name=""__RequestVerificationToken""]').val();
        var headers = {};
        headers['__RequestVerificationToken'] = token;
        $.ajax({
            cache: false,
            dataType: 'json',
            type: 'POST',
            headers: headers,
            data: options.jsonData,
            contentType: 'application/json; charset=utf-8',
            url: options.url,
            success: options.onSuccess,
            error: options.onError
        });
    }
    function getAntiForgeryToken(tokenWindow, appPath) {
        tokenWindow = tokenWindow && typeof tokenWindow === typeof window ? tokenWindow : window;
        appPath = appPath && typeof appPath === "string" ? "_" + appPath.toString() : "";
        var tokenName = "__RequestVerificationToken" + appPath;
        var inputElements = tokenWindow.document.getElementsByTagName("input");
        for (var i = 0; i < inputElements.length; i++) {
            var inputElement = inputElements[i];
            if (inputElement.type === "hidden" && inputElement.name === tokenName) {
                return {
                    name: tokenName,
                    value: inputElement.value
                };
            }
        }
    }
    function appendAntiForgeryToken(data, token) {
        if (data && typeof data !== "string") {
            data = $.param(data);
        }
        token = token ? token : getAntiForgeryToken(null, null);
        data = data ? data + "&" : "";
        var rtnString = token ? data + encodeURIComponent(token.name) + "=" + encodeURIComponent(token.value) : data;
        rtnString = rtnString.replace(/\&$/, '');
        return rtnString;
    }
    function postAntiForgery(url, data, callback, type) {
        return $.post(url, appendAntiForgeryToken(data, null), callback, type);
    }
    function ajaxAntiForgery(settings) {
        var token = settings.token ? settings.token : getAntiForgeryToken(settings.tokenWindow, settings.appPath);
        settings.data = appendAntiForgeryToken(settings.data, token);
        return $.ajax(settings);
    }
    $Ajax.ajaxAntiForgery = ajaxAntiForgery;
})($Ajax || ($Ajax = {}));
//# sourceMappingURL=jqAjaxCSF.js.map