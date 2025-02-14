This is out project for a hack-a-thon. What we are planning to make is a platform for railways which will have multiple features. Firstly, we are planning to make a platform where users can book tickets for a train. Secondly, we are planning to make a platform where users can cancel their tickets. Thirdly, we are planning to make a platform where users can see the status of their tickets. Fourthly, we are planning to make a platform where users can see the details of a train. Fifthly, we are planning to make a platform where users can see the details of a station. Sixthly, we are planning to make a platform where users can see the details of a coach. Seventhly, we are planning to make a platform where users can see the details of a seat. Eighthly, we are planning to make a platform where users can see the details of a passenger. Ninthly, we are planning to make a platform where users can see the details of a booking. 
Also we want to add proper queuing model that is when a user books station from A to B but train is running from station A to C then seat B to C would be free so we can allow someone else to but the ticket for the same. Moreover, if user cancels ticket from A to B1 so seat would be free from station B1 to B so let's say now new user can book the ticket for the same. If the ticket is sold from B2 to B (B1 to B2 would be unsold) then user will get a refund for the same while the user who bought the ticket would get the ticket at some inflated cost for last minute booking and at that time railways will get a profit on that inflated cost after giving the refund. Also tell both users probability of getting a ticket. Add realtime seat availability and booking status. Add reminder service using nodmailer and .env with user and pass as credential on mail that would tell the user that his ticket has been approved. While user is buying ticket then add alternative routes and station suggestion for user to choose from incase the current train is overbooked. Add crowd management feature such that let's say he want to go from A to B but B' is really close to B and crowd over B' is really lesser than B for railway travelling then he can get a suggestion to buy ticket from A to B' instead. Also add credit score based on travelling which would be dependent upon Distance and Frequency of travelling. Also add feature to directly send notification to upcoming stations' station master incase of emergency. Once a ticket will be booked, it'll be based on token and if a user wants to sell ticket midjourney then all transactions would be based on token and not the booking of the user, so it'll be easier to handle on server side.

backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── mailer.js
│   ├── models/
│   │   ├── Station.js
│   │   ├── Train.js
│   │   ├── Ticket.js
│   │   ├── User.js
│   │   ├── Booking.js
│   │   └── Route.js
│   ├── controllers/
│   │   ├── bookingController.js
│   │   ├── stationController.js
│   │   ├── trainController.js
│   │   └── userController.js
│   ├── routes/
│   │   ├── bookingRoutes.js
│   │   ├── stationRoutes.js
│   │   ├── trainRoutes.js
│   │   └── userRoutes.js
│   ├── services/
│   │   ├── bookingService.js
│   │   ├── notificationService.js
│   │   ├── queueingService.js
│   │   └── routeSuggestionService.js
│   └── utils/
│       ├── creditScoreCalculator.js
│       └── stationDistance.js
├── .env
└── server.js
