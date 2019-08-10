/*
 *      filename:       SettingsManager.js
 *      author:         @KeiferC
 *      version:        0.0.1
 *      date:           29 July 2019
 *      description:    This module contains an object that manages
 *                      the settings of the Confirmer GMail add-on
 *
 *      note:           This module is to be in a Google Script
 *                      and thus uses constructor functions 
 *                      instead of Classes (due to GAS' lack of class
 *                      compatibility)
 */

// TODO call parser on every settings getter

/**
 * SettingsManager
 *
 * A class that handles all processes
 * involving add-on settings
 *
 * @returns     {Object}
 */
function SettingsManager() {}

//////////////////////////////////////////
// Getters                              //
//////////////////////////////////////////
/**
 * getGASO
 *
 * Returns the Google Apps Script Object containing
 * user settings for the Confirmer add-on
 *
 * @returns     {UserProperties}
 */
SettingsManager.prototype.getGASO = function ()
{
        return PropertiesService.getUserProperties();
}

/**
 * getAll
 *
 * Returns saved user properties in a GASO format
 *
 * @returns     {Google Apps Script Object}
 */
SettingsManager.prototype.getAll = function ()
{
        return this.getGASO().getProperties();
}

/**
 * getMain
 *
 * @returns     {JSON}
 */
SettingsManager.prototype.getMain = function ()
{
        if (this.getAll().main == undefined)
                throw "Error: Saved 'Main' settings are undefined.";

        return new GasoParser().toJSON(this.getAll().main);
}

/**
 * getContacts
 *
 * @returns     {JSON}
 */
SettingsManager.prototype.getContacts = function ()
{
        if (this.getAll().contacts == undefined) 
                throw "Error: Saved 'Contacts' settings are undefined.";

        return new GasoParser().toJSON(this.getAll().contacts);
}

/**
 * getSchedule
 *
 * @returns     {JSON}
 */
SettingsManager.prototype.getSchedule = function ()
{
        if (this.getAll().schedule == undefined)
                throw "Error: Saved 'Schedule' settings are undefined";

        return new GasoParser().toJSON(this.getAll().schedule);
}

/**
 * getEmailContent
 *
 * @returns     {JSON}
 */
SettingsManager.prototype.getEmailContent = function ()
{
        if (this.getAll().emailContent == undefined)
                throw "Error: Saved 'Email Content' settings are undefined";

        return new GasoParser().toJSON(this.getAll().emailContent);
}

//////////////////////////////////////////
// Setters                              //
//////////////////////////////////////////
/**
 * setDefault
 */
SettingsManager.prototype.setDefault = function ()
{
        this.setMain("9am", 1, true);
        this.setContacts("Contacts", null, "e.g. Contact Names", 
                "e.g. Emails");
        this.setSchedule("Schedule", null, "e.g. Event Date");
        this.setEmailContent("Email Content",null, "e.g. Subject Line", 
                "e.g. Email Body");
}

/**
 * setAll 
 *
 * @param       {MainSettings} main
 * @param       {ContactsSettings} contacts
 * @param       {ScheduleSettings} schedule
 * @param       {EmailContentSettings} emailContent
 */
SettingsManager.prototype.setAll = function
(main, contacts, schedule, emailContent)
{
        this.getGASO().setProperties({
                main: main,
                contacts: contacts,
                schedule: schedule,
                emailContent: emailContent
        });
}

/**
 * setMain
 *
 * @param       {String} hourOfDay
 * @param       {Number} everyXDays
 * @param       {Boolean} sendToSelf
 */
SettingsManager.prototype.setMain = function
(hourOfDay, everyXDays, sendToSelf)
{
        this.getGASO().setProperty("main", 
                new MainSettings(hourOfDay, everyXDays, sendToSelf));
}

/**
 * setContacts
 *
 * @param       {String} header
 * @param       {String} id
 * @param       {String} nameColLabel
 * @param       {String} emailColLabel
 */
SettingsManager.prototype.setContacts = function
(header, id, nameColLabel, emailColLabel)
{
        this.getGASO().setProperty("contacts",
                new ContactsSettings(header, id, nameColLabel, 
                        emailColLabel));
}

/**
 * setSchedule
 *
 * @param       {String} header
 * @param       {String} id
 * @param       {String} dateColLabel
 */
SettingsManager.prototype.setSchedule = function
(header, id, dateColLabel)
{
        this.getGASO().setProperty("schedule", 
                new ScheduleSettings(header, id, dateColLabel));
}

/**
 * setEmailContent
 *
 * @param       {String} header
 * @param       {String} id
 * @param       {String} subjectColLabel
 * @param       {String} bodyColLabel
 */
SettingsManager.prototype.setEmailContent = function
(header, id, subjectColLabel, bodyColLabel)
{
        this.getGASO().setProperty("emailContent",
                new EmailContentSettings(header, id, subjectColLabel, 
                        bodyColLabel));
}

