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

function SettingsManager()
{
        this.module = "SettingsManager";
}

//////////////////////////////////////////
// Getters                              //
//////////////////////////////////////////
/**
 * getGASO
 */
SettingsManager.prototype.getGASO = function ()
{
        return PropertiesService.getUserProperties();
}

/**
 * getAll
 */
SettingsManager.prototype.getAll = function ()
{
        //debug
        Logger.log(typeof(this.getGASO().getProperties()));

        return this.getGASO().getProperties();
}

/**
 * getMain
 */
SettingsManager.prototype.getMain = function ()
{
        // return JSON.parse(
        //         this.getAll()["main"]).replace(/=/g, ":");
        return this.getAll().main;
}

/**
 * getContacts
 */
SettingsManager.prototype.getContacts = function ()
{
        return this.getAll().contacts;
}

/**
 * getSchedule
 */
SettingsManager.prototype.getSchedule = function ()
{
        return this.getAll().schedule;
}

/**
 * getEmailContent
 */
SettingsManager.prototype.getEmailContent = function ()
{
        return this.getAll().emailContent;
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
        this.setContacts(formatSectionHeader("Contacts", PRIMARY_COLOR),
                null, "Contact Names", "Emails");
        this.setSchedule(formatSectionHeader("Schedule", PRIMARY_COLOR),
                null, "Event Date");
        this.setEmailContent(
                formatSectionHeader("EmailContent", PRIMARY_COLOR),
                null, "Subject Line", "Email Body");
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
(formattedHeader, url, nameColLabel, emailColLabel)
{
        this.getGASO().setProperty("contacts",
                new this.Contacts(formattedHeader, url, 
                                  nameColLabel, emailColLabel));
}

/**
 * setSchedule
 */
SettingsManager.prototype.setSchedule = function
(formattedHeader, url, dateColLabel)
{
        this.getGASO().setProperty("schedule", 
                new this.Schedule(formattedHeader, url, dateColLabel));
}

/**
 * setEmailContent
 *
 * @param       {String} formattedSectionHeader
 * @param       {String} url
 * @param       {String} subjectColLabel
 * @param       {String} bodyColLabel
 */
SettingsManager.prototype.setEmailContent = function
(formattedSectionHeader, url, subjectColLabel, bodyColLabel)
{
        this.getGASO().setProperty("emailContent",
                new this.EmailContent(formattedSectionHeader, url,
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
 * @param       {String} formattedHeader
 * @param       {String} url 
 * @param       {String} nameColLabel 
 * @param       {String} emailColLabel 
 * @returns     {Object}
 */
SettingsManager.prototype.Contacts = function
(formattedHeader, url, nameColLabel, emailColLabel)
{
        this.header = formattedHeader;
        this.url = url;
        this.nameColLabel = nameColLabel;
        this.emailColLabel = emailColLabel;
}

/**
 * Schedule
 *
 * @param       {String} formattedHeader
 * @param       {String} url 
 * @param       {String} dateColLabel 
 * @returns     {Object}
 */
SettingsManager.prototype.Schedule = function
(formattedHeader, url, dateColLabel)
{
        this.header = formattedHeader;
        this.url = url;
        this.dateColLabel = dateColLabel;
}

/**
 * EmailContent
 *
 * @param       {String} formattedHeader
 * @param       {String} url
 * @param       {String} subjectColLabel
 * @param       {String} bodyColLabel
 * @returns     {Object} 
 */
SettingsManager.prototype.EmailContent = function
(formattedHeader, url, subjectColLabel, bodyColLabel)
{
        this.header = formattedHeader;
        this.url = url;
        this.subjectColLabel = subjectColLabel;
        this.bodyColLabel = bodyColLabel;
}
