import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import React, {useEffect, useState} from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import globalStyle from '../styles/globalStyle'
import { PRIMARY_BUTTON_BG } from './../constants/colorConstant';
import Header from './../components/Header';
import { getOfficeInfo } from '../actions/commonServiceAction';

const Stack = createNativeStackNavigator();

function CompanyInfoScreen({navigation}) {
  return(
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="OfficeType" component={OfficeTypeScreen} />
        <Stack.Screen name="OfficeList" component={OfficeListScreen} />
      </Stack.Navigator>   
  );
}

const OfficeTypeScreen = ({navigation}) => {
  return (
    <View style={globalStyle.container}>
      <Header navigation = {navigation} title = {'Company Information'}/>
        <ScrollView style={globalStyle.wrapper}>
            <TouchableOpacity
                onPress={()=>navigation.navigate('OfficeList', {type: 'corporate'})}
                style={styles.button}>
                
                <Text style={[globalStyle.fontMedium, styles.buttonText]}>Corporate Office</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
                onPress={()=>navigation.navigate('OfficeList', {type: 'divisinal'})}
                style={styles.button}>
                
                <Text style={[globalStyle.fontMedium, styles.buttonText]}>Divisinal Offices</Text>
            </TouchableOpacity>

        </ScrollView>
    </View>
  )
}

const OfficeListScreen = ({navigation, route}) => {
  const type = route.params.type;

  const [offices, setOffices] = useState([]);

  useEffect(() => {
    async function fetchData() { 
      const response = await getOfficeInfo(type);        
      setOffices(response);
    }

    fetchData(); 
  }, []) 

  return (
    <View style={globalStyle.container}>
      <Header navigation = {navigation} title = {'Company Information'}/>
      <ScrollView style={globalStyle.wrapper}>
        <View style={{borderTopWidth:2, borderLeftWidth: 2, borderRightWidth: 2, borderColor:'#5382AC', marginVertical:15}}>
          {
            offices.map((office, index)=>(
              <View style={styles.rowWrapper} key={index}>
                  <Text style={styles.rowLable}>{office.name}</Text>
                  <Text style={styles.rowValue}>{office.address}</Text>
              </View>
            ))
          }
        </View>

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  
  button: {
    marginVertical: 15, 
    flexDirection:'row', 
    alignItems:'center', 
    borderRadius: 50, 
    padding: 15, 
    width:'100%', 
    height: 100, 
    backgroundColor: PRIMARY_BUTTON_BG ,
    justifyContent:'center'
  },
  buttonText:{
    fontSize:18, color:'#FFF', marginHorizontal:15
  },
  rowWrapper:{
    flexDirection:'row', 
    flexWrap:'wrap', 
    borderBottomWidth:2, 
    borderColor:'#5382AC',
    alignItems:'center'
},
rowLable:{
    flex:1, 
    textAlign:'center', 
    borderColor:'#5382AC',
    paddingVertical: 5,
    paddingHorizontal: 5,
    fontFamily: globalStyle.fontMedium.fontFamily,
    color:'#000'
},
rowValue:{
    flex:1, textAlign:'center',
    paddingVertical: 5,
    paddingHorizontal: 5,
    fontFamily: globalStyle.fontMedium.fontFamily,
    color:'#000'
}
});

export default CompanyInfoScreen