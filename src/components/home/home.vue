<template>
  <div class="home">
    <v-header v-bind:seller="seller"></v-header>
    <div class="contentWrapper" ref="homeWrapper">
      <div>
        <section class="title">
          <div class="content border-1px">
            <div class="avatar">
              <img width="64" height="64" v-bind:src="seller.avatar" alt="avatar">
            </div>
            <div class="name">{{seller.name}}</div>
          </div>
          <div class="btn-group">
            <div class="order" @click="goTo('order')">点菜</div>
            <div class="pay" @click="goTo('cashier')">店内付</div>
          </div>
        </section>
        <split></split>
        <section class="recommend">
          <div class="title">
            <span class="brand"><i class="icon-like"></i></span>
            <span class="name">特色菜推荐</span>
          </div>
          <div class="content">
            <ul class="imgContent">
              <li v-for="item in recommendFood" class="imgItem" @click="goTo('order')">
                <img width="100%" height="100%" :src="item.image">
              </li>
            </ul>
          </div>
        </section>
        <split></split>
        <section class="seller" @click="goTo('business')">
          <div class="sellerTitle">
            <span class="brand"><i class="icon-shop"></i></span>
            <span class="name">本店介绍</span>
          </div>
          <div class="sellerName">
            <span class="text">{{seller.name}}</span>
            <i class="icon-keyboard_arrow_right"></i>
          </div>
          <div class="location">
            <span class="brand"><i class="icon-location"></i></span>
            <span class="text">{{seller.address}}</span>
          </div>
        </section>
        <split></split>
        <section class="ratings" @click="goTo('evaluate')">
          <div class="ratingTitle">
            <span class="brand"><i class="icon-bubble"></i></span>
            <span class="name">本店评价</span>
          </div>
          <div class="linkArea">
            <span class="text">点此进入评价页面</span>
            <i class="icon-keyboard_arrow_right"></i>
          </div>
        </section>
        <footer class="footer">
          <span class="text">由<a href="https://github.com/Jer-X">Jer</a>&copy;提供技术支持</span>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import header from '../header/header';
import split from '../split/split';
import BScroll from 'better-scroll';
import { urlParse } from '../../common/js/util';

const ERR_OK = 0;
let ran;

