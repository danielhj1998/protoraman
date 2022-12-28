export const getColors = (isDarkMode) => {
  if(isDarkMode) {
    return darkColorScheme;
  } else {
    return lightColorScheme;
  }
};

const darkColorScheme = {
  background: "#34343A",
  body: "#E5E5E5",
  green: "#8EBF40",
  orange: "#D6725C",
  gray: "#999999",
  placeholder: "#60606C",
}

const lightColorScheme = {
  background: "#FFFFFF",
  body: "#34343A",
  green: "#568708",
  orange: "#B1523D",
  gray: "#828282",
  placeholder: "#E6E6E6",
}
