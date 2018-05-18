# Paste 4.0

Version 4 of the copypaste tool for personal notes, etc.

## Stack

- MongoDB
- Express.js
- Node.js
- Ubuntu

## Tools

- Ansible

## Install

1. Install Ansible, if not yet installed:
  `sudo add-apt-repository ppa:ansible/ansible && sudo apt update && sudo apt install ansible`
1. `git clone https://github.com/Torniojaws/paste4.git`
1. `cd paste4/`
1. Run `make` to deploy the project (using Ansible, see: [deployment](deployment/prod.yaml))
1. Once the deployment is ready, start the project with `npm start`
1. Then browse to: http://localhost:3000/

## Tests

For testing, Mocha and Chai are used. You can run the tests with `npm test`
If you want to check the DB manually, use: `mongo --host 127.0.0.1:27017`
