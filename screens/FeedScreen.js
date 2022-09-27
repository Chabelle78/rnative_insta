import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet} from 'react-native';
import axios from 'axios';

export default function FeedScreen(){
    const [getPhotos, setGetPhotos] = useState([])
    const [isRefreshing, setIsRefreshing] = useState(false);

    const wait = (timeout) => {
      return new Promise(resolve => setTimeout(resolve, timeout));
  }
  
    const onRefresh = useCallback(() => {
          setIsRefreshing(true);
          wait(2000).then(() => setIsRefreshing(false));
          getPhotosFromApi()
          console.log("ca rafraichit bien la")
  }, []);
  

    function getPhotosFromApi(){
      (async ()=> {
        const files = await axios.get("https://wildstagram.nausicaa.wilders.dev/list")
        setGetPhotos(files.data)
    })();
    }

    useEffect(()=>{
      getPhotosFromApi()
  
    },[])

    return getPhotos.length > 0 ? (
        <>
        <FlatList
          data={getPhotos}
          keyExtractor={(serverImageURI) => serverImageURI}
          refreshing={isRefreshing} 
          onRefresh={onRefresh} 
          renderItem={(itemData) => {
            return (
              <>
                <Image
                  style={styles.image}
                  source={{
                    uri:
                      "https://wildstagram.nausicaa.wilders.dev/files/" +
                      itemData.item,
                  }}
                />
              </>
            );
          }}
        />
 
          </>

      ) : null;
    }

const styles = StyleSheet.create({
    image: {
      resizeMode: "contain",
      height: 500,
    },
  });
  