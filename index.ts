import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();
const env = functions.config();


/***
 * These must be updated in your environment
 * ALGOLIA_APP_ID 
 * ALGOLIA_API_KEY
 * ALGOLIA_INDEX_NAME
 * FIREBASE_DATABASE_URL
 ***/


const algoliasearch = require('algoliasearch');
const client = algoliasearch(env.algolia.appid, env.algolia.apikey);
const courseIndex = client.initIndex('dogs');



/***
 * When a dog is added to your firebase Cloud Firestore database, 
 * this cloud function will automatically duplicate that object
 * in the algolia database.
 ***/

exports.indexCourse = functions.firestore.document('dogs/{dogID}').onCreate((snap, context) => {
    const data = snap.data();
    const objectID = snap.id;

    return courseIndex.saveObject({
        objectID,
        ...data
    });

});


/***
 * When a dog is DELETED from your firebase Cloud Firestore database, 
 * this cloud function will automatically delete that object
 * from the algolia database.
 ***/
exports.unindexCourse = functions.firestore.document('dogs/{dogID}').onDelete((snap, context) => {
    const objectID = snap.id;

    return courseIndex.deleteObjects([objectID]);
});


