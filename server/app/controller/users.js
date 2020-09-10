const {google} = require('googleapis');

const {signToken} = require('./jwt');


// const signUp = (req) => {
//   return new Promise((resolve, reject) => {
//     const sequelize = req.app.get('models').app_db.sequelize;
//     req.app.get('models').app_db.user_directory.findOne({
//       where: sequelize.where(
//         sequelize.fn('lower', sequelize.col('email')),
//         sequelize.fn('lower', req.value.body.email)
//       )
//     }).then(foundUser => {
//       if (foundUser) {
//         reject({statusCode: 403, res: {msg: 'Email is already in use'}});
//       }
//       req.app.get('models').app_db.user_directory.create(req.value.body).then((newUser) => {
//         resolve({
//           statusCode: 200,
//           res: {msg: 'Created Successfully', token: signToken(req.app.get('SECRET_KEY'), 'email', newUser.user_id)}
//         });
//       });
//     }).catch(error => {
//       reject({statusCode: 400, res: {msg: error}})
//     });
//   });
// };


const signInOath2Url = (req) => {
  const oauth2Client = new google.auth.OAuth2(
    req.app.get('GOOGLE_OAUTH2_CLIENT_ID'),
    req.app.get('GOOGLE_OAUTH2_CLIENT_SECRET'),
    req.app.get('GOOGLE_OAUTH2_REDIRECT_URL')
  );
  const scopes = [
    'https://www.googleapis.com/auth/contacts',
    'https://www.googleapis.com/auth/userinfo.profile'
  ];
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });
};


const signIn = (req) => {
  return new Promise(async (resolve, reject) => {
    const oauth2Client = new google.auth.OAuth2(
      req.app.get('GOOGLE_OAUTH2_CLIENT_ID'),
      req.app.get('GOOGLE_OAUTH2_CLIENT_SECRET'),
      req.app.get('GOOGLE_OAUTH2_REDIRECT_URL')
    );
    try {
      const {tokens} = await oauth2Client.getToken(req.value.code);
      oauth2Client.setCredentials(tokens);
      const response = await google.people('v1').people.get({
        resourceName: 'people/me',
        personFields: 'names,photos,emailAddresses,phoneNumbers',
        auth: oauth2Client
      });
      const google_user_id = response.data.resourceName.split('/')[1];
      const existing_user = await req.app.get('models').app_db.user_directory.findOne({where: {google_user_id: google_user_id}});
      if (existing_user) {
        await req.app.get('models').app_db.user_directory.update(
          {
            display_name: response.data.names && response.data.names[0]['displayName'],
            email: response.data.emailAddresses && response.data.emailAddresses[0]['value'],
            phone: response.data.phoneNumbers && response.data.phoneNumbers[0]['value'],
            google_token: JSON.stringify(tokens),
            profile_picture: response.data.photos && response.data.photos[0]['url']
          },
          {where: {user_id: existing_user.user_id}}
        );
      } else {
        const new_user = await req.app.get('models').app_db.user_directory.create({
          google_user_id: google_user_id,
          display_name: response.data.names && response.data.names[0]['displayName'],
          email: response.data.emailAddresses && response.data.emailAddresses[0]['value'],
          phone: response.data.phoneNumbers && response.data.phoneNumbers[0]['value'],
          google_token: JSON.stringify(tokens),
          profile_picture: response.data.photos && response.data.photos[0]['url']
        });
      }
      resolve({
        statusCode: 200,
        res: signToken(req.app.get('SECRET_KEY'), 'google', google_user_id)
      });
    } catch (e) {
      reject(e);
    }
  });
};


const userInfo = (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = req.app.get('models').app_db.user_directory.findOne({where: {google_user_id: req.value.google_user_id}});
      if (!user)
        reject('No user found');
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
};


const contacts = (req) => {
  return new Promise( async (resolve, reject) => {
    const oauth2Client = new google.auth.OAuth2(
      req.app.get('GOOGLE_OAUTH2_CLIENT_ID'),
      req.app.get('GOOGLE_OAUTH2_CLIENT_SECRET'),
      req.app.get('GOOGLE_OAUTH2_REDIRECT_URL')
    );
    try {
      const tokens = JSON.parse(req.value.user.google_token);
      oauth2Client.setCredentials(tokens);
      const response = await google.people('v1').people.get({
        resourceName: 'people/me/connections',
        personFields: 'names,photos,emailAddresses,phoneNumbers',
        auth: oauth2Client
      });

      let userContacts = [];
      for (const user_contact of response.data.connections) {
        userContacts.push({
          key: user_contact.resourceName,
          contactDp: user_contact.photos && user_contact.photos[0].url,
          contactDisplayName: user_contact.names && user_contact.names[0].displayName,
          contactEmail: user_contact.emailAddresses && user_contact.emailAddresses[0].value,
          contactPhone: user_contact.phoneNumbers && user_contact.phoneNumbers[0].value,
        });
      }
      resolve({totalContacts: response.data.totalPeople, contacts: userContacts})
    } catch (e) {
      reject(e);
    }
  });
};


module.exports = {signInOath2Url, signIn, userInfo, contacts};