// TODO: If error, send email to self containing error message
//       - No recipients
//       - Cannot retrieve date of next clinic
// TODO: Expand to create multiple confirmer cards based on needs?
// TODO: Add direct links to edit sheets?
// TODO: Pause confirmer
// TODO: Delete confirmer
// TODO: Add feature that allows for consistent sends?
// TODO: Add feature that allows users to select number of days prior reminder

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
        var manager, settings;

        manager = new SettingsManager();

        // debug -- force reset to default 
        // manager.setDefault();

        settings = manager.getAll();

        //debug -- reset to first init
        // if (JSON.stringify(settings) != "{}") {
        //         manager.getGASO().deleteAllProperties();
        //         settings = manager.getAll();
        // }

        // Initializes default settings for first install
        if (JSON.stringify(settings) == "{}") {
                manager.setDefault();
        }

        // debug
        // Logger.log(typeof(manager.getMain()));
        // Logger.log(manager.getAll());
        Logger.log(manager.getMain());
        // Logger.log(manager.getContacts());
        // Logger.log(manager.getSchedule());
        // Logger.log(manager.getEmailContent());

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
        var settings, calendar, emailer;

        settings = new SettingsManager();
        calendar = new TimeManager();
        emailer = new Emailer(settings.getMain(), settings.getContacts(),
                settings.getSchedule(), settings.getEmailContent());
        
        emailer.email();
}
