/*
 * TODO: Module documentation
 */

//////////////////////////////////////////
// Email Composition                    //
//////////////////////////////////////////
/**
 * Calls and manages main processes
 */
function email() 
{
        var date, contactsList, recipients, subject, message;

        // Calculate date
        try {
                date = getClinicDate();
        } catch(e) {
                Logger.log(e);
        }

        // Retrieve recipient emails
        contactsList = getContactsList(namesColumnTitle, emailsColumnTitle);
        recipients = getRecipients(contactsList, getVolunteers(date));

        Logger.log(recipients);

        // Compose email
        date = formatDate(date);
        subject = generateSubject(date);
        message = getEmailBody(date);

        // Send email
        // MailApp.sendEmail({
        //         bcc: recipients,
        //         subject: subject,
        //         htmlBody: message
        // });
}

function generateSubject(date) 
{
        return  "[" + date + "]: " +
                getColumn(confirmationEmailSheet, subjectColumnTitle)[0];
}

function getEmailBody(date) 
{
        var signature = Gmail.Users.Settings.SendAs.list("me").sendAs.filter(
                function (account) {
                        if (account.isDefault)
                                return true
                })[0].signature;

        return  "<p>Dear Volunteers,</p><p>" + date +
                " is our next immigration clinic. " +
                getColumn(confirmationEmailSheet, bodyColumnTitle) +
                "</p>" + signature;
}

//////////////////////////////////////////
// Contacts Retrieval                   //
//////////////////////////////////////////
/**
 * getRecipients
 * 
 * Given an array of volunteer names and the contacts
 * list, return an array containing volunteer emails
 *
 * @param       {Object} contactsList
 * @param       {Array} volunteers
 * @returns     {Array}
 */
function getRecipients(contactsList, volunteers) 
{
        var emails, i;

        emails = "";

        for (i = 0; i < volunteers.length; i++)
                emails += contactsList[volunteers[i]] + ",";

        emails += Session.getEffectiveUser();

        return emails;
}

/**
 * getContactsList
 * 
 * Merges two arrays into a key-value object
 * 
 * @param       {String} namesTitle 
 * @param       {String} emailsTitle 
 * @return      {Object}
 */
function getContactsList(namesTitle, emailsTitle) 
{
        var namesArray, emailsArray, contactsList, i;

        namesArray = getColumn(contactsSheet, namesTitle);
        emailsArray = getColumn(contactsSheet, emailsTitle);
        contactsList = {};

        if (namesArray.length != emailsArray.length)
                Logger.log("Error: asymmetric contact info");

        for (i = 0; i < namesArray.length; i++)
                contactsList[namesArray[i]] = emailsArray[i];

        return contactsList;
}

/**
 * function getVolunteers
 *
 * Returns an array of volunteers who signed up for
 * the given clinic_date
 *
 * @param       {Date} clinicDate
 * @returns     {Array}
 */
function getVolunteers(clinicDate) 
{
        var sheet, range, index, rowIndex, rowValues, values, i, j;

        sheet = getSheet(volunteersSignupSheet);
        rangeValues = sheet.getSheetValues(1, 1, sheet.getLastRow(),
                sheet.getLastColumn())
        values = [];

        for (i = 0; i < sheet.getLastRow(); i++) {
                if (rangeValues[i][0].valueOf() == clinicDate.valueOf()) {
                        rowValues = rangeValues[i];
                        break;
                }
        }

        for (j = 1; j < rowValues.length; j++) {
                if (rowValues[j])
                        values.push(rowValues[j]);
        }

        return values;
}
