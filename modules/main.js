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
 *
 * ---- Helpers ----
 * buildDeck()
 * confirm()
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
        var settingsManager, settings;

        settingsManager = new SettingsManager(); 

        try {
                settings = settingsManager.getAll();
        } catch(e) {
                if (JSON.stringify(settings) == "{}") 
                        settingsManager.setDefault();
                else
                        throw e;
        }

        return buildDeck();
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
