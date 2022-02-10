<p align="center">
  <a href="https://wodo.io/" target="blank"><img src="https://github.com/wodo-platform/wg-web-ui/blob/master/app/img/_src/branding/logo_purple.png" width="320" alt="Wodo Platform" /></a>
</p>

<div align="center">
<h2> Wodo Game Hub Service </h2>
</div>

<div align="center">
  <h4>
    <a href="https://wodo.io/">
      Website
    </a>
    <span> | </span>
    <a href="#">
      Product Docs
    </a>
    <span> | </span>
    <a href="#">
      Architecture Docs
    </a>
    <span> | </span>
    <!-- <a href="#"> -->
    <!--   CLI -->
    <!-- </a> -->
    <!-- <span> | </span> -->
    <a href="#/CONTRIBUTING.md">
      Contributing
    </a>
    <span> | </span>
    <a href="https://twitter.com/wodoio">
      Twitter
    </a>
    <span> | </span>
    <a href="https://t.me/wodoio">
      Telegram
    </a>
    <span> | </span>
    <a href="https://discord.gg/fbyns8Egpb">
      Discourd
    </a>
    <span> | </span>
    <a href="https://wodoio.medium.com/">
      Medium
    </a>
    <span> | </span>
    <a href="https://www.reddit.com/r/wodoio">
      Reddit
    </a>
  </h4>
</div>

<h3> Table of Contents </h3> 

