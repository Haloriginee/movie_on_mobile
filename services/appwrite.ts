import { Client, Databases, ID, Query } from "react-native-appwrite";

// track the searches made by the user

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite endpoint
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!); // Your Appwrite project ID

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {

  try {

  // check if a record of that search already exists
  // if it does, increment the searchConunt field
  // if it does not, create a new document in Appwrite database with searchCount set to 1

  const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
    Query.equal('searchTerm', query)

  ]);

  console.log(result);

  if(result.documents.length > 0) {
    const existingMovie = result.documents[0];

    await database.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      existingMovie.$id,
      {
        count: existingMovie.searchCount + 1
      }
    )
  } else {

      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movieId: movie.id,
        title: movie.title,
        count: 1,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.log(error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};
