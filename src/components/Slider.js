import { Text, View, Image, ScrollView, Dimensions, StyleSheet } from 'react-native'
import React, { Component } from 'react';

const {width} = Dimensions.get('window');
const height = width * 0.4;

import s1 from '../assets/s1.jpg';
import s2 from '../assets/s2.jpg';
import logo from '../assets/logo.png';
// import slide1 from '../assets/slide1.jpeg';
// import slide3 from '../assets/slide3.jpeg';

const images = [
    logo
]

export class Slider extends Component {
    state = {
        active: 0
    }

    change = ({nativeEvent}) => {
        const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width)

        if(slide !== this.state.active){
            this.setState({active: slide});
        }
    }
  render() {
    return (
      <View style={{marginTop: 5}}>
        <ScrollView 
        onScroll={this.change}
            horizontal showsHorizontalScrollIndicator={false} pagingEnabled style={{height, width}}>
        {
            images.map((item, index)=>(
                <Image 
                    key={index}
                    source={item}
                    style={{width, height, resizeMode:'contain'}}
                />
            ))
        }
        </ScrollView>
        <View style={{flexDirection: 'row', position:'absolute', bottom:0, alignSelf:'center'}}>
            {
                images.map((i, k)=>(
                    <Text key={k}
                        style={ k == this.state.active ? styles.activePagingText : styles.pagingText}
                    >⬤</Text>
                ))
            }
           
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    pagingText: {
        color:'#888', 
        margin:3
   },
   activePagingText:{
    color:'#FFF',
    margin: 3
   }
   
  })

export default Slider