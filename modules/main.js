/*
 *      filename:       main.js
 *      author:         @KeiferC
 *      version:        0.0.1
 *      date:           23 August 2019
 *      description:    This module handles the response to the Confirmer
 *                      Gmail add-on's contextual trigger as well as the 
 *                      main emailing process.
 */

/*------------------------------------------------------------
 *                         Functions
 *------------------------------------------------------------
 * ---- Main ---- 
 * main()
 * sendConfirm()
 *
 * ---- Helpers ----
 * buildDeck()
 * readyToSend(SettingsManager, EmailStatusSettings, TimeManager, Emailer)
 * recipientsReady(SettingsManager, EmailStatusSettings, TimeManager, Emailer)
 *
 ------------------------------------------------------------*/

//////////////////////////////////////////
// Main                                 //
//////////////////////////////////////////
/**
 * main
 *
 * Main callback function to the Confirmer add-on's contextual trigger.
 *
 * @returns     {Array}: Array of Google Cards
 */
function main() 
{
        var settingsManager = new SettingsManager(); 

        try {
                settingsManager.getAll();
        } catch(e) {
                settingsManager.setDefault();
        }

        return buildDeck();
}

/**
 * sendConfirm
 *
 * Callback function for Google time-based trigger. Used to control the
 * add-on's emailing process.
 */
function sendConfirm() 
{
        var settings, status, calendar, emailer, today, sendingDate;

        settings = new SettingsManager(); 
        status = settings.getEmailStatus();
        calendar = new TimeManager(); 
        emailer = new Emailer(settings); 
        today = getToday(); 

        settings.updateEmailStatus(3);

        if (readyToSend(settings, status, calendar, emailer, today)) {
                sendingDate = calendar.getSendingDate();

                // Second conditional in block prevents double error messaging
                if (recipientsReady(settings, status, calendar, emailer) &&
                (calendar.sameDay(today, sendingDate) || 
                today > sendingDate)) {
                        emailer.email();
                        settings.setSentStatus(false, true);
                }
        }
}

//////////////////////////////////////////
// Helpers                              //
//////////////////////////////////////////
/**
 * buildDeck
 *
 * Returns an array of constructed Google Cards
 *
 * @returns     {Array}: Array of Google Cards
 */
function buildDeck()
{
        var cardDeck = [];

        cardDeck.push(new StatusCard().gCard); 
        cardDeck.push(new SettingsCard().gCard); 

        return cardDeck;
}

/**
 * readyToSend
 *
 * Returns true if scheduling is all good to go. Returns false
 * if something is wrong with the next event date (e.g. missing)
 * or if the confirmation email has already been sent. Sends an
 * alert email about the error if it has not already been sent.
 *
 * @param       {SettingsManager} settings 
 * @param       {EmailStatusSettings} status 
 * @param       {TimeManager} calendar 
 * @param       {Emailer} emailer 
 * @returns     {boolean}
 */
function readyToSend(settings, status, calendar, emailer)
{
        try {
                calendar.getSendingDate();
        } catch(e) {
                if (!parseBool(status.sentWarning)) { 
                        emailer.emailError(e);
                        settings.setSentStatus(true, null);
                }
                return false;
        }

        if (parseBool(status.confirmed)) 
                return false;
        
        return true;
}

/**
 * recipientsReady
 *
 * Returns true if recipients status are good to go. Returns false
 * if there's an error regarding recipients retrieval (e.g. missing).
 * Sends an alert email about error if alert has not already been sent.
 * Called after readyToSend.
 *
 * @param       {SettingsManager} settings 
 * @param       {EmailStatusSettings} status 
 * @param       {TimeManager} calendar 
 * @param       {Emailer} emailer 
 * @returns     {boolean}
 */
function recipientsReady(settings, status, calendar, emailer)
{
        try {
                emailer.getRecipients(calendar.getNextDate())
        } catch(e) {
                if (!parseBool(status.sentWarning)) { 
                        emailer.emailError(e);
                        settings.setSentStatus(true, null);
                }
                return false; 
        }
        
        return true;
}
