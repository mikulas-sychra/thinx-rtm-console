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





fixes:

--- on wrong username/password
XMLHttpRequest cannot load http://rtm.thinx.cloud/. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'null' is therefore not allowed access.


owners (users)
- firstname
- lastname
- email
---> api ---> email to user

registratin form
-- password
-- password-verify
---> api ---> user will get apiKey



/user/profile GET
/user/profile POST

/user/password/set POST
/user/password/reset POST

/user/apikey/new GET
/user/apikey/list GET
/user/apikey/revoke POST


