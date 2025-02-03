import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

import logo from '../assets/icon-producer.png';
import iconDrawerToggle from '../assets/icon-drawer-toggle.png';
import { COMPANY_LOGO } from './../config';
import globalStyle from '../styles/globalStyle';

const Header = ({navigation, title}) => {
  return (
    <View 
        style={{
            
            width:'100%', 
            height:100,
            marginBottom: 30,
            alignItems:'center',
        }}
    >
        <View
            style={{
                borderBottomLeftRadius:50,
                borderBottomRightRadius:50,
                width:'100%', 
                height:100, 
                backgroundColor:'#966EAF', 
                flexDirection:'row', 
                justifyContent:'space-between', 
                paddingHorizontal:20,
                paddingTop:15
            }}
        >
            <View style={{height:50, width:50}}>
                <Image source={COMPANY_LOGO} style={{width:'100%', height:'100%',resizeMode:'contain'}} />
            </View>

            <TouchableOpacity style={{marginTop:10}} onPress={()=>navigation.toggleDrawer()}>
                <Image source={iconDrawerToggle} style={{width:25, height:25}} />
            </TouchableOpacity>
        </View>       

        <View
            style={{
                backgroundColor:'#FFF',
                borderRadius: 15,
                alignItems:'center',
                padding:10,
                width:'90%',
                marginTop: -20,
                shadowColor: '#000',
                shadowOffset: { width: 1, height: 1 },
                shadowOpacity:  0.4,
                shadowRadius: 3,
                elevation: 5,
            }}
        >
            <Text  style={[globalStyle.fontFjallaOne, {fontSize: 18}]}>{title}</Text>
        </View>
    </View>
  )
}

export default Header