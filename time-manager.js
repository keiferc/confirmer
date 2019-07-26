//////////////////////////////////////////
// Schedule Calculations                //
//////////////////////////////////////////
/**
 * getClinicDate
 *
 * Retrieves next clinic date from sheet
 *
 * @returns     {Date}
 */
function getClinicDate()
{
         var current_date, clinic_dates, i;
         
         current_date = new Date();
         clinic_dates = getColumn(volunteersSignupSheet, dateColumnTitle);
 
         for (i in clinic_dates) {
                 if (clinic_dates[i] >= current_date)
                         return clinic_dates[i]
         }
 
         throw "Unable to retrieve next clinic date.";
}

function formatDate(date)
{
        var date_format = {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric"
        };

        return date.toLocaleDateString("en-US", date_format);
}

//////////////////////////////////////////
// Time Trigger Management              //
//////////////////////////////////////////
/**
 * 
 * @param       {int} frequency 
 * @param       {int} time 
 */
function startTimeTrigger(frequency, time)
{
        ScriptApp.newTrigger("main")
                .timeBased()
                .everyDays(frequency)
                .atHour(time)
                .inTimezone("America/New_York")
                .create();
}

function stopTimeTrigger()
{
        var triggers, i;

        triggers = ScriptApp.getProjectTriggers();

        for (i = 0; i < triggers.length; i++) {
                if (triggers[i].getTriggerSource() == 
                ScriptApp.TriggerSource.CLOCK)
                        ScriptApp.deleteTrigger(triggers[i]);
        }
}

function editTimeTrigger(frequency, time)
{
        stopTimeTrigger();
        startTimeTrigger(frequency, time);
}
