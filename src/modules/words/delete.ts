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
            userId: event.requestContext.identity.cognitoIdentityId,
            wordId: event.pathParameters.id
        }
    };

    try {
        const data = await dynamoDb.delete(params).promise();
        const response = getResponse(200, {status: true} );
        callback(null, response);
    } catch (error) {
        const errResponse = getResponse(500, {status: false, body: JSON.stringify(error)});
        callback(null, errResponse);
    }
}
