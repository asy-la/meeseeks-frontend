var request = require('request');
var jwt = require('jsonwebtoken');
var cookies = require('js-cookie');

function meeseeksRequest(options) {
  return new Promise(function(resolve, reject) {
    request(options, function(error, response, body) { 
      if (error) {
        console.error(error)
        return reject("Network connection error");
      }

      if (!body) {
        console.error("missing response body");
        return reject("Service error");
      }

      let data = null;
      
      try{
        data = JSON.parse(body)
      } catch(e) {
        console.error(e);
        return reject("Service error");
      }

      if (data.error) {
        console.error(data);

        if (data.msg) {
          return reject(data.msg);
        }
        return reject(data.error);
      }

      return resolve(data);
    });
  });
}

class Meeseeks {
  constructor() {
    this.client_id = "5sXDKBw";
    this.client_secret = "ODk4YzZmNDAtMmVmMS00NTA2LTgyZGUtOGZlMDhjMmY0YzczZThlYTgxNzEtMDYxYS00ZjVkLTk5YTctYjU3OGU0ZmQ0NjNi";
    this.host = "http://localhost:8000/";
    this.public_key = null;
  }
}

/**
 * fetches the meeseeks auth service public key data for token validation
 */
Meeseeks.prototype.getPublicKey = function(id) {
  let self = this;
  let cache = null;

  if (localStorage) {
    cache = JSON.parse(localStorage.getItem("asyla_public_key"));
  }

  if (!self.public_key && cache) {
    self.public_key = cache;
  }

  if (self.public_key && self.public_key[id]) {
    return Promise.resolve(self.public_key[id]);
  }

  let options = {
    method: 'GET',
    url: self.host + '.well-known/jwks.json'
  }

  return meeseeksRequest(options).then(function(result) {
    self.public_key = result;

    if (localStorage) {
      localStorage.setItem("asyla_public_key", JSON.stringify(self.public_key));
    }
  });
}

/**
 * validates an asyla token and returns a promise. the promise resolves either an empty object if the token is 
 * no longer valid, or the token claims if the token is valid. in the event of an error fetching the public key
 * to validate the token then it will reject the promise.
 */
Meeseeks.prototype.validateToken = function(token) {

  let claims;
  let self = this;

  if (!token) {
    return Promise.resolve();
  }

  return new Promise(function(resolve, reject) {

    let decoded = jwt.decode(token);
    console.log(decoded)

    let kid = decoded.kid

    if (!kid) {
      reject("Invalid token")
    }
  
    self.getPublicKey(kid).then(function() {

      // TODO: get key id and validate the signature with the correct key, once key rotation is implemented
      //let decoded = jwt.decode(token, {complete: true});
      //let kid = decoded.payload.kid;

      if (!self.public_key[kid]) {
        reject("Error fetching public key")
      }

      let pubkey = self.public_key[kid];

      try {
        claims = jwt.verify(token, pubkey, { algorithms: ['RS256']});
      } catch (e) {
        return resolve();
      }

      return resolve(claims);

    }).catch(function(err) {
      reject(err);
    });
  });
}

Meeseeks.prototype.createUser = function(username, password, primaryEmail, secondaryEmail) {

  if (!username || !password || !primaryEmail) {
    return Promise.reject("Missing user data")
  }

  let self = this;
  let user = {
    client_id: this.client_id,
    client_secret: this.client_secret,
    username: username,
    password: password,
    primaryEmail: primaryEmail,
  };

  if (secondaryEmail && Array.isArray(secondaryEmail) && this.secondaryEmail.length > 0) {
    user.secondaryEmail = secondaryEmail;
  }

  let options = {
    url: this.host  + "user/",
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  };

  return new Promise(function(resolve, reject) {
    meeseeksRequest(options).then(function(result) {

      if (result.access_token) {
        cookies.set("access_token", result.access_token);
      }

      if (result.refresh_token) {
        cookies.set("refresh_token", result.refresh_token);
      }

      return self.validateToken(result.access_token);
    }).then(function(result) {
      
      resolve(result);

    }).catch(function(err) {
      reject(err);
    });
  });
}

/**
 * attempts to see if a user is active by checking the cookies for an access token and a refresh token. if an access token is found it will validate 
 * the token. if the access token is valid then the claims will be returned. if the access token is not valid then it will attempt to fetch a new one 
 * if a refresh token is available. if a refresh attempt is successful then the token claims will be returned  
 */
Meeseeks.prototype.hasActiveSession = function() {
  let access = cookies.get("access_token");
  let refresh = cookies.get("refresh_token");
  let self = this;

  if (!access && !refresh) {
    Promise.resolve();
  }

  return this.validateToken(access).then(function(result) {
    if (!result && refresh) {
      return self.refreshToken(refresh);
    }
    
    return Promise.resolve(result);

  }).catch(function(err) {
    return Promise.reject(err);
  });
}

Meeseeks.prototype.login = function(username, password) {
  let self = this;

  if (!username || !password) {
    return Promise.reject("missing username or password");
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
    meeseeksRequest(options).then(function(result) {
      if (result.access_token) {
        cookies.set("access_token", result.access_token);
      }

      if (result.refresh_token) {
        cookies.set("refresh_token", result.refresh_token);
      }

      return self.validateToken(result.access_token);
    }).then(function(claims) {
      resolve(claims);
    }).catch(function(err) {
      reject(err)
    });
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
    meeseeksRequest(options).then(function(result) {
      if (result.access_token) {
        cookies.set("access_token", result.access_token);
      }

      if (result.refresh_token) {
        cookies.set("refresh_token", result.refresh_token);
      }

      return self.validateToken(result.access_token);
    }).then(function(claims) {
      resolve(claims);
    }).catch(function(err) {
      reject(err)
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

  return meeseeksRequest(options);
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

  return meeseeksRequest(options);
}

Meeseeks.prototype.verifyEmail = function(code) {
  let options = {
    url: this.host  + "user/verify/" + code,
    method: "GET",
  };

  return meeseeksRequest(options);
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

  return meeseeksRequest(options);
}

const singleton = new Meeseeks();

export default singleton