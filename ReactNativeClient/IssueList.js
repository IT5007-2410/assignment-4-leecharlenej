import React, {useState} from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { Picker } from '@react-native-picker/picker';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    Button,
    useColorScheme,
    View,
  } from 'react-native';

  const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

  function jsonDateReviver(key, value) {
    if (dateRegex.test(value)) return new Date(value);
    return value;
  }

  async function graphQLFetch(query, variables = {}) {
    try {
        /****** Q4: Start Coding here. State the correct IP/port******/
        const response = await fetch('http://10.0.2.2:3000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ query, variables })
        /****** Q4: Code Ends here******/
      });
      const body = await response.text();
      const result = JSON.parse(body, jsonDateReviver);
  
      if (result.errors) {
        const error = result.errors[0];
        if (error.extensions.code == 'BAD_USER_INPUT') {
          const details = error.extensions.exception.errors.join('\n ');
          alert(`${error.message}:\n ${details}`);
        } else {
          alert(`${error.extensions.code}: ${error.message}`);
        }
      }
      return result.data;
    } catch (e) {
      alert(`Error in sending data to server: ${e.message}`);
    }
  }

/* -------------------------------------------
   Section: Debug mode
------------------------------------------- */
const debug = true;

const logMessage = (...messages) => {
  if (debug) {
    console.log(...messages);
  }
};

/* -------------------------------------------
   Section: Code
------------------------------------------- */
class IssueFilter extends React.Component {
  constructor() {
    super();
    this.state = { filterStatus: 'New' };
    this.setField = this.setField.bind(this);
  }

  setField(field, value) {
    this.setState({ [field]: value });
    console.log(`[IssueFilterStatus] ${field} set to:`, value);
  }

    render() {
      const { filterStatus } = this.state;
      const { issues } = this.props;

      const headerTable = ['ID', 'Status', 'Owner', 'Effort', 'Created', 'Due', 'Title'];
      const filteredIssues = issues.filter(issue => issue.status === filterStatus);
      const issueRows = filteredIssues.map(issue => <IssueRow key={issue.id} issue={issue} />);

      return (
        <View style={styles.innerView}>
        {/****** Q1: Start Coding here. ******/}

        <Text style={styles.subHeader}>Issue Filter</Text>

        <View style={styles.formRow}>
          <Text style={styles.filterLabel}>Filter by Status:</Text>
          <Picker
            selectedValue={this.state.filterStatus}
            onValueChange={(itemValue) => this.setField('filterStatus', itemValue)}
            style={styles.picker}
            >
            <Picker.Item label="New" value="New" style={styles.pickerItem} />
            <Picker.Item label="Assigned" value="Assigned" style={styles.pickerItem} />
            <Picker.Item label="Fixed" value="Fixed" style={styles.pickerItem} />
            <Picker.Item label="Closed" value="Closed" style={styles.pickerItem} />
          </Picker>
        </View>

        <Text></Text>
        
        {issueRows.length === 0 ? (
        <Text style={styles.noFilterText}>No issues with <Text style={{ fontWeight: 'bold' }}>Status: "{filterStatus}"</Text>.</Text>
      ) : (

        <ScrollView horizontal={true}>
          <View style={styles.container}>
            <Table>
              <Row data={headerTable} textStyle={styles.tableHeader} style={styles.header} widthArr={width} />
            </Table>

            <ScrollView style={styles.dataWrapper}>
              <Table>{issueRows}</Table>
            </ScrollView>
          </View>
        </ScrollView>

      )}

        {/****** Q1: Code ends here ******/}
        </View>
      );
    }
}

