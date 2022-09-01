import auth from "./auth";
import course from "./course"
import video from "./video"
import favorite from "./favorite"
import playVideo from "./playVideo"
import quiz from "./quiz"
import home from "./home"
import payment from "./payment"
import setting from "./setting"
import guardian from "./guardian"
import insurance from "./insurance"
import receipt from "./receipt"
import test from "./test"
import view from "./view"
import forum from "./forum"
import other from "./other"
import cart from "./cart"
import partner from "./partner"
import chat from "./chat"
import library from "./library"
import document from "./document"
import gallery from "./gallery"
import certificate from "./certificate"
import network from "./network"
import help from "./help"
import attendant from "./attendant"
import summary from "./summary"
import etalk from "./etalk"
import Vue from 'vue'
import Vuex from 'vuex'
import sticker from "./sticker"
import social from "./social"
import upload from "./upload";
import background from "./background";
import report from "./report";
import story from "./story";
import zoom from "./zoom"
import wallet from "@/store/wallet";
Vue.use(Vuex);
export default new Vuex.Store({
    modules: {
        sticker,
        video,
        auth,
        course,
        favorite,
        playVideo,
        cart,
        view,
        payment,
        setting,
        chat,
        test,
        other,
        help,
        guardian,
        insurance,
        receipt,
        forum,
        home,
        partner,
        quiz,
        library,
        document,
        gallery,
        certificate,
        network,
        attendant,
        summary,
        etalk,
        social,
        upload,
        background,
        report,
        story,
        zoom,
        wallet
    }
});