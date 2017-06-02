#!/bin/bash

curl -L -o google-chrome.deb http://dl.google.com/linux/chrome/deb/pool/main/g/google-chrome-stable/google-chrome-stable_58.0.3029.110-1_amd64.deb

sudo dpkg -i google-chrome.deb

sudo sed -i 's|HERE/chrome\"|HERE/chrome\" --disable-setuid-sandbox|g' /opt/google/chrome/google-chrome

rm google-chrome.deb