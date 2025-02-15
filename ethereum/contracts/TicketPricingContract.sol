// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TicketPricingContract {
    uint256 public originalTicketPrice;

    event TicketPriceUpdated(uint256 newPrice);

    constructor(uint256 _originalTicketPrice) {
        originalTicketPrice = _originalTicketPrice;
    }

    function updateTicketPrice(uint256 newPrice) external {
        originalTicketPrice = newPrice;
        emit TicketPriceUpdated(newPrice);
    }

    function getTicketPrice() external view returns (uint256) {
        return originalTicketPrice;
    }
}