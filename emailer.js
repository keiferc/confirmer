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

function Emailer(contacts, schedule, emailContent) {
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
        var calendar, date, contacts, recipients, subject, message;

        calendar = new TimeManager();

        // Calculate date
        try {
                date = calendar.getNextDate();
        } catch(e) {
                Logger.log(e);
        }

        // Retrieve recipient emails
        contacts = this.getContacts();
        recipients = this.getRecipients(contacts, 
                this.getScheduled(date), true); // TODO: get sendToSelf

        //debug
        Logger.log(recipients);

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
        var parser = new GSheetParser(this.emailContent.url);

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
        
        parser = new GSheetParser(this.emailContent.url);
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
 * Given an array of scheduled names and the contacts
 * list, return an array containing emails of the 
 * scheduled people
 *
 * @param       {Object} contacts
 * @param       {Array} scheduled
 * @param       {Boolean} sendToSelf
 * @returns     {Array}
 */
Emailer.prototype.getRecipients = function
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

        parser = new GSheetParser(this.contacts.url);
        namesArr = parser.getColumn(this.contacts.nameColLabel);
        emailsArr = parser.getColumn(this.contacts.emailColLabel);
        contacts = {};

        if (namesArr.length != emailsArr.length)
                Logger.log("Error: asymmetric contact info");

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
        return new GSheetParser(this.schedule.url).getRow(date);
}
