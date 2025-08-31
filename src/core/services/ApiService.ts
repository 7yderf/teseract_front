import axios from "axios";
import VueAxios from "vue-axios";
import JwtService from "./JwtService";

/**
 * @description service to call HTTP request via Axios
 */
class ApiService {
  /**
   * @description property to share vue instance
   */
  static vueInstance: any;

  /**
   * @description initialize vue axios
   */
  static init(app: any) {
    ApiService.vueInstance = app;
    ApiService.vueInstance.use(VueAxios, axios);
    ApiService.vueInstance.axios.defaults.baseURL =
      import.meta.env.VITE_APP_API_URL; // Cambiado de import.meta.env
  }

  /**
   * @description set the default HTTP request headers
   */
  static setHeader() {
    ApiService.vueInstance.axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${JwtService.getToken()}`;
    ApiService.vueInstance.axios.defaults.headers.common["Accept"] =
      "application/vnd.api+json";
    ApiService.vueInstance.axios.defaults.headers.common["Content-Type"] =
      "application/vnd.api+json";
  }

  /**
   * @description send the GET HTTP request
   */
  static query(resource: any, params: any) {
    return ApiService.vueInstance.axios.get(resource, params);
  }

  /**
   * @description send the GET HTTP request
   */
  static get(resource: any, slug = "") {
    return ApiService.vueInstance.axios.get(`${resource}/${slug}`);
  }

  /**
   * @description set the POST HTTP request
   */
  static post(resource: any, params: any = {}, p0: any = {}) {
    return ApiService.vueInstance.axios.post(`${resource}`, params, p0);
  }

  /**
   * @description send the UPDATE HTTP request
   */
  static update(resource: any, slug: any, params: any) {
    return ApiService.vueInstance.axios.put(`${resource}/${slug}`, params);
  }

  /**
   * @description Send the PUT HTTP request
   */
  static put(resource: any, params: any, p0: any) {
    return ApiService.vueInstance.axios.put(`${resource}`, params, p0);
  }

  /**
   * @description Send the PATCH HTTP request
   */
  static patch(resource: any, params: any, p0: any) {
    return ApiService.vueInstance.axios.patch(`${resource}`, params, p0);
  }

  /**
   * @description Send the DELETE HTTP request
   */
  static delete(resource: any) {
    return ApiService.vueInstance.axios.delete(resource);
  }
}

export default ApiService;
