const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || "rxconnect_secret_key";

const generateToken = (id, role, email) => {
  return jwt.sign({ id, role, email }, JWT_SECRET, { expiresIn: "7d" });
};


const normalizeRole = (r) => {
  if (!r) return "CUSTOMER";
  const upper = r.toString().toUpperCase().replace(/\s+/g, "_");
  if (upper === "CUSTOMER") return "CUSTOMER";
  if (upper === "PHARMACIST") return "PHARMACIST";
  if (upper === "DELIVERY_PARTNER" || upper === "DELIVERY") return "DELIVERY_PARTNER";
  if (upper === "ADMIN" || upper === "REGIONAL_ADMIN") return "ADMIN";
  return "CUSTOMER";
};

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

    const requestedRole = role ? normalizeRole(role) : null;
    let effectiveRole = user.role;

    if (requestedRole && user.role !== requestedRole) {
      effectiveRole = requestedRole;
      await prisma.user.update({
        where: { id: user.id },
        data: { role: effectiveRole },
      });
    }

    const token = generateToken(user.id, effectiveRole, user.email);

    const redirectPath =
      effectiveRole === "ADMIN"
        ? "/admin"
        : effectiveRole === "PHARMACIST"
        ? "/pharmacist"
        : effectiveRole === "DELIVERY_PARTNER"
        ? "/delivery"
        : "/customer";

    return res.json({
      success: true,
      message: `Welcome back, ${user.fullName}!`,
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: effectiveRole,
        employeeId: user.employeeId || null,
        branchId: user.branchId || null,
      },
      redirectTo: redirectPath,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: err.message || "Login failed" });
  }
};

const getMe = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        employeeId: true,
        branchId: true,
        deliveryAddress: true,
        preferredPharmacy: true,
        emergencyContact: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      user: {
        ...user,
        customerId: user.employeeId || `RX-${user.id.slice(0, 7).toUpperCase()}`,
        joinedDate: new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateMe = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const { fullName, email, phone, deliveryAddress, preferredPharmacy, emergencyContact } = req.body;

    const dataToUpdate = {};
    if (fullName !== undefined) dataToUpdate.fullName = fullName;
    if (email !== undefined) dataToUpdate.email = email.toLowerCase().trim();
    if (phone !== undefined) dataToUpdate.phone = phone;
    if (deliveryAddress !== undefined) dataToUpdate.deliveryAddress = deliveryAddress;
    if (preferredPharmacy !== undefined) dataToUpdate.preferredPharmacy = preferredPharmacy;
    if (emergencyContact !== undefined) dataToUpdate.emergencyContact = emergencyContact;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        employeeId: true,
        branchId: true,
        deliveryAddress: true,
        preferredPharmacy: true,
        emergencyContact: true,
        createdAt: true,
      },
    });

    return res.json({
      success: true,
      message: "Profile updated successfully!",
      user: {
        ...updatedUser,
        customerId: updatedUser.employeeId || `RX-${updatedUser.id.slice(0, 7).toUpperCase()}`,
        joinedDate: new Date(updatedUser.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      },
    });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ success: false, message: err.message || "Failed to update profile" });
  }
};

module.exports = { signup, login, getMe, updateMe };
