import React, {useState} from 'react';
import { Alert } from 'react-native';
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
    render() {
      return (
        <>
        {/****** Q1: Start Coding here. ******/}
        <Text style={styles.subHeader}>Issue Filter</Text>
        <Text>[Placeholder for Issue Filter.]</Text>
        {/****** Q1: Code ends here ******/}
        </>
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
  
  subHeader : {fontWeight: 'bold'},

  formLabel: {  marginRight: 10, fontWeight: 'bold', width: 50},
  formRow: { flexDirection: 'row', alignItems: 'center', marginBottom: -20},
  picker: {width: 150 },
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
    return (
      <>
      {/****** Q2: Start Coding here. Add Logic to render a row  ******/}
        <Row data={issueRow} style={styles.row} textStyle={styles.text} widthArr={width}/>
      {/****** Q2: Coding Ends here. ******/}  
      </>
    );
  }
  
  function IssueTable(props) {
    const issueRows = props.issues.map(issue =>
      <IssueRow key={issue.id} issue={issue} />
    );

    {/****** Q2: Start Coding here. Add Logic to initalize table header  ******/}
    logMessage('[IssueTable]', props);
    logMessage('[IssueTable]', issueRows);

    const headerTable = ['ID', 'Status', 'Owner', 'Effort', 'Created', 'Due', 'Title'];
    {/****** Q2: Coding Ends here. ******/}
    return (
      <>
        <Text style={styles.subHeader}>Issue Table</Text>
        <ScrollView horizontal={true}>
          <View style={styles.container}>
          {/****** Q2: Start Coding here to render the table header/rows.**********/} 
            <Table>
              <Row data={headerTable} style={styles.header} textStyle={styles.text} widthArr={width}/>
              <ScrollView style={styles.dataWrapper}>{issueRows}</ScrollView>
            </Table>
          {/****** Q2: Coding Ends here. ******/}
          </View>
        </ScrollView>
      </>
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
      return {status: 'New', owner: '', effort: '', due: oneWeekLater, title: ''};
    }

  
    /****** Q3: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
    setField(field, input){
      if (field === 'effort') {

        const effortValue = parseInt(input, 10) || 0; // 0 if not a valid number.
        this.setState({ [field]: effortValue });
        logMessage(`[IssueAdd] effort_field set to:`, effortValue);

      } else if (field === 'due' && input !== null) {

        const filteredInput = input.replace(/[^0-9/]/g, '');
        const [month, day, year] = filteredInput.split('/');

        const dueDate = new Date(year, month - 1, day);
        this.setState({ [field]: dueDate });
        logMessage(`[IssueAdd] due_field set to:`, dueDate);

      }  else {

        this.setState({ [field]: input });
        logMessage(`[IssueAdd] ${field}_field set to:`, input);

      }

    }
    /****** Q3: Code Ends here. ******/
    
    handleSubmit() {
      /****** Q3: Start Coding here. Create an issue from state variables and call createIssue. Also, clear input field in front-end******/
      const { status, owner, effort, due, title } = this.state;

      // Check if all required fields are filled
      if ( !title || !status ) {
        Alert.alert('Validation Error', 'Title and Status fields are required.');
        return;
      }

      const issue = this.state;
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
          <View>         
          {/****** Q3: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
            <Text style={styles.subHeader}>Issue Add</Text>

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
              <TextInput ref={input => {this.effortInput = input;}} placeholder="0-10" onChangeText={(textValue) => this.setField("effort", textValue)} />
            </View>

            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Due</Text>
              <TextInput ref={input => {this.dueInput = input;}} placeholder="MM/DD/YYYY" onChangeText={(textValue) => this.setField("due", textValue)} />
            </View>

            <View style={[styles.formRow, { marginBottom: 10 }]}>
              <Text style={styles.formLabel}>Title</Text>
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
      const query = `mutation addToBlacklist ($newName: String!){addToBlacklist(nameInput: $newName)}`;
      const newName = this.state.name;
      logMessage('[Blacklist] Adding to Blacklist:', newName);
      const data = await graphQLFetch(query, { newName });
      logMessage(data);
      this.newNameInput.clear();
    /****** Q4: Code Ends here. ******/
    }

    render() {
    return (
        <View>
        {/****** Q4: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
          <Text style={styles.subHeader}>BlackList</Text>
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
        this.state = { issues: [] };
        this.createIssue = this.createIssue.bind(this);
    }
    
    componentDidMount() {
    this.loadData();
    }

    componentDidUpdate(){
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
    {/****** Q1: Start Coding here. ******/}
    <IssueFilter />
    {/****** Q1: Code ends here ******/}


    {/****** Q2: Start Coding here. ******/}
    <IssueTable issues={this.state.issues} />
    {/****** Q2: Code ends here ******/}

    
    {/****** Q3: Start Coding here. ******/}
    <IssueAdd createIssue={this.createIssue}/>
    {/****** Q3: Code Ends here. ******/}

    {/****** Q4: Start Coding here. ******/}
    <BlackList />
    {/****** Q4: Code Ends here. ******/}
    </>
      
    );
  }
}
