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
function buildStatusCard(config)
{
        var card = CardService.newCardBuilder();
        var section = CardService.newCardSection();

        section.addWidget(CardService.newTextParagraph()
                .setText(config));

        card.addSection(section);
        card.setHeader(CardService.newCardHeader()
                .setTitle('Settings'));
                
        return card.build();
}

//============== Widgets ================//
// TODO: Build widgets

//============== Sections ===============//
// TODO: Build Sections

//////////////////////////////////////////
// TODO: Helpers                        //
//////////////////////////////////////////
