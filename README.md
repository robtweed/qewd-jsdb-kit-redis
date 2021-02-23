# Installing QEWD with Redis on Ubuntu Linux
 
Rob Tweed <rtweed@mgateway.com>  
17 February 2021, M/Gateway Developments Ltd [http://www.mgateway.com](http://www.mgateway.com)  

Twitter: @rtweed

Google Group for discussions, support, advice etc: [http://groups.google.co.uk/group/enterprise-web-developer-community](http://groups.google.co.uk/group/enterprise-web-developer-community)


# About this Repository

This repository provides instructions on how to install, configure and run QEWD on a Linux system,
using Redis as its database.  It specifically applies to Ubuntu Linux, but with
appropriate changes where necessary, it should apply to most versions of Linux.

# Installation Options

QEWD and Redis can be installed and configured in a number of ways:

- QEWD:
  - a *native* installation, with Node.js physically installed on a Linux machine
  - a pre-build Dockerised version (eg *rtweed/qewd-server* from Docker Hub)

- Redis:
  - *native* installation, with Redis physically installed on a Linux machine
  - a pre-built Dockerised version from [Docker Hub](https://hub.docker.com/_/redis/)

QEWD and Redis (both native and Dockerised versions) can be run on the same Linux machine or host,
or on different Linux machines, communicating via a network connection.

Alternatively, you can use the pre-built 
[QEWD-Redis Docker Container](https://hub.docker.com/r/rtweed/qewd-redis) in which Node.js,
QEWD and an instance of Redis are pre-installed.  Note that this Container can even be re-configured to
connect to other supported databases via a network connection.


## Native Installation of QEWD

### Initial Steps / Pre-requisites

Clone this repository to your Linux system.  For example, to clone it
to the folder ~/qewd on your system:

        cd ~
        git clone https://github.com/robtweed/qewd-starter-kit-redis qewd

The instructions in this document will assume you've cloned it
to the ~/qewd folder on your Linux system.  Adjust the paths in the examples appropriately
if you cloned to a different folder on your Linux system.

QEWD has three key dependencies:

- Node.js must be installed.  The latest version 14 is recommended, but QEWD will also run
satisfactorily with versions 10 and 12.

- a Global Storage Database.  Here we're going to assume you'll be using Redis.

- The [tcp-netx](https://github.com/chrisemunt/tcp-netx) interface module used by QEWD 
to connect to Redis has to be built from
source during installation.  This assumes that a C++ compiler in available in your Linux
system.

To satisfy these dependencies:


### Install Node.js

If you don't have Node.js installed, the simplest approach is to use the 
[installation script](./install_node.sh)
included in this repository.  It will install the latest version 14.x build:

        cd ~/qewd
        source install_node.sh

You can test if it installed correctly by typing:

        node -v

If everything worked correctly, it should return the installed version, eg:

        v14.15.5


### Install Redis

If you don't have Redis installed on any of your available servers, you should do
so now.  Simply follow any of the instructions available on the Web for installing
Redis, eg [Redis's own instructions](https://redis.io/topics/quickstart) or 
[Digital Ocean's instructions](https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-20-04)

It's up to you if Redis and QEWD/Node.js will be running on the same or different machines.


### Install a C++ Compiler

Run the following commands:

        sudo apt-get update
        sudo apt-get install build-essential

These commands are safe to type even if you're unsure whether or not you've already
installed a C++ compiler on your Linux machine.

----


### Installing QEWD

You're now ready to install QEWD.  You install QEWD on the machine on which you've installed Node.js
(see above).

When you cloned this repo, you will have created the
file *~/qewd/package.json* which should look like this:

        {
          "name": "qewd-up",
          "version": "1.0.0",
          "description": "Automated QEWD Builder",
          "author": "Rob Tweed <rtweed@mgateway.com>",
          "scripts": {
            "start": "node node_modules/qewd/up/run_native"
          },
          "dependencies": {
            "qewd": "",
            "tcp-netx": ""
          }
        }

Note the two Node.js dependencies: the modules *qewd* and *tcp-netx*.

Installation of QEWD is a one-off step that makes use of this *package.json* file.
Simply type:

        cd ~/qewd
        npm install


All the dependent Node.js modules used by QEWD will be installed into a new folder named *node_modules*.  
On completion, your *~/qewd* folder should now contain:

        ~/qewd
            |
            |_ package.json
            |
            |_ package-lock.json
            |
            |_ configuration
            |
            |- node_modules



The second part of QEWD's installation is performed automatically when you start QEWD up
for the very first time.  Type:

        cd ~/qewd
        npm start

You should see the following:


        > qewd-up@1.0.0 start /home/rtweed/qewd
        > node node_modules/qewd/up/run_native
        
        mg-webComponents installed
        qewd-client installed
        
        *** Installation Completed.  QEWD will halt ***
        *** Please restart QEWD again using "npm start"

and you'll be returned to the Luinux shell prompt.

If you now check your ~/qewd folder, you'll find it contains:


        ~/qewd
            |
            |_ package.json
            |
            |_ package-lock.json
            |
            |_ configuration
            |
            |- node_modules
            |
            |- qewd-apps
            |      |
            |      |- qewd-monitor-adminui
            |
            |- www
            |   |
            |   |- components
            |   |
            |   |- qewd-monitor-adminui
            |   |
            |   |- mg-webComponents.js
            |   |
            |   |- qewd-client.js


Everything QEWD needs to run should now be present.


### Configuring QEWD to use your Redis Instance

If you have installed Redis and QEWD on the same machines, you do not need to
any further configuration.  Proceed to the next step.

However, if QEWD and Redis are on different machines, you will need to edit the QEWD configuration
JSON file which you'll find on your QEWD machine at *~/qewd/configuration/config.json*.
It should look like this:

        {
          "qewd_up": true,
          "qewd": {
            "port": 8080,
            "poolSize": "2",
            "managementPassword": "keepThisSecret!",
            "database": {
              "type": "redis"
            }
          }
        }

You'll need to add Redis connection parameters (*qewd.database.params*):

- host: the IP address or domain name of your server that is running Redis
- port: the port on which your Redis system is listening for connections.  By default this is *6379*.

For example:

        {
          "qewd_up": true,
          "qewd": {
            "port": 8080,
            "poolSize": "2",
            "managementPassword": "keepThisSecret!",
            "database": {
              "type": "redis",
              "params": {
                "host": "192.168.1.100",
                "port": 6380
              }
            }
          }
        }

If your Redis system is listening on the standard 6379 port, you can simply use:

        {
          "qewd_up": true,
          "qewd": {
            "port": 8080,
            "poolSize": "2",
            "managementPassword": "keepThisSecret!",
            "database": {
              "type": "redis",
              "params": {
                "host": "192.168.1.100"
              }
            }
          }
        }


### Starting QEWD

Every time you want to start QEWD, simply type:

        cd ~/qewd
        npm start

You should see something like the following:

        > qewd-up@1.0.0 start /home/rtweed/qewd
        > node node_modules/qewd/up/run_native

        ** loading /home/rtweed/qewd/configuration/config.json
        Checking for onWorkerStarted path: /home/rtweed/qewd/orchestrator/onWorkerStarted.js
        Checking for onWorkerStarted path: /home/rtweed/qewd/onWorkerStarted.js
        ** results = {
          "routes": [],
          "config": {
            "managementPassword": "secret",
            "serverName": "QEWD-Up Server",
            "port": 8080,
            "poolSize": 2,
            "poolPrefork": false,
            "database": {
              "type": "redis"
            },
            "webServerRootPath": "/home/rtweed/qewd/www/",
            "cors": true,
            "bodyParser": false,
            "mode": "production",
            "sessionDocumentName": "qs",
            "qewd_up": true,
            "moduleMap": {
              "qewd-monitor-adminui": "/home/rtweed/qewd/qewd-apps/qewd-monitor-adminui"
            }
          },
          "cwd": "/home/rtweed/qewd",
          "startupMode": "normal"
        }
        config: {
          "managementPassword": "secret",
          "serverName": "QEWD-Up Server",
          "port": 8080,
          "poolSize": 2,
          "poolPrefork": false,
          "database": {
            "type": "redis"
          },
          "webServerRootPath": "/home/rtweed/qewd/www/",
          "cors": true,
          "bodyParser": false,
          "mode": "production",
          "sessionDocumentName": "qs",
          "qewd_up": true,
          "moduleMap": {
            "qewd-monitor-adminui": "/home/rtweed/qewd/qewd-apps/qewd-monitor-adminui"
          }
        }
        routes: []
        Double ended queue max length set to 20000
        webServerRootPath = /home/rtweed/qewd/www/
        Worker Bootstrap Module file written to node_modules/ewd-qoper8-worker.js
        ========================================================
        ewd-qoper8 is up and running.  Max worker pool size: 2
        ========================================================
        ========================================================
        QEWD.js is listening on port 8080
        ========================================================


If so, QEWD is ready and waiting, listening for incoming requests on port 8080.

Note: if you want to use a different listener port, edit the *~/qewd/configuration/config.json* file
and change the *port* property value.  Then stop and restart QEWD.


### Stopping QEWD

if you're running QEWD as a foreground process in a terminal window, you can simply type *CTRL&C* to stop
QEWD.

Alternatively you can stop QEWD from within the *qewd-monitor* or *qewd-monitor-adminui* applications
(see next section below).  In the Overview or Processes screeens, click the stop button next to the *Master* process.  QEWD will
shut down and the *qewd-monitor* or *qewd-monitor-adminui* applications will no longer work.

----

## Using the Dockerised Version of QEWD and Redis

This is the quickest and simplest way to try out QEWD with Redis.  Of course you
much have Docker installed in order to try it out.

### Download the Docker Container

Assuming you have Docker installed (I would recommend running Docker on a Linux machine),
first pull the latest version of the QEWD-Redis Container:

        docker pull rtweed/qewd-redis


### Starting the Container

Once complete, the trick is to start the container, mapping the directory into which
you cloned this QEWD-Redis repository to a directory within the Docker Container named
*/opt/qewd/mapped*, for example, to run it as a foreground process:

        docker run -it --rm --name qewd -p 8080:8080 -v /home/ubunbtu/qewd:/opt/qewd/mapped rtweed/qewd-redis

Change the mapped volume path (ie */hme/ubuntu/qewd*) appropriately for your installation.

Once it starts up, it's ready to use QEWD.  It's pre-configured to correctly use the
instance of Redis that is pre-installed within the Container.


### Persisting Redis Data

By default, any Redis data created by QEWD will disappear if you stop the Docker Container.  To
persist your Redis data between Container restarts, add another volume mapping directive to the *docker run* command,eg:

        -v /home/ubuntu/redis_data:/var/redis/6379

It's up to you what host directory to use for Redis data storage.  However, you **must** map to
the Container's directory: */var/redis/6379*.

You should see two files appearing in the mapped host directory:

- dump.rdb: The Redis data file.  Note that Redis creates/updates this only every so often, so you
won't initially see it appearing.

- redis_6379.log: The Redis activity log file.


### Stopping QEWD

if you're running the QEWD-Redis container as a foreground process in a terminal window, you can simply type *CTRL&C* to stop it.  Alternatively use the *docker stop* command.

Alternatively you can stop QEWD from within the *qewd-monitor* or *qewd-monitor-adminui* applications
(see below).
In the Overview or Processes screeens, click the stop button next to the *Master* process.  QEWD will
shut down, the Docker Container will stop and the *qewd-monitor* or *qewd-monitor-adminui* applications will no longer work.


----


# Try the QEWD-Monitor Application

You can check if QEWD is working correctly by running the
*qewd-monitor* application that will now have been installed:

Start the QEWD-Monitor application in your browser using the URL:

        http://x.x.x.x:3000/qewd-monitor

or try the latest version:

        http://x.x.x.x:3000/qewd-monitor-adminui

Replace the *x.x.x.x* with the IP address or domain name of your Linux server.

You'll need to enter the QEWD Management password.  Use the value that you
specified in the *managementPassword* property in the *~/qewd/configuration/config.json* file.
This was pre-set to *keepThisSecret!*, but it's a good idea to change this.

You'll now see the Overview panel, from where you can monitor your QEWD run-time environment, view the master and worker process activity.

If the *qewd-monitor* application works correctly, then you can be sure that QEWD
is working correctly and is ready for use.



# Start Developing

Now that you have QEWD up and running on your Linux system, you can begin developing both
REST APIs and/or interactive/WebSocket applications.

Your QEWD system can support both at once, and you can develop and run as many REST APIs as you
wish and as many simultaneous interactive applications as you wish.

From this point onwards, there's no difference in how you develop QEWD applications,
regardless of the Operating System you use, version of Node.js you use, or type of database
you use (YottaDB, Cach&eacute;, IRIS or Redis).  The only difference will be in file paths.

So you can now use the following tutorials:

- [this tutorial](https://github.com/robtweed/qewd-baseline/blob/master/INTERACTIVE.md)
explains how to develop interactive applications using the *qewd-client* browser module.
This is a useful tutorial to take as it will help to explain the basics of how
QEWD supports interactive, WebSocket message-based applications, and how you handle those messages
in your browser's logic.  Note that your version of QEWD includes the *qewd-client* module.

- once familiar with the basics covered in the tutorial above, 
can can find out how to develop a modern interactive WebSocket application whose front-end uses the  
[*mg-webComponents*](https://github.com/robtweed/mg-webComponents) framework
that has also been automatically installed in your QEWD system.
[See this document, starting at the *mg-webCOmponents Framework* section](https://github.com/robtweed/qewd-microservices-examples/blob/master/WINDOWS-IRIS-2.md#the-mg-webcomponents-framework)


- to develop REST APIs, get started with [this document](./REST.md)

- to find out more about how QEWD abstracts the Redis database as persistent 
JSON objects, you can try out the 
[QEWD-JSdb REPL-based tutorial](./REPL.md) after which you can also learn about
the other NoSQL database models supported by QEWD-JSdb:

- [Lists](./LISTS.md)
- [Key/Object Store](./KVS.md)
- [Persistent XML/JSON DOM](./DOM.md)


## License

 Copyright (c) 2021 M/Gateway Developments Ltd,                           
 Redhill, Surrey UK.                                                      
 All rights reserved.                                                     
                                                                           
  http://www.mgateway.com                                                  
  Email: rtweed@mgateway.com                                               
                                                                           
                                                                           
  Licensed under the Apache License, Version 2.0 (the "License");          
  you may not use this file except in compliance with the License.         
  You may obtain a copy of the License at                                  
                                                                           
      http://www.apache.org/licenses/LICENSE-2.0                           
                                                                           
  Unless required by applicable law or agreed to in writing, software      
  distributed under the License is distributed on an "AS IS" BASIS,        
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
  See the License for the specific language governing permissions and      
   limitations under the License.      
