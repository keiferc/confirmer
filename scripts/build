#!/bin/sh

JS_FILES=$(find modules -name "*.js")

clasp login
uglifyjs $JS_FILES --compress --mangle --output confirmer.min.js
rm -f .claspignore
clasp push
