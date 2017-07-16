# Customer Tracker
----

A full [MEAN](https://en.wikipedia.org/wiki/MEAN_(software_bundle)) stack app to perform [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) operations related to customer migrations/implementations. The Customer Tracker website allows users to add, edit, or delete customer records.  Non-registered users can access a table of customer data and export it to a .CSV file.  Records are displayed in a sortable, editable datatable.

All of this data is stored in a [mongoDB](https://www.mongodb.com/) database instance. [Mongoose](http://mongoosejs.com/) is used to model mongoDB objects in node.js.

The application is hosted using a [Node.js](https://nodejs.org/en/) server, utilizing the [Express.js](https://expressjs.com/) framework.

The frontend is built using [Angular 4](https://angular.io/) and [PrimeNG](https://www.primefaces.org/primeng/#/) as an added UI Library.

## Table of Contents

- [Background](#background)
- [Installation](#installation)
- [Development Environment](#dev)
	- [Start mongoDB](#start-mongo)
	- [Compile Code](#compile-code)
	- [Start Node Server](#start-node)
- [Production](#prod)
- [TODO](#todo)
- [Maintainers](#maintainers)
- [Contribute](#contribute)
- [License](#license)

## <a name="background"></a>Background

Customer Tracker started with a need for employees to track the status of customer network implementations.  A shared workbook was originally used to get a high-level status of customer migrations.  This ultimately leads to fragmented document versions or read-only lockouts.  This web application allows concurrent users to view, update, and delete customer records.  It also provides the same functionality of a spreadsheet by using the [PrimeNG](https://www.primefaces.org/primeng/#/) UI library.  



## <a name="installation"></a>Installation


1. Download and install [Node.js](https://nodejs.org/en/download/) using these [instructions](https://docs.npmjs.com/getting-started/installing-node).  This will give you access to [npm](https://npmjs.com) as well.
2. Download and install [mongoDB](https://www.mongodb.com/download-center#community) using these [instructions](https://docs.mongodb.com/manual/installation/).
3. Install Git or GitHub Desktop.
	* Download and install [GitHub Desktop](https://help.github.com/articles/set-up-git/) using these [instructions](https://help.github.com/articles/set-up-git/)
		* Or
	* Download and install [Git](https://git-scm.com/downloads)
4. Clone this repository using the [instructions from GitHub](https://help.github.com/articles/cloning-a-repository/).  This will get all project files to your machine.
    * Ensure you use command:
        `git clone https://github.com/ZGrauer/Customer-Tracker.git`

5. In a terminal, go to the cloned folder
6. Install all dependencies by entering `npm install` from a terminal within the cloned folder.

## <a name="dev"></a>Development Environment

To run the app in development you must have both the mongoDB and node servers running after the project has been built by the compiler.

First, start mongoDB by running the below command in a terminal.  If you encounter errors such as `'mongod' is not recognized as an internal or extrenal command` try  running the command from the mongoDB install folder (`C:\Program Files\MongoDB\Server\3.4\bin` for Windows).  Additionally, you might need to create folders `C:\data\db` for Mongo to run.

### <a name="start-mongo"></a>Start mongoDB
Leave this terminal open so mongoDB will accept connections to the database.  If you wish to kill mongo press Command + C or Control + C.

```sh
$ mongod
# 2017-07-10T13:57:14.009-0500 I NETWORK  [thread1] waiting for connections on port27017
```

### <a name="compile-code"></a>Compile Code
Now that the database server is running the site can be compiled.  Open a terminal in the main project folder (Customer-Tracker).  Run the `npm run build` command to build the development site.

Leave this terminal open.  As you change the files they will be recompiled automatically.  If you wish to kill the process press Command + C or Control + C.

```sh
$ npm run build
```

### <a name="start-node"></a>Start Node Server
Finally, start the node server using `npm start`.  The site should be accessable from http://localhost:3000/

Leave this terminal open.  As long as the process runs it should serve the website. If you wish to kill the process press Command + C or Control + C. If you change the files for the node.js server, you will need to kill and restart this command for the changes to take affect.  This would be for files like `./Customer-Tracker/app.js` and the files in `./Customer-Tracker/routes`

```sh
$ npm start
```

## <a name="prod"></a>Production
To build the project for production run the below command.

```sh
$ npm run build:prod
```

## <a name="todo"></a>TODO
- [X] Add charts using PrimeNG to summarize customer data
- [ ] Add ability to bulk load customer data. Currently use mongo.
- [ ] Add test cases

## <a name="maintainers"></a>Maintainers

[@ZGrauer](https://github.com/ZGrauer).

## Contribute

Feel free to dive in! [Open an issue](https://github.com/ZGrauer/Customer-Tracker/issues/new) or submit PRs.

Customer Tracker follows the [Contributor Covenant](http://contributor-covenant.org/version/1/3/0/) Code of Conduct.

## License

[GNU](LICENSE) © Zachary Grauerholz
