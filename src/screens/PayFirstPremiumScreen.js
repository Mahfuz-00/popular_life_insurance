/* eslint-disable prettier/prettier */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Alert,
} from 'react-native';
import moment from 'moment';
import globalStyle from '../styles/globalStyle';
import {Input} from './../components/Input';
import {FilledButton} from './../components/FilledButton';
import {PickerComponent} from './../components/PickerComponent';
import Header from './../components/Header';
import BackgroundImage from '../assets/BackgroundImage.png';

const PayFirstPremiumScreen = ({navigation}) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [code, setCode] = useState('');
  const [nid, setNid] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [totalPremium, setTotalPremium] = useState('');
  const [servicingCell, setServicingCell] = useState('');
  const [agentMobile, setAgentMobile] = useState('');
  const [fa, setFa] = useState('');
  const [um, setUm] = useState('');
  const [bm, setBm] = useState('');
  const [agm, setAgm] = useState('');
  const currentDate = moment().format('YYYY-MM-DD');

  useEffect(() => {
    // Dummy API Call to Fetch Projects
    const fetchProjects = async () => {
      const response = [
        {label: 'Project A', value: 'A', code: '123'},
        {label: 'Project B', value: 'B', code: '456'},
      ];
      setProjects(response);
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      const project = projects.find(p => p.value === selectedProject);
      setCode(project ? project.code : '');
    }
  }, [selectedProject]);

  // Show alert when the page loads
  useEffect(() => {
    Alert.alert(
      'Service Update',
      'The service is coming soon!',
      [{text: 'OK', onPress: () => {}}],
      {cancelable: false}, // Makes sure the user must acknowledge the alert
    );
  }, []);

  const handleSubmit = () => {
    navigation.navigate('PayfirstPremiumGateways', {
      project: selectedProject,
      code,
      nid,
      date: currentDate,
      name,
      mobile,
      totalPremium,
      servicingCell,
      agentMobile,
      fa,
      um,
      bm,
      agm,
    });
  };

  return (
    <View style={globalStyle.container}>
      <ImageBackground source={BackgroundImage} style={{flex: 1}}>
        <Header navigation={navigation} title={'Pay First Premium'} />
        <ScrollView style={[globalStyle.wrapper, {margin: 10}]}>
          <PickerComponent
            items={projects}
            value={selectedProject}
            setValue={setSelectedProject}
            label={'Project'}
            placeholder={'Select a project'}
            required
          />
          <Input label={'Code'} value={code} editable={false} />
          <Input label={'NID'} value={nid} onChangeText={setNid} required />
          <Input label={'Date'} value={currentDate} editable={false} />
          <Input label={'Name'} value={name} onChangeText={setName} required />
          <Input
            label={'Mobile No.'}
            value={mobile}
            onChangeText={setMobile}
            required
          />
          <Input
            label={'Total Premium'}
            value={totalPremium}
            onChangeText={setTotalPremium}
            required
          />
          <Input
            label={'Servicing Cell Name'}
            value={servicingCell}
            onChangeText={setServicingCell}
            required
          />
          <Input
            label={'Agent Mobile'}
            value={agentMobile}
            onChangeText={setAgentMobile}
            required
          />
          <Text style={styles.sectionTitle}>Code Setup</Text>
          <Input label={'FA'} value={fa} onChangeText={setFa} required />
          <Input label={'UM'} value={um} onChangeText={setUm} />
          <Input label={'BM'} value={bm} onChangeText={setBm} />
          <Input label={'AGM'} value={agm} onChangeText={setAgm} />
          <FilledButton
            title={'Submit'}
            onPress={handleSubmit}
            style={styles.submitButton}
          />
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  submitButton: {
    marginVertical: 20,
  },
});

export default PayFirstPremiumScreen;
