const DARK = true;
const LIGHT = false;

export const useTheme = () => {
    return {
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
            [LIGHT]: 'gray'
        }, 
        colorSecondary: {
            [DARK]: 'gray',
            [LIGHT]: 'black'
        }
    };
};