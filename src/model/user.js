const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema( 
  {
    firstName: {
      type: String,
      minlength: 4,
      maxlength: 20,
      uppercase: true,
      // required: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: "Invalid email",
      },
    },
    age: {
      type: Number,
      min: 18,
      max: 60,
    },

    phone: {
      type: String,
      validate: {
        validator: function (value,) {
          if (!validator.isMobilePhone(value)) {
            throw new Error("please provide correct phone number.");
          }
          return true;
        },
      },
    },

   password: {
  type: String,
  validate: {
    validator: function (value) {
      return validator.isStrongPassword(value);
    },
    message: "Please provide strong password"
  }
},
  

    profileImage: {
      type: String,
      validate: {
        validator: function (value) {
          if (!validator.isURL(value)) {
            throw new Error("please provide correct URL image ");
          }
        },
      },
    },
    skills: [
      {
        type: String,
      },
    ],
  },
  



   
  {
    timestamps: true,
    versionKey: false,
  },


    
)
userSchema.methods.getToken = async function() {
    const user = this;
    if(!process.env.JWT_PVT_KEY) {
      throw new Error("please provide private key");

    }
  },

     userSchema.methods.checkpassword = async function(password) {
    const user = this;
    const checkpassword = await bcrypt.compare(password, user.password);
    return checkpassword
  },

module.exports = mongoose.model("User", userSchema);
