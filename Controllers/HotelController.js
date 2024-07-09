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

// Function to handle user signin
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
        };
        next();
    });
};

// Function to handle room data update
export const Roomdata = async (req, res) => {
    try {
        const { roomType, roomNumber, roomStatus, roomGuestName, roomGuestPhone, roomCapacity, roomNights, roomCheckIn, roomCheckOut, roomPrice } = req.body;

        const userId = req.user.userId;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required for updating' });
        }

        // Find existing room data by userId
        const existingRoomData = await Hotelmodel.findOne({ _id: userId });

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

// Function to get all user and room data
export const getAllData = async (req, res) => {
    try {
        // Fetch all users and their room data from the database
        const users = await Hotelmodel.find();

        // Return the user data
        return res.status(200).json({
            message: "Data retrieved successfully",
            users: users
        });

    } catch (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


// Function to get user-specific data
export const getUserData = async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch user by ID and their room data from the database
        const user = await Hotelmodel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the user data
        return res.status(200).json({
            message: "User data retrieved successfully",
            roomdata: user.roomdata
        });

    } catch (error) {
        console.error("Error fetching user data:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

//delete booking  //// problem
export const deleteBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        // Delete booking by ID from the database
        const deletedBooking = await Hotelmodel.findByIdAndDelete(bookingId);

        if (!deletedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Optionally return a message confirming deletion
        return res.status(200).json({ message: 'Booking deleted successfully' });

    } catch (error) {
        console.error("Error deleting booking:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
