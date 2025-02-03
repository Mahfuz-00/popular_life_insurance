import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, {useState,useEffect} from 'react';
import globalStyle from '../../styles/globalStyle'
import Header from './../../components/Header';
import { PRIMARY_BUTTON_BG } from './../../constants/colorConstant';
import { getPolicyListByUser } from './../../actions/userActions';

const PhPolicyListScreen = ({navigation}) => {
    const [policies, setPolicies] = useState([]);

    useEffect(() => {
        async function fetchData() {      
            const response = await getPolicyListByUser();
            if(response)
            setPolicies(response);
          }
          fetchData(); 
    }, []) 

  return (
    <View style={globalStyle.container}>
      <Header navigation = {navigation} title = {'Policy List'}/>
        <ScrollView style={globalStyle.wrapper}>

            {
                policies.map((policy, index)=>(
                    <TouchableOpacity
                        key={index}
                        onPress={()=>navigation.navigate('DashboardPh', {policyNo: policy})}
                        style={{marginVertical: 15, flexDirection:'row', alignItems:'center', borderRadius: 50, padding: 15, width:'100%', height: 100, backgroundColor: PRIMARY_BUTTON_BG }}>
                        <View 
                            style={{
                                width: 70,
                                height: 70,
                                borderRadius: 70 / 2,
                                overflow: "hidden",
                                borderWidth: 2,
                                borderColor: "#FFF",
                                justifyContent:'center',
                                alignItems:'center',
                                
                            }}
                        >                        
                            <Text style={[globalStyle.fontFjallaOne,{color:'#FFF', fontSize:24}]}>{index + 1}</Text>
                        </View>
                        <Text style={[globalStyle.fontMedium, {fontSize:18, color:'#FFF', marginHorizontal:15}]}>{policy}</Text>
                    </TouchableOpacity>
                ))
            }
            

            
        </ScrollView>
    </View>
  )
}

export default PhPolicyListScreen