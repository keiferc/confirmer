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

