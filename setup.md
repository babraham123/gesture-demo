# Installation

```
sudo pip install flask
sudo pip install gunicorn
sudo apt-get install upstart nginx

git clone git@github.com:babraham123/gesture-demo.git mygesture
cd mygesture

# or combine with an existing conf file
sudo cp mygesture.conf-nginx /etc/nginx/conf.d/mygesture.conf
sudo service nginx restart

sudo cp mygesture.conf-upstart /etc/init/mygesture.conf
sudo start mygesture

# open on startup
sudo update-rc.d mygesture enable 

# view status of all services
sudo initctl list
``` 

