// Design tokens ported from the web app (26JrProj_FoodAtHome src/lib/styles).

export const Colors = {
  textDefault: "#444955",
  textSecondary: "#737780",
  textBrandSecondary: "#A07AD9",
  textOnAction: "#FFFFFF",
  textDanger: "#FF0000",
  bgPagePrimary: "#FCFBFA",
  bgPageSecondary: "#FFFFFF",
  brandPrimary: "#0FA376",
  brandPrimaryLight: "#E7F6F1",
  warning: "#FF9040",
  warningLight: "#FFF0E5",
  borderSecondary: "#DADBDD",
  progressTrack: "rgba(120, 120, 120, 0.20)",
};

export const Fonts = {
  quicksandBold: "Quicksand_700Bold",
  nunitoMedium: "Nunito_500Medium",
  nunitoBold: "Nunito_700Bold",
};

export const Typography = {
  titleXl: { fontFamily: Fonts.quicksandBold, fontSize: 32, lineHeight: 40 },
  titleLg: { fontFamily: Fonts.quicksandBold, fontSize: 24, lineHeight: 32 },
  titleMd: { fontFamily: Fonts.quicksandBold, fontSize: 20, lineHeight: 24 },
  titleSm: { fontFamily: Fonts.nunitoBold, fontSize: 18, lineHeight: 24 },
  button: { fontFamily: Fonts.quicksandBold, fontSize: 18, lineHeight: 24 },
  bodyLg: { fontFamily: Fonts.nunitoMedium, fontSize: 20, lineHeight: 24 },
  bodyLgBold: { fontFamily: Fonts.nunitoBold, fontSize: 20, lineHeight: 24 },
  bodyMd: { fontFamily: Fonts.nunitoMedium, fontSize: 16, lineHeight: 20 },
  bodyMdBold: { fontFamily: Fonts.nunitoBold, fontSize: 16, lineHeight: 20 },
  bodySm: { fontFamily: Fonts.nunitoMedium, fontSize: 14, lineHeight: 16 },
  bodySmBold: { fontFamily: Fonts.nunitoBold, fontSize: 14, lineHeight: 16 },
  bodyXsm: { fontFamily: Fonts.nunitoMedium, fontSize: 12, lineHeight: 16 },
  bodyXsmBold: { fontFamily: Fonts.nunitoBold, fontSize: 12, lineHeight: 16 },
};

export const Layout = {
  pagePadding: 24,
  sectionGap: 24,
};

export const Shadows = {
  card: "0px 1px 4px rgba(12, 12, 13, 0.05), 0px 1px 4px rgba(12, 12, 13, 0.10)",
  navBar: "0px -1px 4px rgba(0, 0, 0, 0.1), 0px -1px 2px rgba(0, 0, 0, 0.06)",
};
