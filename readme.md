This project builds a modular microservice architecture in typescript.

UNDER DEVELOPMENT! - Needs a repository with an example implementation, some of the links are not working yet!

# Gitter Channel
[Chat in Gitter](https://gitter.im/GallVp/chiroit-backend?utm_source=share-link&utm_medium=link&utm_campaign=share-link)

# Architecture
Note: Show the idea of modules , maps and module types here along with the central ServiceRegistry class

# Using this module
This module exists on npm. To use it run:

```
npm install @ords/core --save
```

# Global dependencies
- nodejs
- typescript
- typings
- mocha

# Getting started
Initially install dependencies by running:
```
npm run build-env
```
Whenever you have made changes you can run the following command
```
npm run build-depoly
```
## Scripts
In order to test the project you can now run:
```
npm test
```
To clean the project do:
```
npm run clean
```

# Contribution
Contributions can be made to either modules (microservices), maps or this repo. Module and maps contribution is managed in [http://github.com/medsolve/ords-modules](http://github.com/medsolve/ords-modules) and [http://github.com/medsolve/ords-maps](http://github.com/medsolve/ords-maps) resspectivly.

Core modules implements proposals from the *proposals* directory. Essentially all kinds of modules can be delivered but modules following the *proposals* will be entirely interopable. Below are general rules for code contribution:

- Use camleCase instead of underscore
- Document your code with comments
- Write at least unit tests
- Follow established directory structure

# Versioning
We use schemantic versioning. We do no introduce backwards compatible breakable code without upgrading the software version to a major release.

# Todo
* More documentation
* Better tests
* Update website for project
* Example implemetation