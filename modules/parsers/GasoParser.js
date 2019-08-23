/*
 *      filename:       GasoParser.js
 *      author:         @KeiferC
 *      version:        0.0.1
 *      date:           23 August 2019
 *      description:    This module contains an object that parses a Google 
 *                      Apps Script object (GASO) and converts it into a valid 
 *                      JS object.
 */

/*------------------------------------------------------------
 *                         Functions
 *------------------------------------------------------------
 * ---- Object Constructor ----
 * GasoParser::GasoParser()
 *
 * ---- Methods ----
 * GasoParser::toJSO(string)
 *
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
 * Given a Google Apps Script nested object, returns a JS version 
 * of the object
 *
 * @param       {string} gaso: Google Apps Script nested object
 * @returns     {Object}: JS object to be used in the Confirmer add-on
 */
GasoParser.prototype.toJSO = function
(gaso)
{
        return JSON.parse(gaso.replace(/=/g, '":"')
                .replace(/,\s/g, '","')
                .replace(/\{/g, '"{"')
                .replace(/\}/g, '"}"')
                .replace(/\[/g, '"["')
                .replace(/\]/g, '"]"')
                .replace(/^"\{/g, "{")
                .replace(/\}"$/g, "}")
                .replace(/""/g, '"'));
}
