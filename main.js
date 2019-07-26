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
        return buildDeck();
}

//////////////////////////////////////////
// Deck Builder                         //
//////////////////////////////////////////
function buildDeck()
{
        var cardDeck = [];

        cardDeck.push(buildStatusCard());
        cardDeck.push(buildSettingsCard());
        
        return cardDeck;
}

//////////////////////////////////////////
// Card Component Builders              //
//////////////////////////////////////////
/**
 * 
 * @param       {String} cardHeader
 * @param       {String} imageUrl
 * @param       {String} alt
 * @param       {Array} sectionsArr 
 * @returns     {Card}
 */
function buildCard(cardHeader, imageUrl, alt, sectionsArr)
{
        var card, i;
        
        card = CardService.newCardBuilder();
        card.setHeader(CardService.newCardHeader()
                .setTitle(cardHeader)
                .setImageUrl(imageUrl)
                .setImageAltText(alt)
        );

        for (i = 0; i < sectionsArr.length; i++)
                card.addSection(sectionsArr[i]);

        return card.build();
}

 /**
 * 
 * @param       {String} sectionHeader 
 * @param       {Array} widgetsArr 
 * @returns     {Section}
 */
function buildSection(sectionHeader, widgetsArr)
{
        var section,i;
        
        section = CardService.newCardSection()
                .setHeader(sectionHeader)
                .setCollapsible(true);

        for (i = 0; i < widgetsArr.length; i++)
                section.addWidget(widgetsArr[i]);

        return section;
}
