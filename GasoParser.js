/*
 *      filename:       gaso-to-json.js
 *      author:         @KeiferC
 *      version:        0.0.1
 *      date:           29 July 2019
 *      description:    This module contains an object that
 *                      parses a Google Apps Script object
 *                      and converts it into a valid JSON
 *                      object.
 *
 *      note:           This module is to be in a Google Script
 *                      and thus uses function object constructors
 *                      instead of Classes (due to GAS' lack of class
 *                      compatibility)
 */

/**
 * GasoParser
 *
 * Provides the function toJSON which parses a
 * Google Apps Script Object
 *
 * @returns     {Object}
 */
function GasoParser() {}


/**
 * toJSON
 *
 * Given a Google Apps Script Object, return
 * a JSON version of the object
 *
 * @param       {Object} gaso
 * @returns     {JSON}
 */
GasoParser.prototype.toJSON = function
(gaso)
{
        var json = gaso.replace(/=/g, '":"')
                .replace(/,\s/g, '","')
                .replace(/\{/g, '"{"')
                .replace(/\}/g, '"}"')
                .replace(/\[/g, '"["')
                .replace(/\]/g, '"]"')
                .replace(/^"\{/g, "{")
                .replace(/\}"$/g, "}")
                .replace(/""/g, '"');

        //Logger.log(JSON.stringify(eval('(' + json + ')')));
        Logger.log(JSON.parse(json));

        //return JSON.stringify(eval('(' + json + ')'));
}
