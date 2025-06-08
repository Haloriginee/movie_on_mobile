import MovieCard from '@/components/MovieCard'
import SearchBar from '@/components/SearchBar'
import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import { fetchMovies } from "@/services/api"
import useFetch from '@/services/useFetch'
import { useRouter } from 'expo-router'
import React from 'react'
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native'


const Search = () => {

   const router = useRouter();

  const { data: movies,
          loading: moviesLoading,
          error: moviesError,

  } = useFetch(() => fetchMovies({

      query: ''

    }))

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
          marginVertical: 10
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
              <SearchBar placeholder='Search Movies...' />
            </View>

            {moviesLoading && (
              <ActivityIndicator size="large" color="0000ff" className='my-3'/>
            )}

            {moviesError && (

              <Text className='text-red-500 px-5 py-3'>
                Error: {moviesError.message}
              </Text>

            )}

            {!moviesLoading && !moviesError && "SEARCH TERM".trim() && movies?.length > 0 && (

              <Text className='text-xl text-white font-bold'>
                Search Results For {" "}
                <Text className='text-accent'>SEARCH TERM</Text>
              </Text>

            )}

          </>

        }

        />
    </View>
  )
}

export default Search
