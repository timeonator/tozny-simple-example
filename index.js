const Tozny = require('@toznysecure/sdk/node')
const e3db = require('e3db')


const alicia = { "name":"alicia", "token":"24ef2bdf480eafa4613affeafb26d4f2ca451288593198af6499577d909a6b45"}
const bruce = { "name":"bruce", "token":"72d7a1bf16dbacfaf564bbc8474747d262d73693f2602793eec82d6cf3d65734"}
const clarence = { "name":"clarence", "token":"c04990702e09f1ded991317929bee0da7305d2c699c21c3a1fd3e2332619bc11"}

async function main(name) {
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
    var client = new Tozny.storage.Client(config)
 

    const written = await client.writeRecord(
        'history', {
            round:'1',
            name :'bruce',
        }, 
        { move: 'scissor' }
    );
    console.log(`Wrote record ${written.meta.recordId}`) 

    let record = await client.query();
    console.log("query returned:");
    console.log("name=", record.data.name);
    console.log("round=",record.data.round);
    console.log("move=", record.plain.move);
  } catch(e) {
    console.log("Error connecting to Tozny Server: ", e.name)
  }
}
main('example-client')