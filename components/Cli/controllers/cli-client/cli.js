module.exports = function () {
    const vorpal = require('vorpal')();

    vorpal
        .command('ls', 'list registered components')
        .action((args, callback) => {
            let arr = []
            for (component in this.app.components) {
                arr.push(component)
            }
            console.log(arr)
            callback()
        })

    vorpal
        .command('lse <componentId>', 'list events listened by a component')
        .action((args, callback) => {
            if (this.app.components[args.componentId])
                console.log(this.app.components[args.componentId].eventNames())
            callback();
        });

    vorpal
        .delimiter('Command >')
        .show();
}