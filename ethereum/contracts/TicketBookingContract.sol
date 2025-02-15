// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TicketBookingContract {
    struct Ticket {
        address passenger;
        uint256 bookingTime;
        bool isCancelled;
    }

    struct Cancellation {
        address originalOwner;
        address buyer;
        uint256 refundAmount;
        uint256 cancellationTime;
    }

    mapping(uint256 => Ticket[]) public trainTickets; // Mapping of train ID to tickets
    mapping(uint256 => Cancellation) public trainCancellations; // Mapping of train ID to cancellations
    mapping(uint256 => uint256) public ticketPrices; // Store ticket prices for each train ID

    event TicketBooked(uint256 trainId, address passenger, uint256 bookingTime);
    event TicketCancelled(uint256 trainId, address originalOwner, address buyer, uint256 refundAmount);
    event TicketPriceUpdated(uint256 trainId, uint256 newPrice);

    // Function to book a ticket
    function bookTicket(uint256 trainId) external payable {
        require(msg.value == ticketPrices[trainId], "Incorrect ticket price sent");

        Ticket memory newTicket = Ticket({
            passenger: msg.sender,
            bookingTime: block.timestamp,
            isCancelled: false
        });

        trainTickets[trainId].push(newTicket);
        emit TicketBooked(trainId, msg.sender, block.timestamp);
    }

    // Function to set the ticket price for a train
    function setTicketPrice(uint256 trainId, uint256 price) external {
        ticketPrices[trainId] = price;
        emit TicketPriceUpdated(trainId, price);
    }

    // Function to record a cancellation
    function recordCancellation(uint256 trainId, address buyer) external {
        trainCancellations[trainId] = Cancellation({
            originalOwner: msg.sender,
            buyer: buyer,
            refundAmount: ticketPrices[trainId],
            cancellationTime: block.timestamp
        });
    }

    // Function to refund a ticket
    function refundTicket(uint256 trainId) external {
        Cancellation storage cancellation = trainCancellations[trainId];

        // Ensure the caller is the original owner
        require(msg.sender == cancellation.originalOwner, "Only the original owner can refund the ticket");

        // Refund logic
        uint256 refundAmount = cancellation.refundAmount;
        require(refundAmount > 0, "No refund amount available");

        // Reset the cancellation details
        cancellation.refundAmount = 0;

        // Transfer the refund amount to the original owner
        payable(cancellation.originalOwner).transfer(refundAmount);

        emit TicketCancelled(trainId, cancellation.originalOwner, cancellation.buyer, refundAmount);
    }

    // Function to cancel a ticket
    function cancelTicket(uint256 trainId) external {
        Ticket[] storage tickets = trainTickets[trainId];
        bool ticketFound = false;

        for (uint256 i = 0; i < tickets.length; i++) {
            if (tickets[i].passenger == msg.sender && !tickets[i].isCancelled) {
                tickets[i].isCancelled = true;
                ticketFound = true;
                recordCancellation(trainId, msg.sender);
                break;
            }
        }

        require(ticketFound, "No valid ticket found for cancellation");
    }
}