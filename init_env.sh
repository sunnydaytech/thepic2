#!/bin/bash

curl https://raw.githubusercontent.com/creationix/nvm/v0.16.1/install.sh | sh
nvm install v5.5.0 #Keep this updated
nvm use v5.5.0

sudo apt-get install npm -y
npm install
sudo npm install -g grunt-cli
sudo nom install -g bower
bower install
