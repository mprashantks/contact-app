const jwt = require('jsonwebtoken');

const {userInfo} = require ('../controller/users');


function validateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token)
    return res.status(403).send({auth: false, message: 'No token provided.'});
  jwt.verify(token, req.app.get('SECRET_KEY'), function (err, decoded) {
    if (err)
      return res.status(500).send({auth: false, message: 'Failed to authenticate token.'});
    if (new Date().getTime() > decoded.exp)
      return res.status(500).send({auth: false, message: 'Token expired'});
    if (!req.value) req.value = {};
    req.value['google_user_id'] = decoded.sub;
    userInfo(req).then(user => {
      req.value['user'] = user;
      next();
    }).catch(error => {
      return res.status(500).send({auth: true, message: 'Couldn\'t get user information' })
    });
  });
}

module.exports = {validateToken};
