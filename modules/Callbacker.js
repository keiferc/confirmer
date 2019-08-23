/*
 *      filename:       Callbacker.js
 *      author:         @KeiferC
 *      version:        0.0.1
 *      date:           12 August 2019
 *      description:    This module handles all add-on processing callbacks
 *                      and globals (e.g. onclick action responses).
 */

/*------------------------------------------------------------
 *                         Functions
 *------------------------------------------------------------
 * ---- Callbacks ----
 * submitButton(Google Apps Script Object)
 * refreshStatus(Google Apps Script Object)
 *
 * ---- Sanitizers ----
 * cleanInputSetting(any, boolean)
 * cleanInputUrl(any)
 * sanitize(string)
 * sanitizeGSheetUrl(string)
 * sanitizeSettings(MainSettings, ContactsSettings, ScheduleSettings, 
 *         EmailContentSettings)
 * sanitizeContacts(ContactsSettings)
 * sanitizeSchedule(ScheduleSettings)
 * sanitizeEmailContent(EmailContentSettings)
 *
 * ---- Checkers ----
 * isEmpty(any)
 * isValidUrl(string)
 * isGSheetUrl(string) 
 *
 * ---- Getters ----
 * getGSheet(string)
 *
 * ---- Helpers ----
 * updateSettings(MainSettings, ContactsSettings, ScheduleSettings, 
 *         EmailContentSettings, Array) // for SettingsManager 
 * updateCard(Google Card, boolean)
 * printError(string)
 * parseHourOfDay(string)
 *
 ------------------------------------------------------------*/

//////////////////////////////////////////
// Globals                              //
//////////////////////////////////////////
var PRIMARY_COLOR = "#267cb5";
var SECONDARY_COLOR = "#267cb5";
var GSHEET_URL_FORMAT = "docs.google.com/spreadsheets/d/";

//////////////////////////////////////////
// Callbacks                            //
//////////////////////////////////////////
/**
 * submitButton
 *
 * Callback function from when settings submit
 * button is activated
 *
 * @param       {Google Apps Script Object} response: returned from Google
 * @returns     {Google ActionResponse}: Action for callback to run
 */
function submitButton(response)
{
        var input, main, contacts, schedule, emailContent;

        input = response.formInputs;

        if (isEmpty(input))
                return printError("Error: Unable to retrieve " + 
                                  "submitted form inputs.");

        main = new MainSettings(input.hourOfDay[0], 1, 
                !isEmpty(input.pause), !isEmpty(input.sendToSelf));
        contacts = new ContactsSettings("Contacts", input.contactsId[0],
                input.nameColLabel[0], input.emailColLabel[0]);
        schedule = new ScheduleSettings("Schedule", input.scheduleId[0],
                input.dateColLabel[0]);
        emailContent = new EmailContentSettings("Email Content", 
                input.emailContentId[0], input.subjectColLabel[0],
                input.bodyColLabel[0]);

        return sanitizeSettings(main, contacts, schedule, emailContent);
}

/**
 * refreshStatus
 *
 * @param       {Google Apps Script Object} response 
 */
function refreshStatus(response)
{
        return updateCard(new StatusCard().gCard, false)
}

//////////////////////////////////////////
// Sanitizers                           //
//////////////////////////////////////////
/**
 * cleanInputSetting 
 *
 * @param       {any} setting 
 * @param       {Boolean} isUrl
 * @returns     {Object|number|null}
 */
function cleanInputSetting(setting, isUrl)
{
        if (isEmpty(setting))
                return null;
        else if (isUrl || isValidUrl(setting.toString()))
                return cleanInputUrl(setting);
        else if (typeof(setting) === "number")
                return setting;
        else
                return sanitize(setting.toString());
}

/**
 * cleanInputUrl
 *
 * Returns a sanitized version of the given URL
 *
 * @param       {any} url: Input URL to sanitize
 * @returns     {string}: Sanitized input URL
 */
