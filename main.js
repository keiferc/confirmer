// https://developers.google.com/apps-script/reference/properties/properties
//
// TODO: If error, send email to self containing error message
//       - No recipients
//       - Cannot retrieve date of next clinic
// TODO: Abstract program to not use clinic-specific language (schedule confirmer?)
// TODO: Documentation

/*
 * TODO: Module Documentation
 */

//////////////////////////////////////////
// Main                                 //
//////////////////////////////////////////
function main()
{
        var config = getConfig();
        return buildDeck(config);
}

//////////////////////////////////////////
// Deck Builder                         //
//////////////////////////////////////////
function buildDeck(config)
{
        var cardDeck = [];

        cardDeck.push(buildStatusCard());
        cardDeck.push(buildSettingsCard(config));
        
        return cardDeck;
}

//////////////////////////////////////////
// Card Component Builders              //
//////////////////////////////////////////
/**
 * 
 * @param       {String} text 
 * @returns     {String}
 */
function buildHeader(text)
{
        //TODO: add styling
}

/**
 *
 *
 * @returns     {Widget}
 */
function buildWidget()
{
        var widget = CardService.newTextParagraph();
        widget.setText("ldfnlasdfnasdf");

        return widget;
}

/**
 * 
 * @param       {String} sectionHeader 
 * @param       {Array} widgetsArr 
 * @returns     {Section}
 */
function buildSection(sectionHeader, widgetsArr)
{
        var section = CardService.newCardSection();
        section.setHeader("Section Header");
        section.addWidget(buildWidget());

        return section;
}

/**
 * 
 * @param       {String} cardHeader 
 * @param       {Array} sectionsArr 
 * @returns     {Card}
 */
function buildCard(cardHeader, sectionsArr)
{
        var card = CardService.newCardBuilder();
        card.setHeader(CardService.newCardHeader()
                .setTitle("Card Header")
        );
        card.addSection(buildSection());
        card.build;

        return card;
}
