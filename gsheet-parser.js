/*
 * TODO: Module Documentation
 */

/**
 * getSheet
 *
 * Returns first sheet of a spreadsheet, given
 * the spreadsheet URL
 *
 * @param        {String} ssURL
 * @return       {Sheet}
 */
function getSheet(ssURL) 
{
        var ss = SpreadsheetApp.openByUrl(ssURL);
        ss.setActiveSheet(ss.getSheets()[0]);

        return ss.getActiveSheet()
}

/**
 * getColumn
 *
 * Returns an array of values of the given column
 * name of the given spreadsheet
 *
 * @param       {String} ssURL
 * @param       {String} columnTitle
 * @return      {Array}          
 */
function getColumn(ssURL, columnTitle) 
{
        var sheet, range, textFinder, index, columnIndex,
                columnValues, values, i;

        sheet = getSheet(ssURL);
        range = sheet.getDataRange();
        values = [];

        textFinder = range.createTextFinder(columnTitle);
        index = textFinder.findNext();
        columnIndex = index.getColumn();
        columnValues = sheet.getSheetValues(1, columnIndex,
                sheet.getLastRow(), 1);

        for (i = 1; i < sheet.getLastRow(); i++)
                values.push(columnValues[i][0]);

        return values;
}
