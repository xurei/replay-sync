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
  var tid = (req.query || { tid: 'unknown' }).tid || 'unknown';
  
  dynamoDb.putItem({
    TableName: 'rpz-synchro-tracker',
    Item: {
      timestamp: {
        "S": ""+new Date().getTime(),
      },
      tid: {
        "S": tid
      }
    },
  }, (err, data) => {
    res.json({});
  });
}
