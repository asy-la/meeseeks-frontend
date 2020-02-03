var request = require('request');
var jwt = require('jsonwebtoken');
var cookies = require('js-cookie');

const clientID = "5sXDKBw";
const clientSecret = "ODk4YzZmNDAtMmVmMS00NTA2LTgyZGUtOGZlMDhjMmY0YzczZThlYTgxNzEtMDYxYS00ZjVkLTk5YTctYjU3OGU0ZmQ0NjNi";

class Meeseeks {

  constructor() {
    this.client_id = clientID;
    this.client_secret = clientSecret;
    this.host = "http://localhost:8000/";
    this.public_key = this.getPublicKey();
  }
}

Meeseeks.prototype.getPublicKey = function() {
  let self = this;

  return new Promise(function(resolve, reject){
    request.get({url: self.host + '.well-known/jwks.json'}, function(error, response, body) {
      if (error) {
        reject(error);
        return;
      }
      
      let data;
      try {
        data = JSON.parse(body);
      } catch(e) {
        reject(e);
        return;
      }

      resolve(data.public_key);
    });
  });
}

Meeseeks.prototype.createUser = function(username, password, primaryEmail, secondaryEmail) {

  let user = {
    username: username,
    password: password,
    primaryEmail: primaryEmail,
  };

  if (secondaryEmail && Array.isArray(secondaryEmail) && this.secondaryEmail.length > 0) {
    user.secondaryEmail = secondaryEmail;
  }

  user.client_id = this.client_id;
  user.client_secret = this.client_secret;

  let options = {
    url: this.host  + "user/",
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  };

  return new Promise(function(resolve, reject) {
    request(options, function(error, response, body) { 

      if (error) {
        reject(error);
      }
      
      resolve(user);
    });
  });
}

Meeseeks.prototype.validateToken = function(token) {

  let claims;

  // TODO: get key id and validate the signature with the correct key
  //let decoded = jwt.decode(token, {complete: true});
  //let kid = decoded.payload.kid;

  try {
    claims = jwt.verify(token, this.public_key);
  } catch (e) {
    console.log('token invalid');
    console.log(e);
    return;
  }

  return claims;
}

Meeseeks.prototype.hasActiveSession = function() {
  let claims = null;
  let access = cookies.get("access_token");

  if (access) {
    claims = this.validateToken(access)
  }

  console.log("returning user claims", claims);

  return claims;
}

Meeseeks.prototype.login = function(username, password) {
  let self = this;
  let session = this.hasActiveSession();

  if (session) {
    let refresh = cookies.get("refresh_token");
    return this.refreshToken(refresh);
  }

  let options = {
    url: this.host  + "token",
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "grant_type": "password", 
      "client_id": self.client_id,
      "client_secret": self.client_secret, 
      username: username, 
      password: password
    })
  };

  return new Promise(function(resolve, reject) {
    request(options, function(error, response, body) { 
      if (error) {
        reject(error);
      }

      let data = JSON.parse(body);
      
      resolve(data);
    });
  });
}

Meeseeks.prototype.refreshToken = function(refresh_token) {
  let self = this;
  let options = {
    url: this.host  + "token",
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "grant_type": "refresh_token", 
      "client_id": self.client_id,
      "client_secret": self.client_secret, 
      "refresh_token": refresh_token
    })
  };

  return new Promise(function(resolve, reject) {
    request(options, function(error, response, body) { 
      if (error) {
        reject(error);
      }
      
      let data = JSON.parse(body)
      
      resolve(data);
    });
  });
}

Meeseeks.prototype.sendVerifyEmail = function(email) {

  let options = {
    url: this.host  + "user/verify/",
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "email": email
    })
  };

  return new Promise(function(resolve, reject) {
    request(options, function(error, response, body) { 
      if (error) {
        reject(error);
      }
      
      resolve();
    });
  });
}

const singleton = new Meeseeks();

export default singleton