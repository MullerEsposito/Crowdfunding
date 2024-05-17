// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./contracts/Crowdfunding.sol";

contract CrowdfundingFactory {
    Crowdfunding[] crowdfundings;

    function createCrowdfunding(uint minimum) public {
        Crowdfunding newCrowdfunding = new Crowdfunding(minimum, msg.sender);

        crowdfundings.push(newCrowdfunding);
    }

    function getCrowdfundings() public view returns(Crowdfunding[] memory) {
        return crowdfundings;
    }
}