var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register',{'title':'Register'
  });
});

router.get('/login', function(req, res, next) {
  res.render('login',{'title':'Login'
  });
});

router.post('/register', function(req, res, next){
  // get form values
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;


  // checks for file info
  if(req.files.profileimage){
    console.log('uploading File...');

    // file info
    var originalName    = req.files.profileimage.originalname;
    var imageName       = req.files.profileimage.name;
    var imageMime       = req.files.profileimage.mimetype;
    var imagePath       = req.files.profileimage.path;
    var imageExt        = req.files.profileimage.extension;
    var imageSize       = req.files.profileimage.size;
  } else {
    // set default image
    var profileImageName = 'noimage.png';
  }

  // Form Validation
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email','Email not valid').isEmail();
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Password Confirmation does not match').equals(req.body.password);

  // Check for errors
  var errors = req.validationErrors();

  if(errors){
    res.render('register',{
      errors: errors,
      name: name,
      email: email,
      username: username,
      password: password,
      password2: password2

    });
  } else {
    var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password,
      profileimage: imageName
    });

    // Create User
    User.createUser(newUser, function(err, user){
      if(err) throw err;
      console.log(user);

    });
    req.flash('success', 'You are not registered and may log in');
    res.location('/');
    res.redirect('/');
  }
});

module.exports = router;