- [About](#about)
- [Technical Overview](#technical-overview)
  - [Dev Lifecycle Steps](#dev-lifecycle-steps)
  - [Command Reference](#command-reference)
- [Instantiate MySQL Instance for Development Purpose](#instantiate-mysql-instance-for-development-purpose)
- [Generate Prisma artifacts](#generate-prisma-artifacts)
- [Adding wodo npm package dependencies](#adding-wodo-npm-package-dependencies)
- [Running the app](#running-the-app)
- [Building docker image](#building-docker-image)
- [Publish The Module as NPM Package Locally](#publish-the-module-as-npm-package-locally)
- [CI and Github Workflows](#ci-and-github-workflows)
- [Next Steps](#next-steps)

----

## About

Wodo Game Hub service is backend foundation for Wodo Game Hub solutions. It handles all requests and tasks coming from Wodo Game Hub UI channels.

## Technical Overview

The repo infrastcuture relies on docker-compose tool to configure/instantiate database layer, and standard nodejs/npm commands to build and run the microservice. All configurations and flow are defined in "docker-compose.yaml", ".env", "prisma/schema.prisma" and "package.json" files in the root project directoy. Please review and study these files to understand the build and test lifecycles. 

> Note: Please review and configure ".env" file in advance. The file is crucial for MySQL DB configurations, prisma framework schema generation and your microservice at runtime.  

You will find detailed inforamtion about each step of the development lifecycle in the following sections. It is briefly described below as a reference point. You need to work in the project root directory.

### Dev Lifecycle Steps

1. **MySQL setup:** Run "docker-compose up" command. It reads ".env" file,  builds the MySQL impage from "db" directory and creates your database user and database instance. You will see console outputs indicating successfull start of MySQL. Keep the terminal open and start a new terminal to continue.
2. **MySQL Access Conf:** If you set up your db for the first time (or you purged your MySQL instance and now you set it up again), you need to give privilages to your MySQL user so that Prisma framework can manuplate your MySql DB. It is one-time task. You do not need to repeat this task each time you run "docker-compose up". 
    - Run **"docker ps"** command to find and copy your MySQL container id
    - Start a MySQL client session with root user, run command below, enter your root password
      ```bash 
      docker container exec -it <your_container_id> mysql -u root -p
      ```
    - Run the command below on the sql client session to grant privilages to your MySQL DB user (wodo).  
      ```bash 
      GRANT ALL PRIVILEGES ON *.* to 'wodo'@'%';
      flush privileges;
      ```
    - Terminate the session by running **"exit"** command
3. **Create your database:** Once your MySQL DB is up, run **"npm run db:migrate"** command to generate your database schema sql files and create your database instance on the running MySQL instance. You need to complete this step in the initial stage or repeat it whenever you do some changes in **"prisma/schema.prisma"** file. **"npm run db:migrate"** is defined in the package.json file. It eventually executes **"dotenv -e ../.env -- npx prisma migrate dev --name init"** command. Once the command is executed, you will see generated schema file under **"prisma\migrations\"** folder, eg: prisma\migrations\20220209150351_init.  
   - **Update your database:** If you add a new entity or change something in **"prisma/schema.prisma"** file, you need to run db migration again to apply your changes to your running DB instance and generate prisma client artifacts again. You need to rename the migration name in "package.json" file therefore change the parameter value "--name init" with a proper tag, eg "--name user_table_added" in the command **"dotenv -e ../.env -- npx prisma migrate dev --name init"**. 
4. **Start your microservice:** Run **"npm start"** in order to bootstrap your microservice. Prisma framework reads the same ".env" file and establish connection to your MySQL user at runtime. See src\service\prisma.service.ts file for further details
5. **Query the api** **"http://localhost:3000/api/demos"** on your browser.It should return an empty list
6. **Clean up:** Optional: You can run **"docker-compose down -v"** command to wipe out your MySQL setup and start over. It does full clean up. If you want to stop your MySQL instance, just hit "ctrl+C" on the mysql terminal.

> Note: When you shut down your MySQL instance(ctrl+C), your confs and database instance remains intact. You can run "docker-compose up" again and continue working

> Note: Once you migrate your db and generate prisma client files, your IDE might not recognize the new prisma client because of dependency file cache in the IDE itself. Try to refresh your project and run "npm install" to refresh your dependency tree. You should see your database entity objects in "node_modules\\.prisma\client\index.d.ts" file 

### Command Reference

```bash 
docker-compose up
docker ps
docker container exec -it <your_container_id> mysql -u root -p
  GRANT ALL PRIVILEGES ON *.* to 'wodo'@'%';
  flush privileges;
npm run db:migrate
npm run db:generate
npm start
```

In case you want to purge MySql setup

```bash 
docker-compose down -v
```



## Instantiate MySQL Instance for Development Purpose

We use "docker-compose" to run MySQL instances locally. It is a more comprehensive way to leverage docker. All MySQL configurations are defined in ".env" in the project root directory. The same env file is used by "prisma migrate" which is explained in the next section. Ultimately we consolidate all required configurations in one simple env file.

```bash 
MYSQLDB_ROOT_USER=root
MYSQLDB_ROOT_PASSWORD=password
MYSQLDB_WODO_USER=wodo
MYSQLDB_WODO_PASSWORD=123456
MYSQLDB_WODO_DATABASE=wodo_db
MYSQLDB_LOCAL_PORT=3306
MYSQLDB_DOCKER_PORT=3306

# in case node application is configured in the same docker-compose.yaml file.Not used at the moment in this repo
NODE_LOCAL_PORT=3000
NODE_DOCKER_PORT=3000 

# prisma migarte DB url in the form of DATABASE_URL="mysql://$MYSQLDB_WODO_USER:$MYSQLDB_WODO_PASSWORD@localhost:$MYSQLDB_LOCAL_PORT/$MYSQLDB_WODO_DATABASE"
DATABASE_URL="mysql://wodo:123456@127.0.0.1:3306/wodo_db"
```

We build our own MySql docker image. All definition files are stored in "db" folder. Docker Compose builds the docker image and instantiates it when "docker-compose up" command is executed.

docker-compose.yaml file contains all definitions/configurations to run MySQL DB instance. Important configurations:

- "**build:** ./db" --> Builds our own MySQL docker image using the files in db folder.
- "**command:** --default-authentication-plugin=mysql_native_password" --> Adjust default auth type to "mysql_native_password" since MySQL 8.x version uses sha encrypted auth model by defaul. It is quick tweak to adjust the configuration
- "**env_file:** ./.env" --> passing our main conf file to docker-compose. The confs are consolidated in one simple file.
- "**environment:** .... "  --> Setting up root user password, creating wodo user with password and creating default wodo database
- "**ports:** ... " --> Port forwarding from our local env to docker container
- "**volumes:**" --> Creating persistance storage to not loose MySQL confs and data when we shut MySQL down

To start MySQL instance, run the following command. It prints logs to terminal. To stop MySQL, just hit "ctrl+C"

```bash 
docker-compose up
```

You need to run this command in the project root directory where docker-compose.yaml file resides. You can keep your terminal running and continue development on other terminals.

To validate MySql instance, run the following commands. It lets you open a mysql command line session in the running docker container. First find out your running MySQL docker container name

```bash 
docker ps
```
From the command output, copy the container name. In the sample case, it is "wodo-nodejs-persistence_mysqldb_1". The value is used in the command below to instantiate a MySQL command line session.

```bash 
docker container exec -it wodo-nodejs-persistence_mysqldb_1 mysql -u root -p
```

Once you are connected to MySql command line, run the following commands one by one. We need to give permission to our new user "wodo" to be able to run "prisma migrate" properly.

```bash 
GRANT ALL PRIVILEGES ON *.* to 'wodo'@'%';
flush privileges;
```

Run exit command to terminate the sessiom

```bash 
exit;
```

In case you need to wipe out everything and start over, run the following command. It will remove MySql confs, volumes and everything else.

```bash 
docker-compose down -v
```


## Generate Prisma artifacts

Prisma Migrate tool needs a running MySQL db instance. If you do not have one, please follow the instructions in the previous section. All required prisma commands are defined in "package.json" file as it is the main build and packaging tool.

```json 
    "scripts": {
        "db:migrate": "dotenv -e ../.env -- npx prisma migrate dev --name init",
        "db:introspect": "dotenv -- prisma introspect",
        "db:generate": "dotenv -- prisma generate",
        .
        .
        .
    },
```

".env" file in the project root directory contains the conf parameter "DATABASE_URL" that is needed by "prisma migrate" command. You need to set up correct values based on your definitions. 

```bash 
DATABASE_URL="mysql://wodo:123456@127.0.0.1:3306/wodo_db"
```

Note: If your DB user does not have proper rights to create a database, please run the following SQL commands with root user. Replace db user "wodo" with your db user.

```bash 
GRANT ALL PRIVILEGES ON *.* to 'wodo'@'%';
flush privileges;
```

To create all tables in the new database make the database migration from the prisma schema defined in prisma/schema.prisma

```bash 
npm run db:migrate
```
The command invokes the line defined in package.json file. If you are doing an update you need to change --name param value, "init" is not good anymore. 

```bash 
"db:migrate": "dotenv -e ../.env -- npx prisma migrate dev --name init" 
```

It creates a new SQL migration file for this migration in "prisma" folder and runs the SQL migration file against your dev database that you defined within "MYSQLDB_WODO_USER" in ".env" file.


More info can be found at this link https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate

Now generate the prisma client from the migrated database with the following command

```bash 
npm run db:generate
```
It generates prisma client js package including PrismeServce that your microservice depens on to drive database tasks. 

The database tables are now set up and the prisma client is generated. For more information see the docs:

- https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project-typescript-mysql


##  Adding wodo npm package dependencies

To be able to add internal wodo module as npm dependency, you need to authenticate to git remote npm package repository by logging in to npm, use the npm login command, replacing USERNAME with your GitHub username, TOKEN with your personal access token, and PUBLIC-EMAIL-ADDRESS with your email address.

If GitHub Packages is not your default package registry for using npm and you want to use the npm audit command, we recommend you use the --scope flag with the owner of the package when you authenticate to GitHub Packages.

```bash
npm login --scope=@wodo-platform --registry=https://npm.pkg.github.com
```

Once you login successfully, you can run "npm install" command and start to develop your features. 

To run the same steps in the gitflow actions we need to create a secret in org level and set a personal access token as secret value so that when we run a repository, it can reach npn package regidtery of another private repository. GITHUB_TOKEN is generated by the gitflows per repository. It can not access to other private repos. We have WODO_TOKEN storing Serhat's personal access token as value today. TODO: It will be fixed later. 

Granting additional permissions
If you need a token that requires permissions that aren't available in the GITHUB_TOKEN, you can create a personal access token and set it as a secret in your repository:

Use or create a token with the appropriate permissions for that repository. For more information, see "Creating a personal access token."
Add the token as a secret in your workflow's repository, and refer to it using the ${{ secrets.SECRET_NAME }} syntax. For more information, see "Creating and using encrypted secrets."

https://docs.github.com/en/actions/security-guides/automatic-token-authentication#using-the-github_token-in-a-workflow


## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

> please see the doc to understand runtime configurations and ".env" inf nestjs framework: https://docs.nestjs.com/techniques/configuration

## Building docker image

Along with build and run functionality on your command line, we need to build docker images as well. It means we need to build your project from scratch while preparing docker images. You need to run "npm login" command during docker build process. In order to achive that we can generate .npmrc file in Dockerfile with ${NPM_TOKEN} argument. We will provide the token as argument NPM_TOKEN to the docker build process. 

In your repo root folder, run the following command with your own git token. It will build docker image and add it to your configured docker registery on your laptop

```bash
$ docker build -t wp-nodejs-demo-microservice --build-arg NPM_TOKEN=your_token . 
```

To run the nodejs app on your local laptop, you can run the wollowinf command

```bash
$ docker run -dp 8080:3000 wp-nodejs-demo-microservice
```

Open the url "http://localhost:8080/api/demos" and "http://localhost:8080/docs" in your browser to see API and swagger doc.

## Publish The Module as NPM Package Locally

You may need to publish npm packages from your local dev env in order to speed up development process. It is sort of workaround and you should do clean-up your published package versions since our official github actions will take care of package publishing eventually.

Please follow the steps below to publish wodo-nodejs-persistance npm package from your local development environment.

```bash
npm login --scope=@wodo-platform --registry=https://npm.pkg.github.com
```

in your terminal and you’ll be prompted to provide the following. Enter your github username, access token and wodo-platform email:

```bash
Username: YOUR_GITHUB_USERNAME
Password: YOUR_GITHUB_TOKEN
Email (this IS public): wodo-platform@users.noreply.github.com
```

Once you log in successfully, you will see the messafe below:

```bash
Logged in as your_git_user to scope @wodo-platform on https://npm.pkg.github.com/.
```
Publish the package:

```bash
npm publish
```

Verif that wodo-nodejs-persistance package has been published successfully with the correct version you provided in package.json file. Go to the page below and make sure that your packge is listed on the  published artifact list

```
https://github.com/orgs/wodo-platform/packages
```

> You should increase version number when you need to re-publish a new package version.

Once the package is published, you can add it to the dependencies list in package.json file. In order to retrieve the dependency, you must run **"npm login --scope=@Ywodo-platform --registry=https://npm.pkg.github.com
"** command at least once in your command prompt.

```
"dependencies": {
        "@wodo-platform/wodo-nodejs-persistance": "1.0.0",

  }
```

More details can be found on <a href="https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry"> this page </a>


## CI and Github Workflows

In order to build and package your repo through CI/CD, please have a a look at the file .github/workflows/pipeline.yml under the root project folder. It is preconfigured githubflow. Whenever you push a change onto the main branch, it is triggered. It will be improved to be able to package and release artifacts based on a release process later.

## Next Steps

Once you compose your new repo, you can create helm charts in wodo-helm-charts repo then conitinue with local deployment and official CI/CD gitops deployment. Please refer to Wodo Platform Local Dev Environment guide.
