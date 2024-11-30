import mongoose from 'mongoose';
import net from 'net';
import crypto from 'crypto';
import https from 'https';

import { create } from 'kubo-rpc-client'
import { ethers } from 'ethers';
import { spawn } from 'child_process';
import { log } from 'console';

// Contract address and ABI
const addresse = "0x686D834A4dD03d277C8Fd91EE6d737d1bf09bfD4"
const abi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "serviceName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "uri",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "port",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "valid",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "AuditoriaCreada",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "evidencia",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "EvidenciaAnadida",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_evidencia",
				"type": "string"
			}
		],
		"name": "anadirEvidencia",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "auditorias",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "serviceName",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "uri",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "port",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "valid",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "auditoriasCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_serviceName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_uri",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_port",
				"type": "string"
			}
		],
		"name": "crearAuditoria",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "evidencias",
		"outputs": [
			{
				"internalType": "string",
				"name": "evidencia",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "obtenerAuditoria",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "obtenerEvidencias",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			},
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "obtenerTodasLasAuditorias",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "operator",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

// Ethereum private key
const privateKey = process.env.PRIVATE_KEY

// Ethereum provider, we are using Alchemy here as a provider
const provider = new ethers.providers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/-s-yvgbqdgkLE1-UYFtbwg_xsTr47tJy');

// Create a wallet and connect it to the provider
const wallet = new ethers.Wallet(privateKey, provider);
const contract = new ethers.Contract(addresse, abi, wallet);

// Connect to MongoDB, we are using mongoDB as a cache database
await mongoose.connect('mongodb://mongo:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

const auditSchema = new mongoose.Schema({
    id: String,
    host: String,
    port: Number,
    frequency: Number
});

const Audit = mongoose.model('Audit', auditSchema);

// IPFS client
const ipfsClient = create({
    url: 'http://ipfs:5001'
});

// Get all audits from the blockchain
const audits = await getAllAudits();

// Save audits to the database
// TODO: Get the audits from the database and compare them with the audits from the blockchain, and only save the new audits
await saveAudits(audits);

// Listen for events from the blockchain
console.log('Listening for event AuditoriaCreada...');
contract.on("AuditoriaCreada", (id, serviceName, owner, uri, port, valid, timestamp) => {
    console.log('New audit created:', id, serviceName, owner, uri, port, valid, timestamp);
	const audit = new Audit({
		id: id.toNumber(),
		host: uri,
		port: port
	});
	audit.save();
});


// Download the scripts to be executed from IPFS
const scripts = [
	'QmdTf2NewqnEknhdKyTfvtHJ6ejLRUe7X8KJww4tHQZmmW',
	'Qmaxwis2N7jUpFCADL317geV6YKe7dAYYwMgmeDX1S4eLp'
]

const scriptsJsons = []
for (let i = 0; i < scripts.length; i++) {
	const scriptJson = await downloadScriptFromIpfs(scripts[i]);
	scriptsJsons.push(scriptJson);
}

// Execute the scripts
for (let i = 0; i < scriptsJsons.length; i++) {
	var reponse = await executePythonScript(scriptsJsons[i].path, scriptsJsons[i].hash, "service", "4000");
	console.log("reponse ", reponse);
}

// Audit machines every 30 seconds 
setInterval(async () => {
	console.log('Auditing machines...');
    // Read all audits from the database
    const audits = await Audit.find().exec();

    // Audit all machines
    for (let i = 0; i < audits.length; i++) {
		// Execute the script for each audit
		for (let j = 0; j < scriptsJsons.length; j++) {
			var reponse = await executePythonScript(scriptsJsons[j].path, scriptsJsons[j].hash, audits[i].host, audits[i].port);

			console.log("reponse" + reponse);

			const hash = await sendReportToIpfs(reponse);
			console.log(`Report saved to IPFS with hash: ${hash}`);

			 // Enviar evidencia al contrato
			 await sendEvidenceToBlockchain(audits[i].id, hash);
		}
    }
}, 30000);


// Save audits to the database
async function saveAudits(audits) {
	console.log('Saving audits to database...');
    for (let i = 0; i < audits.length; i++) {
        const audit = new Audit(audits[i]);
        await audit.save();
    }
}

//Get All audits from ethereum
async function getAllAudits() {
	console.log('Getting audits from blockchain...');
	return new Promise(async (resolve) => {
		try {
			let audits = []
			const reponse = await contract.obtenerTodasLasAuditorias();
			for (const auditId of reponse) {
				const audit = await getAuditById(auditId);
				audits.push(audit);
			}

			resolve(audits);
		} catch (err) {
			console.error('Error getting audits:', err);
			resolve([]);
		}
	})
}

// Get audit by id
async function getAuditById(auditId) {
	return new Promise(async (resolve, reject) => {
		try {
			const audit = await contract.obtenerAuditoria(auditId);
			resolve({
				id: audit[0].toNumber(),
				host: audit[3],
				port: audit[4]
			});
		} catch (err) {
			console.error('Error getting audit:', err);
		}
	});
}

//Audit a machine
async function auditMachine (audit) {
	console.log(`Auditing ${audit.host}:${audit.port}`);
    return new Promise((resolve, reject) => {
        let report = {
            id: audit.id,
            host: audit.host,
            port: audit.port,
            timestamp: Date.now(),
            latency: 0,
            connected: false
        };
    
        const start = Date.now();
        
        console.log(`Auditing ${audit.host}:${audit.port}`);
    
        const client = net.createConnection({host: audit.host, port: audit.port}, () => {
            const delay = Date.now() - start;
            report.latency = delay;
            report.connected = true;
            client.end();
        });

        client.on('end', () => {
            resolve(report);
        });

        client.on('error', (err) => {
            report.connected = false;
            resolve(report);
        });
    });
}

// Send report to IPFS 
async function sendReportToIpfs (report) {
	console.log('Sending report '+ report +' to IPFS...');
    const result = await ipfsClient.add(report);
    await ipfsClient.files.cp(`/ipfs/${result.cid}`, `/${result.cid}`)
    return result.cid.toString();
}

// Download an script from IPFS
async function downloadScriptFromIpfs (CID) {
	console.log('Downloading script from IPFS...');
	
	const stream = ipfsClient.cat(CID);
    const chunks = [];

	for await (const chunk of stream) {
		chunks.push(chunk);
	}

	// Combine all chunks into a buffer
	const buffer = Buffer.concat(chunks);

	// Convert buffer into a string
	const jsonString = buffer.toString('utf-8');

	// Parse JSON content into a variable
	const jsonData = JSON.parse(jsonString);
	console.log('Fetched JSON data:', jsonData);

	return jsonData;
}

// Send evidence to blockchain
async function sendEvidenceToBlockchain(auditId, evidence) {
	console.log('Sending evidence to blockchain...');
    try {
        const tx = await contract.anadirEvidencia(auditId, evidence);
        console.log(`Evidence transaction sent: ${tx.hash}`);
        await tx.wait();
        console.log('Evidence added to blockchain.');
    } catch (err) {
        console.error('Error adding evidence:', err);
    }
}

// Función para ejecutar el script Python directamente
async function executePythonScript(scriptUrl, hash, ...params) {
    try {
        const scriptContent = await downloadPythonScript(scriptUrl);

		// Check if the hash is correct
		if (crypto.createHash('sha512').update(scriptContent).digest('hex') !== hash) {
			console.error('Hashes do not match');
			return;
		}

        return new Promise((resolve, reject) => {
            // Ejecutar el script directamente con Python
            const pythonProcess = spawn('python3', ['-c', scriptContent, ...params]);

            let output = '';

            pythonProcess.stdout.on('data', (data) => {
                output += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                console.error(`Error: ${data.toString()}`);
            });

            pythonProcess.on('close', (code) => {
                console.log(`Process exited with code: ${code}`);
                resolve(output);
            });
        });
    } catch (err) {
        console.error(`Failed to execute script: ${err.message}`);
    }
}

// Función para descargar el script desde GitHub
function downloadPythonScript(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                return reject(new Error(`Failed to get file: ${response.statusCode}`));
            }
            let data = '';
            response.on('data', chunk => {
                data += chunk;
            });
            response.on('end', () => resolve(data));
        }).on('error', err => reject(err));
    });
}
