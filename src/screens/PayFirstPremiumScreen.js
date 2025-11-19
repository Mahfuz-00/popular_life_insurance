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
import { fetchProjects, getRate, getAgentCodes } from '../actions/userActions';
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

  const [code6Digit, setCode6Digit] = useState('');        
  const [rate, setRate] = useState('');                   
  const [premium, setPremium] = useState('');            
  const [commission, setCommission] = useState('');       
  const [netAmount, setNetAmount] = useState('');       
  const [isCalculating, setIsCalculating] = useState(false);
  const [isFetchingAgent, setIsFetchingAgent] = useState(false);

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

  // AUTO CALCULATE PREMIUM
  useEffect(() => {
    const calculate = async () => {
      if (!selectedProject?.code || !plan || !term || !age || !sumAssured || parseFloat(sumAssured) <= 0) {
        setCode6Digit(''); setRate(''); setPremium(''); setCommission(''); setNetAmount('');
        return;
      }

      setIsCalculating(true);
      try {
        const paddedAge = age.toString().padStart(2, '0');
        const paddedTerm = term.toString().padStart(2, '0');
        const code = `${plan}${paddedTerm}${paddedAge}`;
        setCode6Digit(code);

        const result = await getRate(selectedProject.code, plan, paddedTerm, paddedAge);

        if (result?.success && result.rate > 0) {
          const rateVal = parseFloat(result.rate);
          const basePremium = (parseFloat(sumAssured) / 1000) * rateVal;
          const roundedPremium = Number(basePremium.toFixed(2));
          const commRate = parseInt(term) < 15 ? 0.38 : 0.48;
          const commAmount = Number((roundedPremium * commRate).toFixed(2));
          const finalPayable = Math.ceil((roundedPremium - commAmount) * 100) / 100;

          setRate(rateVal.toFixed(4));
          setPremium(roundedPremium.toFixed(2));
          setCommission(commAmount.toFixed(2));
          setNetAmount(finalPayable.toFixed(2));
        } else {
          setRate('');
          setPremium(''); setCommission(''); setNetAmount('');
          ToastAndroid.show('Rate not available for this combination', ToastAndroid.LONG);        }
      } catch (e) {
        console.error('Rate API Error:', error);
        setRate('');
        ToastAndroid.show('Failed to fetch rate. Check internet or try again.', ToastAndroid.LONG);
      } finally {
        setIsCalculating(false);
      }
    };

    const timer = setTimeout(calculate, 300);
    return () => clearTimeout(timer);
  }, [selectedProject?.code, plan, term, age, sumAssured]);

  // Fetch Agent Codes
  useEffect(() => {
    if (!fa || fa.length !== 8 || !/^\d+$/.test(fa)) {
      setUm(''); setBm(''); setAgm('');
      return;
    }

    ToastAndroid.show('Verifying agent code...', ToastAndroid.SHORT);

    (async () => {
      setIsFetchingAgent(true);
      const result = await getAgentCodes(fa);
      setIsFetchingAgent(false);

      if (result.success) {
        setUm(result.um || '');
        setBm(result.bm || '');
        setAgm(result.agm || '');
      ToastAndroid.show('Agent verified successfully!', ToastAndroid.SHORT);
      } else {
        setUm(''); setBm(''); setAgm('');
        ToastAndroid.show('Invalid FA Code', ToastAndroid.LONG);
      }
    })();
  }, [fa]);





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
      if (!totalPremium || parseFloat(totalPremium) <= 0) {
        return Alert.alert('Error', 'Please complete all fields and calculate premium');
      }

      if (!netAmount || !code6Digit || !rate) {
        return Alert.alert('Error', 'Premium calculation incomplete');
      }

      navigation.navigate('PayfirstPremiumGateways', {
        project: selectedProject.name,
        projectCode: selectedProject.code,
        code: selectedProject.id,
        nid,
        entrydate,
        name,
        mobile,
        plan: `${selectedProject.id}${plan}`,
        planlabel: selectedPlanLabel,
        age,
        term,
        mode,
        sumAssured,
        totalPremium: totalPremium, 
        servicingCell,
        agentMobile,
        fa,
        um,
        bm,
        agm,
        rateCode: code6Digit,
        basePremium: premium,
        commission: commission,
        rate: rate,
        netAmount: netAmount,
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
          {age < 18 && (
            <Text style={{ marginLeft: 15, color: 'red', fontWeight: 'bold', marginTop: 5 }}>
              Age: {age} years, First payment not allowed under 18 years!
            </Text>
          )}
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
          <Input label="Code (Auto)" value={code6Digit} editable={false} />
          <Input label="Rate" value={rate} editable={false} />
          <Input label="Premium" value={premium} editable={false} />
          <Input label="Commission" value={commission} editable={false} />
          <Input label="Payment Amount" value={netAmount} editable={false} />
          <Input
            label={'Total Premium'}
            value={totalPremium}
            onChangeText={setTotalPremium}
            required
            keyboardType="numeric"
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
          <Input
            label={'FA'}
            value={fa}
            onChangeText={(text) => {
              setFa(text.replace(/[^0-9]/g, '').slice(0, 8)); // only numbers, max 8
            }}
            maxLength={8}
            keyboardType="numeric"
            required
            placeholder="Enter 8-digit FA code"
          />
         <Input
            label={'UM'}
            value={um}
            onChangeText={setUm}
            maxLength={8}
            editable={false}       
            style={{ backgroundColor: '#f0f0f0' }} 
          />
          <Input
            label={'BM'}
            value={bm}
            onChangeText={setBm}
            maxLength={8}
            editable={false}         
            style={{ backgroundColor: '#f0f0f0' }}
          />
          <Input
            label={'AGM'}
            value={agm}
            onChangeText={setAgm}
            maxLength={8}
            editable={false}         
            style={{ backgroundColor: '#f0f0f0' }}
          />
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
  loadingOverlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: 'rgba(0,0,0,0.4)',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
  },
});

export default PayFirstPremiumScreen;
