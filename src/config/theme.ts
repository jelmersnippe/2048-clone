import {Dimensions} from 'react-native';

const ROW_LENGTH = 4;
const GRID_SIZE = Dimensions.get('window').width - 40;
const CELL_SIZE = GRID_SIZE / ROW_LENGTH;

const colors: {[key: string]: string} = {
    2: '#bc8a5f',
    4: '#c89f9c',
    8: '#f07167',
    16: '#f5cb5c',
    32: '#ff9f1c',
    64: '#d08c60',
    128: '#82c0cc',
    256: '#03045e',
    512: '#c77dff',
    1024: '#7b2cbf',
    2048: '#55a630',
    brown: 'brown',
    lightText: 'white',
    darkText: 'black',
    background: '#f0efeb'
};

export const theme = {
    ROW_LENGTH,
    GRID_SIZE,
    CELL_SIZE,
    colors
};
