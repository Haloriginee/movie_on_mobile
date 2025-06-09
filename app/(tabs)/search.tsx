import MovieCard from '@/components/MovieCard'
import SearchBar from '@/components/SearchBar'
import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import { fetchMovies } from "@/services/api"
import { updateSearchCount } from '@/services/appwrite'
import useFetch from '@/services/useFetch'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native'


const Search = () => {

  const [searchQuery, setsearchQuery] = useState('');

  const { data: movies,
          loading: moviesLoading,
          error: moviesError,
          refetch: moviesRefetch,
          reset,

  } = useFetch(() => fetchMovies({

      query: searchQuery

    }), false  ); // Set autoFetch to false to control when to fetch

  // Refetch movies when searchQuery changes
  useEffect(() => {

    const timoutId = setTimeout( async () => {

      if (searchQuery.trim()) {

        await moviesRefetch();

        if(movies?.lenght > 0 && movies?.[0]) // Check if movies array is not empty and has at least one movie
          await updateSearchCount(searchQuery, movies[0]); // Update search count for the first movie in results

      } else {

        reset(); // Reset if searchQuery is empty
      }
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timoutId); // Cleanup timeout on unmount or when searchQuery changes

  }, [searchQuery]);


  return (
    <View className='flex-1 bg-primary'>
      <Image source={images.bg} className='flex-1 absolute w-full z-0' resizeMode='cover' />

      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard {...item} /> }
        keyExtractor={(item) => item.id.toString()}
        className='px-5'
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: 'center',
          gap: 16,
          marginVertical: 16
        }}
        contentContainerStyle={{
          paddingBottom: 100,  // Add padding to the bottom
        }}
        ListHeaderComponent={

          <>
            <View className='w-full flex-row justify-center items-center mt-20'>
              <Image source={icons.logo} className='h-10 w-14' />
            </View>

            <View className='my-5'>
              <SearchBar
                placeholder='Search Movies...'
                value={searchQuery}
                onChangeText={(text: string) => setsearchQuery(text)}

              />
            </View>

            {moviesLoading && (
              <ActivityIndicator size="large" color="#0000ff" className='my-3'/>
            )}

            {moviesError && (

              <Text className='text-red-500 px-5 py-3'>
                Error: {moviesError.message}
              </Text>

            )}

            {!moviesLoading && !moviesError && searchQuery.trim() && movies?.length > 0 && (

              <Text className='text-xl text-white font-bold'>
                Search Results For {" "}
                <Text className='text-accent'>{searchQuery}</Text>
              </Text>

            )}

          </>
        }

        ListEmptyComponent={

          !moviesLoading && !moviesError ? (

            <View className='mt-10 px-5'>

              <Text className='text-center text-gray-500'>
                {searchQuery.trim() ?
                  "No results found " : 'Search for a movie'}
              </Text>

            </View>

          ) : null

        }

        />
    </View>
  )
}

export default Search
