var DynamoDB = require('aws-sdk').DynamoDB;

const dynamoDb = new DynamoDB({
  apiVersion: '2012-08-10',
  credentials: {
    accessKeyId: process.env.CONFIG_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.CONFIG_AWS_SECRET_KEY,
  },
  region: process.env.CONFIG_AWS_REGION,
});

module.exports = (req, res) => {
  var id = (req.query || { id: null }).id;
  //TODO Find a way to invalidate the cache if vercel/lambdas allows it
  res.setHeader('cache-control', 'public, max-age=600');
  
  //TODO remove this line after dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (!id) {
    res.statusCode = 404;
    res.end();
  }
  else {
    dynamoDb.getItem({
      TableName: 'replay-sync-config',
      Key: {
        id: {
          "S": id
        }
      },
    }, (err, data) => {
      if (err) {
        //TODO Send error to me or sentry or whatever
        res.statusCode = 500;
        res.end();
      }
      else {
        //TODO Integrity check
        console.log(data);
        res.json(JSON.parse(data.Item.config.S));
      }
    });
  }
}
