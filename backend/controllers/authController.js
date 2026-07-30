const prisma = require("../config/db");
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      password
    } = req.body;


    // Check existing user
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone }
        ]
      }
    });


    if (existingUser) {
      return res.status(400).json({
        message: "Email or phone already exists"
      });
    }


    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);


    // Create customer account
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        role: "CUSTOMER"
      }
    });


    // Do not send password back
    res.status(201).json({
      message: "Signup successful",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });


  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


module.exports = {
  signup
};