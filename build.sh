#!/bin/sh

JS_FILES=$(find modules -name "*.js")

uglifyjs $JS_FILES --compress --mangle --output confirmer.min.js
rm .claspignore
clasp push
