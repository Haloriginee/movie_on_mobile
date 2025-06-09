// Track the searches made by the user

import { Client, Databases, Query } from 'react-native-appwrite';

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite endpoint
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!); // Your Appwrite project ID

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {

  // Check if a record for that search already exists
  // If it does, increment the searchCount field
  // if it doesn't, create a new document in Apprwrite database => 1

  // TODO: Implement the logic to update the search count here

  const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [

    Query.equal('searchTerm', query)

  ])

  console.log(result);

}
