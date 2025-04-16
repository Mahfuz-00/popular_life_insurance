/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  ToastAndroid, // Added for toast messages
  Alert,
} from 'react-native';
import moment from 'moment';
import globalStyle from '../styles/globalStyle';
import { Input } from './../components/Input';
import { FilledButton } from './../components/FilledButton';
import { PickerComponent } from './../components/PickerComponent';
import { DatePickerComponent } from './../components/DatePickerComponent'; // Added
import Header from './../components/Header';
import BackgroundImage from '../assets/BackgroundImage.png';
import { fetchProjects } from '../actions/userActions';
import { getPlanList, getTermList, getCalculatedPremium } from '../actions/calculatePremiumActions';

const PayFirstPremiumScreen = ({ navigation }) => {
  const [selectedProject, setSelectedProject] = useState({
    code: null,
    id: null,
    name: '',
  });
  const [code, setCode] = useState('');
  const [nid, setNid] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [plans, setPlans] = useState([]);
  const [plan, setPlan] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date('1990-01-01'));
  const [age, setAge] = useState('');
  const [terms, setTerms] = useState([]);
  const [term, setTerm] = useState('');
  const [mode, setMode] = useState('');
  const [sumAssured, setSumAssured] = useState('');
  const [totalPremium, setTotalPremium] = useState('');
  const [servicingCell, setServicingCell] = useState('');
  const [agentMobile, setAgentMobile] = useState('');
  const [fa, setFa] = useState('');
  const [um, setUm] = useState('');
  const [bm, setBm] = useState('');
  const [agm, setAgm] = useState('');
  const entrydate = moment().format('YYYY-MM-DD');

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetchProjects();
      console.log('response.data', response.data);

      if (response?.data) {
        const formattedProjects = response.data.map(project => ({
          label: project.name, // What the user sees
          value: project.id, // What is stored internally
        }));
        setProjects(formattedProjects);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedProject?.value) {
      setCode(selectedProject.value.toString());
      // const projectValue = selectedProject?.value?.toString() ?? '';
      // setCode(projectValue);
    }
  }, [selectedProject]);


  // Fetch Plans
  useEffect(() => {
    async function fetchPlans() {
      const response = await getPlanList();
      if (response) {
        setPlans(response);
      }
    }
    fetchPlans();
  }, []);

  // Fetch Terms based on selected Plan
  useEffect(() => {
    async function fetchTerms() {
      const response = await getTermList(plan);
      if (response) {
        setTerms(response);
      }
    }
    if (plan) {
      fetchTerms();
    } else {
      setTerms([]);
      setTerm(''); // Reset term when plan changes
    }
  }, [plan]);


  // Calculate Age from Date of Birth
  useEffect(() => {
    const calculatedAge = moment().diff(dateOfBirth, 'years');
    setAge(calculatedAge);
  }, [dateOfBirth]);

  // Automatic Premium Calculation with Debouncing
  useEffect(() => {
    const calculatePremium = async () => {
      if (plan && age && term && sumAssured) {
        const postData = {
          plan: plan,
          tarm: term,
          mode: mode,
          dob: moment(dateOfBirth).format('YYYY-MM-DD'),
          sumAssured: sumAssured,
        };

        console.log('Calculator Data:', postData); // For debugging

        const calculatedPremium = await getCalculatedPremium(postData);
        if (calculatedPremium !== undefined) {
          setTotalPremium(Math.ceil(calculatedPremium).toString());
        } else {
          setTotalPremium('');
          ToastAndroid.show('Failed to calculate premium', ToastAndroid.SHORT);
        }
      } else {
        setTotalPremium('');
      }
    };

    const timeoutId = setTimeout(() => {
      calculatePremium();
    }, 500); // Debounce by 500ms

    return () => clearTimeout(timeoutId);
  }, [plan, age, term, mode, sumAssured, dateOfBirth]);

  const handleSumAssuredChange = (text) => {
    setSumAssured(text);
    if (plan && age && term && text) {
      ToastAndroid.show('Calculating premium...', ToastAndroid.SHORT);
    }
  };
  // useEffect(() => {
  //   if (selectedProject) {
  //     const project = projects.find(p => p.code === selectedProject.code);
  //     setCode(project ? project.code : '');
  //   }
  // }, [selectedProject, projects]);

  const handleSubmit = () => {
    // Validate required fields first
    if (!selectedProject?.value || !nid || !name || !mobile || !totalPremium || !plan || !age || !term || !mode || !sumAssured) {
      return Alert.alert('Error', 'Please fill all required fields');
    }

    navigation.navigate('PayfirstPremiumGateways', {
      project: selectedProject.label,
      code: selectedProject.value,
      nid,
      entrydate: entrydate,
      name,
      mobile,
      plan, age,
      term,
      mode,
      sumAssured,
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
      <ImageBackground source={BackgroundImage} style={{ flex: 1 }}>
        <Header navigation={navigation} title={'Pay First Premium'} />
        <ScrollView style={[globalStyle.wrapper, { margin: 10 }]}>
          <PickerComponent
            items={projects}
            value={selectedProject?.value}
            setValue={val => {
              const project = projects.find(p => p.value === val);
              setSelectedProject(project || { code: null, id: null, name: '' });
            }}
            label={'Project'}
            placeholder={'Select a project'}
            required
          />
          <Input label={'Code'} value={code} editable={false} />
          <Input label={'NID'} value={nid} onChangeText={setNid} required />
          <Input label={'Date'} value={entrydate} editable={false} />
          <Input
            label={'Proposers Name'}
            value={name}
            onChangeText={setName}
            required
          />
          <Input
            label={'Proposers Mobile No.'}
            value={mobile}
            onChangeText={setMobile}
            required
          />
          <PickerComponent
            items={plans}
            value={plan}
            setValue={setPlan}
            label={'Plan'}
            placeholder={'Select a plan'}
            required
          />
          <DatePickerComponent
            date={dateOfBirth}
            setDate={setDateOfBirth}
            label={'Birth Date'}
            required
          />
          <PickerComponent
            items={terms}
            value={term}
            setValue={setTerm}
            label={'Term'}
            placeholder={'Select a term'}
            required
          />
          <PickerComponent
            items={[
              { label: 'Yearly', value: 'yly' },
              { label: 'Half Yearly', value: 'hly' },
              { label: 'Quarterly', value: 'qly' },
              { label: 'Monthly', value: 'mly' },
            ]}
            value={mode}
            setValue={setMode}
            label={'Mode'}
            placeholder={'Select a mode'}
            required
          />
          <Input
            label={'Sum Assured'}
            value={sumAssured}
            onChangeText={handleSumAssuredChange} // Updated handler
            required
            keyboardType="numeric"
          />
          <Input
            label={'Total Premium'}
            value={totalPremium}
            editable={false} // Read-only since it's calculated
            required
          />
          <Input
            label={'Servicing Cell Code'}
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
