import { View, Text, ScrollView, ImageBackground, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import globalStyle from '../../styles/globalStyle';
import BackgroundImage from '../../assets/BackgroundImage.png';
import Header from '../../components/Header';
import { getPrListByUser } from '../../actions/userActions';

const PhPRListScreen = ({ navigation, route }) => {
  const policyNo = route.params.policyNo;
  const [prList, setPrList] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await getPrListByUser(policyNo);
      console.log(response);
      if (response)
        setPrList(response);
    }
    fetchData();
  }, [])

  return (
    <View style={globalStyle.container}>
      <ImageBackground source={BackgroundImage} style={{ flex: 1 }}>
        <Header navigation={navigation} title={'PR List'} />
        <ScrollView>
          <View style={globalStyle.wrapper}>
            {
              prList.map((pr, index) => (
                <View key={index} style={{ borderTopWidth: 2, borderLeftWidth: 2, borderRightWidth: 2, borderColor: '#5382AC', marginVertical: 15 }}>
                  
                  <View style={styles.rowWrapper}>
                    <Text style={styles.rowLable}>Policy No</Text>
                    <Text style={styles.rowValue}>{policyNo}</Text>
                  </View>
                  
                  <View style={styles.rowWrapper}>
                    <Text style={styles.rowLable}>PR No</Text>
                    <Text style={styles.rowValue}>{pr.prno}</Text>
                  </View>
                  
                  <View style={styles.rowWrapper}>
                    <Text style={styles.rowLable}>PR Amount</Text>
                    <Text style={styles.rowValue}>{pr.pramount}</Text>
                  </View>
                  
                  <View style={styles.rowWrapper}>
                    <Text style={styles.rowLable}>PR Type</Text>
                    <Text style={styles.rowValue}>{pr.type}</Text>
                  </View>
                  
                  <View style={styles.rowWrapper}>
                    <Text style={styles.rowLable}>PR Date</Text>
                    <Text style={styles.rowValue}>{pr.prdate.format3}</Text>
                  </View>

                </View>
              ))
            }


          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  rowWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderBottomWidth: 2,
    borderColor: '#5382AC',
  },
  rowLable: {
    flex: 1,
    textAlign: 'center',
    borderRightWidth: 2,
    borderColor: '#5382AC',
    paddingVertical: 5,
    paddingHorizontal: 5,
    fontFamily: globalStyle.fontMedium.fontFamily,
    color: '#000'
  },
  rowValue: {
    flex: 1, textAlign: 'center',
    paddingVertical: 5,
    paddingHorizontal: 5,
    fontFamily: globalStyle.fontMedium.fontFamily,
    color: '#000'
  }
})
export default PhPRListScreen