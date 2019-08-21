// Future features? ----------
//      - Expand to create multiple confirmer cards based on needs?
//              - Delete confirmer // if multiple cards
//      - Add feature that allows for consistent sends? e.g. weekly
//      - Add feature that allows users to select number of days prior reminder
//      - Send warning when number of participants < given
//      - Implement suggested searches for column names - trie?
//      - Auto-sort sheets for users? - Too much removal of autonomy?

// Battle Plan ---------------
// TODO: Find solution to setting client-side timezone
//      - Currently sees Google's servers as the client. May need user to explicitly
//        set timezone
// TODO: Testing confirmation email sending time [IN PROGRESS]
//      -  note: based on time trigger
// TODO: Docs [IN PROGRESS]
// TODO: Optimization
//      Note: changes to nextDate occur on time trigger
// TODO: Minimize permissions
// TODO: README

/*
 *      filename:       main.js
 *      author:         @KeiferC
 *      version:        0.0.1
 *      date:           12 August 2019
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

        // debug -- force reset to default 
        // settingsManager.setDefault();

        try {
                settings = settingsManager.getAll();
        } catch(e) {
                if (JSON.stringify(settings) == "{}") 
                        settingsManager.setDefault();
                else
                        throw e;
        }

        // debug
        // Logger.log(typeof(settingsManager.getMain()));
        Logger.log(settingsManager.getAll());
        Logger.log(settingsManager.getEmailStatus());
        // Logger.log(settingsManager.getMain());
        // Logger.log(settingsManager.getContacts());
        // Logger.log(settingsManager.getSchedule());
        // Logger.log(settingsManager.getEmailContent());

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
 * confirm
 *
 * Callback function for Google time-based trigger. Used to control the
 * add-on's emailing process
 */
function confirm()
{
        var settings, status, calendar, emailer, today, sendingDate;

        settings = new SettingsManager();
        status = settings.getEmailStatus();
        calendar = new TimeManager();
        emailer = new Emailer(settings);
        today = getToday();

        // TODO: delete warning buffer
        settings.updateEmailStatus(3, 7);

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

function readyToSend(settings, status, calendar, emailer, today)
{
        try {
                calendar.getSendingDate();
        } catch(e) {
                if (!calendar.sent(status.sentWarning)) {
                        emailer.emailError(e);
                        settings.setSentStatus(true, null);
                }
                return false;
        }

        if (calendar.sent(status.confirmed))
                return false;
        
        return true;
}

function recipientsReady(settings, status, calendar, emailer)
{
        try {
                emailer.getRecipients(calendar.getNextDate())
        } catch(e) {
                if (!calendar.sent(status.sentWarning)) {
                        emailer.emailError(e);
                        settings.setSentStatus(true, null);
                }
                return false; 
        }
        
        return true;
}
