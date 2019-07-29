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
        manager = new SettingsManager();
        settings = manager.getAll();

        //debug - reset
        if (JSON.stringify(settings) != "{}") {
                manager.getGASO().deleteAllProperties();
                settings = manager.getAll();
        }

        if (JSON.stringify(settings) == "{}") 
                manager.setDefault();
        
        // debug
        Logger.log(typeof(manager.getMain()));
        Logger.log(manager.getMain());
        Logger.log(manager.getContacts());
        Logger.log(manager.getSchedule());
        Logger.log(manager.getEmailContent());

        return buildDeck(settings);
}

//////////////////////////////////////////
// Deck Builder                         //
//////////////////////////////////////////
function buildDeck(settings)
{
        var cardDeck = [];

        cardDeck.push(buildStatusCard(settings));
        cardDeck.push(buildSettingsCard(settings));
        
        return cardDeck;
}