//////////////////////////////////////////
// Object Constructors                  //
//////////////////////////////////////////
/**
 * MainSettings
 * 
 * @param       {String} hourOfDay
 * @param       {Number} everyXDays
 * @param       {Boolean} sendToSelf
 * @param       {MainSettings}
 */
function MainSettings(hourOfDay, everyXDays, sendToSelf)
{
        // Format: [1-12][am|pm]; 9am
        this.hourOfDay = cleanInputSetting(hourOfDay, false); 

        // Used for push refresh frequency
        this.everyXDays = cleanInputSetting(everyXDays, false);

        this.sendToSelf = cleanInputSetting(sendToSelf, false);
}

/**
 * ContactsSettings
 *
 * @param       {String} header
 * @param       {String} id 
 * @param       {String} nameColLabel 
 * @param       {String} emailColLabel 
 * @returns     {ContactsSettings}
 */
function ContactsSettings(header, id, nameColLabel, emailColLabel)
{
        this.header = header;
        this.contactsId = id;
        this.nameColLabel = nameColLabel;
        this.emailColLabel = emailColLabel;
}

/**
 * ScheduleSettings
 *
 * @param       {String} header
 * @param       {String} id 
 * @param       {String} dateColLabel 
 * @returns     {ScheduleSettings}
 */
function ScheduleSettings(header, id, dateColLabel)
{
        this.header = header;
        this.scheduleId = id;
        this.dateColLabel = dateColLabel;
}

/**
 * EmailContentSettings
 *
 * @param       {String} header
 * @param       {String} id
 * @param       {String} subjectColLabel
 * @param       {String} bodyColLabel
 * @returns     {EmailContentSettings} 
 */
function EmailContentSettings(header, id, subjectColLabel, bodyColLabel)
{
        this.header = header
        this.emailContentId = id;
        this.subjectColLabel = subjectColLabel;
        this.bodyColLabel = bodyColLabel;
}

//============== Constructor Helpers ==============// 
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

//////////////////////////////////////////
// Checkers                             //
//////////////////////////////////////////
/**
 * updateSettings
 *
 * @param       {MainSettings} main
 * @param       {ContactsSettings} contacts
 * @param       {ScheduleSettings} schedule
 * @param       {EmailContentSettings} emailContent
 * @returns     {ActionResponse}
 */
function updateSettings(main, contacts, schedule, emailContent)
{
        var manager, errors, message, i, 
            cleanContacts, cleanSchedule, cleanEmailContent;

        manager = new SettingsManager();
        errors = [];
        message = "";

        try {
                cleanContacts = sanitizeContacts(contacts);
        } catch(e) {
                errors.push(e);
        } finally {
                try {
                        cleanSchedule = sanitizeSchedule(schedule);
                } catch(e) {
                        errors.push(e);
                } finally {
                        try {
                                cleanEmailContent = sanitizeEmailContent(
                                        emailContent);
                        } catch(e) {
                                errors.push(e);
                        } finally {
                                if (errors.length == 0) {
                                        manager.setAll(main, cleanContacts,
                                                cleanSchedule, 
                                                cleanEmailContent);
                                        return updateCard(new SettingsCard().gCard);
                                }

                                for (i = 0; i < errors.length; i++)
                                        message += (errors[i] + " ");
        
                                return printError(message);
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
                throw "URLs cannot be empty.";
        if (nameColLabel == null || emailColLabel == null)
                throw "Column Labels cannot be empty.";

        parser = getGSheet(id);
        parser.getColumnIndex(decodeURIComponent(nameColLabel));
        parser.getColumnIndex(decodeURIComponent(emailColLabel));

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
                throw "URLs cannot be empty.";
        if (dateColLabel == null)
                throw "Column Labels cannot be empty.";
        
        parser = getGSheet(id);
        parser.getColumnIndex(decodeURIComponent(dateColLabel));

        return new ScheduleSettings(header, id, dateColLabel);
}

/**
 * checkEmailContent
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
                throw "URLs cannot be empty.";
        if (subjectColLabel == null || bodyColLabel == null)
                throw "Column Labels cannot be empty.";
        
        parser = getGSheet(id);
        parser.getColumnIndex(decodeURIComponent(subjectColLabel));
        parser.getColumnIndex(decodeURIComponent(bodyColLabel));

        return new EmailContentSettings(header, id, subjectColLabel, 
                bodyColLabel);
}

//============== Checker Helpers ==============//
/**
 * isGSheetUrl // TODO: more tests. Get more sheet urls
 *
 * Returns true if the given string is a valid Google Sheets URL.
 *
 * @param       {String} url
 * @returns     {Boolean}
 */
function isGSheetUrl(url)
{
        var format = encodeURIComponent(GSHEET_URL_FORMAT);

        if (!isValidUrl(url))
                return false;
        else
                return (sanitize(url).indexOf(format) !== -1);
}

/**
 * sanitizeGSheetUrl
 *
 * Sanitizes the given Google Sheet ID and returns the sheet's
 * unique ID.
 *
 * @param       {String} url
 * @returns     {String}
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
 * getGSheet
 *
 * @param       {String} id
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
