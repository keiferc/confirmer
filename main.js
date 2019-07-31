// https://developers.google.com/apps-script/reference/properties/properties
//
// TODO: If error, send email to self containing error message
//       - No recipients
//       - Cannot retrieve date of next clinic
// TODO: Abstract program to not use clinic-specific language (schedule confirmer?)
// TODO: Documentation
// TODO: Change icon CDN host: https://postimages.org/
// TODO: Expand to create multiple confirmer cards based on needs?
// TODO: Add direct links to edit sheets?
// TODO: Input sanitation (Check if Google already does it)
// TODO: Pentest add-on

/*
 * TODO: Module Documentation
 */

//////////////////////////////////////////
// Main                                 //
//////////////////////////////////////////
var PRIMARY_COLOR = "#1c8adb";
var SECONDARY_COLOR = "#1c8adb";

function main()
{
        var manager, settings;

        Logger.log("main1");

        manager = new SettingsManager();

        Logger.log("main2");

        // debug -- force reset
        // manager.setDefault();

        Logger.log("main3");

        settings = manager.getAll();

        Logger.log("main4");

        //debug - reset
        // if (JSON.stringify(settings) != "{}") {

        //         Logger.log("main5");

        //         manager.getGASO().deleteAllProperties();

        //         Logger.log("main6");

        //         settings = manager.getAll();

        //         Logger.log("main7");
        // }

        Logger.log("main8");

        if (JSON.stringify(settings) == "{}") { // TOFIX: Not robust enough

                Logger.log("main9");

                manager.setDefault();

                Logger.log("main10");
        }

        // debug
        // Logger.log(typeof(manager.getMain()));
         Logger.log(manager.getAll());
        // Logger.log(manager.getMain());
        // Logger.log(manager.getContacts());
        // Logger.log(manager.getSchedule());
        // Logger.log(manager.getEmailContent());

        Logger.log("main11");

        return buildDeck();
}

//////////////////////////////////////////
// Deck Builder                         //
//////////////////////////////////////////
function buildDeck()
{
        var cardDeck = [];

        //cardDeck.push(new StatusCard().gCard);
        cardDeck.push(new SettingsCard().gCard);
        
        return cardDeck;
}
