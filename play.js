#!/usr/bin/env node
const Tozny = require('@toznysecure/sdk/node')
const {program} = require('commander');
program.version('0.1.0');


const alicia = { "name":"alicia", "token":"24ef2bdf480eafa4613affeafb26d4f2ca451288593198af6499577d909a6b45"}
const bruce = { "name":"bruce", "token":"72d7a1bf16dbacfaf564bbc8474747d262d73693f2602793eec82d6cf3d65734"}
const clarence = { "name":"clarence", "token":"c04990702e09f1ded991317929bee0da7305d2c699c21c3a1fd3e2332619bc11"}


async function main() {
    async function connect(name) {
        let mycreds=bruce
      try {
        const cryptoKeys  = await Tozny.crypto.generateKeypair();
        const signingKeys = await Tozny.crypto.generateSigningKeypair();
        const clientInfo  = await Tozny.storage.register(mycreds.token, mycreds.name, cryptoKeys, signingKeys)
    
        // Create a full client instance with the returned client details
        const config = new Tozny.storage.Config(
          clientInfo.clientId,
          clientInfo.apiKeyId,
          clientInfo.apiSecret,
          cryptoKeys.publicKey,
          cryptoKeys.privateKey,
          signingKeys.publicKey,
          signingKeys.privateKey
        )
        const client = new Tozny.storage.Client(config)
    
        // Perform additional storage actions with this client...
      } catch(e) {
        console.log("Error connecting to Tozny Server: ", e.name)
        return(null)
      }
    }


    program
        .option('-d, --debug', 'output extra debugging');

    program
        .command('move')
        .option('-r, --round <round>', 'the round of the game for the command')
        .option('-n, --name <name>', 'the user name')

        .description('make a move for a round')
        .argument('move','one of rock, scissors, or paper')
        .action((move, o, command) => {
            console.log(`move = ${move}`);
            console.log('options =', o);
        });

        
    program
        .command('winner')
        .option('-r, --round <round>', 'the round of the game for the command')
        .option('-n, --name <name>', 'the user name')
        .description('display the winner of a round')
        .action((options) => {
            console.log(`winner for round ${options.round}`);
            console.log("options = ", options);
        });

    program
        .command('info')
        .option('-r, --round <round>', 'the round of the game for the command')
        .option('-n, --name <name>', 'the user name')

        .description('list the moves for a round')
        .action((options) => {
            console.log('info')
            console.log('options=', options)
        });

    program
        .command('judge')
        .description('sent the winner of a round')
        .option('-r, --round <round>', 'the round of the game for the command')
        .option('-n, --name <name>', 'the user name')
        .argument('win', 'the winner account name')
        .action((win, options)=>{
            console.log(`Set the winner of a round ${options.round} to $`, win)
            console.log('options=', options);
            console.log('win=', win)
        });

    program.parse(process.argv);
   options = program.opts();     
   if (options.debug) console.log(options);
 
 //   const client = connect(options.name)


}
main();
