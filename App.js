import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert, Switch } from 'react-native';
import { theme } from './color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fontisto } from '@expo/vector-icons'; 


const STORAGE_KEY = "@toDos"

export default function App() {

  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const [complete, setComplete] = useState(true);

  useEffect( () => {
    loadToDos()
    loadLast()
  }, []);



  const work = async () => {
    await setWorking(true);
  }

  const travel = async () => {
    await setWorking(false);
  }
  

  useEffect( () => {
    
    saveLast()
    }, [working])
  


const saveLast = async () => {
  try {
    await AsyncStorage.setItem('@last', JSON.stringify({working}))
  }
    catch (e) { }
}


const loadLast = async () => {
    
    try {
      const L = await AsyncStorage.getItem('@last')
      const A = JSON.parse(L);
      const B = Object.values(A)[0]
      setWorking(B)
  } 
  catch (e) {}
  }



  const onChangeText = (payload) => setText(payload);


  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY,JSON.stringify(toSave))
  }

  const loadToDos = async () => {    
    const s = await AsyncStorage.getItem(STORAGE_KEY)
    setToDos(JSON.parse(s))
  }


  const addTodo = async () => {
    if(text === ""){
      return
    } else {
      
    }
    const newToDos =  {...toDos, [Date.now()]:{text, working, complete}}
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

    const checkchange = (key) => {
      const newToDos = {...toDos}
      newToDos[key].complete = !(newToDos[key].complete)
      setToDos(newToDos)
      console.log(newToDos)
    }

    const changeData = (key) => {

    

    }


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
        toDos[key].working === working ? 
        
        <View style={styles.toDo} key={key} >
          <Text style={toDos[key].complete ? styles.toDoText : {...styles.toDoText,textDecorationLine: 'line-through', textDecorationStyle: 'solid', color:theme.grey}}>{toDos[key].text}</Text>
          
          <View style={styles.icon}>
          
          <TouchableOpacity style={styles.iconst} onPress={() => changeData(key)}>
            <Fontisto name="move-h-a" size={18} color={theme.grey} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.iconst} onPress={() => checkchange(key)}>
            {toDos[key].complete ? <Fontisto name="checkbox-passive" size={18} color={theme.grey} /> : <Fontisto name="checkbox-active" size={18} color={theme.grey} />}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.iconst} onPress={() => deleteToDo(key)}>
          <Fontisto name="trash" size={18} color={theme.grey} />
          </TouchableOpacity>
          </View>

        </View>
        
        : null
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

  },
  icon: {
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between"
  },
  iconst:{
    paddingLeft: 5,
  }
});
