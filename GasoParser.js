/*
 *      filename:       GasoParser.js
 *      author:         @KeiferC
 *      version:        0.0.1
 *      date:           29 July 2019
 *      description:    This module contains an object that parses a Google 
 *                      Apps Script object (GASO) and converts it into a valid 
 *                      JS object.
 */

/*------------------------------------------------------------
 *                         Functions
 * -----------------------------------------------------------
 * ---- Object Constructor ----
 * GasoParser::GasoParser()
 *
 * ---- Methods ----
 * GasoParser::toJSO(Google Apps Script Object)
 ------------------------------------------------------------*/

/**
 * GasoParser
 *
 * An object constructor that provides the function toJSO.
 *
 * @returns     {GasoParser}: Object that converts GASOs to JS objects
 */
function GasoParser() {}

//////////////////////////////////////////
// Methods                              //
//////////////////////////////////////////
/**
 * toJSO
 *
 * Given a Google Apps Script nested object, return
 * a JS version of the object
 *
 * @param       {String} gaso: Google Apps Script nested object
 * @returns     {JSO}: JS object to be used in the Confirmer add-on
 */
GasoParser.prototype.toJSO = function
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

        return JSON.parse(json);
}
