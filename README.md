# Vasistas : A structure proposal & guidelines for bootstrapping a Node.js project that implements observer design pattern with Inversion of Control (IoC) and Dependency-Injection (DI)

Everything starts in "app.js". Just have a look on how it loads components (plugins) specified in .envdefault/COMPONENTS. Note that environment variables are handled in "config.js" with dotenv package.

## Purpose of this

This code deserves an instructional purpose... But well, that's the way i would bootstrap a modular project, based on plugins (IoC / DI) or Observer Design Pattern in Node.js.

## Some components shipped with Vasistas

* Cli : A command line interface that mostly does nothing.
* AlphabetSoup : A sample component that illustrates how to use generator functions (this.generatePromisesAlphabetSoup()) to handle promises chaining (outputs alphabet letters in Alphabetic order ! Wow !)
* Webserver : A component that implements a basic Express server and a custom "router" based on directories
* IoHandler : Attaches a Socket.IO WS event connectivity to Webserver component

## I hope you have fun coding something based on Vasistas
```bash
npm i
nmm run start
```