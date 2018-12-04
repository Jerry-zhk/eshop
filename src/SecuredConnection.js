import crypto from 'crypto-browserify';
import events from 'events';

const cipher_algorithm = 'aes-256-cbc';
const encryptWithAES256CBC = (key, plaintext) => {
  let iv = Buffer.alloc(16);
  iv = Buffer.from(Array.prototype.map.call(iv, () => { return Math.floor(Math.random() * 256) }));
  let cipher = crypto.createCipheriv(cipher_algorithm, key, iv);
  let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
  ciphertext += cipher.final('hex');
  return { ciphertext, iv: iv.toString('hex') };
}

const decryptWithAES256CBC = (key, hexIV, ciphertext) => {
  let iv = Buffer.from(hexIV, 'hex')
  let decipher = crypto.createDecipheriv(cipher_algorithm, key, iv);
  let plaintext = decipher.update(ciphertext, 'hex', 'utf8');
  plaintext += decipher.final('utf8');
  return plaintext;
}

const encryptWithRSA = (publicKey, data) => {
  return crypto.publicEncrypt(publicKey, data);
}

const SHA256 = (data) => {
  var hash = crypto.createHash('sha256');
  hash.update(data);
  return hash.digest();
}

const hmac_algorithm = 'sha256';
const HMAC = (key, data) => {
  const hmac = crypto.createHmac(hmac_algorithm, key);
  hmac.update(data);
  return hmac.digest('hex');
}

const State = {
  IDLE: 0,
  CONNECTING: 1,
  CONNECTED: 2
};

class SecuredConnection {

  constructor(host) {
    this.host = host;
    this.state = State.IDLE;
    this.eventEmitter = new events.EventEmitter();
  }

  async start() {
    try {


      let res;
      this.setState(State.CONNECTING);
      res = await fetch(this.host, {
        method: 'post',
        mode: "cors",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({ type: 'handshake' })
      }).then(res => {
        console.log(res)
        return res.json()
      });

      // RSA public key from server
      const publicKey = res.publicKey;

      // // Client AES keys
      // var aesKey = crypto.randomBytes(32);
      // console.log(aesKey)

      // // Client RSA keys
      // var rsaKeys = keypair({bit: 512});
      // var buffer = Buffer.from(rsaKeys.public);
      // console.log('hi',buffer); 

      // Diffie Hellman
      const cipher_dh = crypto.getDiffieHellman('modp5');
      const cipher_dhKey = cipher_dh.generateKeys();

      const hmac_dh = crypto.getDiffieHellman('modp5');
      const hmac_dhKey = hmac_dh.generateKeys();

      const cipher_dhKeyCiphertext = encryptWithRSA(publicKey, cipher_dhKey).toString('hex');
      const hmac_dhKeyCiphertext = encryptWithRSA(publicKey, hmac_dhKey).toString('hex');

      res = await fetch(this.host, {
        method: 'post',
        mode: "cors",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({ type: 'diffie-hellman', cipher_clientKey: cipher_dhKeyCiphertext, hmac_clientKey: hmac_dhKeyCiphertext })
      }).then(res => {
        console.log(res)
        return res.json()
      });
      this.session_id = res.session_id;
      // server dh key for cipher
      const cipherServerKey = Buffer.from(res.cipherKey, 'hex');
      const cipherKey = cipher_dh.computeSecret(cipherServerKey);
      // server dh for hmac
      const hmacServerKey = Buffer.from(res.hmacKey, 'hex');
      const hmacKey = hmac_dh.computeSecret(hmacServerKey);


      // hash session key (1024 bits) -> (256 bits)
      this.cipher_key = SHA256(cipherKey);
      this.hmac_key = SHA256(hmacKey);

      const cipherKey_hmac = HMAC(this.cipher_key, cipherServerKey.toString('hex'));
      if (cipherKey_hmac !== res.cipherKey_hmac) {
        console.log('not valid hmac cipherkey');
        return;
      }

      const hmacKey_hmac = HMAC(this.hmac_key, hmacServerKey.toString('hex'));
      if (hmacKey_hmac !== res.hmacKey_hmac) {
        console.log('not valid hmac hmacKey_hmac');
        return;
      }

      this.setState(State.CONNECTED);
    } catch (e) {
      console.error(e)
    }
  }

  setState(state) {
    this.state = state;
    this.eventEmitter.emit('stateChange');
  }

  onStateChange(callback) {
    this.eventEmitter.on('stateChange', () => {
      callback(this.state);
    });
  }

  fetch(endpoint, data) {
    let body = {
      session_id: this.session_id,
    }
    if (data) {
      const dataString = JSON.stringify(data);
      var hmac = HMAC(this.hmac_key, dataString);
      var dataWithHMAC = JSON.stringify({ data: dataString, hmac: hmac });
      const encrypted = encryptWithAES256CBC(this.cipher_key, dataWithHMAC);
      body.data = encrypted;
    }
    return fetch(this.host + endpoint, {
      method: 'post',
      mode: "cors",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(body)
    }).then(res => res.json())
      .then(res => {
        const { data } = res;
        if (data) {
          const { ciphertext, iv } = data;
          const plaintext = decryptWithAES256CBC(this.cipher_key, iv, ciphertext);
          const dataWithHMAC = JSON.parse(plaintext);
          const hmacComputed = HMAC(this.hmac_key, dataWithHMAC.data)
          if (dataWithHMAC.hmac !== hmacComputed) {
            // HMAC verification failed, data was changed
            throw new Error('HMAC does not match data...');
          }
          return JSON.parse(dataWithHMAC.data);
        } else {
          throw new Error('Cannot find response data...');
        }
      });
  }
}

SecuredConnection.State = State;

export default SecuredConnection;