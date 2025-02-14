// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TicketBookingContract {
    struct Ticket {
        address passenger;
        uint256 bookingTime;
        bool isCancelled;
    }

    mapping(uint256 => Ticket[]) public trainTickets;

    event TicketBooked(uint256 trainId, address passenger, uint256 bookingTime);
    event TicketCancelled(uint256 trainId, address passenger, uint256 cancellationTime);

    function bookTicket(uint256 trainId) external payable {
        // Logic to book a ticket and add passenger to waiting list
        // Emit event TicketBooked
    }

    function cancelTicket(uint256 trainId) external {
        // Logic to cancel a ticket and refund if a buyer is available on the waiting list
        // Emit event TicketCancelled
    }

    // Other functions for ticket management can be added as per project requirements
}