function cleanInputUrl(url)
{
        if (isGSheetUrl(url.toString()))
                return sanitizeGSheetUrl(url.toString());
        else if (isValidUrl(url.toString()))
                return sanitize(url.toString());
        
        throw "\""+ url.toString() + "\" is not a valid URL.";
}

/**
 * sanitize
 *
 * Includes percent-encodings of special characters not included 
 * in encodeURIComponent. Used as a first-level sanitizer; outputs 
 * to be passed to content-specific, whitelist-using sanitizers.
 *
 * @param       {string} input: User input to be sanitized
 * @returns     {string} Sanitized user input
 */
function sanitize(input)
{
        var replacers, protocol, i;

        protocol = /(http(s?):\/\/)|(ftp:\/\/)|(mailto:\/\/)/ig; 
        replacers = [
                [/(\/?)\.\.(\/?)/ig, "%2E%2E"], // path traversal
                [/\-{2}/ig, "%2D%2D"], // SQL comments
                [/'/ig, "%27"] // single quotes
        ];

        if (isValidUrl(input))
                input = decodeURIComponent(input); // double encoding

        input = input.replace(protocol, ""); // remote file inclusion
        input = encodeURIComponent(input); // XSS and SQLi

        for (i = 0; i < replacers.length; i++)
                input = input.replace(replacers[i][0], replacers[i][1]);

        return input.toString();
}

/**
 * sanitizeGSheetUrl
 *
 * Sanitizes the given Google Sheet ID and returns the sheet's
 * unique ID.
 *
 * @param       {string} url
 * @returns     {string}
 */
function sanitizeGSheetUrl(url)
{
        var id, blacklist, format;

        blacklist = /[^a-z0-9\-_]/ig;
        format = encodeURIComponent(GSHEET_URL_FORMAT);

        url = sanitize(url);
        id = decodeURIComponent(url.replace(format, ""));
        id = id.replace(/\/.*$/gi, "");
        id = id.replace(blacklist, "");

        return id;
}

/**
 * sanitizeSettings
 *
 * @param       {EmailStatusSettings} emailStatus
 * @param       {MainSettings} main
 * @param       {ContactsSettings} rawContacts
 * @param       {ScheduleSettings} rawSchedule
 * @param       {EmailContentSettings} rawEmailContent
 * @returns     {ActionResponse}
 */
function sanitizeSettings(main, rawContacts, rawSchedule, rawEmailContent)
{
        var errors, contacts, schedule, emailContent;

        errors = [];

        try {
                contacts = sanitizeContacts(rawContacts);
        } catch (e) {
                errors.push(e);
        } finally {
                try {
                        schedule = sanitizeSchedule(rawSchedule);
                } catch(e) {
                        errors.push(e);
                } finally {
                        try {
                                emailContent = sanitizeEmailContent(
                                        rawEmailContent);
                        } catch(e) {
                                errors.push(e);
                        } finally {
                                return updateSettings(main, contacts, 
                                        schedule, emailContent, errors);
                        }
                }
        }
}

/**
 * sanitizeContacts
 *
 * @param       {ContactsSettings} raw
 * @returns     {ContactsSettings}
 */
function sanitizeContacts(raw)
{
        var header, id, nameColLabel, emailColLabel, parser;

        header = cleanInputSetting(raw.header, false);
        id = cleanInputSetting(raw.contactsId, true);
        nameColLabel = cleanInputSetting(raw.nameColLabel, false);
        emailColLabel = cleanInputSetting(raw.emailColLabel, false);

        if (id == null)
                throw "Contacts Sheet URL cannot be empty.";
        if (nameColLabel == null || emailColLabel == null)
                throw "Column Labels cannot be empty.";

        parser = getGSheet(id);
        parser.getColumnIndex(nameColLabel);
        parser.getColumnIndex(emailColLabel);

        return new ContactsSettings(header, id, nameColLabel, emailColLabel);
}

/**
 * sanitizeSchedule
 *
 * @param       {ScheduleSettings} raw
 * @returns     {ScheduleSettings}
 */
function sanitizeSchedule(raw)
{
        var header, id, dateColLabel;

        header = cleanInputSetting(raw.header, false);
        id = cleanInputSetting(raw.scheduleId, true);
        dateColLabel = cleanInputSetting(raw.dateColLabel, false);

        if (id == null)
                throw "Schedule Sheet URL cannot be empty.";
        if (dateColLabel == null)
                throw "Column Labels cannot be empty.";
        
        parser = getGSheet(id);
        parser.getColumnIndex(dateColLabel);

        return new ScheduleSettings(header, id, dateColLabel);
}

/**
 * sanitizeEmailContent
 *
 * @param       {EmailContentSettings} raw
 * @returns     {EmailContentSettings}
 */
function sanitizeEmailContent(raw)
{
        var header, id, subjectColLabel, bodyColLabel;

        header = cleanInputSetting(raw.header, false);
        id = cleanInputSetting(raw.emailContentId, true);
        subjectColLabel = cleanInputSetting(raw.subjectColLabel, false);
        bodyColLabel = cleanInputSetting(raw.bodyColLabel, false);

        
        if (id == null)
                throw "Email Content Sheet URL cannot be empty.";
        if (subjectColLabel == null || bodyColLabel == null)
                throw "Column Labels cannot be empty.";
        
        parser = getGSheet(id);
        parser.getColumnIndex(subjectColLabel);
        parser.getColumnIndex(bodyColLabel);

        return new EmailContentSettings(header, id, subjectColLabel, 
                bodyColLabel);
}

//////////////////////////////////////////
// Checkers                             //
//////////////////////////////////////////
/**
 * isEmpty
 *
 * Helper function that handles multiple return types from Google.
 * Returns true if the value is "empty" or null / undefined or NaN.
 *
 * Note: (null == undefined) === true
 *
 * @param       {any} input: Input to be evaluated
 * @returns     {boolean}: True if input is empty / null
 */
function isEmpty(input)
{
        return input == null || input.toString() === "" || 
               input.toString() == "null" || 
               input.toString() == "undefined";
}

/**
 * isValidUrl
 *
 * Returns true if the given string is a RFC 3986 compliant URL.
 * See https://tools.ietf.org/html/rfc3986#appendix-A.
 *
 * @param       {string} input: User input to check
 * @returns     {boolean}: True if input is a RFC 3986 compliant URL
 */
function isValidUrl(input)
{
        var regex, match, unreserved, pctEncoded, subDelims, pchar, qf, e8, 
        pcharPct, qfPct, protocol, domain, ipv4, port, path, query, fragment;

        unreserved      = "a-z0-9\\-\\._~";
        pctEncoded      = "(%[a-f0-9]{2})";
        subDelims       = "!$&'()*+,;=";
        pchar           = unreserved + subDelims + ":@";
        qf              = pchar + "/?"; // query & fragment chars
        e8              = "((25[0-5])|(2[0-4]\\d)|(1?\\d\\d?))"; // 0 - 255

        pcharPct        = pctEncoded + "*[" + pchar + "]*";
        qfPct           = pctEncoded + "*[" + qf + "]*";

        protocol        = "^(http(s?):\\/\\/)?";
        domain          = "(([a-z0-9\\-]+\\.)+([a-z\\-]+[0-9]*))";
        ipv4            = "((" + e8 + "\\.){3}" + e8 + ")";
        port            = "(:(\\d+))?";

        path            = "(\\/(" + pcharPct + ")*)";
        query           = "(\\?(" + qfPct + ")*)?";
        fragment        = "((#(" + qfPct + ")*)$)?";

        regex = new RegExp(protocol + "(" + domain + "|" + ipv4 + ")" + port +
                "(" + path + query + fragment + ")*", "im");

        match = input.match(regex);

        if (match == null)
                return false;
        else
                return match[0] == input;
}

/**
 * isGSheetUrl
 *
 * Returns true if the given string is a valid Google Sheets URL.
 *
 * @param       {string} url
 * @returns     {boolean}
 */
function isGSheetUrl(url)
{
        var format = encodeURIComponent(GSHEET_URL_FORMAT);

        if (!isValidUrl(url))
                return false;
        else
                return (sanitize(url).indexOf(format) !== -1);
}

//////////////////////////////////////////
// Getters                            //
//////////////////////////////////////////
/**
 * getGSheet
 *
 * @param       {string} id
 * @returns     {GSheetParser}
 */
function getGSheet(id)
{
        var parser;
        
        try {
                parser = new GSheetParser(id);
        } catch (e) {
                throw GSHEET_URL_FORMAT + id + 
                        " is not a retrievable Google Sheet. " +
                        "Please check that the URL is spelled correctly " +
                        "and that you have permission to access the Sheet. ";
        }

        return parser;
}

//////////////////////////////////////////
// Helpers                              //
//////////////////////////////////////////
function updateSettings(main, contacts, schedule, emailContent, errors)
{
        var settings, calendar, message, frequency, time, pause, i;

        settings = new SettingsManager();
        calendar = new TimeManager();
        message = "";

        if (errors.length == 0) {
                settings.setAll(main, contacts, schedule, emailContent);
                settings.updateEmailStatus(3);

                frequency = main.everyXDays;
                time = parseHourOfDay(main.hourOfDay);
                pause = parseBool(main.pause);
                calendar.editTimeTrigger(frequency, time, pause);
                
                return updateCard(new SettingsCard().gCard, true);
        }

        for (i = 0; i < errors.length; i++)
                message += (errors[i] + " ");

        return printError(message);
}

/**
 * updateCard
 *
 * Conducts an in-place update of the given card.
 *
 * @param       {Google Card} card: Google Card to update
 * @returns     {Google ActionResponse}: ActionResponse that updates Card
 */
function updateCard(card, pop) 
{
        var nav = CardService.newNavigation().updateCard(card);

        if (pop)
                nav.popToRoot();

        return CardService.newActionResponseBuilder()
                .setStateChanged(true)
                .setNavigation(nav)
                .build();
}

/**
 * printError
 *
 * Pushes a Google Card on the add-on stack displaying error messages.
 *
 * @param       {string} error: Errors to display
 * @returns     {Google ActionResponse}: ActionResponse that pushes Card
 */
function printError(error)
{
        var errorCard, nav;
        
        errorCard = CardService.newCardBuilder()
                .setHeader(CardService.newCardHeader()
                        .setTitle("Oops! Something went wrong!")
                )
                .addSection(CardService.newCardSection()
                        .addWidget(CardService.newTextParagraph()
                                        .setText(error))
                )
                .build();

        nav = CardService.newNavigation().pushCard(errorCard);

        return CardService.newActionResponseBuilder()
                .setStateChanged(true)
                .setNavigation(nav)
                .build();
}

/**
 * parseHourOfDay 
 *
 * @param       {string} hourOfDay: Attribute of MainSettings
 * @returns     {number}: Integer representing 24 hr clock hour
 */
function parseHourOfDay(hourOfDay)
{
        var time, am, pm, message;

        am = RegExp("am", "gi");
        pm = RegExp("pm", "gi");
        message = "Error: Unable to parse time of day.";

        if (am.test(hourOfDay)) {
                time = hourOfDay.replace(am, "");
                time = parseInt(time);

                if (time == 12)
                        return 0;
                if (isNaN(time))
                        throw message;
                return time;

        } else if (pm.test(hourOfDay)) {
                time = hourOfDay.replace(pm, "");
                time = parseInt(time);

                if (time == 12)
                        return time;
                if (isNaN(time))
                        throw message;
                return (time + 12);
        }

        throw message;
}

function parseBool(bool)
{
        if (isEmpty(bool) || bool === "false")
                return false;
        if (bool === "true")
                return true;
        
        throw "Error: Unable to boolean string.";
}

function getToday() 
{
        var date, offset, hours;

        date = new Date();
        offset = date.getTimezoneOffset() / 60;
        hours = date.getHours();

        date.setHours(hours - offset);

        return date;
}
