#!/bin/bash
echo "-- Dev Setup Started --"
php -S localhost:8080 &
tsc --watch &
sass --watch resources/scss/index.scss:resources/css/index.css
echo "-- Dev Setup Ended --"
