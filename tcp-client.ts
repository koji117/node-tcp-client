import * as net from "net";
import * as fs from "fs";
import * as readline from "readline";
import * as csv from "csv-parser";

import {Socket} from "net";
// The port number and hostname of the server.
const args: string[] = process.argv.slice(2);
// args [port, hostname, data, interval]
const port: number = parseInt(args[0]);
const host: string = args[1];
const dataPath: string = "./data/" + args[2] + ".csv";
const interval: number = parseInt(args[3]);

// Create a new TCP client.
const client: Socket = new net.Socket();


// const stream = fs.createReadStream('./data/jinryu.csv');
// const reader = readline.createInterface({input: stream});
// let csvArray = [];
// reader.on("line", (data) => {
//     csvArray.push(data);
// })
//
// reader.on('close', function () {
//     // console.log(csvArray);
// })
//
// console.log(csvArray)

let csvArray = fs.readFileSync(dataPath).toString().split("\n");

// Send a connection request to the server.
client.connect({port: port, host: host}, function () {
    // If there is no error, the server has accepted the request and created a new
    // socket dedicated to us.
    console.log('TCP connection established with the server.');
    Promise.resolve(0).then(function loop(i) {
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                client.write('\n' + csvArray[i] + '\n');
                resolve(i + 1);
            }, interval);
            if (i === csvArray.length - 1) {
                i = 0;
            }
        })
            .then(loop);
    });
});

// // The client can also receive data from the server by reading from its socket.
// client.on('data', function(chunk) {
//     console.log(`Data received from the server: ${chunk.toString()}.`);
//
//     // Request an end to the connection after the data has been received.
//     client.end();
// });

client.on('end', function () {
    console.log('Requested an end to the TCP connection');
});

client.on('error', function (ex) {
    console.log("ERROR OCCURRED");
    console.log(ex);
});
