Create Self Signed Development Certificates

## Install
```
npm install -g mkcert
```

## CLI

### Create Certificate Authority
```
$ mkcert create-ca --help

  Usage: create-ca [options]

  Options:
    --organization [value]  Organization name (default: "Test CA")
    --country-code [value]  Country code (default: "US")
    --state [value]         State name (default: "California")
    --locality [value]      Locality address (default: "San Francisco")
    --validity [days]       Validity in days (default: 365)
    --key [file]            Output key (default: "ca.key")
    --cert [file]           Output certificate (default: "ca.crt")
    -h, --help              output usage information
```

### Create Certificate

```
$ mkcert create-cert --help

  Usage: create-cert [options]

  Options:
    --ca-key [file]       CA private key (default: "ca.key")
    --ca-cert [file]      CA certificate (default: "ca.crt")
    --validity [days]     Validity in days (default: 365)
    --key [file]          Output key (default: "cert.key")
    --cert [file]         Output certificate (default: "cert.crt")
    --addresses [values]  Comma separated list of domains/ip addresses (default: "localhost,127.0.0.1")
    -h, --help            output usage information
```

## API
```js
import * as mkcert from 'mkcert';

//Create Certificate Authority
mkcert.createCA({
  organization: 'Hello CA',
  countryCode: 'NP',
  state: 'Bagmati',
  locality: 'Kathmandu',
  validityDays: 365
})
.then((ca)=> {
  console.log(ca.key, ca.cert);

  //Create Certificate
  mkcert.createSSL({
    addresses: ['127.0.0.1', 'localhost'],
    validityDays: 365,
    caKey: ca.key,
    caCert: ca.cert
  })
  .then((cert)=> {
    console.log(cert.key, cert.cert);
    //Create a full chain certificate by merging CA and SSL certificates
    const fullChain = [ cert.cert, ca.cert ].join('\n');
    console.log(fullChain);
  })
  .catch(err=> console.error(err));

})
.catch(err=> console.error(err));
```