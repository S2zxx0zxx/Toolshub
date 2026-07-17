const https = require('https');
const crypto = require('crypto');

function getHash(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      const hash = crypto.createHash('sha384');
      res.on('data', chunk => hash.update(chunk));
      res.on('end', () => resolve(`sha384-${hash.digest('base64')}`));
    });
  });
}

(async () => {
  console.log("qrcodejs:", await getHash('https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'));
  console.log("jspdf:", await getHash('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'));
  console.log("pdf-lib:", await getHash('https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js'));
})();
