import { View, Text, ScrollView, ImageBackground, Image, Dimensions } from 'react-native'
import React from 'react'

import Header from './../components/Header';
import globalStyle from '../styles/globalStyle';

import BackgroundImage from '../assets/background-full.png'

const {width} = Dimensions.get('window');

const MessageFromMd = ({navigation}) => {
  return (
    <View style={globalStyle.container}>
        <ImageBackground source={BackgroundImage} style={{flex:1}}>
            <Header navigation = {navigation} title = {'Message from CEO'}/>
            <ScrollView style={globalStyle.wrapper}>
                <View style={{marginVertical: 10, alignItems:'center'}}>
                    <View style={{height: width * 0.6, width: width * 0.6}}>
                        <Image style={{width:'100%', height:'100%', resizeMode:'cover', 
                        borderRadius: 20, borderWidth: 4, borderColor:'#DEA5CA'}} source={require('../assets/md.jpg')} />
                    </View>                    
                </View>
                <Text style={[globalStyle.fontMedium, {color:'#FFF', textAlign:'justify', marginVertical:10}]}>
                    Popular Life Insurance Company Ltd is a leading and prominent life insurance company in the country's insurance sector having all kinds of lucrative life insurance products and services. It is a third-generation life insurance company which was established by a group of renowned and enthusiastic business entrepreneurs of the country. The company was incorporated as a public limited company on September 26, 2000 under The Companies Act,1994 and commenced it’s journey in the same year. The company obtained the certificate of registration from the Chief Controller of Insurance, Department of Insurance on October 04,2000. Currently the company has been operating business as per legal framework of the revised Insurance Act, 2010 under the supervision of Insurance Development and Regulatory Authority (IDRA), Ministry of Finance. Popular Life Insurance Company Ltd (PLICL) started it’s operation with a paid-up capital of TK 30 million against an authorized capital of TK 250 million being sponsored by a group of individual linked to reputed business concern. Both authorized and paid-up capital have been enhanced to TK-5000 million and 604.28 million respectively as on 31st December, 2017. Eminent business personality Mr. Hasan Ahmed, CIP is the existing Chairman of the Board of Directors while management team consists of a group of professionals headed by a very promising and leading insurance professional Mr. B M Yousuf Ali, Managing Director and CEO. The company has been listed with Dhaka Stock exchange and Chittagong stock exchange on July 10, 2005 and the shares of the company are traded under "A" category in both stock exchange. The company has obtained credit rating "AA+" for long term and ST-1 rating for short term, based on the financial report up to December 31, 2018. As per financial statement of 2018, the company has earned Premium income TK-8,039.76 million where life fund stands Tk-17,871.49 million. Total assets of the company stands Tk-19,645.64 million and investment becomes Tk-13,398.14 million. Since inception to December, 2018 the company has paid various claims amounting TK-.41,504.68 million in favor of 2.99 million Policy holders. The company has built up a strong IT infrastructure to provide prompt service to the policy holders as well as to be aligned with recent approaches of the government towards a more digitalized and brighter future of the country. Company has established leading Position in County's insurance sector through paying highest dividend to his shareholder's and maximum policy bonuses to his policyholders since inception.
                </Text>
            </ScrollView>
        </ImageBackground>
    </View>
  )
}

export default MessageFromMd