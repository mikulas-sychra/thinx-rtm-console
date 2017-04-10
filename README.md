# thinx-rtm-console

Web application running on AngularJS. Serves as an IoT device management UI. Should use CouchDB.

## Prerequisites

* Application runs on HTTP port 80 (possibly HTTPS 441)
* JavaScript enabled browser


```
ssh-keygen -t rsa
-----------------
Generating public/private rsa key pair.
/root/.ssh/deployKey
Your identification has been saved in /root/.ssh/deployKey.
-----------------


touch ~/.ssh/config
-----------------
host github.com
 HostName github.com
 IdentityFile ~/.ssh/deployKey
 User git
-----------------


cd /deployPath/.git/hooks
touch post-receive
-----------------
#!/bin/sh
git --work-tree=/var/www/rtm/www --git-dir=git@github.com:suculent/thinx-rtm-console.git checkout -f
-----------------
chmod +x post-receive
```