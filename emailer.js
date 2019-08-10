/*
 *      filename:       Emailer.js
 *      author:         @KeiferC
 *      version:        0.0.1
 *      date:           29 July 2019
 *      description:    This module manages the emailing processes
 *                      involved with the Confirmer GMail add-on
 *
 *      note:           This module is to be in a Google Script
 *                      and thus uses constructor functions
 *                      instead of Classes (due to GAS' lack of class
 *                      compatibility)
 */

/**
 * Emailer 
 *
 * @param       {MainSettings} main
 * @param       {Object} contacts 
 * @param       {Object} schedule 
 * @param       {Object} emailContent 
 * @returns     {Object}
 */
function Emailer(main, contacts, schedule, emailContent) {
        this.main = main;
        this.contacts = contacts;
        this.schedule = schedule;
        this.emailContent = emailContent;
}

//////////////////////////////////////////
// Email Composition                    //
//////////////////////////////////////////
/**
 * Calls and manages main processes
 */
Emailer.prototype.email = function () 
{
        var calendar, date, recipients, subject, message;

        // Calculate date
        try {
                date = new TimeManager().getNextDate();
        } catch(e) {
                // TODO : Send error email (next event is not scheduled)
                // debug
                throw e;
        }

        // Retrieve recipient emails
        try {
                recipients = this.getRecipients(date);
        } catch(e) {
                // TODO: Send error email (no one is scheduled for next event)
                // debug
                throw e;
        }

        // Compose email
        date = calendar.formatDate(date);
        subject = this.generateSubject(date);
        message = this.generateEmailBody(date);

        // Send email
        // MailApp.sendEmail({
        //         bcc: recipients,
        //         subject: subject,
        //         htmlBody: message
        // });
}

/**
 * generateSubject
 *
 * Formats the subject line from the given spreadsheet,
 * column label, and formatted date
 *
 * @param       {Date} date
 * @returns     {String}
 */
Emailer.prototype.generateSubject = function
(date)
{
        var parser = new GSheetParser(this.emailContent.emailContentId);

        return  "[" + date + "]: " +
                parser.getColumn(this.emailContent.subjectColLabel)[0];
}

/**
 * generateEmailBody
 *
 * Formats the email body from the given spreadsheet,
 * column label, and formatted date.
 *
 * @param       {Date} date
 * @returns     {String}
 */
Emailer.prototype.generateEmailBody = function 
(date)
{
        var parser, body, signature;
        
        parser = new GSheetParser(this.emailContent.emailContentId);
        body = parser.getColumn(this.emailContent.bodyColLabel)[0];
        signature = Gmail.Users.Settings.SendAs.list("me").sendAs.filter(
                function (account) {
                        if (account.isDefault)
                                return true
                })[0].signature;

        return  "<p>Dear Volunteers,</p>" + 
                "<p>" + date + " is our next immigration clinic. " + 
                body +"</p>" + signature;
}

//////////////////////////////////////////
// Contacts Retrieval                   //
//////////////////////////////////////////
/**
 * getRecipients
 *
 * Client-facing function. Used for status card.
 */
Emailer.prototype.getRecipients = function 
(date)
{
        var contacts, settings, scheduled, recipients;

        contacts = this.getContacts();
        settings = new SettingsManager().getMain();
        scheduled = this.getScheduled(date);
        recipients = this.getRecipientsHelper(contacts, scheduled, 
                settings.sendToSelf != undefined);

        if (isEmpty(recipients))
                throw "Error: No persons scheduled for the next event.";
        
        return recipients;
}

/**
 * getRecipientsHelper
 * 
 * Given an array of scheduled names and the contacts
 * list, return an array containing emails of the 
 * scheduled people.
 *
 * @param       {Object} contacts
 * @param       {Array} scheduled
 * @param       {Boolean} sendToSelf
 * @returns     {String}
 */
Emailer.prototype.getRecipientsHelper = function
(contacts, scheduled, sendToSelf) 
{
        var emails, i;

        emails = "";

        for (i = 0; i < scheduled.length; i++)
                emails += contacts[scheduled[i]] + ",";

        if (sendToSelf)
                emails += Session.getEffectiveUser();
        else
                emails = emails.replace(/(^\s*,)|(,\s*$)/g, "");

        return emails;
}

/**
 * getContacts
 * 
 * Merges two arrays into a key-value object
 * 
 * @return      {Object}
 */
Emailer.prototype.getContacts = function () 
{
        var parser, namesArr, emailsArr, contacts, i;

        parser = new GSheetParser(this.contacts.contactsId);
        namesArr = parser.getColumn(this.contacts.nameColLabel);
        emailsArr = parser.getColumn(this.contacts.emailColLabel);
        contacts = {};

        if (namesArr.length != emailsArr.length)
                throw "Error: asymmetric contact info. The number of names " + 
                      "is not equal to the number of emails in the given " + 
                      "Google Sheet.";

        for (i = 0; i < namesArr.length; i++)
                contacts[namesArr[i]] = emailsArr[i];

        return contacts;
}

/**
 * getScheduled
 *
 * Returns an array of scheduled people who signed up for
 * the given scheduled date
 *
 * @param       {Date} date
 * @returns     {Array}
 */
Emailer.prototype.getScheduled = function
(date) 
{
        var scheduled = new GSheetParser(this.schedule.scheduleId)
                .getRow(date);

        if (isEmpty(scheduled))
                throw "Error: No persons scheduled for the next event.";

        return scheduled;
}
