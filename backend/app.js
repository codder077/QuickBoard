const express = require('express');
const { connect } = require('./db/connection');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const app = express();
const cors = require('cors');
const stripe = require('stripe')("sk_test_51OMTBgSBwW6fmG0JXexEGREGn1CViNKMuHzw53jJzGNQ7Mq9YJ92MRibCx2uXyKZgMBml2Dnl0463BAgI2Cd63lx009VOMLIpk");

connect();

const Users = require('./models/userModel');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const port = process.env.PORT || 8000;

// Routes
app.get('/', (req, res) => {
    res.send("This is Backend");
});


const Ticket = require("./models/trainTicketModel");



//Ticket OnCancelation
app.post('/api/oncancelation', async (req, res) => {
    try {
        const receivedData = req.body;
        const { userEmail, pnr } = receivedData;
        if (!userEmail) {
            return res.status(400).json({ message: 'Some error occured ! Please login again after logingout', status: 400 });

        } else {
            const user = await Users.findOne({ email:userEmail });
            user.cancelationOnTrack = true;
            const ticket = await Ticket.findOne({ _id: pnr });
            ticket.cancelationOnTrack = true;
            ticket.save();
            await user.save();
            return res.json({
                status: 200,
            });

        }
    } catch (error) {
        console.log("Error occured at the backend of onticket cancellation");
        return res.status(500).json({ message: 'Some Error Occured! Please try again later', status: 500 });

    }
})


//Ticket Booking 
app.post('/api/bookticket', async (req, res) => {
    try {
        console.log("Booking ticket request received at backend", req.body);
        const ticketData = req.body;
        const { userEmail, amount, trainNo, trainName, departureStation, destinationStation, departuredate, coach } = ticketData;

        if (!userEmail || !amount || !trainNo || !trainName || !departureStation || !destinationStation || !departuredate || !coach) {
            return res.status(400).json({ message: 'Please fill all required details', status: 400 });

        } else {

            const newTicket = new Ticket({
                amount,
                trainNo,
                userEmail,
                trainName,
                departureStation,
                destinationStation,
                departuredate,
                coach
            });


            console.log(newTicket);
            const savedTicket = await newTicket.save();
            const pnr = savedTicket._id.toString();
            const user = await Users.findOne({ email:userEmail });
            console.log("jfhj",user);
            const ticket = {
                amount, trainNo, trainName, departureStation, pnr, destinationStation, departuredate, coach, canceled: false, cancelationOnTrack: false,

            }
            console.log(ticket, "fdfgd54678", pnr);

            user.trainTickets.push(ticket);
            await user.save();
            return res.json({
                status: 200,
            });
        }

    } catch (error) {
        console.log("Error occured at backend at ticket booking ");
        return res.status(500).json({ message: 'Internal Server Error', status: 500 });

    }
})




//login and signup routes

app.post('/api/register', async (req, res) => {
    try {
        console.log("Received registration request");
        const user = req.body;
        const { fullname, phone, email, password } = user;
        console.log("user received", req.body);
        // console.log("pic received",pic,fullName,email,password);
        // console.log(req.body);
        if (!fullname || !email || !password || !phone) {
            return res.status(400).json({ message: 'Please fill all required details', status: 400 });
        } else {
            const isAlreadyExist = await Users.findOne({ email });
            const isUserAlreadyExist = await Users.findOne({ phone });

            if (isAlreadyExist || isUserAlreadyExist) {
                return res.status(400).json({ message: 'User Alredy Exist', status: 400 });
            } else {
                const salt = await bcryptjs.genSalt(10);
                const hashedpassword = await bcryptjs.hash(password, salt);

                const newUser = new Users({
                    fullName: fullname,
                    email,
                    password: hashedpassword,
                    phone,

                });

                await newUser.save();
                console.log("mbvdhmsbdfndm");
                return res.status(200).json({ message: 'User Registered Successfully', status: 200 });

            }
        }
    } catch (error) {
        console.log(error, "signup backend error");
        return res.status(500).json({ message: 'Internal Server Error', status: 500 });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Please fill all the required details', status: 400 });
        } else {
            const user = await Users.findOne({ email });
            if (!user) {
                res.status(400).json({ message: 'User Email or Password is Incorrect', status: 400 });
            }
            else {


                const validateUser = await bcryptjs.compare(password, user.password);
                if (!validateUser) {
                    res.status(400).json({ message: 'User Email or Password is Incorrect', status: 400 });
                }
                else {
                    const payload = {
                        userId: user._id,
                        email: user.email
                    }
                    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "quickboard";
                    jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: 84600 }, async (err, token) => {
                        await Users.updateOne({ _id: user._id }, {
                            $set: { token }
                        })
                        user.save();
                        return res.status(200).json({ user: { id: user._id, email: user.email, fullName: user.fullName, }, token: token, message: "user signedin successfully", status: 200 });

                    })
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
})


const server = app.listen(port, () => {
    console.log('Listening on port ' + port);
});