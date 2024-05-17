// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

struct Request {
    string description;
    uint value;
    address recipient;
    bool isComplete;
    uint yesVotes;
    mapping(address => bool) voters;
}