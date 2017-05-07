<template>
    <div class="cashier">
        <section class="title">
          <div class="content border-1px">
            <div class="avatar">
              <img width="64" height="64" v-bind:src="seller.avatar" alt="avatar">
            </div>
            <div class="name">{{seller.name}}</div>
          </div>
        </section>
        <section class="price">
            <div class="priceContent">
                <span class="name">消费总额</span>
                <div class="bottom">
                    <input class='curPrice' type="text" placeholder='请询问店员后输入' v-model='price' @keyup='check()'>
                </div>
            </div>
        </section>
        <section class="confirm">
            <span class="totalPrice" v-if='price.length === 0'>￥0.00</span>
            <span class="totalPrice" v-if="price.length > 0">{{price}}</span>
            <span class="confirmBtn">确认支付</span>
        </section>
    </div>
</template>

<script>
let pri = '';
let regPri = '';

export default {
    props: {
        seller: {
            type: Object
        }
    },
    data() {
        return {
            price: ''
        };
    },
    methods: {
        check() {
            if(this.price.length > 9){
                this.price = pri;
            }
            pri = this.price;
            if(pri.length === 1){
                if(/^[0-9]{1,8}$/.test(pri)){
                    this.price = '￥' + pri;
                }else{
                    this.price = '';
                }
            }else {
                if(pri.indexOf('￥') === -1){
                    pri = '￥'.concat(pri);
                }
                regPri = pri.substring(1);
                if(/^[0-9]{1,8}$/.test(regPri)){
                    this.price = pri;
                }else{
                    pri = pri.substring(0,pri.length - 1);
                    this.price = pri;
                }
            }
            
        }
    }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
.cashier
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(147,153,159,0.2);
    .title
        padding: 30px 10px 0
        .content
          border-1px(rgba(7,17,27,0.1))
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
    .price
        margin: 10px 10px 0
        border: 1px solid rgb(220,20,20)
        background: #fff
        height: 90px
        .name
            display: block
            padding: 10px 0 0 15px
        .bottom
            height: 64px
            line-height: 64px
            text-align: right
            padding-right: 3px
            .curPrice
                font-size: 20px
                outline: none
                text-align:right
    .confirm
        position: absolute
        bottom: 0
        left: 0
        display: flex
        background: #fff
        width: 100%
        border-top: 1px solid rgba(7,17,27,0.4)
        border-bottom: 1px solid rgba(7,17,27,0.4)
        height: 30px
        font-size: 0
        .totalPrice,.confirmBtn
            display: block
            line-height: 30px
            font-size: 14px
        .totalPrice
            flex: 1 1 auto
            padding-left: 10px
            color: rgb(220,20,20)
        .confirmBtn
            flex: 0 0 105px
            width: 105px
            text-align: center
            background: rgb(240,20,20)
            color: #fff
</style>
