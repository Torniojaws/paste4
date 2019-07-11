[![GitHub version](https://badge.fury.io/gh/Torniojaws%2Fpaste4.svg)](https://badge.fury.io/gh/Torniojaws%2Fpaste4)
[![Build Status](https://travis-ci.org/Torniojaws/paste4.svg?branch=master)](https://travis-ci.org/Torniojaws/paste4)
[![Coverage Status](https://coveralls.io/repos/github/Torniojaws/paste4/badge.svg?branch=master)](https://coveralls.io/github/Torniojaws/paste4?branch=master)

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

# Notes

Do not update `mongoose` to version between 5.5.0 and 5.6.4. It breaks in Travis CI.
Version 5.4.23 is the newest one that works.

## Tests

For testing, Mocha and Chai are used. You can run the tests with `npm test`
If you want to check the DB manually, use: `mongo --host 127.0.0.1:27017`
