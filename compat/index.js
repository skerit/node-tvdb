/*!
 * node-tvdb
 *
 * Node.js library for accessing TheTVDB API at <http://www.thetvdb.com/wiki/index.php?title=Programmers_API>
 *
 * Copyright (c) 2014-2015 Edward Wellbrook <edwellbrook@gmail.com>
 * MIT Licensed
 */

"use strict";

var request = require("superagent").get;
var parser  = require("xml2js").parseString;

// available providers for remote ids
var REMOTE_PROVIDERS = {
    imdbid: /^tt/i,
    zap2it: /^ep/i
};

// options for xml2js parser
var PARSER_OPTS = {
    trim: true,
    normalize: true,
    ignoreAttrs: true,
    explicitArray: false,
    emptyTag: null
};

//
// API Client
//

var Client = (function(){var PRS$0 = (function(o,t){o["__proto__"]={"a":t};return o["a"]===t})({},{});var DP$0 = Object.defineProperty;var GOPD$0 = Object.getOwnPropertyDescriptor;var MIXIN$0 = function(t,s){for(var p in s){if(s.hasOwnProperty(p)){DP$0(t,p,GOPD$0(s,p));}}return t};var proto$0={};

    /**
     * Set up tvdb client with API key and optional language (defaults to "en")
     *
     * @param {String} token
     * @param {String} [language]
     * @api public
     */

    function Client(token, language) {
        if (!token) throw new Error("Access token must be set.");

        this.token = token;
        this.language = language || "en";
        this.baseURL = "http://www.thetvdb.com/api";
    }DP$0(Client,"prototype",{"configurable":false,"enumerable":false,"writable":false});

    /**
     * Get available languages useable by TheTVDB API
     *
     * http://www.thetvdb.com/wiki/index.php?title=API:languages.xml
     *
     * @param {Function} [callback]
     * @return {Promise} promise
     * @api public
     */

    proto$0.getLanguages = function(callback) {
        var path = (("" + (this.baseURL)) + ("/" + (this.token)) + "/languages.xml");

        return sendRequest(path, function(response, done) {
            done((response && response.Languages) ? response.Languages.Language : null);
        }, callback);
    };

    /**
     * Get the current server time
     *
     * @param {Function} [callback]
     * @return {Promise} promise
     * @api public
     */

    proto$0.getTime = function(callback) {
        var path = (("" + (this.baseURL)) + "/Updates.php?type=none");

        return sendRequest(path, function(response, done) {
            done((response && response.Items) ? response.Items.Time : null);
        }, callback);
    };

    /**
     * Get basic series information by name
     *
     * http://www.thetvdb.com/wiki/index.php?title=API:GetSeries
     *
     * @param {String} name
     * @param {Function} [callback]
     * @return {Promise} promise
     * @api public
     */

    proto$0.getSeriesByName = function(name, callback) {
        var path = (("" + (this.baseURL)) + ("/GetSeries.php?seriesname=" + name) + ("&language=" + (this.language)) + "");

        return sendRequest(path, function(response, done) {
            response = (response && response.Data) ? response.Data.Series : null;
            done(!response || Array.isArray(response) ? response : [response]);
        }, callback);
    };

    /**
     * Get basic series information by id
     *
     * http://www.thetvdb.com/wiki/index.php?title=API:Base_Series_Record
     *
     * @param {Number|String} id
     * @param {Function} [callback]
     * @return {Promise} promise
     * @api public
     */

    proto$0.getSeriesById = function(id, callback) {
        var path = (("" + (this.baseURL)) + ("/" + (this.token)) + ("/series/" + id) + ("/" + (this.language)) + ".xml");

        return sendRequest(path, function(response, done) {
            done((response && response.Data) ? response.Data.Series : null);
        }, callback);
    };

    /**
     * Get basic series information by remote id (zap2it or imdb)
     *
     * http://www.thetvdb.com/wiki/index.php?title=API:GetSeriesByRemoteID
     *
     * @param {String} remoteId
     * @param {Function} [callback]
     * @return {Promise} promise
     * @api public
     */

    proto$0.getSeriesByRemoteId = function(remoteId, callback) {
        var keys = Object.keys(REMOTE_PROVIDERS);

        var provider = "";
        var len      = keys.length;

        while (len-- && provider === "") {
            if (REMOTE_PROVIDERS[keys[len]].exec(remoteId)) {
                provider = keys[len];
            }
        }

        var path = (("" + (this.baseURL)) + ("/GetSeriesByRemoteID.php?" + provider) + ("=" + remoteId) + ("&language=" + (this.language)) + "");

        return sendRequest(path, function(response, done) {
            done((response && response.Data) ? response.Data.Series : null);
        }, callback);
    };

    /**
     * Get full/all series information by id
     *
     * http://www.thetvdb.com/wiki/index.php?title=API:Full_Series_Record
     *
     * @param {Number|String} id
     * @param {Function} [callback]
     * @return {Promise} promise
     * @api public
     */

    proto$0.getSeriesAllById = function(id, callback) {
        var path = (("" + (this.baseURL)) + ("/" + (this.token)) + ("/series/" + id) + ("/all/" + (this.language)) + ".xml");

        return sendRequest(path, function(response, done) {
            if (response && response.Data && response.Data.Series) {
                response.Data.Series.Episodes = response.Data.Episode;
            }

            done(response ? response.Data.Series : null);
        }, callback);
    };

    /**
     * Get series actors by series id
     *
     * http://www.thetvdb.com/wiki/index.php?title=API:actors.xml
     *
     * @param {Number|String} id
     * @param {Function} [callback]
     * @return {Promise} promise
     * @api public
     */

    proto$0.getActors = function(id, callback) {
        var path = (("" + (this.baseURL)) + ("/" + (this.token)) + ("/series/" + id) + "/actors.xml");

        return sendRequest(path, function(response, done) {
            done((response && response.Actors) ? response.Actors.Actor : null);
        }, callback);
    };

    /**
     * Get series banners by series id
     *
     * http://www.thetvdb.com/wiki/index.php?title=API:banners.xml
     *
     * @param {Number|String} id
     * @param {Function} [callback]
     * @return {Promise} promise
     * @api public
     */

    proto$0.getBanners = function(id, callback) {
        var path = (("" + (this.baseURL)) + ("/" + (this.token)) + ("/series/" + id) + "/banners.xml");

        return sendRequest(path, function(response, done) {
            done((response && response.Banners) ? response.Banners.Banner : null);
        }, callback);
    };

    /**
     * Get episode by episode id
     *
     * http://www.thetvdb.com/wiki/index.php?title=API:Base_Episode_Record
     *
     * @param {Number|String} id
     * @param {Function} [callback]
     * @return {Promise} promise
     * @api public
     */

    proto$0.getEpisodeById = function(id, callback) {
        var path = (("" + (this.baseURL)) + ("/" + (this.token)) + ("/episodes/" + id) + "");

        return sendRequest(path, function(response, done) {
            done((response && response.Data) ? response.Data.Episode : null);
        }, callback);
    };

    /**
     * Get series and episode updates since a given unix timestamp
     *
     * http://www.thetvdb.com/wiki/index.php?title=API:Update_Records
     *
     * @param {Number} time
     * @param {Function} [callback]
     * @return {Promise} promise
     * @api public
     */

    proto$0.getUpdates = function(time, callback) {
        var path = (("" + (this.baseURL)) + ("/Updates.php?type=all&time=" + time) + "");

        return sendRequest(path, function(response, done) {
            done(response ? response.Items : null);
        }, callback);
    };

MIXIN$0(Client.prototype,proto$0);proto$0=void 0;return Client;})();

