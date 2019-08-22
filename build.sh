#!/bin/sh

JS_FILES=$(find . -name "*.js")

uglifyjs $JS_FILES --compress --mangle --output confirmer.min.js
rm .claspignore
