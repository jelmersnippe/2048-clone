import {Dimensions} from 'react-native';

const ROW_LENGTH = 4;
const GRID_SIZE = Dimensions.get('window').width - 40;
const CELL_SIZE = GRID_SIZE / ROW_LENGTH;

export const theme = {
    ROW_LENGTH,
    GRID_SIZE,
    CELL_SIZE
};
