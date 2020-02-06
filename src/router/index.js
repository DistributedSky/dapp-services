import PageServices from "@/components/services/Page";
import PageCheck from "@/components/check/Page";
import PageRegistration from "@/components/registration/Page";
import PagePassport from "@/components/passport/Page";
import PageFlight from "@/components/flight/Page";
import Router from "vue-router";
import Vue from "vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "services",
      component: PageServices
    },
    {
      path: "/registration",
      name: "registration",
      component: PageRegistration
    },
    {
      path: "/check",
      name: "check",
      component: PageCheck
    },
    {
      path: "/passport/:liability",
      name: "passport",
      component: PagePassport,
      props: true
    },
    {
      path: "/flight",
      name: "flight",
      component: PageFlight
    },
    { path: "*", redirect: "/" }
  ]
});
