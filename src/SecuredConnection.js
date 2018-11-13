import crypto from 'crypto-browserify';
import events from 'events';
import keypair from 'keypair';

const algorithm = 'aes-256-cbc';
const encryptWithAES256CBC = (key, plaintext) => {
  let iv = Buffer.alloc(16);
  iv = Buffer.from(Array.prototype.map.call(iv, () => { return Math.floor(Math.random() * 256) }));
  let cipher = crypto.createCipheriv(algorithm, key, iv);
  let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
  ciphertext += cipher.final('hex');
  return { ciphertext, iv: iv.toString('hex') };
}

const decryptWithAES256CBC = (key, hexIV, ciphertext) => {
  let iv = Buffer.from(hexIV, 'hex')
  let decipher = crypto.createDecipheriv(algorithm, key, iv);
  let plaintext = decipher.update(ciphertext, 'hex', 'utf8');
  plaintext += decipher.final('utf8');
  return plaintext;
}

const encryptWithRSA = (publicKey, data) => {
  return crypto.publicEncrypt(publicKey, data);
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
    let res;
    this.setState(State.CONNECTING);
    res = await fetch(this.host, {
      method: 'post',
      mode: "cors", 
      headers: {
          "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({ type: 'handshake' })
    }).then(res => res.json());

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
    const dh = crypto.getDiffieHellman('modp5');
    const dhKey = dh.generateKeys();

    const dhKeyCiphertext = encryptWithRSA(publicKey, dhKey).toString('hex');

    res = await fetch(this.host, {
      method: 'post',
      mode: "cors", 
      headers: {
          "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({ type: 'diffie-hellman', clientKey: dhKeyCiphertext })
    }).then(res => res.json());
    this.session_id = res.session_id;
    const serverKey = Buffer.from(res.serverKey, 'hex');
    const dhSessionKey = dh.computeSecret(serverKey);

    // hash session key (1024 bits) -> (256 bits)
    const hash = crypto.createHash('sha256');
    hash.update(dhSessionKey);
    this.session_key = hash.digest();

    this.setState(State.CONNECTED);
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
    const dataString = JSON.stringify(data);
    const encrypted = encryptWithAES256CBC(this.session_key, dataString);
    return fetch(this.host + '/' + endpoint, {
      method: 'post',
      mode: "cors", 
      headers: {
          "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        session_id: this.session_id,
        data: encrypted
      })
    }).then(res => res.json())
      .then(res => {
        const { data } = res;
        if(data){
         const { ciphertext, iv } = data;
         const plaintext = decryptWithAES256CBC(this.session_key, iv, ciphertext);
         return JSON.parse(plaintext);
        }else{
          throw new Error('Cannot find response data...');
        }
      })
      .then(res => {console.log(res)});
  }
}

SecuredConnection.State = State;

export default SecuredConnection;