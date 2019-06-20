import React, { Component } from "react";
import { 
    StyleSheet,
    FlatList,
    View, 
    Text, 
    Image,
    Button
} from "react-native";
import { 
    Container,
    Content,
    Header,
    Form, 
    Item, 
    Input 
} from 'native-base';
import Modal from "react-native-modal";
import firebase from 'react-native-firebase';
import DatePicker from 'react-native-datepicker';
import TransItem from './TransItem';


/*
    other import statements or 
    JS variables like const here - can be dummy data to use for development
*/
export default class Trans extends Component {
    constructor() {
      super();
      this.ref = firebase.firestore().collection('trans');
      this.unsubscribe = null;
      this.state = {
        isModalVisible: false,
        isDateTimePickerVisible: false,
        title: '',
        amount: '',
        category: '',
        date: '',
        loading: true,
        trans: [],
      }
    }

    componentDidMount() {
      this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate)
    }
  
    componentWillUnmount() {
      this.unsubscribe();
    }
    
    onCollectionUpdate = (querySnapshot) => {
      const trans = [];
      querySnapshot.forEach((doc) => {
        const { title, amount, category, date } = doc.data();
        
        trans.push({
          key: doc.id,
          doc, // DocumentSnapshot
          title,
          amount,
          category,
          date
        });
      });
    
      this.setState({ 
        trans,
        loading: false,
     });
    }

    updateTransactionTitle(title) {
      this.setState({title: title})
    }

    updateTransactionAmount(amount) {
      this.setState({amount: amount})
    }

    updateTransactionCategory(category) {
      this.setState({category: category})
    }

    updateTransactionDate(date) {
      this.setState({date: date})
    }

    addTransaction() {
      this.ref.add({
        title: this.state.title,
        amount: this.state.amount,
        category: this.state.category,
        date: this.state.date
      });
      this.setState({
        title: '',
        amount: '',
        category: '',
        date: '15-08-1999',
      });
    }

    toggleModal() {
      this.setState({ isModalVisible: !this.state.isModalVisible });
    }
    
    confirmButton = () => {
      this.toggleModal();
      this.addTransaction();
    };

    render() {
      if (this.state.loading) {
        return null; // or render a loading icon
      }

        return (
            <View>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Transactions</Text>
                </View>

                
                <FlatList 
                  data={this.state.trans}
                  renderItem={({ item }) => <TransItem {...item}/>}
                />

                {/* Add transactions popup window */}
                <View style = {styles.addButton}>
                  <Button title="Add transaction" onPress={() => this.toggleModal()} />
                  <Modal isVisible={this.state.isModalVisible}>
                
                      <View style = {styles.addButtonWindow}>
                        <Form>
                          <Item>
                            <Input 
                              placeholder = "Title"
                              value = {this.state.title}
                              onChangeText={(text) => this.updateTransactionTitle(text)}
                            />
                          </Item>
                          <Item>
                            <Input 
                              placeholder = "Amount"
                              keyboardType = 'numeric'
                              value = {this.state.amount}
                              onChangeText={(text) => this.updateTransactionAmount(text)}
                            />
                          </Item>
                          <Item>
                            <Input 
                              placeholder = "Category"
                              value = {this.state.category}
                              onChangeText={(text) => this.updateTransactionCategory(text)}
                            />
                          </Item>
                        </Form>
                        <DatePicker
                          style={{width: 200}}
                          date={this.state.date} //initial date from state
                          mode="date" //The enum of date, datetime and time
                          placeholder="Select Date"
                          format="DD-MM-YYYY"
                          confirmBtnText="Confirm"
                          cancelBtnText="Cancel"
                          customStyles={{
                            dateIcon: {
                              position: 'absolute',
                              left: 0,
                              top: 4,
                              marginLeft: 10
                            },
                            dateInput: {
                              marginLeft: 36,
                              fontSize: 30
                            }
                          }}
                          onDateChange={(date) => {this.updateTransactionDate(date)}}
                        />
                        </View>
                      
                    <Button 
                      title="Confirm" 
                      disabled={!this.state.title.length ||
                                !this.state.amount.length ||
                                !this.state.category.length ||
                                !this.state.date.length}
                      onPress={this.confirmButton}/>
                    <Button title="Cancel" onPress={() => this.toggleModal()} />
                      
                  </Modal>
                </View>
                
            
          </View>
            
            
        );
    }
}

/**
 * StyleSheet
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#7ACCC7",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 10,
    borderBottomColor: "#ddd",
  },
  headerText: {
    color: "white",
    fontSize: 18,
    padding: 26,
  },
  scrollContainer: {
    flex: 1,
    marginTop: 50
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  textInput: {
    alignSelf: "stretch",
    color: "#fff",
    padding: 20,
    backgroundColor: "#252525",
    borderTopWidth: 2,
    borderTopColor: "#ededed",
  },
  addButton: {
    position: "absolute",
    zIndex: 11,
    top: 450,
    right: 40,
    backgroundColor: "#7ACCC7",
    width: 300,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 10,
  },
  addButtonWindow: {
    backgroundColor: "#00B386",
    borderRadius: 5,
  }
});
