import Hotelmodel from "../Models/HotelModel.js";
import bcrypt from "bcrypt";

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

        // Save user to database
        await newUser.save();

        // Return success response
        return res.status(201).json({ message: "User signed up successfully" });

    } catch (error) {
        // Handle any unexpected errors
        console.error("Signup error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

