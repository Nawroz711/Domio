import User from "../models/user.model.js";

export const getUsers = async (page, limit, currentUserId, filters = {}) => {
  try {
    const { search, province, status, role } = filters;

    // Build query object
    const query = { _id: { $ne: currentUserId } }; // exclude current user

    // Search functionality - search in name, email, phone
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    // Province filter
    if (province) {
      query.province = province;
    }

    // Status filter (isActive)
    if (status !== undefined && status !== '') {
      query.isActive = status === 'true';
    }

    // Role filter
    if (role) {
      query.role = role;
    }

    const users = await User.paginate(query, { page, limit, sort: { createdAt: -1 } });
    return users;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const updateUserStatus = async (userId, isActive) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true }
    ).select('-password');
    return user;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
