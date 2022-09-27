import * as FileSystem from "expo-file-system";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Image, FlatList, Button, Alert } from "react-native";
import singleFileUploader from "single-file-uploader";
import Constants from "expo-constants";

export default function ImagesScreen() {
  const [imagesURI, setImagesURI] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

  const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        wait(2000).then(() => setIsRefreshing(false));
        readImageIntoDirectory()
        console.log("ca rafraichit bien la")
}, []);

  function readImageIntoDirectory (){
    (async () => {
      const images = await FileSystem.readDirectoryAsync(
        FileSystem.cacheDirectory + "ImageManipulator"
      );
      setImagesURI(images);
    })();
  }

  useEffect(() => {
    readImageIntoDirectory()

  }, []);

  async function deleteImage (item){
    try {
        const fileUri = ( FileSystem.cacheDirectory +
            "ImageManipulator/" +
            item);
       await FileSystem.deleteAsync(fileUri)
        Alert.alert('Delete Image', `This picture ${item} has been deleted`)

        readImageIntoDirectory()
      
    } catch (error) {
        alert(error)
    }
}

  return imagesURI.length > 0 ? (
    <FlatList
      data={imagesURI}
      keyExtractor={(imageURI) => imageURI}
      refreshing={isRefreshing} 
      onRefresh={onRefresh} 
      renderItem={(itemData) => {
        return (<>
          <Image
            style={styles.image}
            source={{
              uri:
                FileSystem.cacheDirectory + "ImageManipulator/" + itemData.item,
            }}
          />
          <Button 
          title="Upload" 
          onPress={ async () => {
            try {
             await singleFileUploader({
                    distantUrl:
                      "https://wildstagram.nausicaa.wilders.dev/upload",
                    expectedStatusCode: 201,
                    filename: itemData.item,
                    filetype: "image/jpeg",
                    formDataName: "fileData",
                    localUri:
                      FileSystem.cacheDirectory +
                      "ImageManipulator/" +
                      itemData.item,
                    token: Constants.manifest.extra.token,
                  });
                  Alert.alert('Uploaded')
            } catch (error) {
                alert(error)
            }
          }}/>
           <Button 
                color="red"
                title="Delete" 
                onPress={()=> deleteImage(itemData.item)}/>
          </>
        );
      }}
    />
  ) : null;
}

const styles = StyleSheet.create({
  image: {
    resizeMode: "cover",
    height: 500,
  },
  
});
