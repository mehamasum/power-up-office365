'use strict';

const config = require('config');

const AuthClient = function () {
    console.log('auth client');
    var oauthAuthorizeUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
        oauthTokenUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        clientId = config.clientId,
        clientSecret = config.clientSecret,
        redirectUrl = config.redirectUrl;

    // Helper function to create an encoded url query string from an object
    function toQueryString(obj) {
        console.log('toQueryString');
        var str = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                str.push(`${key}=${obj[key]}`);
            }
        }
        return str.join('&');
    }

    /**
     * Obtain a Microsoft Graph Azure AD v2.0 authorization endpoint URL based on configuration.
     * @returns {string} The authorization endpoint URL
     */
    this.getAuthUrl = function () {
        console.log('getAuthUrl');
        var scopes = ['profile', 'openid', 'https://graph.microsoft.com/User.Read',
            'https://graph.microsoft.com/Files.ReadWrite.All',
            'Notes.ReadWrite.All', 'Notes.ReadWrite', 'offline_access'];

        var query = toQueryString({
            'client_id': clientId,
            'scope': scopes.join(' '),
            'redirect_uri': redirectUrl,
            'display': 'page',
            'locale': 'en',
            'response_type': 'code'
        });
        return `${oauthAuthorizeUrl}?${query}`;
    };

  /* Microsoft Graph auth request sender */
    this.requestAccessToken = function(type, code, callback) {
        console.log('requestAccessToken');

        var data;

        if (type === "AUTH_CODE") {
            //requestAccessTokenByAuthCode
            data = {
                'client_id': clientId,
                'client_secret': clientSecret,
                'redirect_uri': redirectUrl,
                'code': code,
                'grant_type': 'authorization_code'
            }
        }

        else if (type === "REFRESH_TOKEN") {
            //requestAccessTokenByRefreshToken
            data = {
                'client_id': clientId,
                'client_secret': clientSecret,
                'redirect_uri': redirectUrl,
                'refresh_token': code,
                'grant_type': 'refresh_token'
            }
        }

        // jquery is in parent

        $.ajax({
            type: "POST",
            url: oauthTokenUrl,
            data: data,
            async: false,
            contentType: "application/json",
            complete: function (xhr, statusText) {
                console.log(xhr.status + " " + statusText);
            },
            success: function (data) {
                console.log(JSON.parse(data));
                callback(JSON.parse(data));
            },
            error: function (xhr, statusText, err) {
                console.log("Error:" + xhr.status);
                callback(null);
            }
        });


    }
};

module.exports = new AuthClient();
