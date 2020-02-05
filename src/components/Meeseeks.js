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
    this.public_key = null;

    this.getPublicKey();
  }
}

Meeseeks.prototype.getPublicKey = function() {
  let self = this;

  return new Promise(function(resolve, reject){

    if (self.public_key) {
      
      resolve(self.public_key);
    }

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

      self.public_key = data.public_key;
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

      if (!body) {
        reject("empty response body");
      }

      let data = null;
      
      try{
        data = JSON.parse(body)
      } catch(e) {
        reject(e);
        return;
      }
      
      if (data.error) {
        if (data.msg) {
          reject(data.msg);
        }

        reject(data.error);
      }

      if (data.access_token) {
        cookies.set("access_token", data.access_token);
      }

      if (data.refresh_token) {
        cookies.set("refresh_token", data.refresh_token);
      }
      
      resolve(data);
    });
  });
}

Meeseeks.prototype.validateToken = function(token) {

  let claims;
  let self = this;

  return this.getPublicKey().then(function() {

    // TODO: get key id and validate the signature with the correct key, once key rotation is implemented
    //let decoded = jwt.decode(token, {complete: true});
    //let kid = decoded.payload.kid;

    try {
      claims = jwt.verify(token, self.public_key, { algorithms: ['RS256']});
    } catch (e) {
      console.log(e)
      if (e.message === "jwt malformed") {
        return Promise.resolve();
      }
      return Promise.reject(e);
    }

    return Promise.resolve(claims);
  });
}

Meeseeks.prototype.hasActiveSession = function() {
  let access = cookies.get("access_token");

  if (access) {
    return this.validateToken(access)
  } else {
    return Promise.resolve();
  }
}

Meeseeks.prototype.login = function(username, password) {
  let self = this;
  let session = this.hasActiveSession();
  let refresh = cookies.get("refresh_token");

  if (!username || !password) {
    Promise.reject("missing username or password");
  }

  if (session && refresh) {
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

      if (!body) {
        reject("empty response body");
      }

      let data = null;
      
      try{
        data = JSON.parse(body)
      } catch(e) {
        reject(e);
        return;
      }

      if (data.error) {

        if (data.msg) {
          return reject(data.msg);
        }

        return reject(data.error);
      }

      if (data.access_token) {
        cookies.set("access_token", data.access_token);
      }

      if (data.refresh_token) {
        cookies.set("refresh_token", data.refresh_token);
      }
      
      resolve(data);
    });
  });
}

Meeseeks.prototype.logout = function() {
  cookies.remove("access_token");
  cookies.remove("refresh_token");
}

Meeseeks.prototype.refreshToken = function(refresh_token) {
  console.log("sending refresh token request")
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

      if (!body) {
        reject("empty response body");
      }
      
      let data = null;
      
      try{
        data = JSON.parse(body)
      } catch(e) {
        reject(e);
        return;
      }
      
      resolve(data);
    });
  });
}

Meeseeks.prototype.sendPasswordResetEmail = function(email) {
  let options = {
    url: this.host  + "user/password/reset/" + encodeURIComponent(email),
    method: "GET",
    headers: {
      'Authorization': 'Basic ' + btoa(this.client_id + ":" + this.client_secret),
    }
  };

  return new Promise(function(resolve, reject) {
    request(options, function(error, response, body) { 
      if (error) {
        reject(error);
      }

      if (body) {
        let data = null;
        
        try{
          data = JSON.parse(body)
        } catch(e) {
          reject(e);
          return;
        }

        if (data.error) {

          if (data.msg) {
            return reject(data.msg);
          }

          return reject(data.error);
        }
      }

      resolve();
    });
  });
}

Meeseeks.prototype.submitPasswordReset = function(code, password) {
  let options = {
    url: this.host  + "user/password/reset/",
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ' + btoa(this.client_id + ":" + this.client_secret)
    },
    body: JSON.stringify({
      "code": code,
      "password": password,
    })
  };

  return new Promise(function(resolve, reject) {
    request(options, function(error, response, body) { 
      if (error) {
        reject(error);
      }

      if (!body) {
        reject("empty response body");
      }

      let data = null;
      
      try{
        data = JSON.parse(body)
      } catch(e) {
        reject(e);
        return;
      }

      if (data.error) {

        if (data.msg) {
          return reject(data.msg);
        }

        return reject(data.error);
      }

      resolve();
    });
  });
}

Meeseeks.prototype.verifyEmail = function(code) {
  let options = {
    url: this.host  + "user/verify/" + code,
    method: "GET",
  };

  return new Promise(function(resolve, reject) {
    request(options, function(error, response, body) { 
      if (error) {
        reject(error);
      }

      if (body) {
        let data = null;
        
        try{
          data = JSON.parse(body)
        } catch(e) {
          reject(e);
          return;
        }

        if (data.error) {

          if (data.msg) {
            return reject(data.msg);
          }

          return reject(data.error);
        }
      }

      resolve();
    });
  });
}

Meeseeks.prototype.sendVerifyEmail = function(email) {

  let options = {
    url: this.host  + "user/verify/",
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
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

      if (body) {
        let data = null;
        
        try{
          data = JSON.parse(body)
        } catch(e) {
          reject(e);
          return;
        }

        if (data.error) {

          if (data.msg) {
            return reject(data.msg);
          }

          return reject(data.error);
        }
      }

      resolve();
    });
  });
}

const singleton = new Meeseeks();

export default singleton