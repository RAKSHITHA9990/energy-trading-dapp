// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EnergyTrading {

    struct User {
        uint balance;
        uint energy;
    }

    mapping(address => User) public users;

    uint public pricePerUnit = 1 ether;

    event Transaction(address indexed from, address indexed to, uint units, uint cost);

    function addBalance() public payable {
    users[msg.sender].balance += msg.value;
    }

    function addEnergy(uint units) public {
        users[msg.sender].energy += units;
    }

    function buyEnergy(address producer, uint units) public {

        uint cost = units * pricePerUnit;

        require(users[msg.sender].balance >= cost, "Not enough balance");
        require(users[producer].energy >= units, "Not enough energy");

        users[msg.sender].balance -= cost;
        users[producer].balance += cost;

        users[msg.sender].energy += units;
        users[producer].energy -= units;

        emit Transaction(msg.sender, producer, units, cost);
    }

    function getBalance(address user) public view returns (uint) {
        return users[user].balance;
    }

    function getEnergy(address user) public view returns (uint) {
        return users[user].energy;
    }
}