/* -------------------------------------------
   Section: CSS
------------------------------------------- */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  header: { height: 50, backgroundColor: '#537791' },
  text: { textAlign: 'center' },
  dataWrapper: { marginTop: -1 },
  row: { height: 40, backgroundColor: '#E7E6E1'},

  innerView : { padding: 10, flex: 1 },
  
  topHeader : { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center'},
  subHeader : { fontWeight: 'bold', marginBottom: 10, },
  horizontalLine: { borderBottomColor: '#ccc', borderBottomWidth: 1, marginVertical: 10, },

  bullet: { marginLeft: 20, marginBottom: 5, },

  activeButton: {backgroundColor: '#d8e7ff',},
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10, },
  button: { paddingVertical: 10, paddingHorizontal: 15, backgroundColor: '#D3D3D3', borderRadius: 5, },
  buttonText: {textTransform: 'none',  },

  tableHeader: { fontWeight: 'bold', color: '#fff', marginBottom: 10, textAlign: 'center' },
  filterLabel: {  marginRight: 10, fontWeight: 'bold', width: 110 },
  noFilterText: { marginTop: 20, fontSize: 16, color: 'gray', textAlign: 'center',},
  formLabel: {  marginRight: 10, fontWeight: 'bold', width: 50 },
  formRow: { flexDirection: 'row', alignItems: 'center', marginBottom: -20 },
  picker: { width: 150 },
  pickerItem: { fontSize: 15 },
  });

const width= [40,80,80,50,80,80,200];

