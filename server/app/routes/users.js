const express = require('express');

const {validateRequest, schemas} = require('../middlewares/validateRequest');
const {validateToken} = require('../middlewares/validateToken');
const UserController = require('../controller/users');

const users = express.Router();

// users.post('/signup', validateBody(schemas.signUpSchema), (req, res) => {
//   UserController.signUp(req).then(data => {
//     res.status(data.statusCode).json(data.res);
//   }).catch(error => {
//     res.status(error.statusCode).send(error.res)
//   });
// });

users.get('/signin/oauth2/creds', (req, res) => {
  res.status(200).json({
    clientId: req.app.get('GOOGLE_OAUTH2_CLIENT_ID'),
    scope: req.app.get('GOOGLE_OAUTH2_SCOPE')
  });
});

users.get('/signin/oauth2', validateRequest('GET', schemas.signInOauth2Schema), (req, res) => {
  UserController.signIn(req).then(data => {
    res.status(data.statusCode).json({data:data.res});
  }).catch(error => {
    res.status(400).send(error);
  });
});

users.get('/contacts', validateToken, (req, res) => {
  UserController.contacts(req).then(data => {
    let result = {...data};
    result['userDp'] = req.value.user.profile_picture;
    result['userDisplayName'] = req.value.user.display_name;
    result['userEmail'] = req.value.user.email;
    res.status(200).json(result);
  }).catch(error => {
    res.status(400).send(error);
  });
});

users.delete('/deleteContact', validateToken, validateRequest('DELETE', schemas.deleteContactSchema), (req, res) => {
  UserController.deleteContact(req).then(() => {
    res.status(200).json({message: 'Deleted'});
  }).catch(error => {
    res.status(400).send(error);
  });
});


module.exports = users;
