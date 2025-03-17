import {View, Text, TouchableOpacity, Image, Dimensions} from 'react-native';
import React from 'react';
var {width, height} = Dimensions.get('window');

import globalStyle from '../styles/globalStyle';

const MenuComponent = ({icon, title, ...props}) => {
  return (
    <TouchableOpacity
      style={{
        height: height * 0.15,
        width: '32%',
        backgroundColor: 'white',
        alignItems: 'center',
        marginVertical: 20,
      }}
      {...props}>
      {/* <View style={{ height:'75%', width:'75%', marginBottom:5, marginTop:5, borderRadius: 15, backgroundColor:'#fff'}}>
                
            </View> */}
      <Image
        source={icon}
        style={{
          height: '80%',
          width: '80%',
          marginBottom: 5,
          borderRadius: 15,
          backgroundColor: '#fff',
        }}
      />

      <Text style={[globalStyle.font, {textAlign: 'center'}]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default MenuComponent;
