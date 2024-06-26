import mongoose from "mongoose";

const HotelSchema = new mongoose.Schema({
    username: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        // required: true,
        unique: true
    },
    password: {
        type: String,
        // required: true
    },
    token: { type: String },
    roomdata: [
        {
        roomType: {
            type: String,
            default: "Executive-ac"
        },
        roomNumber: {
            type: String
        },
        roomStatus: {
            type: String,
            default: "Available"
        },
        roomGuestName: {
            type: String,
            default: function () {
                return this.username; // Setting default value based on the name field
            }
        },
        roomGuestEmail: {
            type: String,
            default: function () {
                return this.email; // Setting default value based on the email field
            }
        },
        roomGuestPhone: {
            type: String,
           
        },
        roomCapacity: {
            type: String,
           
        },
        roomNights: {
            type: String,
          
        },
        roomCheckIn: {
            type: String,
      
        },
        roomCheckOut: {
            type: String,
       
        },
        roomPrice: {
            type: Number,
        
        }
    }
]
});

const Hotelmodel = mongoose.model('Hoteldata', HotelSchema);

export default Hotelmodel;
