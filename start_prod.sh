git pull
sudo npm install
bower install
grunt --force
cd build
sudo lsof -i:80 | grep LISTEN | awk '{print $2}' | xargs sudo kill
nohup sudo node --harmony server.js prod > log &
