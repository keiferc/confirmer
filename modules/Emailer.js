/*
 *      filename:       Emailer.js
 *      author:         @KeiferC
 *      version:        0.0.1
 *      date:           29 July 2019
 *      description:    This module manages the emailing processes involved 
 *                      with the Confirmer GMail add-on.
 */

/*------------------------------------------------------------
 *                         Functions
 *------------------------------------------------------------
 * ---- Object Constructor ----
 * Emailer::Emailer(MainSettings, ContactsSettings, 
 *      ScheduleSettings, EmailContentSettings)
 *
 * ---- Email Composition ----
 * Emailer::email()
 * Emailer::generateSubject(Date)
 * Emailer::generateEmailBody(Date)
 * 
 * ---- Contacts Retrieval ----
 * Emailer::getRecipients(Date)
 * Emailer::getRecipientsHelper(Object, Array , Boolean)
 * Emailer::getContacts()
 * Emailer::getScheduled(Date)
 *
 * ---- Helpers ----
 * Emailer::emailError(string)
 ------------------------------------------------------------*/

/**
 * Emailer
 *
 * Custom object constructor handling emailing processes.
 *
 * @param       {MainSettings} main: SettingsManager obj for main
 * @param       {ContactsSettings} contacts: SettingsManager obj for contacts
 * @param       {ScheduleSettings} schedule: SettingsManager obj for schedules
 * @param       {EmailContentSettings} emailContent: SettingsManager obj for
 *                                                   email content
 * @returns     {Emailer}: Object instance for handling emailing processes
 */
function Emailer(settings) {
        this.main = settings.getMain();
        this.contacts = settings.getContacts();
        this.schedule = settings.getSchedule();
        this.emailContent = settings.getEmailContent();
}

//////////////////////////////////////////
// Email Composition                    //
//////////////////////////////////////////
/**
 * email
 *
 * Composes and sends add-on emails.
 */
Emailer.prototype.email = function () 
{
        var calendar, date, recipients, subject, message;

        calendar = new TimeManager();

        try {
                date = calendar.getNextDate();
        } catch(e) {
                this.emailError("Date retrieval error. " + e);
                throw e;
        }

        try {
                recipients = this.getRecipients(date);
        } catch(e) {
                this.emailError("Recipient retrieval error. " + e);
                throw e;
        }

        // Compose email
        date = calendar.formatDate(date);
        subject = this.generateSubject(date);
        message = this.generateEmailBody(date);

        // Send email
        MailApp.sendEmail({
                bcc: recipients,
                subject: "TEST" + subject,
                htmlBody: message
        });
}

/**
 * generateSubject
 *
 * Formats the subject line from the given spreadsheet,
 * column label, and formatted date
 *
 * @param       {Date} date: JS Date object
 * @returns     {String}: Formatted subject line for email
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
 * @param       {Date} date: JS Date object
 * @returns     {String}: Formatted message body for email
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

        return  "Dear Volunteers,<br><br>" + 
                date + " is our next immigration clinic. " + 
                body + "<br><br>" + signature;
}

//////////////////////////////////////////
// Contacts Retrieval                   //
//////////////////////////////////////////
/**
 * getRecipients
 *
 * Returns a comma-delineated string of email address to send email to.
 * Call helper function getRecipientsHelper
 *
 * @param       {Date}: JS Date object
 * @returns     {string}: Comma-delineated string of email addresses
 */
Emailer.prototype.getRecipients = function 
(date)
{
        var contacts, settings, scheduled, recipients;

        contacts = this.getContacts();
        settings = new SettingsManager().getMain();
        scheduled = this.getScheduled(date);

        recipients = this.getRecipientsHelper(contacts, scheduled, 
                settings.sendToSelf == "true");

        if (isEmpty(recipients))
                throw "No persons scheduled for the next event. " + 
                      "Please check that there is someone scheduled for " +
                      "the event on " + new TimeManager().formatDate(date) +
                      ".";
        
        return recipients;
}

/**
 * getRecipientsHelper
 * 
 * Given an array of scheduled names and the contacts list, return an array 
 * containing emails of the scheduled people.
 *
 * @param       {Object} contacts: Object - { name : email_address }
 * @param       {Array} scheduled: Array of names of scheduled people
 * @param       {Boolean} sendToSelf: True if to send a copy of email to self
 * @returns     {String}: Comma-delineated string of email addresses
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
 * Merges two arrays into a key-value object.
 * 
 * @return      {Object}: Object = { name : email_address }
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
 * the given scheduled date.
 *
 * @param       {Date} date: JS Date object
 * @returns     {Array}: Array of people scheduled for given event date
 */
Emailer.prototype.getScheduled = function
(date) 
{
        var scheduled = new GSheetParser(this.schedule.scheduleId)
                .getRow(date);

        if (isEmpty(scheduled))
                throw "No persons scheduled for the next event. " +
                      "Please check the schedule for participants.";

        return scheduled;
}

//////////////////////////////////////////
// Helpers                              //
//////////////////////////////////////////
/**
 * emailError
 *
 * Emails the given error message to the user.
 *
 * @param       {string} message: Error message to email to user
 */
Emailer.prototype.emailError = function
(message)
{
        MailApp.sendEmail({
                bcc: Session.getEffectiveUser(),
                subject: "[Confirmer Add-on] Heads Up!",
                htmlBody: message
        });
}
