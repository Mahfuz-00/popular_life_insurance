import { View, Text, TouchableOpacity, Image, Dimensions} from 'react-native'
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

import logo from '../assets/icon-producer.png';
import iconDrawerToggle from '../assets/icon-drawer-toggle.png';
import { COMPANY_LOGO, COMPANY_NAME } from './../config';
import globalStyle from '../styles/globalStyle';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const Header = ({navigation, title}) => {
    const showTitleCard = title && title.trim() !== '';

    const companyNameFontSize = SCREEN_WIDTH < 380 ? 17 : 20;

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
                alignItems: 'center',
                justifyContent:'space-between', 
                paddingHorizontal:20,
                // paddingTop:15
            }}
        >
            {/* <View style={{height:50, width:50}}>
                <Image source={COMPANY_LOGO} style={{width:'100%', height:'100%',resizeMode:'contain'}} />
            </View> */}

            {/* <TouchableOpacity style={{marginTop:10}} onPress={()=>navigation.toggleDrawer()}>
                <Image source={iconDrawerToggle} style={{width:25, height:25}} />
            </TouchableOpacity> */}

                {/* LEFT: Logo */}
                <Image
                source={COMPANY_LOGO}
                style={{ width: 50, height: 50, resizeMode: 'contain' }}
                />

                {/* CENTER: Company Name (Takes Full Middle Space) */}
                <View style={{ position: 'absolute', left: 0, right: 0, alignItems: 'center' }}>
                <Text style={[
                    globalStyle.fontFjallaOne, 
                    {fontSize: companyNameFontSize,}]}
                    numberOfLines={1}
                    adjustsFontSizeToFit={false}
                    >
                    {COMPANY_NAME}
                </Text>
                </View>

                {/* RIGHT: Drawer Toggle */}
                <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
                <Image
                    source={iconDrawerToggle}
                    style={{ width: 28, height: 28 }}
                />
                </TouchableOpacity>
            </View>       
       
       {/* WHITE TITLE CARD — ONLY SHOW IF TITLE EXISTS */}
        {showTitleCard && (
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
        )}
    </View>
  )
}

export default Header