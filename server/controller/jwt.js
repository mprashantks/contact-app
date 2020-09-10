const jwt = require('jsonwebtoken');


function signToken(secret_key, user_type, user_id) {
  return jwt.sign({
    iss: 'ContactsApp',
    sub_type: user_type,
    sub: user_id,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 1)
  }, secret_key)
}


module.exports = {signToken};
