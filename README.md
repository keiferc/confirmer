# Confirmer

A Gmail add-on that manages recurring confirmation emails.

Requires
- shell
- NPM: `npm install n -g`
- UglifyJS2: `npm install uglify-js -g`
- Google Clasp: `npm i @google/clasp -g`

Setup # TODO: clean with config script
```
git clone ...
cd Confirmer
chmod u+x build.sh develop.sh
./build.sh # TODO: add npm build
clasp login
clasp create
clasp push
clasp deploy --versionNumber 0 --description "First deployment"
```

Future features? ----------
     - Expand to create multiple confirmer cards based on needs?
             - Delete confirmer // if multiple cards
     - Add feature that allows for consistent sends? e.g. weekly
     - Add feature that allows users to select number of days prior reminder
     - Send warning when number of participants < given
     - Implement suggested searches for column names - trie?
     - Auto-sort sheets for users? - Too much removal of autonomy?
     - Users manually set timezone
             - JS relies on client's timezone. Add-on sees Google as the
               client
             - userTimezone.id — the user's timezone identifier
                     - e.g. America/New_York.
