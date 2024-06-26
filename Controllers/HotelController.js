import Hotelmodel from "../Models/HotelModel.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

// Function to handle user signup
export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user with same email already exists
        let existingUser = await Hotelmodel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new Hotelmodel({
            username,
            email,
            password: hashedPassword
        });



        // Generate JWT token
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);
        newUser.token = token;

        // Save user to database
        await newUser.save();

        // Return success response with token
        return res.status(201).json({
            message: "User signed up successfully",
            token: token
        });

    } catch (error) {
        // Handle any unexpected errors
        console.error("Signup error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await Hotelmodel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatching = await bcrypt.compare(password, user.password);
        if (!isMatching) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        // Update token in the database if it has changed
        if (token !== user.token) {
            user.token = token;
            await user.save();
        }

        return res.status(200).json({
            message: "Login successful",
            token: token,
            user: user  // Optionally, you can return the user object as well
        });

    } catch (error) {
        // Handle any unexpected errors
        console.error("Signin error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};




// Middleware to verify JWT and extract userId
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        // Attach userId to request object
        req.user = {
            userId: decoded.userId,
            // Add other user properties if needed
        };
        next();
    });
};

export const Roomdata = async (req, res) => {
    try {
        const { roomType, roomNumber, roomStatus, roomGuestName, roomGuestPhone, roomCapacity, roomNights, roomCheckIn, roomCheckOut, roomPrice } = req.body;

        // Check if there's an _id provided in the request body
        const roomId = req.user.userId; // Assuming _id is passed in req.body

        if (!roomId) {
            return res.status(400).json({ message: 'Room ID (_id) is required for updating' });
        }

        // Find existing room data by _id and userId
        const existingRoomData = await Hotelmodel.findOne({ _id: roomId });

        if (!existingRoomData) {
            return res.status(404).json({ message: 'Room data not found or user does not have access' });
        }
        // Construct new room data object
        const newRoomData = {
            roomType,
            roomNumber,
            roomStatus,
            roomGuestName,
            roomGuestPhone,
            roomCapacity,
            roomNights,
            roomCheckIn,
            roomCheckOut,
            roomPrice,
        };

        // Add new room data to the array
        existingRoomData.roomdata.push(newRoomData);

        // Save updated room data to database
        await existingRoomData.save();

        // Return success response
        return res.status(200).json({ message: 'Room data updated successfully', room: existingRoomData });

    } catch (error) {
        // Handle any unexpected errors
        console.error('Room data update error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


