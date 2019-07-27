/*
 * TODO: Module Documentation
 */

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
 * @param       
 * @returns     {Section}
 */
function buildSection(sectionHeader, widgetsArr, collapsible)
{
        var section,i;
        
        section = CardService.newCardSection()
                .setHeader(sectionHeader)
                .setCollapsible(collapsible);

        for (i = 0; i < widgetsArr.length; i++)
                section.addWidget(widgetsArr[i]);

        return section;
}

/**
 * 
 * @param       {String} key 
 * @param       {String} title 
 * @param       {String} hint 
 * @param       {any} value 
 * @param       {Function} callback
 * @returns     {Object}
 */
function buildTextInputWidget(key, title, hint, value, callback)
{
       var widget = CardService.newTextInput()
                        .setFieldName(key)
                        .setTitle(title);
        
        if (hint != null)
                widget.setHint(hint);
        if (value != null)
                widget.setValue(value);
        if (callback != null)
                widget.setOnChangeAction(callback);
        
        return widget;
}
 