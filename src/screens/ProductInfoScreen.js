import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import iconProducer from '../assets/icon-producer.png';
import globalStyle from '../styles/globalStyle';
import Header from './../components/Header';

const {height} = Dimensions.get('window');
const productData = [
  {
    "ProductName": "Hajj Bima Plan",
    "ProductImage": require('../assets/products/1.png'),
    "ProductDetailsUri": "https://www.popularlifeins.com/images/test/BYEeEGao6o8i.jpg"
  },
  {
    "ProductName": "Assurance cum Pension and Medical Benefit plan",
    "ProductImage": require('../assets/products/2.png'),
    "ProductDetailsUri": "https://www.popularlifeins.com/images/test/V8m6XtdA4FCc.jpg"
  },
  {
    "ProductName": "DPS",
    "ProductImage": require('../assets/products/3.png'),
    "ProductDetailsUri": "https://www.popularlifeins.com/images/test/k5EYFolEtQ2A.jpg"
  },
  {
    "ProductName": "Child-Protection-Assurance-Plan",
    "ProductImage": require('../assets/products/4.png'),
    "ProductDetailsUri": "https://www.popularlifeins.com/images/test/wJLJ7xi4oqjt.jpg"
  },
  {
    "ProductName": "Double Payment Single Premium Policy",
    "ProductImage": require('../assets/products/5.png'),
    "ProductDetailsUri": "https://www.popularlifeins.com/images/test/CcUgzK3Syzvh.png"
  },
  {
    "ProductName": "Education Expense Assurance Plan",
    "ProductImage": require('../assets/products/6.png'),
    "ProductDetailsUri": "https://www.popularlifeins.com/images/test/vN3DumS0m320.jpg"
  },
  {
    "ProductName": "Child-Scholarship-Assurance-Plan",
    "ProductImage": require('../assets/products/7.png'),
    "ProductDetailsUri": "https://www.popularlifeins.com/images/test/wJrWyGUkeY4f.png"
  },
  {
    "ProductName": "Endowment Assurance Plan",
    "ProductImage": require('../assets/products/8.png'),
    "ProductDetailsUri": "https://www.popularlifeins.com/images/test/MrcD4R3eiBjU.jpg"
  },
  {
    "ProductName": "Five-Payment-Endowment-Assurance-Plan",
    "ProductImage": require('../assets/products/9.png'),
    "ProductDetailsUri": "https://www.popularlifeins.com/images/test/wr8iDPmkq98d.jpg"
  },
  {
    "ProductName": "Four-Payment-Endowment-Assurance-Plan",
    "ProductImage": require('../assets/products/10.png'),
    "ProductDetailsUri": "https://www.popularlifeins.com/images/test/jt2PJ3XhSyll.jpg"
  },
  {
    "ProductName": "Mohorana-Bima-Plan",
    "ProductImage": require('../assets/products/11.png'),
    "ProductDetailsUri": "https://www.popularlifeins.com/images/test/HdSiTc0f2Xfz.jpg"
  },
  {
    "ProductName": "Money-Back-Term-Assurance-Plan",
    "ProductImage": require('../assets/products/12.png'),
    "ProductDetailsUri": "https://www.popularlifeins.com/images/test/xCF1tOliGRtd.jpg"
  },
  {
    "ProductName": "Single-Payment-Endowment-Assurance-Plan",
    "ProductImage": require('../assets/products/13.png'),
    "ProductDetailsUri": "https://www.popularlifeins.com/images/test/NflKDIzINziV.jpg"
  },
  {
    "ProductName": "Three-Payment-Endowment-Assurance-Plan",
    "ProductImage": require('../assets/products/14.png'),
    "ProductDetailsUri": "https://www.popularlifeins.com/images/test/7DldaN2f07iR.jpg"
  },
  {
    "ProductName": "Bi-Ennial",
    "ProductImage": require('../assets/products/15.png'),
    "ProductDetailsUri": "https://www.popularlifeins.com/images/test/4RA7YE5EfAAQ.jpg"
  },

];

const Stack = createNativeStackNavigator();

function ProductInfoScreen({navigation}) {
  return(
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Products" component={Products} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} />
      </Stack.Navigator>   
  );
}

const Products = ({navigation}) => {
  const [products, setProducts] = React.useState(productData);  

  React.useEffect(() => {
    
  }, [])

  return (
    <View style={globalStyle.container}>
      <Header navigation = {navigation} title = {'Product Info'}/>
      <ScrollView style={globalStyle.wrapper}>   
        <View style={styles.container}>
          {
            productData.map((item, index) => (
              <TouchableOpacity key={index} style={styles.productCard}
                onPress={()=>navigation.navigate('ProductDetails', {
                  productDetailsUri : item.ProductDetailsUri
                })}
              >
                <View style={styles.productImgWrapper}>
                  <Image style={styles.productImg} source={item.ProductImage} />
                </View>

                <Text style={[globalStyle.font, styles.productTitle]}>{item.ProductName}</Text>
              </TouchableOpacity>
            ))
          }
        </View>
        
      </ScrollView>
    </View>
  )
}

const ProductDetails = ({ navigation, route }) => {
  const productDetailsUri = route.params.productDetailsUri;

  return(
    <ScrollView style={[globalStyle.container, {marginVertical: 5}]}>
      <Image source={{uri: productDetailsUri}} resizeMode='contain'
          style={{height:height, width:'100%', overflow:'visible'}} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal:20,
    paddingVertical:10,
    flexDirection:'row',
    flexWrap:'wrap',
    justifyContent:'space-between'
  },
  productCard:{ 
    height:230,
    width:'48%',
    borderRadius:8,
    marginVertical:10,
    
    alignItems:'center',
  },
  productImgWrapper:{
    height:'80%',
    width:'100%'
  },
  productImg:{
    height:'100%',
    width:'100%',
    borderRadius: 15
  },
  productNumber:{
    color:'#fff',
    fontWeight:'bold',
    marginTop:10,
  },
  productTitle:{
    color:'#000',
    textAlign:'center',
    overflow:'hidden',
    marginTop: 5
  }
});

export default ProductInfoScreen