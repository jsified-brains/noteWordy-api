import { APP_CONSTANTS } from '../../config/app_constants';
import getResponse from '../../utils/responseUtils';
import * as AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient({
    'region': 'us-east-1'
});

export async function main(event , context, callback){
    const requestData = JSON.parse(event.body);
        
    const params = {
        TableName: APP_CONSTANTS.WORDS_TABLE,
        Key: {
            wordId: event.pathParameters.id,
            userId: event.requestContext.identity.cognitoIdentityId
        },
        UpdateExpression: 'set word = :word, meaning = :meaning, example = :example, comments = :comments',
        ExpressionAttributeValues: {
            ':word': requestData.word || null,
            ':meaning': requestData.meaning || null,
            ':example': requestData.example || null,
            ':comments': requestData.comments || null
        }
    };

    try {
        const result = await dynamoDb.update(params).promise();
        const response = getResponse(200, {result} );
        callback(null, response);
    } catch (error) {
        const errResponse = getResponse(500, {status: false});
        callback(errResponse, null);
    }
}
