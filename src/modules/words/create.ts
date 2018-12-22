import uuid from "uuid";
import { APP_CONSTANTS } from '../../config/app_constants';
import * as AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient({
    'region': 'us-east-1'
});

export async function main(event, context, callback) {
    const requestData = JSON.parse(event.body);    
    const params = {
        TableName: APP_CONSTANTS.WORDS_TABLE,
        Item: {
            wordId: uuid.v1(),
            userId: event.requestContext.identity.cognitoIdentityId,
            createdAt: Date.now(),
            ...requestData 
        }
    };

    try {
        await dynamoDb.put(params).promise();
        const response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify(params.Item)
        };
        callback(null, response);
    } catch (err) {
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify(err)
        };
    }  
}
