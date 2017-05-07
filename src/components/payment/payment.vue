<template>
    <div class="payment">
        <div class="titleContent">
            <div class="brand"><i class="icon-shop"></i></div>
            <div class="name">
                <span class="total">{{foodList.length}}道菜</span>
                <span class="set">您所在的桌位：{{desk}}</span>
            </div>
        </div>
        <div class="subtotal">
            <div class="text">小计</div>
            <div class="price">￥{{totalPri}}</div>
        </div>
        <split></split>
        <split></split>
        <div class="message border-1px">
            <div class="text">给商家留言</div>
            <div class="detail">口味、偏好等<i class="icon-keyboard_arrow_right"></i></div>
        </div>
        <div class="payBtn" @click='payMoney()'>
            ￥{{totalPri}}立即下单
        </div>
        <div class="back" @click='back()'>
            返回
        </div>
    </div>
</template>

<script>
import split from '../split/split';
import { Toast, Indicator } from 'mint-ui';
const ERR_OK = 0;

export default {
    data() {
        return {
            payState: 0
        };
    },
    computed: {
        foodList() {
            return this.$store.state.foodList;
        },
        seller() {
            return this.$store.state.seller;
        },
        desk() {
            return this.$store.state.desk;
        },
        oldPri() {
            let pri = 0;
            this.foodList.forEach((item) => {
                pri += item.price * item.count;
            });
            return pri;
        },
        totalDisc() {
            let disc = 0;
            this.foodList.forEach((item) => {
                if (item.oldPrice) {
                    disc += (item.oldPrice - item.price);
                }
            });
            return disc;
        },
        totalPri() {
            return parseFloat(this.oldPri - this.totalDisc).toFixed(2);
        }
    },
    methods: {
        back() {
            this.$root._router.push('/store/order');
        },
        payMoney() {
            Indicator.open({
                text: '正在支付中',
                spinnerType: 'fading-circle'
            });
            this.$http.post('/data/order', {
                "desk": this.desk,
                "foods": this.foodList,
                "progress": 'unfinished',
                "pay": 'done'
            }, { emulateJSON: true }).then((res) => {
                res = res.body;
                if (res.errno === ERR_OK) {
                    Indicator.close();
                    Toast({
                        message: '支付成功,请等待餐点送达',
                        position: 'middle',
                        duration: 1500
                    });
                    setTimeout(() => {
                        this.payState = 1;
                        this.$root._router.push(`/index?desk=${this.desk}`);
                    }, 2000);
                } else {
                    Indicator.close();
                    Toast({
                        message: '支付不成功,请重新支付',
                        position: 'middle',
                        duration: 1500
                    });
                }
            }, () => { });
        }
    },
    components: {
        split
    },
    beforeRouteLeave(from, to, next) {
        if (this.payState === 1) {
            this.$store.commit('_push', {});
            this.$store.commit('_update', []);
            this.$store.commit('_add', {});
            next();
        }
        next();
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl'

.payment
    position absolute
    top 0
    bottom 0
    left 0
    right 0
    background: #f3f5f7
    .titleContent
        display flex
        align-items center
        border-1px(rgba(7,17,27,0.2))
        padding: 10px 10px 20px 10px
        font-size: 0
        .brand
            flex 0 0 22px
            color: rgb(0,160,220)
            padding-left: 5px
            padding-right 4px
            .icon-shop
                font-size: 22px
        .name
            flex: 1 1 auto
            margin-left: 6px
            font-size: 14px
            line-height: 18px
            color: rgb(7,17,27)
            .total
                display block
                font-size 18px
                font-weight bold
            .set
                display block
                margin-top 5px
                font-size 16px
                color: rgb(147,153,159)
    .subtotal
        display: flex
        justify-content: space-between
        padding: 0 10px
        width: 100%
        height: 60px
        background: #fff
        .text
            flex 1 1 auto
            line-height 60px
            font-size: 18px
        .price
            flex 1 1 auto
            text-align: center
            line-height: 60px
            font-size: 18px
    .message
        display: flex
        justify-content: space-between
        padding: 0 10px
        width: 100%
        height: 60px
        background: #fff
        border-bottom: 1px solid rgba(7,17,27,0.2)
        .text
            flex 1 1 auto
            line-height 60px
            font-size: 18px
        .detail
            flex 0 0 auto
            text-align: right
            line-height: 60px
            padding-right 20px
            font-size: 14px
            .icon-keyboard_arrow_right
                font-size 16px
    .payBtn
        margin: 40px 10px 20px
        height: 40px
        line-height: 40px
        background: rgb(220,20,20)
        color: #fff
        text-align center
        font-size: 18px
    .back
        margin-left 10px
        text-decoration underline
        cursor: pointer
        color: rgb(0,160,220)
</style>
