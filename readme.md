This project builds a modular microservice architecture in typescript.

UNDER DEVELOPMENT!

# Gitter Channel
[Chat in Gitter](https://gitter.im/GallVp/chiroit-backend?utm_source=share-link&utm_medium=link&utm_campaign=share-link)

# Architecture
Note: Show the idea of modules and module types here along with the central PesantService class

# Global dependencies
- nodejs
- typescript
- typings

# Getting started
In project directory, run:
```
npm install
typings install
tsc
```
In order to test the project you can now run:
```
npm test
```
## Cleaning Test Build
To clean the build directories, run:
```
./cleanBuild
```
# Organisation of project
Show the idea of modules and module types here along with the central Server class

# Contribution
Eventually modules will be created seperatly from this core project but for now they are included in the *modules* folder. These core modules implements proposals from the *proposals* directory. Essentially all kinds of modules can be delivered but modules following the *proposals* will be more interopable. Below are some general rules of code:

- Use camleCase
- Document your code
- Write test

Ideas for naming to and directory structure to keep consistensy *modules/:type/:type.:custom.ts* where type is the type of module and custom can be everything. A mongodb db will be *modules/database/database.mongo.ts* with the class name being *DatabaseMongo*. All maps from internal microservices to connector should be located in *maps/* and named acordding to what connector they belong to. Please see the names of already implemented maps and follow that naming.

# Versioning
We use schemantic versioning. Do no introduce backwards compatible breakable code without upgrading the software version to a major release.

# Todo
* More documentation, tests and example implementations
* Create issue board
* Create website for project