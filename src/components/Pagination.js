import React from 'react'
import { View, Text,StyleSheet,TouchableOpacity,ScrollView,SafeAreaView } from 'react-native'
import globalStyle from '../styles/globalStyle';
import { PRIMARY_BUTTON_BG } from './../constants/colorConstant';

const Pagination = ({totalPages,setCurrentPage,currentPage}) => {
    var myloop = [];

    for (let i = 1; i <= totalPages; i++) {
        myloop.push(
            <TouchableOpacity key={i}
                style={{
                    backgroundColor:currentPage==i? PRIMARY_BUTTON_BG :'grey',
                    marginRight:10, 
                    padding:10, 
                    height:40, 
                    width:50, 
                    borderRadius:10,
                    alignItems:'center'
                }}
                onPress={()=>setCurrentPage(i)}
            >
                <Text style={[globalStyle.fontMedium, {color:'#FFF'}]}>{i}</Text>
            </TouchableOpacity>
        );
    }
    return(        
        <View style={{height: 70,justifyContent:'center'}}>
            <View style={{flexDirection:'row', paddingLeft:10,paddingRight:10}}>
                <ScrollView horizontal={true}>
                    {myloop}
                </ScrollView>                    
            </View>
        </View>
    )
};

export default Pagination
