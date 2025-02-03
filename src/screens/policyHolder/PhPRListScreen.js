import { View, Text, ScrollView, ImageBackground, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import globalStyle from '../../styles/globalStyle';
import BackgroundImage from '../../assets/BackgroundImage.png';
import Header from '../../components/Header';
import { getPrListByUser } from '../../actions/userActions';

const PhPRListScreen = ({ navigation, route }) => {
  const policyNo = route.params.policyNo;
  const [prList, setPrList] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      const response = await dispatch(getPrListByUser(policyNo));      
      if (response)
        setPrList(response);
    }
    fetchData();
  }, [])

  return (
    <View style={globalStyle.container}>
      <ImageBackground source={BackgroundImage} style={{ flex: 1 }}>
        <Header navigation={navigation} title={`PR List (${policyNo})`} />
          <View style={styles.rowWrapper}>
            <Text style={styles.rowLable}>PR No</Text>
            <Text style={styles.rowLable}>PR Date</Text>
            <Text style={styles.rowLable}>Amount</Text>
          </View>
        <ScrollView>
          <View style={globalStyle.wrapper}>
            <View style={{ marginVertical: 8 }}>
              

              {
                Object.keys(prList).map((key, index) => (
                  <View key={index}>
                    <View style={styles.rowWrapper}>
                      <Text style={styles.rowLable}>{key}</Text>
                      <Text style={styles.rowLable}></Text>
                      <Text style={styles.rowLable}></Text>
                    </View>
                    {
                      prList[key].pr.map((prItem, index) => (
                        <View style={styles.rowWrapper} key={index}>
                          <Text style={styles.rowValue}>{prItem.prno}</Text>
                          <Text style={styles.rowValue}>{prItem.prdate.format3}</Text>
                          <Text style={styles.rowValue}>{prItem.pramount}</Text>
                        </View>
                      ))
                    }
                    <View style={styles.rowWrapper}>
                      <Text style={styles.rowLable}></Text>
                      <Text style={styles.rowLable}></Text>
                      <Text style={[styles.rowLable, {borderTopWidth: 0.5}]}>{prList[key].total}</Text>
                    </View>

                    <View style={{ borderWidth: 0.5, marginHorizontal: 15, marginVertical: 8 }}></View>
                  </View>
                ))
              }

            </View>
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
  },
  rowLable: {
    flex: 1,
    textAlign: 'center',

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