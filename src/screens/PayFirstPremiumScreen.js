/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  ToastAndroid, 
  Alert,
  TouchableOpacity,
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
  const [modes, setModes] = useState([]);
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
  const [fatherHusbandName, setFatherHusbandName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [gender, setGender] = useState(''); 
  const [nominee1Name, setNominee1Name] = useState('');
  const [nominee1Percent, setNominee1Percent] = useState('');
  const [nominee2Name, setNominee2Name] = useState('');
  const [nominee2Percent, setNominee2Percent] = useState('');
  const [nominee3Name, setNominee3Name] = useState('');
  const [nominee3Percent, setNominee3Percent] = useState('');

  const [netCommission, setNetCommission] = useState('');   


  // SPECIAL PROJECT CODES → Use mode multiplier
  const SPECIAL_PROJECTS = ['ABA', 'AKOK', 'ALA', 'IA', 'JBA', 'JBAK', 'IBT'];

  // Mode multiplier mapping
  const MODE_MULTIPLIER = {
    yly: 1,
    hly: 2,
    qly: 4,
    mly: 12,
    single: 1,
  };

  // Plan 72 special mode factor
  const PLAN_72_FACTOR = {
    mly: 1,
    qly: 3,
    hly: 6,
    yly: 12,
    single: 1,
  };

  const isSpecialProject = selectedProject?.code 
    ? SPECIAL_PROJECTS.includes(selectedProject.code) 
    : false;

  // PERFECT: Reset premium-related fields when project changes
  useEffect(() => {
    setPlan('');
    setModes([]);
    setMode('');
    setTerm('');
    setTerms([]);
    setCode6Digit('');
    setRate('');
    setPremium('');
    setCommission('');
    setNetAmount('');
    setSelectedPlanLabel('');
  }, [selectedProject?.code]);

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

  // useEffect(() => {
  //   if (selectedProject?.value) {
  //     setCode(selectedProject.value.toString());
  //   }
  // }, [selectedProject]);

useEffect(() => {
  setCode(selectedProject?.id?.toString() || '');
}, [selectedProject?.id]);


  // Fetch Plans
  // FINAL: FETCH PLANS — ONLY 28 & 57 FOR NON-SPECIAL PROJECTS
  useEffect(() => {
    async function fetchPlans() {
      try {
        const response = await getPlanList();
        if (!response || !Array.isArray(response)) return;

        // DEBUG: Specifically show 28, 57, and 72
        const debugPlans = response.filter(p => 
          ['28', '57', '72'].includes(p.value)
        );
        console.log('Plans 28, 57, 72 details:', debugPlans.map(p => ({
          value: p.value,
          label: p.label,
          fullLabel: p.fullLabel || p.label,
          modes: Object.values(p.modes || {}).filter(Boolean),
        })));

        let allowedPlans = response;

        // NON-SPECIAL PROJECT → ONLY 28 & 57
        if (selectedProject?.code && !SPECIAL_PROJECTS.includes(selectedProject.code)) {
          allowedPlans = response.filter(p => p.value === '28' || p.value === '57' || p.value === '72');
        }

        // CRITICAL: Map from allowedPlans, NOT response
        const formattedPlans = allowedPlans.map(plan => ({
          label: plan.value,
          value: plan.value,
          fullLabel: plan.label,
          modes: Object.values(plan.modes || {}).filter(Boolean),
        }));

        setPlans(formattedPlans);

        // RESET IF CURRENT PLAN IS NO LONGER ALLOWED
        if (plan && !formattedPlans.some(p => p.value === plan)) {
          setPlan('');
          setModes([]);
          setMode('');
          setTerm('');
          setTerms([]);
          setCode6Digit('');
          setRate('');
          setPremium('');
          setCommission('');
          setNetAmount('');
          ToastAndroid.show('Only Plan 28 & 57 allowed for this project', ToastAndroid.LONG);
        }

      } catch (err) {
        console.error('Failed to fetch plans:', err);
        ToastAndroid.show('Failed to load plans', ToastAndroid.LONG);
      }
    }

    fetchPlans();
  }, [selectedProject?.code]); // Re-run when project changes

  // Set selected plan label when plan changes
  useEffect(() => {
    const selected = plans.find(p => p.value === plan);
    if (selected) {
      setSelectedPlanLabel(selected ? selected.fullLabel : '');
      const availableModes = selected.modes || [];
      setModes(availableModes);
      setMode('');

      if (availableModes.length === 0) {
        ToastAndroid.show('No payment mode available for this plan', ToastAndroid.LONG);
      }
    } else {
      setSelectedPlanLabel('');
      setModes([]);
      setMode('');
    }
  }, [plan, plans]);

  // Fetch Terms based on selected Plan
  useEffect(() => {
    async function fetchTerms() {
      const response = await getTermList(plan);
      console.log('Terms :', response);
     if (response && Array.isArray(response) && response.length > 0) {
        setTerms(response);
      } else {
        setTerms([]);
        setTerm('');
        ToastAndroid.show('No term available for this plan', ToastAndroid.LONG);
      }
    }
    if (plan) {
      fetchTerms();
    } else {
      setTerms([]);
      setTerm(''); // Reset term when plan changes
    }
  }, [plan]);

  // useEffect(() => {
  //   if (selectedProject?.id) {
  //     setCode(selectedProject.id.toString());
  //   } else {
  //     setCode('');
  //   }
  // }, [selectedProject]);


  // // Calculate Age from Date of Birth
  // useEffect(() => {
  //   const calculatedAge = moment().diff(dateOfBirth, 'years');
  //   setAge(calculatedAge);
  // }, [dateOfBirth]);

  // Bangladesh Insurance Age: +1 year from 1 July
    useEffect(() => {
      if (!dateOfBirth) return;

      const birthDate = moment(dateOfBirth);
      const today = moment();
      const currentYearJuly1 = moment().year(today.year()).month(6).date(1); // 1 July this year

      let age = today.diff(birthDate, 'years');
      console.log('Initial calculated age:', age);

      // If today is 1 July or later → add 1 year
      if (today.isSameOrAfter(currentYearJuly1)) {
        age += 1;
      }

      console.log('Final age after 1 July adjustment:', age);

      setAge(age);
    }, [dateOfBirth]);

  // AUTO CALCULATE PREMIUM
  useEffect(() => {
    const calculate = async () => {
      // Reset fields
      setCode6Digit(''); setRate(''); setPremium(''); setCommission(''); setNetAmount('');

      if (!selectedProject?.code || !plan || !term || age < 0 || !sumAssured || parseFloat(sumAssured) <= 0 || !mode) {
        return;
      }

      const isSpecialProject = SPECIAL_PROJECTS.includes(selectedProject.code);
      const sa = parseFloat(sumAssured);
      const paddedAge = age.toString().padStart(2, '0');
      const paddedTerm = term.toString().padStart(2, '0');
      const code = `${plan}${paddedTerm}${paddedAge}`;
      setCode6Digit(code);

      let basePremiumInitial = 0;
      let basePremiumFinal = 0;
      let fetchedRate = 0;
      let commRate = parseInt(term) < 15 ? 0.38 : 0.48;

      // Special commission for Plan 10 & 15
      if (plan === '10' || plan === '15') {
        commRate = 0.06;
      }

      try {
      if (isSpecialProject) {
          // ONLY SPECIAL PROJECTS → FETCH RATE
          const result = await getRate(selectedProject.code, plan, paddedTerm, paddedAge);

          if (!result?.success || !result.rate || result.rate <= 0) {
            setRate('Not Found');
            ToastAndroid.show('Rate not available for this combination', ToastAndroid.LONG);
            setPremium(''); setCommission(''); setNetAmount('');
            return;
          }

          const rateVal = parseFloat(result.rate);
          setRate(rateVal.toString());

          if (plan === '72') {
            const preBase = sa / rateVal;
            const factor = PLAN_72_FACTOR[mode] || 1;
            console.log('Plan 72 - Pre Base:', preBase, 'Factor:', factor);
            basePremiumInitial = preBase * factor 
            basePremiumFinal = basePremiumInitial * 500;
            console.log('Base Premium Calculation for Plan 72:', `(${sa} / ${rateVal}) * ${factor} * 500 = ${basePremiumFinal}`);
          } else {
            const multiplier = MODE_MULTIPLIER[mode] || 1;
            console.log('Mode Multiplier:', multiplier);
            basePremiumInitial = (sa / 1000) * rateVal;
            basePremiumFinal = basePremiumInitial / multiplier;
            console.log('Base Premium Calculation:', `(${sa} / 1000) * ${rateVal} / ${multiplier} = ${basePremiumFinal}`);
          }
        } else {
          // NON-SPECIAL (28 & 57) → NO RATE FETCH, DIRECT CALCULATION
          setRate('0');
          basePremiumFinal = sa / (12 * parseInt(term));
          console.log('Base Premium Calculation for Non-Special:', `${sa} / (12 * ${term}) = ${basePremiumFinal}`);
        }

        const roundedPremium = Number(basePremiumFinal.toString());
        console.log('Rounded Premium:', roundedPremium);
        // const commAmount = Number((roundedPremium * commRate).toFixed(2));
        // console.log('Commission Amount:', commAmount);
        // const netBeforeRound = roundedPremium - commAmount;
        // console.log('Net Amount before rounding:', netBeforeRound);

        const commAmount = Number((roundedPremium * commRate).toString());
        console.log('Commission Amount:', commAmount);
        const taxOnCommission = Number((commAmount * 0.05).toString());        // 5% Tax
        console.log('Tax on Commission (5%):', taxOnCommission);
        const netCommission = Number((commAmount - taxOnCommission).toString());
        console.log('Net Commission after tax:', netCommission);
        const netBeforeRound = roundedPremium - netCommission;               // Final deduction
        console.log('Net Amount before rounding:', netBeforeRound);

        const decimal = netBeforeRound - Math.floor(netBeforeRound);
        const netAmount =
          decimal < 0.5
            ? Math.floor(netBeforeRound)
            : Math.floor(netBeforeRound) + 1;
        console.log('Net Amount after rounding:', netAmount);

        setPremium(roundedPremium.toString());
        setCommission(commAmount.toString());           // ← Gross commission
        setNetCommission(netCommission.toString());     // ← Net after 5% tax
        setNetAmount(netAmount.toString());

      } catch (e) {
        console.error('Calculation error:', e);
        setRate('Error');
        ToastAndroid.show('Failed to calculate. Try again.', ToastAndroid.LONG);
      }
    };

    const timer = setTimeout(calculate, 500);
    return () => clearTimeout(timer);
  }, [selectedProject?.code, plan, term, age, sumAssured, mode]);

  // Fetch Agent Codes
  useEffect(() => {
    if (!fa || fa.length !== 8 || !/^\d+$/.test(fa)) {
      setUm(''); setBm(''); setAgm('');
      return;
    }

    // Must have a project selected
    if (!selectedProject?.code) {
      setUm(''); setBm(''); setAgm('');
      ToastAndroid.show('Please select a project first', ToastAndroid.LONG);
      return;
    }

    ToastAndroid.show('Verifying agent code...', ToastAndroid.SHORT);

    (async () => {
      setIsFetchingAgent(true);
      const result = await getAgentCodes(fa, selectedProject.code);
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
  }, [fa, selectedProject?.code]);


  const handleNomineePercent = (setter) => (text) => {
  // only digits, max 3 characters
  const filtered = text.replace(/[^0-9]/g, '').slice(0, 3);
  setter(filtered);
  };

  const checkNomineeTotal = () => {
  const n1 = parseInt(nominee1Percent || '0');
  const n2 = parseInt(nominee2Percent || '0');
  const n3 = parseInt(nominee3Percent || '0');

  const total = n1 + n2 + n3;

  if (total > 100) {
    Alert.alert('Error', 'Total Nominee Percentage cannot exceed 100%');
    return false;
  }
  return true;
  };






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
      if (!checkNomineeTotal()) return;

      if (age < 18) return Alert.alert('Error', 'Age must be 18 or above');

      if (!fatherHusbandName || !motherName || !nominee1Name || !nominee1Percent) {
      return Alert.alert('Error', 'Please fill all required nominee & family details');
      }

      if (!netAmount || !code6Digit || !commission) {
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
        commission: netCommission,
        rate: rate,
        netAmount: netAmount,
        fatherHusbandName, 
        motherName, 
        address, 
        district, 
        gender,
        nominee1Name, 
        nominee1Percent,
        nominee2Name, 
        nominee2Percent,
        nominee3Name, 
        nominee3Percent,
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
          {/* <Input label={'Code'} value={selectedProject?.id?.toString() || ''} editable={false} /> */}
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
            keyboardType="phone-pad"
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
          <PickerComponent items={modes} value={mode} setValue={setMode} label="Mode"   placeholder={'Select a mode'} required />
          <Input
            label={'Sum Assured'}
            value={sumAssured}
            onChangeText={setSumAssured}
            required
            keyboardType="numeric"
          />
          <Input label="Code (Auto)" value={code6Digit} editable={false} />
         {isSpecialProject ? (
            <Input label="Rate" value={rate} editable={false} />
          ) : (
            <Input label="Rate" value="0" editable={false} />
          )}
          <Input label="Premium" value={premium ? Math.ceil(parseFloat(premium)).toString() : ''} editable={false} />
          <Input label="Commission" value={netCommission ? Math.ceil(parseFloat(netCommission)).toString() : ''} editable={false} />
          <Input label="Payment Amount" value={netAmount ? Math.ceil(parseFloat(netAmount)).toString(): ''} editable={false} />
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
            keyboardType="phone-pad"
            required
          />

          <Text style={styles.sectionTitle}>Personal & Nominee Details</Text>
          <Input label="Father's / Husband's Name" value={fatherHusbandName} onChangeText={setFatherHusbandName} required />
          <Input label="Mother's Name" value={motherName} onChangeText={setMotherName} required />
          <Input label="Address" value={address} onChangeText={setAddress} required/>
          <Input label="District" value={district} onChangeText={setDistrict} required/>

          <Text style={{ marginLeft: 15, marginTop: 10, fontWeight: '600' }}>Gender</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
            {['Male', 'Female'].map(g => (
              <TouchableOpacity key={g} onPress={() => setGender(g)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#000', marginRight: 10, justifyContent: 'center', alignItems: 'center' }}>
                  {gender === g && <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#000' }} />}
                </View>
                <Text>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Nominee Details</Text>
          <Input label="Nominee 1 Name" value={nominee1Name} onChangeText={setNominee1Name} required />
          <Input label="Nominee 1 %" value={nominee1Percent} onChangeText={handleNomineePercent(setNominee1Percent)} keyboardType="numeric" required />
          <Input label="Nominee 2 Name" value={nominee2Name} onChangeText={setNominee2Name} />
          <Input label="Nominee 2 %" value={nominee2Percent} onChangeText={handleNomineePercent(setNominee2Percent)} keyboardType="numeric" />
          <Input label="Nominee 3 Name" value={nominee3Name} onChangeText={setNominee3Name} />
          <Input label="Nominee 3 %" value={nominee3Percent} onChangeText={handleNomineePercent(setNominee3Percent)} keyboardType="numeric" />

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
