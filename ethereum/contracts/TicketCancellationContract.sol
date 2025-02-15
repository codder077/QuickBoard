// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TicketCancellationContract {
    struct Cancellation {
        address originalOwner;
        address buyer;
        uint256 refundAmount;
        uint256 cancellationTime;
    }

    mapping(uint256 => Cancellation) public trainCancellations;
    mapping(uint256 => uint256) public ticketPrices; // Store ticket prices for each train ID

    event TicketRefunded(uint256 trainId, address originalOwner, address buyer, uint256 refundAmount);

    // Function to set the ticket price for a train
    function setTicketPrice(uint256 trainId, uint256 price) external {
        ticketPrices[trainId] = price;
    }

    function refundTicket(uint256 trainId) external {
        Cancellation storage cancellation = trainCancellations[trainId];

        // Ensure the caller is the original owner
        require(msg.sender == cancellation.originalOwner, "Only the original owner can refund the ticket");

        // Refund logic (this is a placeholder, actual implementation may vary)
        uint256 refundAmount = ticketPrices[trainId];
        cancellation.refundAmount = refundAmount;
        cancellation.cancellationTime = block.timestamp;

        // Emit the refund event
        emit TicketRefunded(trainId, cancellation.originalOwner, cancellation.buyer, refundAmount);
    }

    // Function to record a cancellation
    function recordCancellation(uint256 trainId, address buyer) external {
        trainCancellations[trainId] = Cancellation({
            originalOwner: msg.sender,
            buyer: buyer,
            refundAmount: 0,
            cancellationTime: 0
        });
    }
}