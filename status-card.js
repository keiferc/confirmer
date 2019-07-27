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

        sectionsArr.push(getScheduleStatusSection());
        sectionsArr.push(getEmailStatusSection());

        return sectionsArr;
}

function getScheduleStatusSection()
{
        var header, widgetsArr, nextEventDate, sendingDate;

        header = formatSectionHeader("Schedule", PRIMARY_COLOR);
        widgetsArr = [];

        nextEventDate = buildTextKeyValWidget("Next Event Date", null, 
                "asdf", false);
        sendingDate = buildTextKeyValWidget("Reminder Email Sending Date", null,
                "input here", false);
        
        widgetsArr.push(nextEventDate);
        widgetsArr.push(sendingDate);

        return buildSection(header, widgetsArr, false);
}

function getEmailStatusSection()
{
        var header, widgetsArr, sender, bcc, subject, body;

        header = formatSectionHeader("Email", PRIMARY_COLOR);
        widgetsArr = [];

        sender = buildTextKeyValWidget("Sender", null, 
                "Sender email here", false);
        bcc = buildTextKeyValWidget("BCC", null, 
                "bcc1<br>bcc2<br>bcc3", true);
        subject = buildTextKeyValWidget("Subject", null, 
                "Subject Line Here", false);
        body = buildTextParagraphWidget("here is the email body");

        widgetsArr.push(sender);
        widgetsArr.push(bcc);
        widgetsArr.push(subject);
        widgetsArr.push(body);

        return buildSection(header, widgetsArr, false);
}

//============== Widgets ================//
// TODO: Build widgets

//////////////////////////////////////////
// TODO: Helpers                        //
//////////////////////////////////////////
