import User from "../Models/Users.js";

// Update User

export const UserUpdate = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const dataupdate = {
        username: req.body.username,
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        address: req.body.address,
        city: req.body.city,
        routepoints: req.body.routepoints,
        collage: req.body.collage,
        number: req.body.number,
      };
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          ...dataupdate,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  } else {
    return res.status(400).json({
      message: "You can update only your account!",
      success: false,
    });
  }
};

// Delete User

export const deleteUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been Deleted");
    } catch (error) {
      next(error);
    }
  } else {
    return res.status(400).json({
      message: "You can Delete only your account!",
      success: false,
    });
  }
};

// Get User

export const GetUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const user = await User.findById(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  } else {
    return res.status(400).json({
      message: "You can View only your account!",
      success: false,
    });
  }
};

// Get Followers

export const GetFollowers = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const user = await User.findById(req.params.userId);
      const friends = await Promise.all(
        user.followings.map((friendId) => {
          return User.findById(friendId);
        })
      );
      let friendList = [];
      friends.map((friend) => {
        const { _id, username, profilePicture } = friend;
        friendList.push({ _id, username, profilePicture });
      });
      res.status(200).json(friendList);
    } catch (error) {
      res.status(500).json(error);
      next(error);
    }
  } else {
    return res.status(400).json({
      message: "You can View only your Followers!",
      success: false,
    });
  }
};

// Follow a User

export const FollowUSer = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you allready follow this user");
      }
    } catch (error) {
      res.status(500).json(error);
      next(error);
    }
  } else {
    return res.status(400).json({
      message: "You only follow a User By Your Account!",
      success: false,
    });
  }
};

// UnFollow a User

export const UnFollowUSer = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you dont follow this user");
      }
    } catch (error) {
      res.status(500).json(error);
      next(error);
    }
  } else {
    return res.status(400).json({
      message: "You only Unfollow a User By Your Account!",
      success: false,
    });
  }
};
