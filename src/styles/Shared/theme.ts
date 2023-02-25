import { createTheme } from "@material-ui/core/styles";

const defaultTheme = createTheme();

export const BLURPLE = "#7289DA";
export const BLACK = defaultTheme.palette.grey[900];
export const WHITE = defaultTheme.palette.grey[100];
export const PRIMARY_MAIN = defaultTheme.palette.grey[400];

export const BLURPLE_BUTTON_COLORS = {
  backgroundColor: BLURPLE,
  "&:hover": {
    backgroundColor: "#637DC9",
  },
  "&:active": {
    backgroundColor: "#4666A8",
  },
};

const globalTheme = createTheme({
  typography: {
    fontFamily: "Inter",
  },

  palette: {
    primary: {
      main: PRIMARY_MAIN,
      dark: defaultTheme.palette.grey[500],
      contrastText: defaultTheme.palette.grey[100],
    },
    secondary: {
      main: defaultTheme.palette.grey[700],
      dark: "rgb(55, 55, 55)",
    },
    background: {
      paper: defaultTheme.palette.grey[800],
    },
    action: {
      disabled: defaultTheme.palette.grey[500],
    },
  },

  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 850,
      lg: 1280,
      xl: 1920,
    },
  },
});

const muiTheme = createTheme({
  ...globalTheme,

  overrides: {
    MuiTypography: {
      root: {
        color: globalTheme.palette.primary.main,
      },
      colorPrimary: {
        color: globalTheme.palette.primary.contrastText,
      },
      h3: {
        fontSize: 40,
        marginBottom: 6,
      },
      h4: {
        marginTop: -10,
      },
      h6: {
        marginBottom: 6,
      },
      overline: {
        fontSize: "0.85rem",
        lineHeight: 1.8,
      },
      gutterBottom: {
        marginBottom: 24,
      },
    },

    MuiSvgIcon: {
      colorPrimary: {
        color: globalTheme.palette.primary.contrastText,
      },
      colorDisabled: {
        color: "rgb(100, 100, 100)",
      },
    },

    MuiPaper: {
      rounded: {
        borderRadius: 8,
      },
    },

    MuiCard: {
      root: {
        backgroundColor: globalTheme.palette.background.paper,
        marginBottom: 12,
      },
    },

    MuiContainer: {
      root: {
        [globalTheme.breakpoints.down("sm")]: {
          padding: "0 10px",
        },
      },
      maxWidthSm: {
        [globalTheme.breakpoints.up("md")]: {
          maxWidth: 680,
        },
      },
    },

    MuiInput: {
      root: {
        color: globalTheme.palette.primary.light,
      },
      input: {
        "&::placeholder": {
          color: WHITE,
        },
      },
      underline: {
        "&:before": {
          borderBottom: `1px solid ${globalTheme.palette.secondary.main}`,
        },
        "&:after": {
          borderBottom: `2px solid ${globalTheme.palette.primary.main}`,
        },
        "&:hover:not($disabled):not($focused):not($error):before": {
          borderBottom: `2px solid ${globalTheme.palette.secondary.main}`,
        },
      },
    },

    MuiInputLabel: {
      root: {
        color: "rgb(140, 140, 140)",
      },
    },

    MuiSelect: {
      icon: {
        color: globalTheme.palette.primary.main,
      },
    },

    MuiSwitch: {
      root: {
        "& .Mui-checked .MuiSwitch-thumb": {
          color: globalTheme.palette.primary.light,
        },
        "& .MuiSwitch-thumb": {
          color: globalTheme.palette.primary.dark,
        },
      },
    },

    MuiButton: {
      root: {
        borderRadius: 9999,
      },
      textPrimary: {
        color: globalTheme.palette.primary.contrastText,
      },
      containedPrimary: {
        backgroundColor: globalTheme.palette.background.paper,
        "&:hover": {
          backgroundColor: "rgb(60, 60, 60)",
        },
      },
      containedSecondary: {
        "&:hover": {
          backgroundColor: "rgb(80, 80, 80)",
        },
      },
      outlinedPrimary: {
        color: globalTheme.palette.primary.contrastText,
      },
    },

    MuiMenu: {
      paper: {
        backgroundColor: globalTheme.palette.background.paper,
      },
      list: {
        color: globalTheme.palette.primary.contrastText,
      },
    },

    MuiPopover: {
      paper: {
        backgroundColor: globalTheme.palette.background.paper,
      },
    },

    MuiTabs: {
      indicator: {
        backgroundColor: WHITE,
      },
      scrollButtons: {
        color: WHITE,
      },
    },

    MuiTab: {
      textColorInherit: {
        color: globalTheme.palette.primary.contrastText,
      },
    },

    MuiBreadcrumbs: {
      root: {
        marginBottom: 18,
      },
      separator: {
        color: globalTheme.palette.primary.main,
      },
    },

    MuiBottomNavigation: {
      root: {
        backgroundColor: "rgb(30, 30, 30)",
        position: "fixed",
        bottom: 0,
        zIndex: 5,
        width: "100%",
        height: 70,
      },
    },

    MuiBottomNavigationAction: {
      root: {
        color: globalTheme.palette.primary.dark,
        "&$selected": {
          color: WHITE,
          paddingTop: 0,
        },
        paddingTop: 0,
      },
    },

    MuiDialog: {
      paper: {
        backgroundColor: "rgb(50, 50, 50)",
      },
    },

    MuiToolbar: {
      root: {
        backgroundColor: "#1e1e1e",
      },
    },

    MuiSnackbar: {
      anchorOriginBottomCenter: {
        bottom: 85,
      },
    },

    MuiAccordion: {
      root: {
        "&:before": {
          backgroundColor: globalTheme.palette.secondary.main,
        },
      },
      rounded: {
        "&:first-child": {
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        },
        "&:last-child": {
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        },
      },
    },

    MuiAccordionDetails: {
      root: {
        paddingBottom: 32,
      },
    },

    MuiCircularProgress: {
      colorPrimary: {
        color: globalTheme.palette.primary.contrastText,
      },
      root: {
        display: "block",
        margin: 12,
      },
    },

    MuiLinearProgress: {
      colorPrimary: {
        backgroundColor: globalTheme.palette.background.paper,
      },
      barColorPrimary: {
        backgroundColor: WHITE,
      },
      root: {
        margin: 12,
      },
    },

    MuiDivider: {
      root: {
        backgroundColor: globalTheme.palette.secondary.main,
        marginTop: 6,
      },
    },
  },
});

export default muiTheme;
