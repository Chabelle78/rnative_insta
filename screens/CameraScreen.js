import React, { useState, useEffect, useRef } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { Camera, CameraType } from "expo-camera";
import * as ImageManipulator from 'expo-image-manipulator';

export default function CameraScreen(){
    const [hasPermission, setHasPermission] = useState(null);
    const cameraRef = useRef(null)
    const [type, setType]= useState(CameraType.back)

   async function getPicture(){
    (async()=>{
        const {status} = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
    })();

    }

useEffect(()=>{
    getPicture();
   
},[])

async function onPressed(){
    const pictureMetadata = await cameraRef.current.takePictureAsync();
    console.log("pictureMetadata", pictureMetadata);
    console.log(await ImageManipulator.manipulateAsync(pictureMetadata.uri,[
        {resize:{width:800}}
    ]))
}

function toggleCameraType() {
    setType((current) => (
      current === CameraType.back ? CameraType.front : CameraType.back
    ));
  }

if (hasPermission === null){ return <View />}
if (hasPermission === false){ return <Text>No access to camera</Text>}


    return (<>
            <Camera style={styles.camera} ref={cameraRef} type={type}/>
            <Button title="Flip Camera" onPress={()=>toggleCameraType()}/>
            <Button title="Take a picture" onPress={()=>onPressed()}/>
            </>
        )
}

const styles = StyleSheet.create({
    camera:{
        flex:1
    }
})