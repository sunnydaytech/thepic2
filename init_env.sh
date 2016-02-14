#!/bin/bash

curl https://raw.githubusercontent.com/creationix/nvm/v0.16.1/install.sh | sh
source ~/.bashrc
#Keep this updated
nvm install v5.6.0 
nvm use v5.6.0

sudo apt-get install npm -y
npm install
sudo npm install -g grunt-cli
sudo npm install -g bower
bower install
