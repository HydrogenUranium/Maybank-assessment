import { StylesConfig } from "react-select";

export const colors = {
    black: '#000',
    darkGrey: '#323232',
    grey: '#CECECE',
    lightGray: '#f2f2f2',
    red: '#d40511',
    none: 'none'
};

export const selectStyles: StylesConfig = {
    control: (base, { isFocused }) => ({
        ...base,
        border: `1px solid ${ isFocused ? colors.black : colors.grey}`,
        boxShadow: 'none',

        ':hover': {
            border: `1px solid ${colors.black}`,
            cursor: 'pointer',
        },
    }),
    menuList: (base) => ({
        ...base,
        border: `1px solid ${colors.grey}`,
        borderRadius: '3px',
    }),

    option: (base, { isSelected, }) => ({
        ...base,
        backgroundColor: isSelected ? colors.lightGray : colors.none,
        cursor: 'pointer',
        fontWeight: isSelected ? 'bold' : 'normal', 
        color: isSelected ? colors.red : colors.darkGrey,
        ":hover": {
            color: colors.red,
        },
        ":active": {
            backgroundColor: colors.grey,
        }
    }),
};