//
// Utilities
//

/**
 * Send and handle http request
 *
 * @param {String} url
 * @param {Function} normaliser - to normalise response object
 * @param {Function} [callback]
 * @return {Promise} promise
 * @api private
 */

function sendRequest(url, normaliser, callback) {
    return new Promise(function(resolve, reject) {
        request(url, function(error, data) {

            if (data &&
                data.statusCode === 200 &&
                data.text !== "" &&
                data.text.indexOf("404 Not Found") === -1) {

                parseXML(data.text, function(error, results) {
                    normaliser(results, function(response) {
                        if (callback) {
                            callback(error, response);
                        } else {
                            error ? reject(error) : resolve(response);
                        }
                    });
                });

            } else {
                if (!error) {
                    error = new Error("Could not complete the request");
                }
                error.statusCode = data ? data.statusCode : undefined;

                if (callback) {
                    callback(error);
                } else {
                    reject(error);
                }
            }
        });
    });
}

/**
 * Parse XML response
 *
 * @param {String} xml data
 * @param {Function} callback
 * @api private
 */

function parseXML(data, callback) {
    parser(data, PARSER_OPTS, function(error, results) {
        if (results && results.Error) {
            callback(new Error(results.Error));
        } else {
            callback(error, results);
        }
    });
}

/**
 * Parse pipe list string to javascript array
 *
 * @param {String} list
 * @return {Array} parsed list
 * @api public
 */

function parsePipeList(list) {
    return list.replace(/(^\|)|(\|$)/g, "").split("|");
}

//
// Exports
//

Client.utils = {
    parsePipeList: parsePipeList
};

module.exports = Client;
