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

function main()
{
        var manager, settings;

        manager = new SettingsManager();

        // debug -- force reset to default 
        //manager.setDefault();

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
        Logger.log(manager.getAll());
        // Logger.log(manager.getMain());
        // Logger.log(manager.getContacts());
        // Logger.log(manager.getSchedule());
        // Logger.log(manager.getEmailContent());

        // debug
        var c = new Card("asdf", "asdf", "asdf", []);
        var arr = [
                // valid urls
                "https://du.com/?q=en%25ter%253Ayr%252F2010%252Fmoth%252F5k&t",
                "https://duckduckgo.com/?q=test+regex&t=ffab&ia=web#sffqwefq",
                "https://stackoverflow.com/questions/161738/asdfasdf-fsda-ef",
                "https://developers.google.com/apps-sc/refce/spt/seet#nlah()",
                "https://255.255.255.255:80/s?q=f+s&s=c.mit:*i=U-8&&sI=&sP=1",
                "https://regex101.com:80/asdf$afljlijbqewfu",
                "https://asdah.gov/asdh-ah.as",
                "https://www3.google.com",
                "http://255.255.255.255:80/s?q=fd+s&s=c.mit:*i=U-8&&sI=&sP=",
                "http://hh-1.wut.blabla.com:80/test/t/test.aspx?dd=dd&id=dk",
                "http://sub.web-site.com/cgi-/perl.cgi?key1=v&key2=value2e",
                "http://foobar.net/casual/archive/2005/12/01/61722.aspx",
                "http://www.my.com/calendar#filter:year/2010/month/5k",
                "http://www.asdah.com/~joe",
                "255.255.255.255:80/s?q=fd+s&s=c.mit:*i=U-8&&sI=&sP=1",
                "i.imgur.com/98efqkp19ubfasdfbp1u2bfis.jpg==.",
                "flanders.co.nz/2009/11/08/blah-foo-bar-wut/",
                "www.m.google.com/help.php?a=5",
                // invalid urls
                "https://some-url.com?query=&name=foo?filter=.#some_anchor",
                "http://hh-1hallo. msn.bla.cm:80800/t/test.aspx?dd=dd&id=d",
                "www.google.com/somthing\"/somethingmore",
                "google.com?fdad",
                "255.24.10.1.1",
                "500.20.30.1",
                "asdf.com/%",
                "jfyjtf",
                "%%34",
                "%",
        ];

        for (var i = 0; i < arr.length; i++) {
                Logger.log("sanitized:  " + c.sanitize(arr[i]));
                Logger.log("=========================================");
        }

        return buildDeck();
}

//////////////////////////////////////////
// Deck Builder                         //
//////////////////////////////////////////
function buildDeck()
{
        var cardDeck = [];

        // cardDeck.push(new StatusCard().gCard);
        cardDeck.push(new SettingsCard().gCard);

        return cardDeck;
}
