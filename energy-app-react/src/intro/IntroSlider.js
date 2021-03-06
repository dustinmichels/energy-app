import React, { Component } from 'react';
import { Icon } from 'react-native-elements';
import { StyleSheet, View, Text, Image, AsyncStorage } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';

// List of icons: https://oblador.github.io/react-native-vector-icons/
// Slides shown in intro
const slides = [
  {
    key: 'Welcome',
    title: "Welcome to our comps",
    text: "Explore Carleton's energy usage at anytime. View energy, heat, and water consumption and generation by building or across campus. Don't forget about the turbines!",
    icon: 'tree',
    color: '#29ABE2',
    type: 'entypo'
  },
  {
    key: 'Data',
    title: "Data at your fingers",
    text: 'Get real-time data from key buildings on campus. Our app reads data from various meters within each building.',
    icon: 'ios-options-outline',
    color: '#A3A1FF',
    type: 'ionicon'
  },
  {
    key: 'Compare',
    title: "Compare buildings",
    text: "See how different buildings on campus compare in terms of energy use and generation. Select this compare icon on the top right of a building's information page to compare two buildings.",
    icon: 'compare-arrows',
    color: '#1a5fce',
    type: 'material-icons'
  },
  {
    key: 'Map',
    title: "Explore with an energy map",
    text: "View how all buildings are doing in terms of a utility consumption of your choice. Tap on a building to get the exact number in a callout, and then tap the callout to get more information on its building.",
    icon: 'map',
    color: '#ce197f',
    type: 'font-awesome'
  },
  {
    key: 'Sustainability',
    title: "Interested in being green?",
    text: "Check out the Learn tab to stay up to date with the latest news from Carleton's Sustainability Office. Discover more about the Sustainability Office and how you can get involved with sustainability at Carleton.",
    icon: 'graduation-cap',
    color: '#00b33c',
    type: 'font-awesome'
  },
];

// Documentation: https://github.com/Jacse/react-native-app-intro-slider
export default class IntroSlider extends Component {
  constructor(props) {
    super(props);
  }

  // Renders slide
  _renderItem = props => (
    <View
      style={[styles.mainContent, {
        paddingTop: props.topSpacer,
        paddingBottom: props.bottomSpacer,
        width: props.width,
        height: props.height,
        backgroundColor: props.color
      }]}
    >
      <Icon
        style={{ backgroundColor: 'transparent' }}
        name={props.icon}
        size={200}
        color="white"
        type={props.type}
      />
      <View>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.text}>{props.text}</Text>
      </View>
    </View>
  );

  // Renders next button
   _renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          name="ios-arrow-round-forward-outline"
          color="rgba(255, 255, 255, .9)"
          size={35}
          style={{ backgroundColor: 'transparent' }}
          type="ionicon"
        />
      </View>
    );
  }

  // Renders skip button
  _renderSkipButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          name="ios-arrow-round-forward-outline"
          color="rgba(255, 255, 255, .9)"
          size={35}
          style={{ backgroundColor: 'transparent' }}
          type="ionicon"
        />
      </View>
    );
  }

  // Handles done press on intro screen
  _onDone = () => {
    //console.log("Done button was pressed!")
    this.props.onDone(true);
  }
  
  // Renders checkmark button at final slide
  _renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon
          name="ios-checkmark-outline"
          color="rgba(255, 255, 255, .9)"
          size={35}
          style={{ backgroundColor: 'transparent' }}
          type="ionicon"
        />
      </View>
    );
  }

  render() {
    return (
      <AppIntroSlider
        slides={slides}
        renderItem={this._renderItem}
        renderDoneButton={this._renderDoneButton}
        renderNextButton={this._renderNextButton}
        showSkipButton
        onDone={this._onDone}
        onSkip={this._onDone}
      />
    );
  }
}

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  image: {
    width: 320,
    height: 320,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  }
});