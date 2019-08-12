// https://developers.google.com/apps-script/reference/properties/properties
//
// TODO: If error, send email to self containing error message
//       - No recipients
//       - Cannot retrieve date of next clinic
// TODO: Expand to create multiple confirmer cards based on needs?
// TODO: Add direct links to edit sheets?
// TODO: Input sanitation (Check if Google already does it)
// TODO: Pentest add-on
// TODO: remove caching? might be a weird UX
// TODO: Pause confirmer
// TODO: Delete confirmer
// TODO: Add feature that allows for consistent sends?
// TODO: Add feature that allows users to select number of days prior reminder

/*
 * TODO: Module Documentation
 */

//////////////////////////////////////////
// Main                                 //
//////////////////////////////////////////
var PRIMARY_COLOR = "#267cb5";
var SECONDARY_COLOR = "#267cb5";
var GSHEET_URL_FORMAT = "docs.google.com/spreadsheets/d/";

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

        if (JSON.stringify(settings) == "{}") { // TOEVAL: Robustness
                manager.setDefault();
        }

        // debug
        // Logger.log(typeof(manager.getMain()));
        // Logger.log(manager.getAll());
        // Logger.log(manager.getMain());
        // Logger.log(manager.getContacts());
        // Logger.log(manager.getSchedule());
        // Logger.log(manager.getEmailContent());

        return buildDeck();
}

//////////////////////////////////////////
// Deck Builder                         //
//////////////////////////////////////////
function buildDeck()
{
        var cardDeck = [];

        cardDeck.push(new StatusCard().gCard);
        cardDeck.push(new SettingsCard().gCard);

        return cardDeck;
}

function confirm()
{
        var settings, calendar, emailer;

        Logger.log("test");
}
