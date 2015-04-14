(function (window) {
    var getUrlParameterValue = function (url, name) {
        if (!url || !name) {
            return null;
        }

        if (url.indexOf('?') === -1) {
            return null;
        }

        var parameters = url.split('?')[1].split('&');

        for (var i = 0, length = parameters.length; i < length; i++) {
            var nameValuePair = parameters[i].split('=');

            if (nameValuePair[0] === name) {
                return decodeURIComponent(nameValuePair[1]);
            }
        }

        return null;
    };

    var resize = function (width, height) {
        if (!width || !height) {
            return;
        }

        var url = window.location.href;
        var hostUrl = getUrlParameterValue(url, 'SPHostUrl');
        var senderId = getUrlParameterValue(url, 'SenderId');

        if (!hostUrl || !senderId) {
            return;
        } else {
            var message = '<Message senderId=' + senderId + '>' + 'resize(' + width + ', ' + height + ')</Message>';
            window.parent.postMessage(message, hostUrl);
        }
    };

    window.SPAppPartResize = {
        resize: resize
    };
})(window);
