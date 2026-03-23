import User from "../models/user.model.js";

export const getUsers = async (page , limit , currentUserId) => {
  try {
    const users = await User.paginate(
      { _id: { $ne: currentUserId } }, // exclude current user
      { page, limit }
    );
    return users;
  } catch (e) {
    console.error(e);
  }
};
