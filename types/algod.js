import algosdk from 'algosdk';
// Define the Algorand node connection parameters
const algodToken = ''; // free service does not require tokens
const algodServer = 'https://testnet-api.algonode.cloud';
const algodPort = 443;
// Create an instance of the algod client
export const algod = new algosdk.Algodv2(algodToken, algodServer, algodPort);
