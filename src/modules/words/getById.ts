import { APP_CONSTANTS } from '../../config/app_constants';
import getResponse from '../../utils/responseUtils';
import * as AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient({
    'region': 'us-east-1'
});

export async function main(event, context, callback) {        
    const params = {
        TableName: APP_CONSTANTS.WORDS_TABLE,
        Key: {
            wordId: event.pathParameters.id,
            userId: event.requestContext.identity.cognitoIdentityId
        }
    };

    try {
        const data = await dynamoDb.get(params).promise();
        
        if (data.Item) {
            const response = getResponse(200, data.Item);
            callback(null, response);
        } else {
            throw new Error('Item not found');
        }
    } catch (error) {
        const errResponse = getResponse(500, error);
        callback(errResponse, null);
    }
}
