/* Adds the initial data after the package is installed. */

const fs = require('fs');
const os = require('os');
const path = require('path');

let aa = './dist/es6.node/getHundredsOfNanosecondsSinceGregorianReform';
const time = require(aa).getHundredsOfNanosecondsSinceGregorianReform;

aa = './dist/es6.node/randomBytesGenerator';
const random = require(aa).randomBytesGenerator;

aa = './dist/es6.node/getMAC';
const getMAC = require(aa).getMAC;

aa = './dist/es6.node/binaryToHexDigits';
const binaryToHexDigits = require(aa).binaryToHexDigits;

aa = './dist/es6.node/TypeGuards/isFourteenBits';
const isFourteenBits = require(aa).isFourteenBits;

aa = './dist/es6.node/TypeGuards/isSixBytesInHex';
const isSixBytesInHex = require(aa).isSixBytesInHex;

aa = './dist/es6.node/TypeGuards/isSixtyBitsInHex';
const isSixtyBitsInHex = require(aa).isSixtyBitsInHex;


const homeDir = os.homedir();
const filePath = path.join(homeDir, 'ifid');
fs.stat(filePath, (err, stats) => {
  if (err === null && stats.isFile()) {
    getFilePromise((data) => {
      const lastResults = (() => {
        let obj;
        try {
          obj = JSON.parse(data);
        } catch (e) {
          makeNewRecordPromise(() => process.exit(0), () => process.exit(1));
        }

        if (typeof obj !== 'object' || !obj) {
          makeNewRecordPromise(() => process.exit(0), () => process.exit(1));
        } else {
          let changed = false;          
          if (!isSixBytesInHex(obj.nodeIdentifier)) {
            try {
              obj.nodeIdentifier = getMAC();
            } catch (e) {
              console.log(e, 'Using random number for node identifier.');
              obj.nodeIdentifier = binaryToHexDigits(random(6), 12);
            }
            
            changed = true;
          }

          if (!isFourteenBits(obj.clockSequence)) {
            /* Initialize clock sequence to random value. */
            obj.clockSequence = random(2).slice(0, 14);
            changed = true;
          }

          if (!isSixtyBitsInHex(obj.timestamp)) {
            obj.timestamp = getHundredsOfNanosecondsSinceGregorianReform()
              .toString(16).split('');
            changed = true;
          }

          if (changed) {
            const str = JSON.stringify(obj);
            const resolve = () => process.exit(0);
            const reject = () => process.exit(1);
            writeRecordPromise(str, resolve, reject).then(() => console.log('fooooob'));
          }
        }
        
      })();
    }, (err) => {
      process.exit(1);
    });
  } else {
    makeNewRecordPromise(() => process.exit(0), () => process.exit(1));
  }
});

function getFilePromise(resolve, reject) {
  return new Promise(() => {
    const encoding = 'utf8';
    fs.readFile(filePath, encoding, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function makeNewRecordPromise(resolve, reject) {
  const nodeIdentifier = getMAC();
  const clockSequence = random(2).slice(0, 14).split('');
  const timestamp = (() => {
    let timeStr = time().toString(16);
    for (let ii = timeStr.length; ii < 15; ii += 1) {
      timeStr = '0' + timeStr;
    }

    return timeStr.split('');
  })();

  const record = {
    nodeIdentifier,
    clockSequence,
    timestamp,
  };

  return writeRecordPromise(JSON.stringify(record), resolve, reject);
}

function writeRecordPromise(text, resolve, reject) {
  return new Promise(() => {
    fs.writeFile(filePath, text, (err) => {
      if (err) {
        reject();
      } else {
        resolve();
      }
    });
  });
}