/*
 * TODO: Module Documentation
 */

//////////////////////////////////////////
// Status Card Builders                 //
//////////////////////////////////////////
// TODO: Finish status card
/**
 * 
 * @param       {Object} config 
 */
function buildStatusCard()
{
        var card, icon, sectionsArr;

        icon = "https://www.maxpixel.net/static/photo/2x/" + 
               "E-Mail-Icon-At-News-At-Sign-Email-1083508.png";

        sectionsArr = getStatusSectionsArr();
        card = buildCard("Status", icon,
                         "Emailer Icon", sectionsArr);

        return card;
}

//============== Sections ===============//
// TODO: Build Sections
function getStatusSectionsArr()
{
        var sectionsArr = [];

        sectionsArr.push(getStatusSection());

        return sectionsArr;
}

function getStatusSection()
{
        return buildSection("Status Section", getStatusWidgetsArr(), false);
}

//============== Widgets ================//
// TODO: Build widgets
function getStatusWidgetsArr()
{
        var widgetsArr = [];

        widgetsArr.push(printStatusWidget());

        return widgetsArr;
}

function printStatusWidget()
{
        var widget, status;

        widget = CardService.newTextParagraph();
        status = "Hello, World!";

        widget.setText(status);

        return widget;
}

//////////////////////////////////////////
// TODO: Helpers                        //
//////////////////////////////////////////
