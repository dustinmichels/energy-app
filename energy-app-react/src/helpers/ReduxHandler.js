/* GraphDetailCard.js
 * Written by Liv Phillips, Veronica Child, and Andrew Woosnam for Energy App Comps, 2018
 * Redux handles state for the app, including navigation. When the app starts up, redux is called during the
 * loading screen, & the screen does not disappear until all fetched data has been resolved.
 */

import { Platform, Dimensions } from 'react-native';
import { Provider, connect } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { getAllHistoricalGraphData, getAllCurrentGraphData, dateToTimestamp, cleanupData,
    getAllHistoricalBuildingGraphData, getAllCurrentBuildingGraphData } from './ApiWrappers';
import { calculateRatio, getSpecificRandom } from './General';



/* When adding new redux calls that you want to happen at start up, call them in this handler
 * but define them in their own reducer (see below) */
export const handler = store => next => action => {
    next(action);

    switch (action.type) {
        case 'GET_BUILDING_GRAPH_DATA':
            store.dispatch({type: 'GET_BUILDING_GRAPH_DATA_LOADING'});
            try {
                var historicalBuildingData = getAllHistoricalBuildingGraphData();
                var currentBuildingData = getAllCurrentBuildingGraphData();
                store.dispatch({
                    type: 'GET_BUILDING_GRAPH_DATA_RECEIVED',
                    historicalBuildingData,
                    currentBuildingData
                });
            } catch (error) {
                next({
                    type: 'GET_BUILDING_GRAPH_DATA_ERROR',
                });
            }

            break;
        case 'GET_GRAPH_DATA':
            store.dispatch({type: 'GET_GRAPH_DATA_LOADING'});
            try {
                var historicalData = getAllHistoricalGraphData();
                var current = getAllCurrentGraphData();
                var currentData = current.data;
                var currentTotals = current.totals;
                var windSpeed = currentData.windSpeed;
                var windRatio = calculateRatio(currentData);

                store.dispatch({
                    type: 'GET_GRAPH_DATA_RECEIVED',
                    historicalData,
                    currentData,
                    currentTotals,
                    windRatio,
                    windSpeed
                });
            } catch (error) {
                next({
                    type: 'GET_GRAPH_DATA_ERROR',
                });
            }

            break;
        case 'GET_LAYOUT':
            var layout = Dimensions.get('screen');
            store.dispatch({
                type: 'GET_LAYOUT_RECEIVED',
                layout,
            });
            break;
        case 'GET_TURBINE':
            store.dispatch({type: 'GET_TURBINE_DATA_LOADING'});
            var timeEnd = new Date();
            var timeStart = new Date();
            timeStart.setHours(timeEnd.getHours()-1);
            var start = dateToTimestamp(timeStart);
            var end = dateToTimestamp(timeEnd);

            var url = 'http://energycomps.its.carleton.edu/api/index.php/values/building/55/'+start+'/'+end;

            fetch(url)
                .then((response) => response.json())
                .then((jsonData) => {
                    jsonData = cleanupData(jsonData);
                    if (jsonData == 0) {
                        jsonData = getSpecificRandom(2, 1500, 1, 1);
                    }

                    return jsonData;
                })
                .then(turbineData => next({
                    type: 'GET_TURBINE_DATA_RECEIVED',
                    turbineData
                }))
                .catch(error => next({
                    type: 'GET_TURBINE_DATA_ERROR',
                    error
                }))
                break;

        case 'GET_SOLAR':
            store.dispatch({type: 'GET_SOLAR_DATA_LOADING'});
            var timeEnd = new Date();
            var timeStart = new Date();
            timeStart.setHours(timeEnd.getHours()-1);

            // Solar data are purely historical (up to 2018) at the moment 
            if (timeStart.getFullYear() == 2018){
                timeStart.setFullYear(2017);
                timeEnd.setFullYear(2017);
            }

            var start = dateToTimestamp(timeStart);
            var end = dateToTimestamp(timeEnd);

            var url = 'http://energycomps.its.carleton.edu/api/index.php/values/building/51/'+start+'/'+end;

            fetch(url)
                .then((response) => response.json())
                .then((jsonData) => {
                    jsonData = cleanupData(jsonData);
                     if (jsonData == 0) {
                        jsonData = getSpecificRandom(2, 560, 1, 1);
                    }
                    return jsonData;
                })
                .then(solarData => next({
                    type: 'GET_SOLAR_DATA_RECEIVED',
                    solarData
                }))
                .catch(error => next({
                    type: 'GET_SOLAR_DATA_ERROR',
                    error
                }))
                break;
        default:
            break;
    };
}

export const apiReducer = (state = { turbineData: [], solarData: [], loading: true}, action) => {
    switch (action.type) {
            case 'GET_TURBINE_LOADING':
                return {
                    ...state,
                    loading: true,
                };
            case 'GET_TURBINE_DATA_RECEIVED':
                return {
                    loading: false,
                    turbineData: action.turbineData,
                    solarData: state.solarData
                };
            case 'GET_TURBINE_DATA_ERROR':
                return state;

            case 'GET_SOLAR_LOADING':
                return {
                    ...state,
                    loading: true,
                };
            case 'GET_SOLAR_DATA_RECEIVED':
                return {
                    loading: false,
                    solarData: action.solarData,
                    turbineData: state.turbineData
                };
            case 'GET_SOLAR_DATA_ERROR':
                return state;

            default:
                return state;
        };
}

export const buildingDataReducer = (state = { historicalBuildingGraphData: [], currentBuildingGraphData: [], loading: true}, action) => {
    switch (action.type) {
        case 'GET_BUILDING_GRAPH_DATA_LOADING':
            return {
                ...state,
                loading:true,
            };
        case 'GET_BUILDING_GRAPH_DATA_RECEIVED':
            return {
                loading: false,
                historicalBuildingData: action.historicalBuildingData,
                currentBuildingData: action.currentBuildingData
            };
        case 'GET_BUILDING_GRAPH_DATA_ERROR':
            return state;
        default:
            return state;
        };
}

export const dataReducer = (state = { historicalGraphData: [], currentGraphData: [], currentTotals: [], windRatio: [],
                                      windSpeed: [], loading: true }, action) => {
    switch (action.type) {
        case 'GET_GRAPH_LOADING':
            return {
                ...state,
                loading: true,
            };
        case 'GET_GRAPH_DATA_RECEIVED':
            return {
                loading: false,
                historicalData: action.historicalData,
                currentData: action.currentData,
                currentTotals: action.currentTotals,
                windRatio: action.windRatio,
                windSpeed: action.windSpeed
            };
        case 'GET_GRAPH_DATA_ERROR':
            return state;
        default:
            return state;
    };
}

const initialState = {'height': 500, 'width': 500};

export const layoutReducer = (state = {layout: []}, action) => {
    const ui = Dimensions.get('screen');
    switch (action.type) {
        case 'GET_LAYOUT_RECEIVED':
            return {
                layout: action.layout,
            }
        default:
            return state;
    };
}