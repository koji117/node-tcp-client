import {readFileSync} from "fs";
import {Socket} from "net";

// The port number and hostname of the server.
const args: string[] = process.argv.slice(2);
// args [port, hostname, data, interval]
const port: number = parseInt(args[0], 10);
const host: string = args[1];
const dataPath: string = "./data/" + args[2] + ".csv";
const interval: number = parseInt(args[3], 10);

// Create a new TCP client.
const client: Socket = new Socket();
const csvArray = convertCsvToArray(dataPath);

function connect() {
    console.log("new client");
    client.connect({port, host}, () => {
        console.log("TCP connection established with the server.");
        Promise.resolve(0).then(function loop(i) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    client.write("\n" + csvArray[i] + "\n");
                    resolve(i + 1);
                    }, interval);
                if (i === csvArray.length - 1) {
                    i = 0;
                }
            })
                .then(loop);
        });
        },
    );
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

    client.on("error", console.error);
}

// function that reconnect the client to the server
function reconnect() {
    setTimeout(() => {
        client.removeAllListeners(); // the important line that enables you to reopen a connection
        connect();
    }, 5000);
}

connect();

export function convertCsvToArray(path) {
    return readFileSync(path).toString().split("\n");
}

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
