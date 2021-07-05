const User = require("../../../models/user");

const Friendship = require("../../../models/friendship");

const jwt = require("jsonwebtoken");

const env = require("../../../config/environment");
const { FriendsList } = require("../../../../codeial-final-live/src/components/index.js");

module.exports.createSession = async function (req, res) {
  //Whenever a username and password is received, we need to find that user and generate JWT corresponding to that user

  try {
    let user = await User.findOne({ email: req.body.email });

    if (!user || user.password != req.body.password) {
      return res.json(422, {
        message: "Invalid username/password",
      });
    }

    return res.json(200, {
      message: "Sign In Successful, here is your token, plz keep it safe",

      data: {
        //user.JSON() part gets encrypted

        token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: "100000" }),
        user: user,
      },
      success: true,
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};

module.exports.signUp = async function (req, res) {
  try {
    if (req.body.password != req.body.confirm_password) {
      return res.json(422, {
        message: "Passwords donot match",
      });
    }

    User.findOne({ email: req.body.email }, function (err, user) {
      if (user) {
        return res.json(200, {
          message: "Sign Up Successful, here is your token, plz keep it safe",

          data: {
            //user.JSON() part gets encrypted

            token: jwt.sign(user.toJSON(), env.jwt_secret, {
              expiresIn: "100000",
            }),
            user,
          },
          success: true,
        });
      }

      if (!user) {
        let user = User.create(req.body, function (err, user) {
          if (err) {
            return res.json(500, {
              message: "Internal Server Error",
            });
          }

          // let userr = User.findOne({ email: req.body.email });

          return res.json(200, {
            message: "Sign Up Successful, here is your token, plz keep it safe",

            data: {
              //user.JSON() part gets encrypted

              token: jwt.sign(user.toJSON(), env.jwt_secret, {
                expiresIn: "100000",
              }),
              user,
            },
            success: true,
          });
        });
      } else {
        return res.json(500, {
          message: "Internal Server Error",
        });
      }
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};

module.exports.editProfile = async function (req, res) {
  if (req.body.password == req.body.confirm_password) {
    try {
      let user = await User.findById(req.body.id);

      user.name = req.body.name;
      user.password = req.body.password;

      user.save();

      return res.json(200, {
        message: "User is updated Successfully",

        data: {
          //user.JSON() part gets encrypted

          token: jwt.sign(user.toJSON(), env.jwt_secret, {
            expiresIn: "100000",
          }),
          user,
        },
        success: true,
      });
    } catch (err) {
      console.log(err);

      return res.json(500, {
        message: "Internal Server Error",
      });
    }
  } else {
    return res.json(422, {
      message: "Passwords donot match",
    });
  }
};

module.exports.profile = async function (req, res) {
  try {
    let user = await User.findById(req.params.userId);

    return res.json(200, {
      message: "The User Profile",

      data: {
        //user.JSON() part gets encrypted

        token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: "100000" }),
        user: user,
      },
      success: true,
    });
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};

module.exports.createFriendship = async function (req, res) {
  try {
    let user = await User.findOne({_id:req.body.id});
  

    if (user) {
      let friend = await Friendship.create({
        from_user: req.body.id,
        to_user: req.params.userId,
      });

      user.friendships.push(friend);

      user.save();

      toSend = []

      let i;
      check = user.friendships
      for (i=0; i<check.length; i++){

        let friendFinder = await Friendship.findOne({_id: check[i]})
        let friendToUser = friendFinder.to_user

        let userMapped = await User.findOne({_id: friendToUser})

        let toAdd = {_id: userMapped._id, email: userMapped.email, name: userMapped.name};

        toSend.push(toAdd)
      }

    
      return res.json(200, {
        message: "Friendship created successfully",

        data: {
          //user.JSON() part gets encrypted

          token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: "100000" }),
          friends: toSend,
        },
        success: true,
        
      });
    }else {
      return res.json(500, {
        message: "NHI BANA FRIEND",
      });
    }

  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};



module.exports.fetchFriends = async function (req, res) {
  try {
    let user = await User.findOne({_id:req.params.userId});

    toSend = []

    let i;
    check = user.friendships
    for (i=0; i<check.length; i++){

      let friendFinder = await Friendship.findOne({_id: check[i]})
      let friendToUser = friendFinder.to_user

      let userMapped = await User.findOne({_id: friendToUser})

      let toAdd = {_id: userMapped._id, email: userMapped.email, name: userMapped.name};

      toSend.push(toAdd)
    }

    return res.json(200, {
      message: "List of friends",

      data: {
        //user.JSON() part gets encrypted

        token: jwt.sign(user.toJSON(), env.jwt_secret, {
          expiresIn: "100000",
        }),
        
        friends: toSend
      },
      success: true,
    });
    
  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: "NHI MIL RAHA BRO",
    });
  }
};


module.exports.searchUser = async function (req, res){
  try{
    
    var regex = new RegExp(req.params.name,'i');

    let users = await User.find({name: regex})


    return res.json(200, {
      message: "The list of Searched Users",

      data: {
        //user.JSON() part gets encrypted

        //token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: "100000" }),
        users: users,
      },
      success: true,
    });

  }catch(err){

    console.log(err);

    return res.json(500, {
      message: "Internal Server Error",
    });
  }

}

module.exports.removeFriendship = async function (req, res) {
  try {
    let friendCheck = await Friendship.findOne({from_user:req.body.id, to_user:req.params.userId});
    let friendId = friendCheck._id;

    friendCheck.remove();

    let user = await User.findOne({_id:req.body.id})
  
    if (user) {
      
      user.friendships.pull(friendId);
      user.save();
      

      toSend = []

      let i;
      check = user.friendships
      for (i=0; i<check.length; i++){

        let friendFinder = await Friendship.findOne({_id: check[i]})
        let friendToUser = friendFinder.to_user

        let userMapped = await User.findOne({_id: friendToUser})

        let toAdd = {_id: userMapped._id, email: userMapped.email, name: userMapped.name};

        toSend.push(toAdd)
      }

    
      return res.json(200, {
        message: "Friendship created successfully",

        data: {
          //user.JSON() part gets encrypted

          token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: "100000" }),
          friends: toSend,
        },
        success: true,
        
      });
    }else {
      return res.json(500, {
        message: "NHI BANA FRIEND",
      });
    }

  } catch (err) {
    console.log(err);

    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};
