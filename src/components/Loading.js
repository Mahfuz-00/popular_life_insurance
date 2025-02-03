import React,{useContext} from 'react';
import {View, StyleSheet, ActivityIndicator, Text} from 'react-native';
import { useSelector } from 'react-redux';

const Loading =()=> {
  
  const { loading } = useSelector(state => state.loading);

  return (
    
    <View>
      {
        loading && 
        <View style={styles.overlay}>
          <View style={styles.container}>
            <ActivityIndicator color={'black'} />
            <Text style={styles.text}>Loading...</Text>
          </View>
        </View>
      }
      
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    height:'100%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 20,
    borderRadius: 8,
  },
  text: {
    marginLeft: 16,
    fontSize: 18,
    fontWeight: '500',
  }
});


export default Loading;