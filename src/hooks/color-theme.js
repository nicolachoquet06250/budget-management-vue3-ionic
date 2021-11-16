const DARK = true;
const LIGHT = false;

export const useTheme = () => ({
    bgPrimary: {
        [DARK]: 'black',
        [LIGHT]: 'blue'
    }, 
    bgSecondary: {
        [DARK]: 'black',
        [LIGHT]: 'white'
    },
    
    colorPrimary: {
        [DARK]: 'white',
        [LIGHT]: 'white'
    }, 
    colorSecondary: {
        [DARK]: 'gray',
        [LIGHT]: 'black'
    }
});