/*
 *      filename:       GSheetParser.js
 *      author:         @KeiferC
 *      version:        0.0.1
 *      date:           29 July 2019
 *      description:    This module contains an object that parses
 *                      Google Sheets
 *
 *      note:           This module is to be in a Google Script
 *                      and thus uses constructor functions
 *                      instead of Classes (due to GAS' lack of class
 *                      compatibility)
 */

/**
 * GSheetParser
 *
 * @param       {String} ssId
 * @returns     {Object}
 */
function GSheetParser(ssId)
{
        this.ss = SpreadsheetApp.openById(ssId)
}

//////////////////////////////////////////
// Methods                              //
//////////////////////////////////////////
/**
 * getSheet
 *
 * Returns nth sheet in the Google Sheet.
 * Uses zero-indexing.
 *
 * @param       {Number} index
 * @returns     {Sheet}
 */
GSheetParser.prototype.getSheet = function
(index) 
{
        //this.ss.setActiveSheet(ss.getSheets()[0]);
        //return this.ss.getActiveSheet()
        if (nth < 0)
                throw "Invalid sheet number.";

        return this.ss.getSheets()[index];
}

/**
 * getColumn
 *
 * Returns an array of values of the given column
 *
 * @param       {String} columnLabel
 * @returns      {Array}
 */
GSheetParser.prototype.getColumn = function
(columnLabel) 
{
        var sheet, range, textFinder, index, 
            columnIndex, columnValues, values, i;

        sheet = this.getSheet(0);
        range = sheet.getDataRange();
        values = [];

        textFinder = range.createTextFinder(columnLabel);
        index = textFinder.findNext();
        columnIndex = index.getColumn();
        columnValues = sheet.getSheetValues(1, columnIndex,
                sheet.getLastRow(), 1);

        for (i = 1; i < sheet.getLastRow(); i++)
                values.push(columnValues[i][0]);

        return values;
}

/**
 * getRow
 *
 * Returns an array of values of the given row
 *
 * @param       {String} rowLabel
 * @returns     {Array}
 */
GSheetParser.prototype.getRow = function
(rowLabel)
{
        var sheet, range, rowValues, values, i, j;

        sheet = this.getSheet(0);
        range = sheet.getSheetValues(1, 1, sheet.getLastRow(),
                sheet.getLastColumn())
        values = [];

        // Get row
        for (i = 0; i < sheet.getLastRow(); i++) {
                if (range[i][0].valueOf() == rowLabel.valueOf()) {
                        rowValues = range[i];
                        break;
                }
        }

        // Get filled values in row
        for (j = 1; j < rowValues.length; j++) {
                if (rowValues[j])
                        values.push(rowValues[j]);
        }

        return values;
}
