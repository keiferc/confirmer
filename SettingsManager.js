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
function SettingsManager()
{
        this.module = "SettingsManager";
        this.main = this.getMain();
        this.contacts = this.getContacts();
        this.schedule = this.getSchedule();
        this.emailContent = this.getEmailContent();
}

//////////////////////////////////////////
// Getters                              //
//////////////////////////////////////////
/**
 * getGASO
 *
 * Returns the Google Apps Script Object containing
 * user settings for the Confirmer add-on
 *
 * @returns     {Object}
 */
SettingsManager.prototype.getGASO = function ()
{
        return PropertiesService.getUserProperties();
}

/**
 * getAll
 *
 * Returns a JSON format 
 */
SettingsManager.prototype.getAll = function ()
{
        return this.getGASO().getProperties();
}

/**
 * getMain
 */
SettingsManager.prototype.getMain = function ()
{
        return new GasoParser().toJSON(this.getAll().main);
}

/**
 * getContacts
 */
SettingsManager.prototype.getContacts = function ()
{
        return new GasoParser().toJSON(this.getAll().contacts);
}

/**
 * getSchedule
 */
SettingsManager.prototype.getSchedule = function ()
{
        return new GasoParser().toJSON(this.getAll().schedule);
}

/**
 * getEmailContent
 */
SettingsManager.prototype.getEmailContent = function ()
{
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
 * @param       {Object} main
 * @param       {Object} contacts
 * @param       {Object} schedule
 * @param       {Object} emailContent
 */
SettingsManager.prototype.setAll = function
(main, contacts, schedule, emailContent)
{
        this.getGASO().setProperties({
                main: main,
                contacts: contacts,
                schedule: schedule,
                emailContent: emailContent,
        });
}

/**
 * setMain
 */
SettingsManager.prototype.setMain = function
(hourOfDay, everyXDays, sendToSelf)
{
        this.getGASO().setProperty("main", 
                new this.Main(hourOfDay, everyXDays, sendToSelf));
}

/**
 * setContacts
 */
SettingsManager.prototype.setContacts = function
(header, url, nameColLabel, emailColLabel)
{
        this.getGASO().setProperty("contacts",
                new this.Contacts(header, url, 
                                  nameColLabel, emailColLabel));
}

/**
 * setSchedule
 */
SettingsManager.prototype.setSchedule = function
(header, url, dateColLabel)
{
        this.getGASO().setProperty("schedule", 
                new this.Schedule(header, url, dateColLabel));
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
                new this.EmailContent(header, url,
                                      subjectColLabel, bodyColLabel));
}

//////////////////////////////////////////
// Nested Object Constructors           //
//////////////////////////////////////////
/**
 * Main
 * 
 * @param       {String} hourOfDay
 * @param       {Number} everyXDays
 * @param       {Boolean} sendToSelf
 * @param       {Object}
 */
SettingsManager.prototype.Main = function
(hourOfDay, everyXDays, sendToSelf)
{
        this.hourOfDay = hourOfDay; // [1-12][am|pm] e.g. 9am, 12pm
        this.everyXDays = everyXDays; // delivery time check
        this.sendToSelf = sendToSelf;
}

/**
 * Contacts
 *
 * @param       {String} header
 * @param       {String} url 
 * @param       {String} nameColLabel 
 * @param       {String} emailColLabel 
 * @returns     {Object}
 */
SettingsManager.prototype.Contacts = function
(header, url, nameColLabel, emailColLabel)
{
        this.header = header;
        this.url = url;
        this.nameColLabel = nameColLabel;
        this.emailColLabel = emailColLabel;
}

/**
 * Schedule
 *
 * @param       {String} header
 * @param       {String} url 
 * @param       {String} dateColLabel 
 * @returns     {Object}
 */
SettingsManager.prototype.Schedule = function
(header, url, dateColLabel)
{
        this.header = header;
        this.url = url;
        this.dateColLabel = dateColLabel;
}

/**
 * EmailContent
 *
 * @param       {String} header
 * @param       {String} url
 * @param       {String} subjectColLabel
 * @param       {String} bodyColLabel
 * @returns     {Object} 
 */
SettingsManager.prototype.EmailContent = function
(header, url, subjectColLabel, bodyColLabel)
{
        this.header = header;
        this.url = url;
        this.subjectColLabel = subjectColLabel;
        this.bodyColLabel = bodyColLabel;
}
