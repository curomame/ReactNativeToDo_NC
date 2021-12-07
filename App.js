import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { theme } from './color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fontisto } from '@expo/vector-icons'; 


const STORAGE_KEY = "@toDos"
const last = "@working"

export default function App() {

  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});

  useEffect( () => {
    loadToDos();
    loadWhat();
  }, []);

  const travel = () => {
    setWorking(false);
  }
  
  const work = () => {
    setWorking(true);
  }
  
  const onChangeText = (payload) => setText(payload);

useEffect(() => {
  AsyncStorage.setItem(last,{working})
}, [working])

  // const saveWhat = async() => {
  //   await AsyncStorage.setItem(STORAGE_KEY,{working})
  //   }
  



  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY,JSON.stringify(toSave))
  }

  const loadToDos = async () => {    
    const s = await AsyncStorage.getItem(STORAGE_KEY)
    setToDos(JSON.parse(s))
  }

  const loadWhat = async () => {
    const w = await AsyncStorage.getItem(last)
    setWorking(w)
  }

  const addTodo = async () => {
    if(text === ""){
      return
    } else {
      
    }
    const newToDos =  {...toDos, [Date.now()]:{text, working}}
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
    
  }

    const deleteToDo = async (key) => {
      Alert.alert("Delete To Do?","Are you sure?",[
        {text:"Cancel"},
        {text:"I'm sure", onPress: async() => {
          const newToDos = {...toDos}
          delete newToDos[key]
          setToDos(newToDos);
          await saveToDos(newToDos);
        }}
      ])

      

    };



  return (
    <View style={styles.container}>
    
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color : working ? "white" : theme.grey}}>Work</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color : !working ? "white" : theme.grey}}>Travel</Text>
        </TouchableOpacity>

      </View>
    
        <TextInput
        onSubmitEditing={addTodo}
        onChangeText={onChangeText} 
        returnKeyType="done"
        value={text}
        returnKeyType='default' 
        placeholder={working ? "Add a To Do" : "Where do you want to go?"}  
        style={styles.input}/>

    <ScrollView>
      {Object.keys(toDos).map((key) => (
        toDos[key].working === working ? <View style={styles.toDo}key={key}>
          <Text style={styles.toDoText}>{toDos[key].text}</Text>
          <TouchableOpacity onPress={() => deleteToDo(key)}>
          <Fontisto name="trash" size={18} color={theme.grey} />
          </TouchableOpacity>

        </View> : null
        ))}
    </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal:20,
  },
  header :{
    justifyContent:"space-between",
    flexDirection:"row",
    marginTop: 100,
  },
  btnText : {
    fontSize:36,
    fontWeight:"500",
    
  },
  input:{
    backgroundColor: "white",
    paddingVertical:15,
    paddingHorizontal:20,
    borderRadius:15,
    marginTop:20,
    marginVertical:15,
    fontSize:16,
  },
  toDo:{
    backgroundColor : theme.toDoBg,
    marginBottom:10,
    paddingVertical:10,
    paddingHorizontal:20,
    borderRadius:15,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between"
  },
  toDoText: {
    color:"white",
    fontSize:14,
    fontWeight:"400",

  }
});
