// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8;

import "../structs/Request.sol";

contract Crowdfunding {
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    Request[] public requests;
    string[] public test;

    modifier restrictedToManager() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;        
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);

        approvers[msg.sender] = true;
    }

    event testUpdated(string newValue);
    function getTestArrayLength() public view returns (uint) {
        return test.length;
    }


    function createRequest(string memory description, uint value, address recipient) public payable restrictedToManager {
        // require(approvers[msg.sender]);
        Request storage newRequest = requests.push(); 
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.isComplete = false;
        newRequest.yesVotes = 0;

        test.push("a");
        test.push("b");
        test.push("c");
    }

    function aproveRequest(uint index) public {
        Request storage request = requests[index];

        bool isVoter = approvers[msg.sender];
        bool isNotAlreadyVoted = !request.voters[msg.sender];
        
        require(isVoter);
        require(isNotAlreadyVoted);

        request.voters[msg.sender] = true;
        request.yesVotes++;
    }

    function getRequest() public view returns (string memory description, uint value, address recipient, bool isComplete, uint yesVotes) {
        Request storage request = requests[0];
        return (request.description, request.value, request.recipient, request.isComplete, request.yesVotes);
    }
}