export default {
  data() {
    return {
      seller: {},
      goods: [],
      recommendFood: []
    };
  },
  created() {
    this.$http.get('/data/seller').then((res) => {
      res = res.body;
      if (res.errno === ERR_OK) {
        this.seller = res.data[0];
        this.$nextTick(() => {
          this._initScroll();
        });
      }
    }, () => { });
    this.$http.get('/data/goods').then((res) => {
      res = res.body;
      if (res.errno === ERR_OK) {
        this.goods = res.data;
        this.recommendFood = this.recommend();
        this.$nextTick(() => {
          this._initScroll();
        });
      }
    }, () => { });
  },
  methods: {
    recommend() {
      let food = [], _tmp, _len;
      for (let i = 0; i < 6; i++) {
        ran = Math.floor(Math.random() * 9);
        _tmp = this.goods[ran];
        _len = _tmp.foods.length;
        ran = Math.floor(Math.random() * _len);
        if (i > 1 && food[i - 1].name === _tmp.foods[ran].name) {
          ran = Math.floor(Math.random() * _len);
        }
        food.push(_tmp.foods[ran]);
      }
      return food;
    },
    _initScroll() {
      if (!this.homeScroll) {
        this.homeScroll = new BScroll(this.$refs.homeWrapper, {
          click: true
        });
      } else {
        this.homeScroll.refresh();
      }
    },
    goTo(path) {
      if (!event._constructed) {
        return;
      }
      path = '/store/' + path;
      this.$root._router.push(path);
    }
  },
  computed: {
    desk() {
      let queryParam = urlParse();
      return parseInt(queryParam.desk);
    }
  },
  components: {
    'v-header': header,
    split
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    this.$store.commit('_desk', this.desk);
    next();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'
    .contentWrapper
      position:absolute
      top: 134px
      left: 0
      bottom: 0
      width: 100%
      overflow: hidden
      .title
        padding: 10px
        .content
          border-1px(rgba(7,17,27,0.2))
          padding-bottom: 10px
          .avatar
            display: inline-block
            vertical-align: top
            margin-left: 4px
            img
              border-radius: 2px
          .name
            display: inline-block
            vertical-align: middle
            margin: 8px 0 0 4px
            font-size: 16px
            line-height: 18px
            font-weight: 600
        .btn-group
          padding-top: 10px
          display: flex
          justify-content: space-between
          .order,.pay
            flex: 1 1 auto
            display:inline-block
            text-align: center
            padding: 10px 0
            color: #fff
            border-radius: 2px
          .order
            margin-right: 5px
            background: #cf112d
          .pay
            margin-left: 5px
            background: #ffae00
      .recommend
        padding: 10px 10px 0
        .title
          padding: 0 0 10px 0
          border-1px(rgba(7,17,27,0.2))
          font-size: 0
          .brand
            display: inline-block
            vertical-align: top
            color: rgb(220,20,20)
            .icon-like
              font-size: 18px
          .name
            display: inline-block
            vertical-align: top
            margin-left: 6px
            font-size: 14px
            line-height: 18px
            color: rgb(147,153,159)
        .content
          padding-top: 10px
          overflow: auto
          .imgItem
            float: left
            width: 49%
            height: 150px
            margin-right: 0
            margin-bottom: 10px
            box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04)
            img
              border-radius: 4px
          .imgItem:nth-of-type(odd)
            margin-right: 2%
      .seller
        padding: 10px
        .sellerTitle
          border-1px(rgba(7,17,27,0.2))
          padding-bottom: 10px
          font-size: 0
          .brand
            display: inline-block
            vertical-align: top
            color: rgb(0,160,220)
            .icon-shop
              font-size: 18px
          .name
            display: inline-block
            vertical-align: top
            margin-left: 6px
            font-size: 14px
            line-height: 18px
            color: rgb(147,153,159)
        .sellerName
          position: relative
          border-1px(rgba(7,17,27,0.2))
          height: 30px
          padding: 5px 0
          .text
            font-size: 16px
            line-height: 30px
            font-weight: bold
            color: rgb(7,17,27)
          .icon-keyboard_arrow_right
            position: absolute
            right: -5px
            top: 5px
            font-size: 30px
            color: rgba(7,17,27,0.3)
        .location
          display: flex
          font-size:0
          padding-top: 10px
          .brand
            flex: 0 0 18px
            display: inline-block
            vertical-align: top
            font-size: 18px
            color: rgb(147,153,159)
          .text
            flex: 1 1 auto
            display: inline-block
            vertical-align: top
            margin-left: 2px
            font-size: 16px
      .ratings
        padding: 10px 10px 0
        .ratingTitle
          border-1px(rgba(7,17,27,0.2))
          padding-bottom: 10px
          font-size: 0
          .brand
            display: inline-block
            vertical-align: top
            color: rgb(0,160,220)
            .icon-bubble
              font-size: 18px
          .name
            display: inline-block
            vertical-align: top
            margin-left: 6px
            font-size: 14px
            line-height: 18px
            color: rgb(147,153,159)
        .linkArea
          position: relative
          height: 30px
          padding: 5px 0
          .text
            font-size: 16px
            line-height: 30px
            color: rgb(7,17,27)
          .icon-keyboard_arrow_right
            position: absolute
            right: -5px
            top: 5px
            font-size: 30px
            color: rgba(7,17,27,0.3)
      .footer
        position: relative
        border-top: 1px solid rgba(7,17,27,0.1)
        height: 30px
        text-align: center
        background: #f3f5f7
        .text
          position:absolute
          bottom: 0
          left: 50%
          transform: translateX(-50%)
          color: rgb(147,153,159)
          font-size: 14px
</style>
