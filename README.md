# Zorkin SDK (beta v1)

⚠️ Not officially production ready until documentation updated to indicate otherwise. Use at your own risk.

The Zorkin SDK is a frontend client for interfacing with Zorkin. It supports authorizing new sessions, and once authorized, allows transactions to be signed with the session key. Session authorization involves generating proof to demonstrate possession of a valid JWT for the contract account, uniquely derived from the JWT based on the subject, issuer, and client fields. A detailed description of how Zorkin works will be provided upon release.

This is a beta-v1 release, so you can expect limited documentation and code that may not be production quality. However, the SDK is mostly finalized. It is a Vite component library that enables the addition of frontend components, such as a pre-made sign-in modal for added convenience.

Since the product is in its beta phase, the production release may have a completely different set of features compared to the beta release or current claims. No warranties or liabilities are provided.

## Install

```sh
yarn add zorkin-sdk
```

## Regenerate Zorkin-Server REST Client with OpenAPI

The backend handles most of the heavy lifting. To regenerate the API using OpenAPI, run the following command.

```sh
openapi-generator-cli generate -i https://zorkin-server.winton-nathan-roberts-5e4.workers.dev/openapi.json -g typescript-axios -o ./src/zorkin-client/zorkin-server-oapi-client
```

## Build

```sh
yarn build
```

## Disclaimer

This software is provided "as is," without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and non-infringement. In no event shall the authors or copyright holders be liable for any claim, damages, or other liability, whether in an action of contract, tort, or otherwise, arising from, out of, or in connection with the software or the use or other dealings in the software.

You are solely responsible for determining the appropriateness of using or redistributing the software and assume any risks associated with your use. The software is in a beta phase, and features are subject to change without notice. No guarantees are made regarding the availability, functionality, or performance of the software.

By using this software, you acknowledge that it may contain bugs, errors, or inaccuracies, and you agree that the authors are not obligated to provide support, updates, or fixes.

Use at your own risk.
