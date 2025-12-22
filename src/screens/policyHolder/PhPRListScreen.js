import { View, Text, ScrollView, ImageBackground, StyleSheet, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import globalStyle from '../../styles/globalStyle';
import BackgroundImage from '../../assets/BackgroundImage.png';
import Header from '../../components/Header';
import { getPrListByUser } from '../../actions/userActions';
import { SHOW_LOADING, HIDE_LOADING } from '../../store/constants/commonConstants';

const PhPRListScreen = ({ navigation, route }) => {
  const policyNo = route.params.policyNo;
  const [prList, setPrList] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      dispatch({ type: SHOW_LOADING, payload: `Loading PR List for ${policyNo}...` });
      setIsLoadingData(true);
      try {
        const response = await dispatch(getPrListByUser(policyNo));
        if (response) {
          setPrList(response);
        } else {
            setPrList({});
        }
      } catch (error) {
        console.error('Failed to fetch PR list:', error);
        setPrList({});
      } finally {
        dispatch({ type: HIDE_LOADING });
        setIsLoadingData(false); 
      }
    }
    fetchData();
  }, [])

  return (
    <View style={globalStyle.container}>
      <ImageBackground source={BackgroundImage} style={{ flex: 1 }}>
        <Header navigation={navigation} title={`PR List (${policyNo})`} />
          <View style={styles.rowWrapper}>
            <Text style={[styles.rowLable, globalStyle.tableText]}>PR No</Text>
            <Text style={[styles.rowLable, globalStyle.tableText]}>PR Date</Text>
            <Text style={[styles.rowLable, globalStyle.tableText]}>Amount</Text>
          </View>
        <ScrollView>
          <View style={globalStyle.wrapper}>
            <View style={{ marginVertical: 8 }}>
              

              {
                Object.keys(prList).map((key, index) => (
                  <View key={index}>
                    <View style={styles.rowWrapper}>
                      <Text style={[styles.rowLable, globalStyle.tableText]}>{key}</Text>
                      <Text style={[styles.rowLable, globalStyle.tableText]}></Text>
                      <Text style={[styles.rowLable, globalStyle.tableText]}></Text>
                    </View>
                    {
                      prList[key].pr.map((prItem, index) => (
                        <View style={styles.rowWrapper} key={index}>
                          <Text style={[styles.rowValue, globalStyle.tableText]}>{prItem.prno}</Text>
                          <Text style={[styles.rowValue, globalStyle.tableText]}>{prItem.prdate.format3}</Text>
                          <Text style={[styles.rowValue, globalStyle.tableText]}>{prItem.pramount}</Text>
                        </View>
                      ))
                    }
                    <View style={styles.rowWrapper}>
                      <Text style={[styles.rowLable, globalStyle.tableText]}></Text>
                      <Text style={[styles.rowLable, globalStyle.tableText]}></Text>
                      <Text style={[styles.rowLable, globalStyle.tableText, {borderTopWidth: 0.5}]}>{prList[key].total}</Text>
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