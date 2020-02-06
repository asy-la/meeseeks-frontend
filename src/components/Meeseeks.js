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
  }
}

Meeseeks.prototype.getPublicKey = function() {
  let self = this;

  return new Promise(function(resolve, reject){

    let cache = null;

    if (localStorage) {
      cache = localStorage.getItem("me_public_key");
    }

    if (!self.public_key && cache) {
      self.public_key = cache;
    }

    if (self.public_key) {
      return resolve(self.public_key);
    }

    request.get({url: self.host + '.well-known/jwks.json'}, function(error, response, body) {
      if (error) {
        return reject(error.toString());
      }
      
      let data;

      try {
        data = JSON.parse(body);
      } catch(e) {
        return reject(e.toString());
      }

      if (data.public_key) {
        self.public_key = data.public_key;

        if (localStorage) {
          localStorage.setItem("me_public_key", self.public_key);
        }

        return resolve(data.public_key);
      } else {
        return reject("failed to fetch public key")
      }
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
      return Promise.resolve();
    }

    return Promise.resolve(claims);

  }).catch(function(e) {

    Promise.reject(e.toString());
  });
}

Meeseeks.prototype.createUser = function(username, password, primaryEmail, secondaryEmail) {

  let self = this;
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
        return reject(error);
      }

      if (!body) {
        return reject("empty response body");
      }

      let data = null;
      
      try{
        data = JSON.parse(body)
      } catch(e) {
        return reject(e.toString());
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
      
      self.validateToken(data.access_token).then(function(result) {
        return resolve(result);
      });
    });
  });
}

Meeseeks.prototype.hasActiveSession = function() {
  let access = cookies.get("access_token");
  let refresh = cookies.get("refresh_token");
  let self = this;

  if (access) {
    return this.validateToken(access).then(function(result) {

      if (!result && refresh) {
        return self.refreshToken(refresh);
      } else {
        return Promise.resolve(result);
      }
    }).catch(function(err) {
      return Promise.reject(err.toString());
    })
  } else {
    return Promise.resolve();
  }
}

Meeseeks.prototype.login = function(username, password) {
  let self = this;
  let session = this.hasActiveSession();
  let refresh = cookies.get("refresh_token");

  if (!username || !password) {
    return Promise.reject("missing username or password");
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
        if (error.message) {
          return reject(error.message);
        }

        return reject(error.toString());
      }

      if (!body) {
        return reject("empty response body");
      }

      let data = null;
      
      try{
        data = JSON.parse(body)
      } catch(e) {
        return reject(e.toString());
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
      
      self.validateToken(data.access_token).then(function(result) {
        return resolve(result);
      });
    })
  });
}

Meeseeks.prototype.logout = function() {
  cookies.remove("access_token");
  cookies.remove("refresh_token");
  if (window) {
    window.location.reload();
  }
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
        return reject(error.toString());
      }

      if (!body) {
        return reject("empty response body");
      }
      
      let data = null;
      
      try{
        data = JSON.parse(body)
      } catch(e) {
        return reject(e.toString());
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
      
      self.validateToken(data.access_token).then(function(result) {
        return resolve(result);
      });
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
        return reject(error.toString());
      }

      if (body) {
        let data = null;
        
        try{
          data = JSON.parse(body)
        } catch(e) {
          return reject(e.toString());
        }

        if (data.error) {

          if (data.msg) {
            return reject(data.msg);
          }

          return reject(data.error);
        }
      }

      return resolve();
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
        return reject(error.toString());
      }

      if (!body) {
        return reject("empty response body");
      }

      let data = null;
      
      try{
        data = JSON.parse(body)
      } catch(e) {
        return reject(e.toString());
      }

      if (data.error) {

        if (data.msg) {
          return reject(data.msg);
        }

        return reject(data.error);
      }

      return resolve();
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
        return reject(error.toString());
      }

      if (body) {
        let data = null;
        
        try{
          data = JSON.parse(body)
        } catch(e) {
          return reject(e.toString());
        }

        if (data.error) {

          if (data.msg) {
            return reject(data.msg);
          }

          return reject(data.error);
        }
      }

      return resolve();
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
        return reject(error.toString());
      }

      if (body) {
        let data = null;
        
        try{
          data = JSON.parse(body)
        } catch(e) {
          return reject(e.toString());
        }

        if (data.error) {

          if (data.msg) {
            return reject(data.msg);
          }

          return reject(data.error);
        }
      }

      return resolve();
    });
  });
}

const singleton = new Meeseeks();

export default singleton