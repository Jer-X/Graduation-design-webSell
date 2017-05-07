<template>
  <div class="pay">
    <div class="pay-content">
      <header class="payHead">
        <div class="back" @click="back">
          <i class="icon-arrow_lift"></i>
        </div>
        <span class="title">提交订单</span>
      </header>
      <split class="pay_spc"></split>
      <div class="detailWrapper">
        <div class="detail border-1px">
          <h2 class="address">{{detail.address}}</h2>
          <span class="name">{{detail.name}}</span>
          <span class="name">先生</span>
          <span class="phone">{{detail.phone}}</span>
          <i class="icon-keyboard_arrow_right"></i>
        </div>
        <div class="time">
          <!--<span class="arriveTime">送达时间</span>-->
          <!--<i class="icon-keyboard_arrow_right"></i>-->
          <mt-cell title="送达时间">
            <span class="arriveTime">{{desc}}</span>
          </mt-cell>
        </div>
      </div>
      <split class="pay_split"></split>
      <mt-radio
        align="right"
        title="请选择支付方式"
        v-model="radioValue"
        :options="options">
      </mt-radio>
      <split class="radioBottom"></split>
      <div class="foods">
        <section class="sellerWrapper">
          <div class="seller">{{seller.name}}</div>
          <div class="distribution">
            <span>本单由</span>
            <span>{{who}}</span>
            <span>配送</span>
          </div>
          <section class="foodWrapper">
            <ul>
              <li class="foodItem" v-for="item in foodList">
                <div class="foodName">{{item.name}}</div>
                <div class="foodCount">x{{item.count}}</div>
                <div class="oldPrice" v-if="item.oldPrice">{{item.oldPrice}}</div>
                <div class="price">{{item.price}}</div>
              </li>
            </ul>
          </section>
          <section class="surcharge">
            <div class="deliveryPrice">
              <span>配送费</span>
              <span>￥{{seller.deliveryPrice}}</span>
            </div>
          </section>
          <section class="statement">
            <div class="title">特价优惠不与立减优惠同享</div>
            <div class="discountPrice">
              <span>原价￥{{oldPri}}-共优惠￥{{totalDisc}}</span>
              <span>总计:￥{{totalPri}}</span>
            </div>
          </section>
        </section>
      </div>
      <div class="confirm">
        <div class="confirmLeft">
          <span class="totalDiscount">已优惠￥{{totalDisc}}</span>
          <span class="totalPrice">还需付￥{{totalPri}}</span>
        </div>
        <div class="confirmRight">确认下单</div>
      </div>
    </div>
  </div>
</template>

<script>
  import split from '../split/split';

  export default {
    data() {
      return {
        detail: {
          address: '广东工业大学',
          name: '夏',
          phone: '15817153853'
        },
        desc:'',
        radioValue:'支付宝',
        options:[
          {
            label: '支付宝',
            value: '支付宝'
          },
          {
            label: '微信',
            value: '微信'
          }
        ],
        who: '商家'
      };
    },
    created() {
      this.time();
    },
    computed: {
      foodList() {
        return this.$store.state.foodList;
      },
      seller() {
        return this.$store.state.seller;
      },
      oldPri() {
        let pri = 0;
        this.foodList.forEach((item)=>{
          pri += item.price;
        });
        return pri;
      },
      totalDisc() {
        let disc = 0;
        this.foodList.forEach((item)=>{
          if(item.oldPrice) {
            disc += (item.oldPrice-item.price);
          }
        });
        return disc;
      },
      totalPri() {
        return this.oldPri - this.totalDisc;
      }
    },
    methods: {
      back() {
        this.$root._router.go(-1);
      },
      time() {
        let Now = new Date();
        let Hour = Now.getHours();
        let Min = Now.getMinutes();
        let Arrive = Min + 38;
        if(Arrive >= 60){
          Hour = Hour + 1 === 24 ? 0 : Hour + 1;
          Min = Arrive-60 < 10 ? 0+''+(Arrive-60) : Arrive-60;
          this.desc = `预计${Hour}:${Min}送达`;
        }else{
          Min = Min + 38;
          this.desc = `预计${Hour}:${Min}送达`;
        }
      }
    },
    components: {
      split
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'

  .pay
    height: 100%
    .payHead
      display: flex
      background: #fff
      .back
        flex: 0 0 20px
        .icon-arrow_lift
          display: block
          padding: 10px
          font-size: 20px
          color: rgb(7,17,27)
      .title
        flex: 1 1 auto
        text-align: center
        font-size: 16px
        line-height: 20px
        padding-top: 10px
    .pay_spc
      height: 10px
    .detailWrapper
      height: 96px
      padding: 0 10px
      .detail
        position: relative
        border-1px(rgba(7,17,27,0.2))
        padding-bottom: 4px
        .address
          padding-left: 10px
          font-size: 18px
          line-height: 18px
          color:rgb(7,17,27)
          margin-top: 6px
          margin-bottom: 8px
        .name,.phone
          margin-bottom: 6px
          line-height: 10px
          font-size: 10px
          color: rgb(147,153,159)
        .name:nth-of-type(1)
          padding-left: 10px
        .name:nth-of-type(2)
          margin-right: 8px
        .icon-keyboard_arrow_right
          position:absolute
          display: block
          top: 10px
          right: -8px
          font-size: 28px
          color: rgb(147,153,159)
      .time
        .mint-cell:last-child
          background: none
          .arriveTime
            font-size: 14px
            color: rgb(240,20,20)
    .radioBottom
      border-top:none
</style>