/* -------------------------------------------
   Section: Code
------------------------------------------- */
function IssueRow(props) {
    const issue = props.issue;

    {/****** Q2: Coding Starts here. Create a row of data in a variable******/}
    const issueRow = [issue.id, issue.status, issue.owner, issue.effort, issue.created.toDateString(), issue.due ? issue.due.toDateString() : 'Open', issue.title];
    {/****** Q2: Coding Ends here.******/}

    const statusColor = {
      New: '#f9d589',
      Assigned: '#96c4b7', 
      Fixed: '#7d98c5', 
      Closed: '#a687c3', 
    };

    const statusStyle = {
      ...styles.row,
      backgroundColor: statusColor[issue.status] || '#E7E6E1',
    };

    return (
      <>
      {/****** Q2: Start Coding here. Add Logic to render a row  ******/}
      <Row
        data={issueRow.map((cell, index) => index === 1 ?
          (<Text style={[styles.text, { backgroundColor: statusColor[issue.status] }]}>{cell}</Text>) :
          (<Text style={styles.text}>{cell}</Text>)
        )}
        style={styles.row} widthArr={width} />
      {/****** Q2: Coding Ends here. ******/}  
      </>
    );
  }
  
  function IssueTable(props) {
    const issueRows = props.issues.map(issue =><IssueRow key={issue.id} issue={issue} />);

    {/****** Q2: Start Coding here. Add Logic to initalize table header  ******/}
    logMessage('[IssueTable] props - ', props);
    logMessage('[IssueTable] issueRows -', issueRows);

    const headerTable = ['ID', 'Status', 'Owner', 'Effort', 'Created', 'Due', 'Title'];
    {/****** Q2: Coding Ends here. ******/}
    return (
      <View style={styles.innerView}>
        <Text style={styles.subHeader}>Issue Table</Text>

        <ScrollView horizontal={true}>
          <View style={styles.container}>
          {/****** Q2: Start Coding here to render the table header/rows.**********/} 
            <Table>
              <Row data={headerTable} textStyle={styles.tableHeader} style={styles.header} widthArr={width}/>
            </Table>
            
            <ScrollView style={styles.dataWrapper}>
              <Table>{issueRows}</Table>
            </ScrollView>
          {/****** Q2: Coding Ends here. ******/}
          </View>
        </ScrollView>
      </View>
    );
  }

  class IssueAdd extends React.Component {
    constructor() {
      super();
      this.handleSubmit = this.handleSubmit.bind(this);
      /****** Q3: Start Coding here. Create State to hold inputs******/
      this.state = this.getInitialState();
      /****** Q3: Code Ends here. ******/
    }

    getInitialState() {
      const oneWeekLater= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      return {status: 'New', owner: 'Open', effort: 0, due: oneWeekLater, title: ''};
    }

    /****** Q3: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
    setField(field, input){
        this.setState({ [field]: input });
        logMessage(`[IssueAdd] ${field}_field set to:`, input);
    }
    /****** Q3: Code Ends here. ******/
    
    handleSubmit() {
      /****** Q3: Start Coding here. Create an issue from state variables and call createIssue. Also, clear input field in front-end******/
      const { status, owner, effort, due, title } = this.state;
      logMessage('[IssueAdd] Submitting Issue:', this.state);

      // ------------------- Check owner name if status is Assigned, Fixed or Closed.
      if (status !== 'New' && (owner === 'Open' || owner === '')) {
        Alert.alert('Validation Error', 'Owner field required if status is not New.');
        return;
      }

      // ------------------- Check that effort is an integer.
      const effortValue = Number(effort);
      if (isNaN(effortValue)) {
        logMessage('Checking if effortValue is a number');
        Alert.alert('Validation Error', 'Effort field should be an integer.');
        return;
      }

      // ------------------- Check that due date is in MM/DD/YYYY format.
      const mmddyyyyPattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
      let dueDate;

      if (due instanceof Date){
        dueDate = due;
      } else if (due === ''){
        dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      } else if(mmddyyyyPattern.test(due)){
        logMessage('Check mmddyyyyPattern');
        const [month, day, year] = due.split('/');
        dueDate = new Date(year, month - 1, day);
      } else {
        logMessage(due);
        Alert.alert('Validation Error', 'Due date field must be in MM/DD/YYYY format.');
        return;
      }

      // ------------------- Check if all required fields are filled
      if ( !title || !status ) {
        Alert.alert('Validation Error', 'Title field is required.');
        return;
      }

      const issue = { status, owner, effort: effortValue, due: dueDate, title };
      logMessage('[IssueAdd] Adding Issue:', issue);
      this.props.createIssue(issue);

      this.setState(this.getInitialState());

      this.ownerInput.clear();
      this.effortInput.clear();
      this.dueInput.clear();
      this.titleInput.clear();

      /****** Q3: Code Ends here. ******/
    }
  
    render() {
      return (
          <View style={styles.innerView}>         
          {/****** Q3: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
            <Text style={styles.subHeader}>Issue Add</Text>
            <Text>(*) required</Text>

            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Status</Text>
              <Picker
                selectedValue={this.state.status}
                onValueChange={(itemValue) => this.setField('status', itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="New" value="New" style={styles.pickerItem} />
                <Picker.Item label="Assigned" value="Assigned" style={styles.pickerItem} />
                <Picker.Item label="Fixed" value="Fixed" style={styles.pickerItem} />
                <Picker.Item label="Closed" value="Closed" style={styles.pickerItem} />
              </Picker>
            </View>

            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Owner</Text>
              <TextInput ref={input => {this.ownerInput = input;}} placeholder="Name" onChangeText={(textValue) => this.setField("owner", textValue)} />
            </View>

            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Effort</Text>
              <TextInput ref={input => {this.effortInput = input;}} keyboardType="numeric" maxLength={2} placeholder="2-digit number" onChangeText={(textValue) => this.setField("effort", textValue)} />
            </View>

            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Due</Text>
              <TextInput ref={input => {this.dueInput = input;}} placeholder="MM/DD/YYYY" onChangeText={(textValue) => this.setField("due", textValue)} />
            </View>

            <View style={[styles.formRow, { marginBottom: 10 }]}>
              <Text style={styles.formLabel}>Title(*)</Text>
              <TextInput ref={input => {this.titleInput = input;}} placeholder="Description" onChangeText={(textValue) => this.setField("title", textValue)} />
            </View>

            {/* <TextInput ref={input => {this.statusInput = input;}} placeholder="Status" onChangeText={(textValue) => this.setField("status", textValue)} /> */}
            
            <Button onPress={this.handleSubmit} title="Add Issue"/>
          {/****** Q3: Code Ends here. ******/}
          </View>
      );
    }
  }

class BlackList extends React.Component {
    constructor()
    {   super();
        this.handleSubmit = this.handleSubmit.bind(this);
        /****** Q4: Start Coding here. Create State to hold inputs******/
        this.state = {name: ''};
        /****** Q4: Code Ends here. ******/
    }
    /****** Q4: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
    setName(newName) {
        this.setState({name: newName}); // Updates compoent's state when there is a change in TextInput.
    }
    /****** Q4: Code Ends here. ******/

