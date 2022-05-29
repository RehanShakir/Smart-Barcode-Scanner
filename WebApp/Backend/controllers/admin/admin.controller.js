const express = require("express");
const User = require("../../models/user.model");
const Scanner = require("../../models/scanner.model");
const { Request, Response } = express;

/**
 * Send Dashboard counts
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
exports.dashboardCounts = async (req, res) => {
  try {
    const users = await User.countDocuments({ role: "client" });
    const pendingUsers = await User.countDocuments({
      status: "pending",
      role: "client",
    });
    const approvedUsers = await User.countDocuments({
      status: "approved",
      role: "client",
    });
    const rejectedUsers = await User.countDocuments({
      status: "rejected",
      role: "client",
    });
    const scannedBarcodes = await Scanner.countDocuments();
    return res.status(200).json({
      users,
      pendingUsers,
      approvedUsers,
      rejectedUsers,
      scannedBarcodes,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `INTERNAL SERVER ERROR: ${error.message}` });
  }
};

/**
 * Get All Users
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "client" });
    return res.status(200).json({ users });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `INTERNAL SERVER ERROR: ${error.message}` });
  }
};

/**
 * User Status Update
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
exports.statusUpdate = async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { _id: req.params.userId },
      {
        status: req.body.status,
      },
      { new: true }
    );
    return res.status(200).json({ message: "Status Updated Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `INTERNAL SERVER ERROR: ${error.message}` });
  }
};

/**
 * Get All Scanned Data
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
exports.getScannedData = async (req, res) => {
  try {
    const scannedData = await Scanner.find({ claim: true }).populate({
      path: "userId",
      select: "-password",
    });
    return res.status(200).json({ scannedData });
  } catch (error) {
    res
      .status(500)
      .json({ message: `INTERNAL SERVER ERROR: ${error.message}` });
  }
};

/**
 * Assign Buttons to user
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
exports.updateButtons = async (req, res) => {
  try {
    const { assignedButtons } = req?.body;
    console.log(assignedButtons);
    let user = await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        assignedButtons,
      },
      { new: true, upsert: true }
    );

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Get Scanned Data By User id
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
exports.userScannedData = async (req, res) => {
  try {
    const scannedData = await Scanner.find({ userId: req.params.id }).populate({
      path: "userId",
      select: "-password",
    });
    return res.status(200).json({ data: scannedData });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Get One User By Id
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
exports.getOneUser = async (req, res) => {
  try {
    const scanCount = await Scanner.countDocuments({ userId: req.params.id });
    const user = await User.findOne({ _id: req.params.id });

    return res.status(200).json({ user, scanCount });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `INTERNAL SERVER ERROR: ${error.message}` });
  }
};

/**
 * Update Claim Status
 * @param {Request} req - request object
 * @param {Response} res - response object
 */
exports.updateClaimStatus = async (req, res) => {
  try {
    await Scanner.findOneAndUpdate(
      { _id: req.params.id },
      {
        claimStatus: req.body.claimStatus,
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Claim Status updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `INTERNAL SERVER ERROR: ${error.message}` });
  }
};
// exports.updatePassword = async (req, res) => {
//   try {
//     let { fullName, email, oldPassword, newPassword } = req?.body;

//     if (!oldPassword) {
//       return res.status(500).json({
//         status: "Failed",
//         message: "Old Password is required",
//       });
//     }

//     if (!newPassword) {
//       newPassword = oldPassword;
//     }
//     const user = await User.findById(req.user._id);

//     if (!(await user?.comparePassword(oldPassword))) {
//       return res.status(500).json({
//         status: "Unauthorized",
//         message: "Old Password is inorrect",
//       });
//     }

//     const userData = await User.findOneAndUpdate(
//       { _id: req.user._id },
//       {
//         fullName,
//         email,
//         password: await user.generateHash(newPassword),
//         role: user.role,
//         status: user.status,
//       },
//       { new: true }
//     );

//     res.status(200).json({
//       message: "User Information Updated",
//       data: userData,
//     });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: `INTERNAL SERVER ERROR: ${error.message}` });
//   }
// };
