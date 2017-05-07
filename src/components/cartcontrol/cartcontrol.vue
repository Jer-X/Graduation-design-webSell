<template>
  <div class="cartcontrol">
    <transition-group name="move">
      <div key="outer" class="cart-decrease" v-show="curFood.count>0" @click.stop="decreaseCart($event)">
        <i key="inner" class="inner icon-remove_circle_outline"></i>
      </div>
    </transition-group>
    <div class="cart-count" v-show="curFood.count>0">{{curFood.count}}</div>
    <div class="cart-increase icon-add_circle" @click.stop="addCart($event)"></div>
  </div>
</template>

<script>
  export default {
    props: {
      food:{
        type:Object
      }
    },
    data() {
      return {
      };
    },
    computed: {
      curFood() {
        return  this.food;
      }
    },
    methods: {
      addCart(event) {
        if(!event._constructed) {
            return;
        }
        if(!this.curFood.count){
          this.$set(this.curFood,'count',1);
        }else{
          this.curFood.count ++;
        }
        this.$root.eventHub.$emit('cart_add',event.target);
      },
      decreaseCart(event) {
        if(!event._constructed) {
          return;
        }
        if(this.curFood.count){
          this.curFood.count --;
        }
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size:0
    .move-enter-active,.move-leave-active
      transition: all .5s
    .move-enter,.move-leave-to
      &.cart-decrease
        opacity: 0
        transform: translate3d(24px,0,0)
        .inner
          transform: rotate(180deg)
    .cart-decrease
      display:inline-block
      padding: 6px
      .inner
        display:inline-block
        font-size: 24px
        line-height: 24px
        color: rgb(0,160,220)
        transition: all .5s
    .cart-count
      display:inline-block
      width: 12px
      font-size: 10px
      padding-top: 6px
      line-height: 24px
      text-align: center
      color: rgb(147,153,159)
      vertical-align: top
    .cart-increase
      display:inline-block
      padding: 6px
      font-size: 24px
      line-height: 24px
      color: rgb(0,160,220)
</style>
