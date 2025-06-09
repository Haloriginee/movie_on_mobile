// Track the searches made by the user

import { Client, Databases, ID, Query } from 'react-native-appwrite';

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

  try {

    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [

      Query.equal('searchTerm', query)

    ])

    if(result.documents.length > 0) {

      const existingMovie = result.documents[0];

      await database.updateDocument(

        DATABASE_ID,
        COLLECTION_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        }
      )
    } else {

      await database.createDocument(

        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          searchTerm: query,
          movieId: movie.id,
          count: 1,
          poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          title: movie.title,
        }
      );
    }

  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {

  try {

     const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [

      Query.limit(5),
      Query.orderDesc('count'),

    ])

    return result.documents as unknown as TrendingMovie[];

  } catch (error) {

    console.log(error);
    return undefined;

  }

}
