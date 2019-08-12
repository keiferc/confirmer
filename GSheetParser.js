/*
 *      filename:       GSheetParser.js
 *      author:         @KeiferC
 *      version:        0.0.1
 *      date:           29 July 2019
 *      description:    This module contains an object that parses Google 
 *                      Sheets
 */

/*------------------------------------------------------------
 *                         Functions
 *------------------------------------------------------------
 * ---- Object Constructor ----
 * GSheetParser::GSheetParser(string)
 *
 * ---- Methods ----
 * GSheetParser::getSheet(number)
 * GSheetParser::getColumnIndex(string)
 * GSheetParser::getColumn(string)
 * GSheetParser::getRow(string)
 ------------------------------------------------------------*/
 
/**
 * GSheetParser
 *
 * Object constructor for parsing the Google Spreadsheet of the given ID
 *
 * @param       {String} ssId: Google Spreadsheet ID
 * @returns     {GSheetParser}: Object that parses the given Google Spreadsheet 
 */
function GSheetParser(ssId)
{
        try {
                this.ss = SpreadsheetApp.openById(ssId);
        } catch(e) {
                throw "Error: Unable to open the given Google Sheet \"" +
                      GSHEET_URL_FORMAT + ssId + "\". Please check if " +
                      "the given URL is spelled correctly and if you " +
                      "have permission to access the given Google Sheet.";
        }
}

//////////////////////////////////////////
// Methods                              //
//////////////////////////////////////////
/**
 * getSheet
 *
 * Returns nth sheet in the Google Sheet. Uses zero-indexing.
 *
 * @param       {number} index: Index of sheet to return
 * @returns     {Google Sheet}: Sheet of the Google Spreadsheet
 */
GSheetParser.prototype.getSheet = function
(index) 
{
        if (index < 0)
                throw "Error: Invalid sheet number.";

        return this.ss.getSheets()[index];
}

/**
 * getColumnIndex
 *
 * Searches the Google first Google Sheet of the Spreadsheet for the column
 * index containing the given string. Throws exception if not found.
 *
 * @param       {string}: String to search in the Sheet
 * @returns     {number}: Index of column containing given string
 */
GSheetParser.prototype.getColumnIndex = function
(columnLabel)
{
        var sheet, range, textFinder, index;

        columnLabel = decodeURIComponent(columnLabel);
        sheet = this.getSheet(0);
        range = sheet.getDataRange();
        
        textFinder = range.createTextFinder(columnLabel).matchEntireCell(true);
        index = textFinder.findNext();

        if (index == null)
                throw "Error: Unable to find column \"" + columnLabel + 
                      "\" in given Google Sheet. Please make sure that " + 
                      "the column label is spelled correctly and that it " + 
                      "exists in the given Google Sheet.";

        return index.getColumn();
}

/**
 * getColumn
 *
 * Returns an array of values of the column containing the given string.
 *
 * @param       {string} columnLabel: String representing column
 * @returns     {Array}: Array of column values
 */
GSheetParser.prototype.getColumn = function
(columnLabel) 
{
        var sheet, columnIndex, columnValues, values, i;

        sheet = this.getSheet(0);
        values = [];

        columnIndex = this.getColumnIndex(columnLabel);
        columnValues = sheet.getSheetValues(1, columnIndex,
                sheet.getLastRow(), 1);

        for (i = 1; i < sheet.getLastRow(); i++)
                values.push(columnValues[i][0]);

        return values;
}

/**
 * getRow
 *
 * Returns an array of values of the row containing the given string.
 * Ignores empty cells.
 *
 * @param       {String} rowLabel: String representing row
 * @returns     {Array}: Array of row values
 */
GSheetParser.prototype.getRow = function
(rowLabel)
{
        var sheet, range, rowValues, values, i, j;

        if (typeof(rowLabel) === "string")
                rowLabel = decodeURIComponent(rowLabel);

        sheet = this.getSheet(0);
        range = sheet.getSheetValues(1, 1, sheet.getLastRow(),
                sheet.getLastColumn())
        rowValues = []
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