    async handleSubmit() {
    /****** Q4: Start Coding here. Create an issue from state variables and issue a query. Also, clear input field in front-end******/
      
      if (this.state.name === '') {
        Alert.alert('Validation Error', 'Name field is required.');
        return;
      }

      const query = `mutation addToBlacklist ($newName: String!){addToBlacklist(nameInput: $newName)}`;
      const newName = this.state.name;
      logMessage('[Blacklist] Adding to Blacklist:', newName);
      const data = await graphQLFetch(query, { newName });
      logMessage(data);

      this.setState({ name: '' });
      this.newNameInput.clear();
    /****** Q4: Code Ends here. ******/
    }

    render() {
    return (
        <View style={styles.innerView}>
        {/****** Q4: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
          <Text style={styles.subHeader}>Blacklist</Text>
          <TextInput ref={input => {this.newNameInput = input;}} placeholder="Name to Blacklist" onChangeText={(newName) => this.setName(newName)} />
          <Button onPress={this.handleSubmit} title="Add to Blacklist"/>
        {/****** Q4: Code Ends here. ******/}
        </View>
    );
    }
}

export default class IssueList extends React.Component {
    constructor() {
        super();
        this.state = { issues: [], display: 1 };
        this.createIssue = this.createIssue.bind(this);
        this.setDisplay = this.setDisplay.bind(this);
    }

    setDisplay(value){
      this.setState({display: value});
    }
    
    componentDidMount() {
    this.loadData();
    }

    async loadData() {
    const query = `query {
        issueList {
        id title status owner
        created effort due
        }
    }`;

    const data = await graphQLFetch(query);
    if (data) {
        this.setState({ issues: data.issueList });
    }
    }

    async createIssue(issue) {
      logMessage('[IssueList] Creating Issue:', issue);
    const query = `mutation issueAdd($issue: IssueInputs!) {
        issueAdd(issue: $issue) {
        id
        }
    }`;

    const data = await graphQLFetch(query, { issue });
    if (data) {
        this.loadData();
    }
    }
    
    render() {
    return (
    <>
      <Text style={styles.topHeader}>Issue Tracker</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={() => this.setDisplay(1)} style={[styles.button, this.state.display === 1 && styles.activeButton]}>
          <Text style={styles.buttonText}>Issue Filter</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.setDisplay(2)} style={[styles.button, this.state.display === 2 && styles.activeButton]}>
          <Text style={styles.buttonText}>Issue Table</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.setDisplay(3)} style={[styles.button, this.state.display === 3 && styles.activeButton]}>
          <Text style={styles.buttonText}>Issue Add</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => this.setDisplay(4)} style={[styles.button, this.state.display === 4 && styles.activeButton]}>
          <Text style={styles.buttonText}>Blacklist</Text>
        </TouchableOpacity>

        {/* <Button onPress={()=>this.setDisplay(1)} title="Issue Filter"/>
        <Button onPress={()=>this.setDisplay(2)} title="Issue Table"/>
        <Button onPress={()=>this.setDisplay(3)} title="Issue Add"/>
        <Button onPress={()=>this.setDisplay(4)} title="Blacklist"/> */}
      </View>

      {/****** Q1: Start Coding here. ******/}
      {this.state.display === 1 ? <IssueFilter issues={this.state.issues} /> : <View style={styles.horizontalLine} />}
      {/****** Q1: Code ends here ******/}


      {/****** Q2: Start Coding here. ******/}
      {this.state.display === 2 ? <IssueTable issues={this.state.issues} /> : <View style={styles.horizontalLine} />}
      {/****** Q2: Code ends here ******/}

      
      {/****** Q3: Start Coding here. ******/}
      {this.state.display === 3 ?  <IssueAdd createIssue={this.createIssue} /> : <View style={styles.horizontalLine} />}
      {/****** Q3: Code Ends here. ******/}

      {/****** Q4: Start Coding here. ******/}
      {this.state.display === 4 ?  <BlackList /> : <View style={styles.horizontalLine} />}
      {/****** Q4: Code Ends here. ******/}
    </>
      
    );
  }
}
