/* OverviewListCard.js
 * Written by Liv Phillips for Energy App Comps, 2018
 * First level detail cards for Overview page, giving basic details about turbine energy, energy usage,
 * and energy generation.
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableHighlight, Image, Platform } from 'react-native';
import { connect } from 'react-redux';
import { Card, Button } from 'react-native-elements'
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Comparator from './../helpers/Comparators';
import Graph from './../visualizations/Graph';
import { default as CustomThemes } from './../visualizations/GraphThemes';
import { GetStyle } from './../styling/Themes';
import CurrTheme from './../styling/CurrentTheme';
import { moderateScale } from './../helpers/General';

const theme = GetStyle(CurrTheme);

@connect(
    state => ({
        currentData: state.data.currentData,
        totals: state.data.currentTotals,
        loading: state.data.loading,
        windRatio: state.data.windRatio,
        ui: state.ui
    }),
    dispatch => ({
        refresh: () => dispatch({type: 'GET_GRAPH_DATA'}),
    }),
)

export default class OverviewListCard extends Component {
    // Navigate to correct screen based on which card was pressed
    returnScreen = ( item, navigation ) => {
        switch(item.title) {
            case "Wind Turbine Energy":
                navigation.navigate('TurbineView',
                           {graphType:item.graphType, data:item.data, title: item.title});
                break;

            case "Energy Use":
                navigation.navigate('OverviewCardView',
                           {graphType:item.graphType, data:item.data, title: item.title, card: 1});
                break;

            case "Energy Generation":
                navigation.navigate('OverviewCardView',
                           {graphType:item.graphType, data:item.data, title: item.title, card: 2});
                 break;

            default:
                alert("Sorry, this is a fake card for viewing purposes only.");
        }
    }

    // Return different views based on the card type
    returnUnique = () => {
        item = this.props.cardItem;

        switch (item.title) {
            case "Wind Turbine Energy":
                return(
                  <View style={[{height: moderateScale(160), width: moderateScale(280)}]}>
                  <View style={[theme.container, { alignItems: 'center' }, theme.flexboxRow]}>
                    <Image source={require('./../assets/images/windmillCard.png')}
                      defaultSource={require('./../assets/images/windmillCard.png')}
                      resizeMode="contain"
                      style={{ flex: 0.5, height: moderateScale(150), width: moderateScale(102), marginLeft: '-20%'}} />
                    <View style={[{alignItems: 'center', marginLeft: '-45%', marginTop: '15%', flex: 0.5 }]}>
                        <Text style={[ styles.font, theme.fontRegular, { color: 'black' } ]}>
                          Wind energy currently
                        </Text>
                        <Text style={[ styles.font, theme.fontRegular, { color: 'black' } ]}>
                          makes up
                        </Text>
                        <Text style={[ styles.font, theme.fontBold, { fontSize: 16, color: '#0B5091' }]}>
                          {this.props.windRatio["percentage"]}%
                        </Text>
                        <Text style={[ styles.font, theme.fontRegular, { color: 'black' } ]}>
                          of overall energy use.
                        </Text>
                    </View>
                  </View>
                  </View>
              );
            break;

            case "Energy Use":
                return(
                    <Graph
                        type={item.graphType}
                        legend={true}
                        theme={CustomThemes.carleton}
                        graphData={this.props.currentData.usage}/>
                );
                break;

            case "Energy Generation":
                return(
                    <Graph
                      type={item.graphType}
                      legend={true}
                      theme={CustomThemes.carleton}
                      graphData={this.props.currentData.generation}/>
                );
                break;

            default:
                break;
        }
    }

    render() {
        var item = this.props.cardItem;
        var navigation = this.props.cardNavigation;

        const { refresh, loading, currentData, windRatio, totals, ui } = this.props;
        var uniquePortion = this.returnUnique();

        var margins = '3%';
        if (ui.layout.height < 600) {
            margins = '0%';
        }


        return(
            <Card
             containerStyle={[styles.card, theme.flex, { marginRight: margins, marginLeft: margins}]}
             title={item.title}
             titleStyle={[styles.title, theme.fontRegular]}
             dividerStyle={styles.divider}>

             <TouchableHighlight
                onPress={() => this.returnScreen(item, navigation)}
                underlayColor="transparent">
            <View pointerEvents="none" style={[theme.container, theme.flexboxRow]}>
                {uniquePortion}

                <TouchableHighlight
                    onPress={() => this.returnScreen(item, navigation)}
                    underlayColor="transparent"
                    style={[styles.button, {position: 'absolute', right: 0}]}>

                    <FontAwesome name="angle-right" size={moderateScale(40)} color="#0B5091" />

                </TouchableHighlight>

            </View>
            </TouchableHighlight>

            {item.title === "Energy Use" &&
                <Comparator
                     data={currentData.usage}
                     total={totals.usage}
                     cardType="use"
                     number={1}/>
            }

            {item.title === "Energy Generation" &&
                <Comparator
                     data={currentData.generation}
                     total={totals.generation}
                     cardType="generation"
                     number={1}/>
            }
            </Card>

        );

    }
}

const styles = StyleSheet.create({
  button: {
    marginRight: '3%',
    paddingTop: '3%',
    paddingBottom: '3%',
  },

  divider: {
    marginBottom: 5,
  },

  font: {
    fontSize: moderateScale(14),
    color: '#647C92',
    paddingBottom: '3%',
    backgroundColor: 'transparent',
  },

  list: {
      marginLeft: '3%',
      marginRight: '3%',
  },

  title: {
    fontSize: moderateScale(18),
    marginBottom: 10,
    fontWeight: 'normal'
  },

  card: {
    backgroundColor: 'white',
    borderColor:'#e1e8ee',
    borderWidth: 1,
    borderRadius: 5,

    ...Platform.select({
          ios: {
            shadowColor: 'rgba(0,0,0, .2)',
          },})
  }
})