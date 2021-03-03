import {Dimensions} from 'react-native';

const GRID_SIZE = Dimensions.get('window').width - 40;
const CELL_SIZE = GRID_SIZE / 4;

export const theme = {
    GRID_SIZE,
    CELL_SIZE
};
