import mongoose from 'mongoose';
import net from 'net';
import { create } from 'kubo-rpc-client'
import { ethers } from 'ethers';

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

// Audit machines every 30 seconds 
setInterval(async () => {
	console.log('Auditing machines...');
    // Read all audits from the database
    const audits = await Audit.find().exec();

    // Audit all machines
    for (let i = 0; i < audits.length; i++) {
        const report = await auditMachine(audits[i]);
        console.log(report);

        const hash = await sendReportToIpfs(report);
        console.log(`Report saved to IPFS with hash: ${hash}`);

        // Enviar evidencia al contrato
        await sendEvidenceToBlockchain(audits[i].id, hash);
    }
}, 30000);

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
	console.log('Sending report to IPFS...');
    const result = await ipfsClient.add(JSON.stringify(report));
    await ipfsClient.files.cp(`/ipfs/${result.cid}`, `/${result.cid}`)
    return result.cid.toString();
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