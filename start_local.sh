#!/bin/bash
sudo docker rm $(sudo docker ps -aq)
sudo docker build -t thepic2 .
sudo docker run --name=thepic2-running -i -t thepic2


