// TODO: If error, send email to self containing error message
//       - No recipients
//       - Cannot retrieve date of next clinic
// TODO: Expand to create multiple confirmer cards based on needs?
// TODO: Delete confirmer // if multiple cards
// TODO: Add feature that allows for consistent sends?
// TODO: Add feature that allows users to select number of days prior reminder

// TODO: Test emailStatus changes
// TODO: Send warning when number of participants < given
// TODO: Email error testing
// TODO: Email error sending date
// TODO: Sending confirmation email date
// TODO: Testing confirmation email sending date
// TODO: Testing confirmation email sending time
// TODO: Docs
// TODO: Optimization
//      Note: changes to nextDate occur on time trigger
// TODO: finish EmailStatus -- see callbacker
//       submitButton --> try { emailStatus.nextDate = nextDate from schedule }
//                      fail -->  
//                   success --> 
//                             >
//       which module should manage EmailStatus
//       optimization strategies

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

        //debug -- reset to first init
        // if (JSON.stringify(settings) != "{}") {
        //         manager.getGASO().deleteAllProperties();
        //         settings = manager.getAll();
        // }

        // debug
        // Logger.log(typeof(settingsManager.getMain()));
        Logger.log(settingsManager.getAll());
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
        var settings, status, calendar, emailer, today;

        settings = new SettingsManager();
        status = settings.getEmailStatus();
        calendar = new TimeManager();
        emailer = new Emailer(settings);
        today = getToday();

        // TODO: finish recipients check
        // TODO: delete warning buffer
        settings.updateEmailStatus(3, 7);

        if (readyToSend(settings, status, calendar, emailer, today) &&
            recipientsReady(settings, status, calendar, emailer)) {
                emailer.email();
                settings.setConfirmed(status, true);
                settings.setSentWarning(status, false);
        }
}

function readyToSend(settings, status, calendar, emailer, today)
{
        var sendingDate;

        try {
                sendingDate = calendar.getSendingDate();
        } catch(e) {
                if (!calendar.sent(status.sentWarning)) {
                        emailer.emailError(e);
                        settings.setSentWarning(status, true);
                }
                return false;
        }

        if (calendar.sent(status.confirmed))
                return false;
        if (calendar.sameDay(today, sendingDate) || today > sendingDate)
                return true;
        
        return false;
}

// TOTEST
function recipientsReady(settings, status, calendar, emailer)
{
        try {
                emailer.getScheduled(calendar.getNextDate())
        } catch(e) {
                if (!calendar.sent(status.sentWarning)) {
                        emailer.emailError(e);
                        settings.setSentWarning(status, true);
                }
                return false; 
        }
        
        return true;
}
