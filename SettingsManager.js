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
        this.setContacts("Contacts", null, "Contact Names", "Emails");
        this.setSchedule("Schedule", null, "Event Date");
        this.setEmailContent("Email Content",null, "Subject Line", 
                             "Email Body");
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
 * @param       {String} url
 * @param       {String} nameColLabel
 * @param       {String} emailColLabel
 */
SettingsManager.prototype.setContacts = function
(header, url, nameColLabel, emailColLabel)
{
        this.getGASO().setProperty("contacts",
                new ContactsSettings(header, url, nameColLabel, 
                        emailColLabel));
}

/**
 * setSchedule
 *
 * @param       {String} header
 * @param       {String} url
 * @param       {String} dateColLabel
 */
SettingsManager.prototype.setSchedule = function
(header, url, dateColLabel)
{
        this.getGASO().setProperty("schedule", 
                new ScheduleSettings(header, url, dateColLabel));
}

/**
 * setEmailContent
 *
 * @param       {String} header
 * @param       {String} url
 * @param       {String} subjectColLabel
 * @param       {String} bodyColLabel
 */
SettingsManager.prototype.setEmailContent = function
(header, url, subjectColLabel, bodyColLabel)
{
        this.getGASO().setProperty("emailContent",
                new EmailContentSettings(header, url, subjectColLabel, 
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
        this.hourOfDay = cleanInputSetting(hourOfDay); // [1-12][am|pm]; 9am
        this.everyXDays = cleanInputSetting(everyXDays); // refresh check
        this.sendToSelf = cleanInputSetting(sendToSelf);
}

/**
 * ContactsSettings
 *
 * @param       {String} header
 * @param       {String} url 
 * @param       {String} nameColLabel 
 * @param       {String} emailColLabel 
 * @returns     {ContactsSettings}
 */
function ContactsSettings(header, url, nameColLabel, emailColLabel)
{
        this.header = cleanInputSetting(header);
        this.contactsUrl = cleanInputSetting(url);
        this.nameColLabel = cleanInputSetting(nameColLabel);
        this.emailColLabel = cleanInputSetting(emailColLabel);
}

/**
 * ScheduleSettings
 *
 * @param       {String} header
 * @param       {String} url 
 * @param       {String} dateColLabel 
 * @returns     {ScheduleSettings}
 */
function ScheduleSettings(header, url, dateColLabel)
{
        this.header = cleanInputSetting(header);
        this.scheduleUrl = cleanInputSetting(url);
        this.dateColLabel = cleanInputSetting(dateColLabel);
}

/**
 * EmailContentSettings
 *
 * @param       {String} header
 * @param       {String} url
 * @param       {String} subjectColLabel
 * @param       {String} bodyColLabel
 * @returns     {EmailContentSettings} 
 */
function EmailContentSettings(header, url, subjectColLabel, bodyColLabel)
{
        this.header = cleanInputSetting(header);
        this.emailContentUrl = cleanInputSetting(url);
        this.subjectColLabel = cleanInputSetting(subjectColLabel);
        this.bodyColLabel = cleanInputSetting(bodyColLabel);
}

//============== Constructor Helpers ==============// 
/**
 * cleanInputSetting 
 *
 * @param       {Object} setting 
 * @returns     {Object|null}
 */
function cleanInputSetting(setting)
{
        if (setting == null || setting == undefined  || 
            setting.toString() === "")
                return null;
        else
                return setting;
}

//////////////////////////////////////////
// Checkers                             //
//////////////////////////////////////////
/**
 * checkMain
 *
 * @param       {MainSettings} main
 * @returns     {Boolean}
 */
SettingsManager.prototype.checkMain = function 
(main)
{
        return true;
}

/**
 * checkContacts
 *
 * @param       {ContactsSettings} contacts
 * @returns     {Boolean}
 */
SettingsManager.prototype.checkContacts = function
(contacts)
{
        return true;
}

/**
 * checkSchedule
 *
 * @param       {ScheduleSettings} schedule
 * @returns     {Boolean}
 */
SettingsManager.prototype.checkSchedule = function
(schedule)
{
        return true;
}

/**
 * checkEmailContent
 *
 * @param       {EmailContentSettings} emailContent
 * @returns     {Boolean}
 */
SettingsManager.prototype.checkEmailContent = function
(emailContent)
{
        return true;
}

//============== Checker Helpers ==============//
/**
 */
