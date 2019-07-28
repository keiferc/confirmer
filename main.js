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
        var settings = getAllSettings();

        //debug - reset
        if (JSON.stringify(settings) != "{}") {
                getSettingsObj().deleteAllProperties();
                settings = getAllSettings();
        }

        if (JSON.stringify(settings) == "{}") 
                setDefaultSettings();
        
        // debug
        Logger.log(typeof(getMainSettings()));
        Logger.log(getMainSettings());
        Logger.log(getContactsSettings());
        Logger.log(getScheduleSettings());
        Logger.log(getEmailContentSettings());

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
