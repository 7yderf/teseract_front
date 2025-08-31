/* eslint-disable no-undef */
import { reactive } from "vue";

type ViewportKey =
  | "phone"
  | "phoneMid"
  | "phoneBig"
  | "phoneXbig"
  | "tabletSmall"
  | "tabletPortrait"
  | "tabletLandscape"
  | "desktop"
  | "desktopMid"
  | "desktopMidBig"
  | "desktopBig"
  | "desktopXbig";

const storeDevice = reactive({
  aside: {
    show: localStorage.aside ? JSON.parse(localStorage.aside) : true,
  },
  viewport: {
    phone: {
      query: "(max-width: 374px)",
      value: false,
    },
    phoneMid: {
      query: "(max-width: 375px)",
      value: false,
    }, // 375
    phoneBig: {
      query: "(min-width: 425px)",
      value: false,
    }, // 425
    phoneXbig: {
      query: "(min-width: 635px)",
      value: false,
    }, // 635
    tabletSmall: {
      query: "(min-width: 767px)",
      value: false,
    }, // 767
    tabletPortrait: {
      query: "(min-width: 991px)",
      value: false,
    }, // 991
    tabletLandscape: {
      query: "(min-width: 1023px)",
      value: false,
    }, // 1023
    desktop: {
      query: "(min-width: 1199px)",
      value: false,
    }, // 1200
    desktopMid: {
      query: "(min-width: 1319px)",
      value: false,
    }, // 1319
    desktopMidBig: {
      query: "(min-width: 1399px)",
      value: false,
    }, // 1400
    desktopBig: {
      query: "(min-width: 1919px)",
      value: false,
    }, // 1920
    desktopXbig: {
      query: "(min-width: 2559px)",
      value: false,
    }, // 2560
  },
  asideToggle: (isShow: any) => {
    storeDevice.aside.show = isShow;
    localStorage.aside = JSON.stringify(isShow);
  },
  loader: {
    show: false,
  },
  loaderToggle: (isShow: boolean) => {
    storeDevice.loader.show = isShow;
  },
  useMediaQuery(viewportType: ViewportKey) {
    const mobile = matchMedia(
      this.viewport[viewportType].query ?? "(min-width: 0px)"
    );
    this.viewport[viewportType].value = mobile.matches;
    const medialistener = (e: { matches: any }) => {
      this.viewport[viewportType].value = e.matches;
    };
    mobile.addEventListener("change", medialistener);
  },
});

export default storeDevice;
