/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    ImageBackground,
    TextInput,
    StyleSheet,
    Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDispatch } from 'react-redux';
import moment from 'moment';

import Header from './../components/Header';
import globalStyle from '../styles/globalStyle';
import BackgroundImage from '../assets/BackgroundImage.png';
import { FilledButton } from './../components/FilledButton';
import { Input } from './../components/Input';
import { PickerComponent } from './../components/PickerComponent';
import { SHOW_LOADING, HIDE_LOADING } from '../constants/commonConstants';
import { DatePickerComponent } from './../components/DatePickerComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchProjects } from '../actions/userActions';
import axios from 'axios';
import { API } from '../config';

const CodeWiseCollectionScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const [projects, setProjects] = useState([]);
    const [projectsUnfiltered, setProjectsUnfiltered] = useState([]);
    const [selectedProject, setSelectedProject] = useState({
        code: '',
        id: null,
        name: '',
    });
    const [designations, setDesignations] = useState([]);
    const [selectedDesignation, setSelectedDesignation] = useState('');
    const [code, setCode] = useState('');
    const [reportType, setReportType] = useState('Summary');
    const [data, setData] = useState(null);
    const [fromDate, setFromDate] = useState(new Date(2020, 0, 1));
    const [toDate, setToDate] = useState(new Date());

    // Minimum date (Jan 1, 2020)
    // const minDate = new Date(2020, 0, 1);

    // Fetch projects on component mount
    useEffect(() => {
        async function fetchData() {
            const response = await fetchProjects();
            console.log('Project response.data', response.data);

            if (response?.data) {
                // Store unfiltered projects
                const unfilteredProjects = response.data.map(project => ({
                    label: project.name,
                    value: project.code,
                }));
                setProjectsUnfiltered(unfilteredProjects);



                // List of project codes to exclude (second codes from the 7 sets)
                const codesToExclude = ['ABAD', 'ADPS', 'IBDPS', 'ALAD', 'JBAD', 'IAD', 'JBADK'];

                // Filter out the unwanted project codes
                const filteredProjects = response.data
                    .filter(project => !codesToExclude.includes(project.code))
                    .map(project => ({
                        label: project.name,
                        value: project.code,
                    }));
                setProjects(filteredProjects);
            }
        }

        fetchData();
    }, []);

    // Fetch designations on component mount
    useEffect(() => {
        const fetchDesignations = async () => {
            try {
                dispatch({ type: SHOW_LOADING, payload: { textColor: '#000000' } });
                const token = await AsyncStorage.getItem('token');
                const response = await axios.get(`${API}/api/designations`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${JSON.parse(token)}`,
                    },
                });

                if (response.status === 200 && response.data?.data) {
                    console.log('Designation response.data', response.data);
                    const allowedDesignations = ['Agent', 'Manager', 'Am', 'Agm'];
                    const formattedDesignations = response.data.data
                        .filter(item => allowedDesignations.includes(item))
                        .map(item => {
                            const displayLabel = {
                                'Agent': 'FA',
                                'Manager': 'BM',
                                'Am': 'UM',
                                'Agm': 'AGM',
                            }[item] || item;
                            return {
                                label: displayLabel,
                                value: item,
                            };
                        });
                    // const formattedDesignations = response.data.data.map(item => {
                    //     const displayLabel = {
                    //         'Agent': 'FA',
                    //         'Manager': 'BM',
                    //         'Am': 'UM',
                    //         'Agm': 'AGM',
                    //     }[item] || item; // Use mapped label or original if not in mapping
                    //     return {
                    //         label: displayLabel,
                    //         value: item, // Preserve original API value
                    //     };
                    // });
                    setDesignations(formattedDesignations);
                    // if (formattedDesignations.length > 0) {
                    //     setSelectedDesignation(formattedDesignations[0].value);
                    // }
                }
            } catch (error) {
                console.error('Failed to fetch designations:', error);
                Alert.alert(
                    'Error',
                    `Failed to fetch designations: ${error.response?.data?.message || error.message || 'Server error'}`,
                    [{ text: 'OK', style: 'cancel' }],
                );
            } finally {
                dispatch({ type: HIDE_LOADING });
            }
        };

        fetchDesignations();
    }, []);

    // Fetch collection data
    const fetchCollectionData = async () => {
        // Validate inputs
        if (!selectedProject?.value || !selectedDesignation || !code.trim()) {
            Alert.alert('Error', 'Please fill all fields.', [{ text: 'OK', style: 'cancel' }]);
            return;
        }

        // Validate date range only for Details
        if (reportType === 'Details' && fromDate > toDate) {
            Alert.alert('Error', 'From date cannot be after To date', [{ text: 'OK', style: 'cancel' }]);
            return;
        }

        try {
            dispatch({ type: SHOW_LOADING, payload: { textColor: '#000000' } });
            const token = await AsyncStorage.getItem('token');
            // Use different endpoints based on reportType
            const endpoint = reportType === 'Summary'
                ? `${API}/api/code-wise-collection-summary`
                : `${API}/api/code-wise-collection-details`;

            const response = await axios.post(
                endpoint,
                {
                    project_code: selectedProject.value.toString(),
                    designation: selectedDesignation,
                    code,
                    // Do not send from_date or to_date to the API
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${JSON.parse(token)}`,
                    },
                }
            );

            if (response.status === 200 && response.data?.data) {
                console.log('Code Wise Collection Response:', JSON.stringify(response.data, null, 2)); // Debug log
                if (Array.isArray(response.data.data) && response.data.data.length === 0) {
                    Alert.alert('Alert', 'No data found.', [{ text: 'OK', style: 'cancel' }]);
                    setData(null);
                } else {
                    setData(response.data.data);
                }
            } else {
                console.log('Code Wise Collection No Data:', response.data);
                Alert.alert('Error', 'No data found for the provided inputs.', [
                    { text: 'OK', style: 'cancel' },
                ]);
                setData(null);
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
            Alert.alert(
                'Error',
                `Failed to fetch data: ${error.response?.data?.message || error.message || 'Server error'}`,
                [{ text: 'OK', style: 'cancel' }],
            );
            setData(null);
        } finally {
            dispatch({ type: HIDE_LOADING });
        }
    };

    // Render Summary Table
    const renderSummaryTable = () => {
        if (!data || !data.data) {
            console.log('No data or data.data is undefined'); // Debug log
            return null;
        }

        const projectName = selectedProject.label;
        const years = Object.keys(data.data); // Get all years dynamically

        if (years.length === 0) {
            console.log('No years found in data.data'); // Debug log
            return null;
        }

        return (
            <View style={styles.table}>
                <Text style={[globalStyle.fontBold, styles.title]}>
                    Popular Life Insurance Co.Ltd.
                </Text>
                <Text style={[globalStyle.fontMedium, styles.subtitle]}>
                    {projectName} - Code Wise Collection Summary
                </Text>
                <Text style={[globalStyle.fontMedium, styles.codeInfo]}>
                    Code No: {code}
                </Text>
                {years.map((year, yearIndex) => (
                    <View key={yearIndex}>
                        <Text style={[globalStyle.fontMedium, styles.yearHeader]}>{year}</Text>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.headerCell, { flex: 1 }]}>Month</Text>
                            <Text style={styles.headerCell}>Type</Text>
                            <Text style={styles.headerCell}>Amount</Text>
                            <Text style={styles.headerCell}>No of Trns.</Text>
                        </View>
                        {Object.keys(data.data[year].data || {}).map((month, monthIndex) => {
                            const monthData = data.data[year].data[month];
                            const deferredCount = monthData.deffered_count || 0; // Use deffered_count
                            const renewalCount = monthData.renewal_count || 0; // Use renewal_count
                            const totalCount = monthData.total_count || 0; // Use total_count
                            const transactionCount = Array.isArray(monthData.data) ? monthData.data.length : 0; // Safe check
                            console.log(`Year: ${year}, Month: ${month}, Data:`, monthData); // Debug log
                            return (
                                <View key={monthIndex}>
                                    <View style={styles.row}>
                                        <Text style={[styles.cell, { flex: 1 }]}>{month}</Text>
                                        <Text style={styles.cell}>Deferred</Text>
                                        <Text style={styles.cell}>0.00</Text>
                                        <Text style={styles.cell}>{deferredCount}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={[styles.cell, { flex: 1 }]}></Text>
                                        <Text style={styles.cell}>Renewal</Text>
                                        <Text style={styles.cell}>{monthData.total || '0.00'}</Text>
                                        <Text style={styles.cell}>{renewalCount}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={[styles.cell, { flex: 1 }]}></Text>
                                        <Text style={styles.cell}>Total</Text>
                                        <Text style={styles.cell}>{monthData.total || '0.00'}</Text>
                                        <Text style={styles.cell}>{totalCount}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                ))}
                <View style={[styles.row, styles.grandTotal]}>
                    <Text style={[styles.cell, { flex: 1 }]}>Grand Total</Text>
                    <Text style={styles.cell}></Text>
                    <Text style={styles.cell}>{data.total || '0.00'}</Text>
                    <Text style={styles.cell}>
                        {years.reduce((sum, year) =>
                            sum + Object.values(data.data[year].data || {}).reduce(
                                (monthSum, month) => monthSum + (month.total_count || 0),
                                0
                            ),
                            0
                        )}
                    </Text>
                </View>
            </View>
        );
    };

    // Render Details Table
    const renderDetailsTable = () => {
        console.log('Fetched data:', JSON.stringify(data, null, 2));

        // Check if data is undefined or null
        if (!data) {
            console.log('No data is available');
            return (
                <Text style={[globalStyle.fontMedium, { textAlign: 'center', marginTop: 20 }]}>
                    No data found for the selected projects.
                </Text>
            );
        }

        const projectName = selectedProject?.label || 'Unknown Project';
        const projects = Object.keys(data);


           // Function to get project label from code
           const getProjectLabel = (projectCode) => {
            const project = projectsUnfiltered.find(p => p.value === projectCode);
            return project ? project.label : projectCode; // Fallback to code if not found
        };

        // Check if all projects are empty arrays
        if (projects.length === 0 || projects.every(project => Array.isArray(data[project]) && data[project].length === 0)) {
            return (
                <Text style={[globalStyle.fontMedium, { textAlign: 'center', marginTop: 20 }]}>
                    No data found for the selected projects.
                </Text>
            );
        }

        return (
            <View style={styles.table}>
                <Text style={[globalStyle.fontBold, styles.title]}>
                    Popular Life Insurance Co.Ltd.
                </Text>
                <Text style={[globalStyle.fontMedium, styles.subtitle]}>
                    Code Wise Collection Summary Details
                </Text>
                <Text style={[globalStyle.fontMedium, styles.codeInfo]}>
                    Code No: {code || 'N/A'}
                </Text>

                {projects.map((project, projectIndex) => (
                    <View key={projectIndex}>
                        <Text style={[globalStyle.fontMedium, styles.yearHeader]}>
                            Project: {getProjectLabel(project)}
                        </Text>

                        {/* Check if project data is an empty array */}
                        {Array.isArray(data[project]) && data[project].length === 0 ? (
                            <Text style={[globalStyle.fontMedium, { textAlign: 'center', marginTop: 10 }]}>
                                No data found for the current year.
                            </Text>
                        ) : (
                            Object.keys(data[project]?.data || {}).map((year, yearIndex) => (
                                <View key={yearIndex}>
                                    <Text style={[globalStyle.fontMedium, styles.yearHeader]}>{year}</Text>
                                    {Object.keys(data[project].data[year]?.data || {}).map((month, monthIndex) => (
                                        <View key={monthIndex}>
                                            <Text style={[globalStyle.fontMedium, styles.monthHeader]}>{month}</Text>
                                            <View style={styles.tableHeader}>
                                                <Text style={styles.headerCell}>Trns. No</Text>
                                                <Text style={styles.headerCell}>Amount</Text>
                                                <Text style={styles.headerCell}>D/R</Text>
                                                <Text style={styles.headerCell}>Date</Text>
                                            </View>
                                            {(data[project].data[year].data[month]?.data || []).map((txn, idx) => (
                                                <View style={styles.row} key={idx}>
                                                    <Text style={styles.cell}>{txn.transaction_no || 'N/A'}</Text>
                                                    <Text style={styles.cell}>{txn.amount || '0.00'}</Text>
                                                    <Text style={styles.cell}>{txn.type || 'N/A'}</Text>
                                                    <Text style={styles.cell}>
                                                        {txn.date ? moment(txn.date.original).format('DD-MM-YYYY') : 'N/A'}
                                                    </Text>
                                                </View>
                                            ))}
                                            <View style={[styles.row, styles.subTotal]}>
                                                <Text style={styles.cell}>Sub Total</Text>
                                                <Text style={styles.cell}>{data[project].data[year].data[month]?.total || '0.00'}</Text>
                                                <Text style={styles.cell}></Text>
                                                <Text style={styles.cell}></Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            ))
                        )}

                        {/* Project-specific totals */}
                        {!Array.isArray(data[project]) && (
                            <View style={styles.totals}>
                                <View style={styles.row}>
                                    <Text style={styles.cell}>Deferred Collection</Text>
                                    <Text style={styles.cell}>{data[project]?.deffered_total || '0.00'}</Text>
                                    <Text style={styles.cell}>
                                        {Object.keys(data[project]?.data || {}).reduce((sum, year) =>
                                            sum + Object.values(data[project].data[year]?.data || {}).reduce((monthSum, month) =>
                                                monthSum + (month.data || []).filter(txn => txn.type === 'D').length, 0
                                            ), 0)}
                                    </Text>
                                    <Text style={styles.cell}></Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.cell}>Renewal Collection</Text>
                                    <Text style={styles.cell}>
                                        {Object.keys(data[project]?.data || {}).reduce((sum, year) =>
                                            sum + parseFloat(data[project].data[year]?.total || 0), 0).toFixed(2)}
                                    </Text>
                                    <Text style={styles.cell}>
                                        {Object.keys(data[project]?.data || {}).reduce((sum, year) =>
                                            sum + Object.values(data[project].data[year]?.data || {}).reduce((monthSum, month) =>
                                                monthSum + (month.data || []).filter(txn => txn.type === 'R').length, 0
                                            ), 0)}
                                    </Text>
                                    <Text style={styles.cell}></Text>
                                </View>
                                <View style={[styles.row, styles.grandTotal]}>
                                    <Text style={styles.cell}>Grand Total</Text>
                                    <Text style={styles.cell}>
                                        {Object.keys(data[project]?.data || {}).reduce((sum, year) =>
                                            sum + parseFloat(data[project].data[year]?.total || 0), 0).toFixed(2)}
                                    </Text>
                                    <Text style={styles.cell}></Text>
                                    <Text style={styles.cell}></Text>
                                </View>
                            </View>
                        )}
                    </View>
                ))}

                {/* Indicator before overall totals */}
                <Text style={[globalStyle.fontBold, { textAlign: 'center', marginVertical: 20 }]}>
                    Overall Totals for All Projects
                </Text>

                {/* Overall totals across all projects */}
                <View style={styles.totals}>
                    <View style={styles.row}>
                        <Text style={styles.cell}>Deferred Collection</Text>
                        <Text style={styles.cell}>
                            {projects.reduce((sum, project) =>
                                !Array.isArray(data[project]) ? sum + Object.keys(data[project]?.data || {}).reduce((yearSum, year) =>
                                    yearSum + Object.values(data[project].data[year]?.data || {}).reduce((monthSum, month) =>
                                        monthSum + (month.data || []).reduce((txnSum, txn) =>
                                            txn.type === 'D' ? txnSum + parseFloat(txn.amount || 0) : txnSum, 0
                                        ), 0
                                    ), 0) : sum, 0).toFixed(2)}
                        </Text>
                        <Text style={styles.cell}>
                            {projects.reduce((sum, project) =>
                                !Array.isArray(data[project]) ? sum + Object.keys(data[project]?.data || {}).reduce((yearSum, year) =>
                                    yearSum + Object.values(data[project].data[year]?.data || {}).reduce((monthSum, month) =>
                                        monthSum + (month.data || []).filter(txn => txn.type === 'D').length, 0
                                    ), 0) : sum, 0)}
                        </Text>
                        <Text style={styles.cell}></Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.cell}>Renewal Collection</Text>
                        <Text style={styles.cell}>
                            {projects.reduce((sum, project) =>
                                !Array.isArray(data[project]) ? sum + Object.keys(data[project]?.data || {}).reduce((yearSum, year) =>
                                    yearSum + Object.values(data[project].data[year]?.data || {}).reduce((monthSum, month) =>
                                        monthSum + (month.data || []).reduce((txnSum, txn) =>
                                            txn.type === 'R' ? txnSum + parseFloat(txn.amount || 0) : txnSum, 0
                                        ), 0
                                    ), 0) : sum, 0).toFixed(2)}
                        </Text>
                        <Text style={styles.cell}>
                            {projects.reduce((sum, project) =>
                                !Array.isArray(data[project]) ? sum + Object.keys(data[project]?.data || {}).reduce((yearSum, year) =>
                                    yearSum + Object.values(data[project].data[year]?.data || {}).reduce((monthSum, month) =>
                                        monthSum + (month.data || []).filter(txn => txn.type === 'R').length, 0
                                    ), 0) : sum, 0)}
                        </Text>
                        <Text style={styles.cell}></Text>
                    </View>
                    <View style={[styles.row, styles.grandTotal]}>
                        <Text style={styles.cell}>Grand Total</Text>
                        <Text style={styles.cell}>
                            {projects.reduce((sum, project) =>
                                !Array.isArray(data[project]) ? sum + parseFloat(data[project]?.total || 0) : sum, 0).toFixed(2)}
                        </Text>
                        <Text style={styles.cell}></Text>
                        <Text style={styles.cell}></Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={globalStyle.container}>
            <ImageBackground source={BackgroundImage} style={{ flex: 1 }}>
                <Header navigation={navigation} title={'Collection Summary'} />
                <ScrollView>
                    <View style={globalStyle.wrapper}>
                        {/* Input Fields */}
                        <View style={styles.inputContainer}>
                            <PickerComponent
                                items={projects}
                                value={selectedProject?.value}
                                setValue={val => {
                                    const project = projects.find(p => p.value === val);
                                    setSelectedProject(project || { code: '', id: null, name: '' });
                                }}
                                label={'Project'}
                                placeholder={'Select a project'}
                                required
                            />
                            <PickerComponent
                                items={designations}
                                value={selectedDesignation}
                                setValue={setSelectedDesignation}
                                label={'Designation'}
                                placeholder={'Select designation'}
                                required
                            />
                            <Input label={'Code'} value={code} onChangeText={setCode} required />
                            <PickerComponent
                                items={[
                                    { label: 'Summary', value: 'Summary' },
                                    { label: 'Details', value: 'Details' }
                                ]}
                                value={reportType}
                                setValue={setReportType}
                                label={'Report Type'}
                                placeholder={'Select report type'}
                                required
                            />
                            {/* Conditionally render date pickers for Details only */}
                            {['Summary', 'Details'].includes(reportType) && (
                                <View>
                                    <Text style={[globalStyle.fontMedium, { textAlign: 'center', marginTop: 5, marginBottom: 5 }]}>
                                        Report {reportType} will show only current year's Transactions.
                                    </Text>
                                    {/* <DatePickerComponent
                                        date={fromDate}
                                        setDate={setFromDate}
                                        defaultDate={new Date('2020-01-01')}
                                        label={
                                            <Text>
                                                From Date<Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                        }
                                        minimumDate={minDate}
                                        maximumDate={toDate}
                                        required
                                    /> */}
                                    {/* <DatePickerComponent
                                        date={toDate}
                                        setDate={setToDate}
                                        defaultDate={new Date('2020-01-01')}
                                        label={
                                            <Text>
                                                To Date<Text style={{ color: 'red' }}>*</Text>
                                            </Text>
                                        }
                                        minimumDate={fromDate}
                                        maximumDate={new Date()}
                                        required
                                    /> */}
                                </View>
                            )}
                            <FilledButton
                                title="Fetch Data"
                                style={styles.fetchButton}
                                onPress={fetchCollectionData}
                            />
                        </View>

                        {/* Data Display */}
                        {data && reportType === 'Summary' && renderSummaryTable()}
                        {data && reportType === 'Details' && renderDetailsTable()}
                        {data === null && projects.length > 0 && selectedDesignation && code.trim() && (
                            <Text style={[globalStyle.fontMedium, { textAlign: 'center', marginTop: 20 }]}>

                            </Text>
                        )}
                    </View>
                </ScrollView>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        marginVertical: 20,
    },
    label: {
        color: 'black',
        marginBottom: 10,
        fontSize: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#5382AC',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        fontFamily: globalStyle.fontMedium.fontFamily,
        marginBottom: 15,
        backgroundColor: '#FFF',
        color: '#000',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#5382AC',
        borderRadius: 5,
        marginBottom: 15,
        backgroundColor: '#FFF',
    },
    picker: {
        height: 50,
        color: '#000',
    },
    fetchButton: {
        width: '50%',
        borderRadius: 50,
        alignSelf: 'center',
    },
    table: {
        borderTopWidth: 2,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderColor: '#5382AC',
        marginVertical: 15,
    },
    title: {
        textAlign: 'center',
        fontSize: 18,
        marginVertical: 10,
    },
    subtitle: {
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 5,
    },
    codeInfo: {
        textAlign: 'center',
        fontSize: 14,
        marginBottom: 10,
    },
    dateRange: {
        textAlign: 'center',
        fontSize: 14,
        marginBottom: 10,
    },
    yearHeader: {
        fontSize: 18,
        fontFamily: globalStyle.fontBold.fontFamily,
        marginVertical: 10,
        marginLeft: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderColor: '#5382AC',
        backgroundColor: '#F0F8FF',
    },
    headerCell: {
        flex: 1,
        textAlign: 'center',
        paddingVertical: 5,
        paddingHorizontal: 5,
        fontFamily: globalStyle.fontBold.fontFamily,
        color: '#000',
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#5382AC',
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        paddingVertical: 5,
        paddingHorizontal: 5,
        fontFamily: globalStyle.fontMedium.fontFamily,
        color: '#000',
    },
    subTotal: {
        backgroundColor: '#E6E6FA',
    },
    grandTotal: {
        backgroundColor: '#D3D3D3',
    },
    monthHeader: {
        fontSize: 16,
        marginVertical: 10,
        marginLeft: 10,
    },
    totals: {
        marginTop: 10,
        borderTopWidth: 2,
        borderColor: '#5382AC',
    },
});

export default CodeWiseCollectionScreen;