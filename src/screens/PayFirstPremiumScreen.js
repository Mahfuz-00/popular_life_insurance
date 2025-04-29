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
import { DatePickerComponent } from './../components/DatePickerComponent';
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
  const [selectedPlanLabel, setSelectedPlanLabel] = useState(''); // New state for plan label
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
      console.log('Project response.data', response.data);

      if (response?.data) {
        const formattedProjects = response.data.map(project => ({
          label: project.name, // What the user sees
          value: project.id, // What is stored internally
          code: project.code,
        }));
        setProjects(formattedProjects);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedProject?.value) {
      setCode(selectedProject.value.toString());
    }
  }, [selectedProject]);

  useEffect(() => {
    if (selectedProject?.id) {
      setCode(selectedProject.id.toString());
    } else {
      setCode('');
    }
  }, [selectedProject]);


  // Fetch Plans
  useEffect(() => {
    async function fetchPlans() {
      const response = await getPlanList();
      console.log('Plan response.data', response);
      if (response) {
        // setPlans(response);
        // Format plans to show value in dropdown
        const formattedPlans = response.map(plan => ({
          label: plan.value, // Show value in dropdown
          value: plan.value, // Store value
          fullLabel: plan.label, // Store full label for display
        }));
        setPlans(formattedPlans);
      }
    }
    fetchPlans();
  }, []);

  // Set selected plan label when plan changes
  useEffect(() => {
    const selected = plans.find(p => p.value === plan);
    setSelectedPlanLabel(selected ? selected.fullLabel : '');
  }, [plan, plans]);

  // Fetch Terms based on selected Plan
  useEffect(() => {
    async function fetchTerms() {
      const response = await getTermList(plan);
      console.log('Terms :', response);
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

  useEffect(() => {
    if (selectedProject?.id) {
      setCode(selectedProject.id.toString());
    } else {
      setCode('');
    }
  }, [selectedProject]);


  // Calculate Age from Date of Birth
  useEffect(() => {
    const calculatedAge = moment().diff(dateOfBirth, 'years');
    setAge(calculatedAge);
  }, [dateOfBirth]);

  // // Automatic Premium Calculation with Debouncing
  // useEffect(() => {
  //   const calculatePremium = async () => {
  //     if (plan && age && term && sumAssured) {
  //       const postData = {
  //         plan: plan,
  //         tarm: term,
  //         mode: mode,
  //         dob: moment(dateOfBirth).format('YYYY-MM-DD'),
  //         sumAssured: sumAssured,
  //       };

  //       console.log('Calculator Data:', postData); // For debugging

  //       const calculatedPremium = await getCalculatedPremium(postData);
  //       if (calculatedPremium !== undefined) {
  //         setTotalPremium(Math.ceil(calculatedPremium).toString());
  //       } else {
  //         setTotalPremium('');
  //         ToastAndroid.show('Failed to calculate premium', ToastAndroid.SHORT);
  //       }
  //     } else {
  //       setTotalPremium('');
  //     }
  //   };

  //   const timeoutId = setTimeout(() => {
  //     calculatePremium();
  //   }, 500); // Debounce by 500ms

  //   return () => clearTimeout(timeoutId);
  // }, [plan, age, term, mode, sumAssured, dateOfBirth]);

  // const handleSumAssuredChange = (text) => {
  //   setSumAssured(text);
  //   if (plan && age && term && text) {
  //     ToastAndroid.show('Calculating premium...', ToastAndroid.SHORT);
  //   }
  // };
  // useEffect(() => {
  //   if (selectedProject) {
  //     const project = projects.find(p => p.code === selectedProject.code);
  //     setCode(project ? project.code : '');
  //   }
  // }, [selectedProject, projects]);

  const handleSubmit = () => {
    // Validate required fields first
    if (!selectedProject?.id || !nid || !name || !mobile || !totalPremium || !plan || !age || !term || !mode || !sumAssured) {
      return Alert.alert('Error', 'Please fill all required fields');
    }

    const combinedPlan = `${selectedProject.id}${plan}`;

    if (!combinedPlan) {
      console.log(com);
      return Alert.alert('Error', 'Invalid project or plan selection');
    }

    navigation.navigate('PayfirstPremiumGateways', {
      project: selectedProject.name,
      projectCode: selectedProject.code,
      code: selectedProject.id,
      nid,
      entrydate: entrydate,
      name,
      mobile,
      plan: combinedPlan,
      planlabel: selectedPlanLabel,
      age,
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
            value={selectedProject?.id}
            setValue={(val) => {
              const project = projects.find(p => p.value === val) || { value: null, code: null, label: '' };
              console.log('Selected project:', project); // Debug
              setSelectedProject({
                id: project.value,
                code: project.code,
                name: project.label,
              });
            }}
            label={'Project'}
            placeholder={'Select a project'}
            required
          />
          <Input label={'Code'} value={selectedProject?.id?.toString() || ''} editable={false} />
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
          {/* <Input
            label={'Plan Name'}
            value={selectedPlanLabel}
            editable={false}
          /> */}
          <View>
            <Text style={[globalStyle.fontMedium.fontFamily, styles.planName]}>
              Plan Name
            </Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={styles.planNameScroll}
            >
              <Text style={[globalStyle.input, styles.planNameInput]}>
                {selectedPlanLabel}
              </Text>
            </ScrollView>
          </View>
          <DatePickerComponent
            date={dateOfBirth}
            setDate={setDateOfBirth}
            label={
              <Text>
                Birth Date<Text style={{ color: 'red' }}>*</Text>
              </Text>
            }
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
              { label: 'Single', value: 'single' },
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
            onChangeText={setSumAssured}
            required
            keyboardType="numeric"
          />
          {/* <Input
            label={'Sum Assured'}
            value={sumAssured}
            onChangeText={handleSumAssuredChange} // Updated handler
            required
            keyboardType="numeric"
          /> */}
          <Input
            label={'Total Premium'}
            value={totalPremium}
            onChangeText={setTotalPremium}
            required
            keyboardType="numeric"
          />
          {/* <Input
            label={'Total Premium'}
            value={totalPremium}
            editable={false} // Read-only since it's calculated
            required
          /> */}
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
          <Input
            label={'FA'}
            value={fa}
            onChangeText={setFa}
            maxLength={8}
            required />
          <Input
            label={'UM'}
            value={um}
            onChangeText={setUm}
            maxLength={8} />
          <Input
            label={'BM'}
            value={bm}
            onChangeText={setBm}
            maxLength={8} />
          <Input
            label={'AGM'}
            value={agm}
            onChangeText={setAgm}
            maxLength={8} />
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
  planNameScroll: {
    marginBottom: 10,
    flexGrow: 0,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 7,
    backgroundColor: '#E0E0E0',
  },
  planNameInput: {
    padding: 15,
    fontSize: 14,
    fontFamily: 'Poppins-Regular', fontWeight: 'normal',
    // fontWeight: 'normal',
    color: '#333',
    minWidth: '100%',
    paddingRight: 20,
  },
  planName: {
    color: 'black',
    marginBottom: 10,
    fontFamily: 'Poppins-Regular', fontWeight: 'normal'
    // fontWeight: '100'
  },
  loadingText: {
    color: '#000', // Ensure black text for loading
    fontFamily: globalStyle.fontMedium.fontFamily,
    fontSize: 16,
    marginLeft: 10, // Space after loading indicator
  },
});

export default PayFirstPremiumScreen;
