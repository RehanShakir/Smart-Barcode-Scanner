/**
 * Checking Admin Or Not
 * @param {Request Object} req
 * @param {Response Object} res
 */
exports.isAdmin = (req, res, next) => {
  req?.user?.role === "admin"
    ? next()
    : res
        .status(400)
        .json({ message: "Please Login as Admin to access the resource." });
};
