"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const net_1 = require("net");
const rxjs_1 = require("rxjs");
// Get the port number and hostname of the server from command arguments.
// args [port, hostname, data, interval]
const args = process.argv.slice(2);
const port = parseInt(args[0], 10);
const host = args[1];
const dataPath = "./data/" + args[2] + ".csv";
const intervalValue = parseInt(args[3], 10);
// Create a new TCP client.
const client = new net_1.Socket();
const csvArray = convertCsvToArray(dataPath);
// Create a subscription
const rxInterval = rxjs_1.interval(intervalValue);
let subscription;
// Connect to the server
function connect() {
    console.log("new client");
    client.connect({ port, host }, () => {
        console.log("TCP connection established with the server.");
        subscription = rxInterval.subscribe((i) => {
            client.write("\n" + csvArray[i] + "\n");
            i++;
        });
    });
    client.on("data", (data) => {
        console.log("Received: " + data);
    });
    client.on("close", () => {
        console.log("Connection closed");
        reconnect();
    });
    client.on("end", () => {
        console.log("Connection ended");
        reconnect();
    });
    client.on("error", (error) => {
        console.error(error);
        if (subscription) {
            subscription.unsubscribe();
        }
    });
}
// function that reconnect the client to the server
function reconnect() {
    setTimeout(() => {
        client.removeAllListeners(); // the important line that enables you to reopen a connection
        connect();
    }, 5000);
}
connect();
function convertCsvToArray(path) {
    return fs_1.readFileSync(path).toString().split("\n");
}
exports.convertCsvToArray = convertCsvToArray;
// Send a connection request to the server.
// client.connect({port: port, host: host}, function () {
//     // If there is no error, the server has accepted the request and created a new
//     // socket dedicated to us.
//     console.log('TCP connection established with the server.');
//     Promise.resolve(0).then(function loop(i) {
//         return new Promise(function (resolve, reject) {
//             setTimeout(function () {
//                 client.write('\n' + csvArray[i] + '\n');
//                 resolve(i + 1);
//             }, interval);
//             if (i === csvArray.length - 1) {
//                 i = 0;
//             }
//         })
//             .then(loop);
//     });
// });
//
// // // The client can also receive data from the server by reading from its socket.
// // client.on('data', function(chunk) {
// //     console.log(`Data received from the server: ${chunk.toString()}.`);
// //
// //     // Request an end to the connection after the data has been received.
// //     client.end();
// // });
//
// client.on('end', function () {
//     console.log('Requested an end to the TCP connection');
// });
//
// client.on('error', function (ex) {
//     console.log("ERROR OCCURRED");
//     console.log(ex);
// });
//# sourceMappingURL=tcp-client.js.map