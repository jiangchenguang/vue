import Vue from "./instance/index";
import { initGlobalAPI } from "./global-api/index";
import { GlobalAPI } from "types/globalAPI";

// @ts-ignore
initGlobalAPI(Vue);

export default Vue;
