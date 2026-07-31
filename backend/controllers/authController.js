const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || "rxconnect_secret_key";

const generateToken = (id, role, email) => {
  return jwt.sign({ id, role, email }, JWT_SECRET, { expiresIn: "7d" });
};

// Helper: Normalize Role String
const normalizeRole = (r) => {
  if (!r) return "CUSTOMER";
  const upper = r.toString().toUpperCase().replace(/\s+/g, "_");
  if (upper === "CUSTOMER") return "CUSTOMER";
  if (upper === "PHARMACIST") return "PHARMACIST";
  if (upper === "DELIVERY_PARTNER" || upper === "DELIVERY") return "DELIVERY_PARTNER";
  if (upper === "ADMIN" || upper === "REGIONAL_ADMIN") return "ADMIN";
  return "CUSTOMER";
};

// @desc Register User (Stored directly in Database)
// @route POST /api/auth/signup
const signup = async (req, res) => {
  try {
    const { fullName, email, password, phone, role, employeeId, vehicle, branchId } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required." });
    }

    const roleEnum = normalizeRole(role);
    const cleanEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullName,
        email: cleanEmail,
        password: hashedPassword,
        phone: phone || null,
        role: roleEnum,
        employeeId: employeeId || null,
        vehicle: vehicle || null,
        branchId: branchId || null,
      },
    });

    const token = generateToken(user.id, user.role, user.email);

    return res.status(201).json({
      success: true,
      message: "Account created successfully in database!",
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        employeeId: user.employeeId,
        branchId: user.branchId,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ success: false, message: err.message || "Failed to create account" });
  }
};

// @desc Login User (Authenticates against Database)
// @route POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password." });
    }

    const cleanEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const token = generateToken(user.id, user.role, user.email);

    return res.json({
      success: true,
      message: `Welcome back, ${user.fullName}!`,
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        employeeId: user.employeeId || null,
        branchId: user.branchId || null,
      },
      redirectTo:
        user.role === "ADMIN"
          ? "/admin"
          : user.role === "PHARMACIST"
          ? "/pharmacist"
          : user.role === "DELIVERY_PARTNER"
          ? "/delivery"
          : "/customer",
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: err.message || "Login failed" });
  }
};

// @desc Get current logged in user profile from Database
// @route GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, fullName: true, email: true, phone: true, role: true, employeeId: true, branchId: true },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { signup, login, getMe };
