<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span @click="select(2,$event)" :class="{'active':Type===2}" class="block positive">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span @click="select(0,$event)" :class="{'active':Type===0}" class="block positive">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
      <span @click="select(1,$event)" :class="{'active':Type===1}" class="block negative">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
    </div>
    <div :class="{'on': Content}" class="switch" @click="toggle($event)">
      <i class="icon-check_circle"></i>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script>
  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;

  export default {
    props: {
      ratings: {
        type: Array,
        default() {
          return [];
        }
      },
      desc: {
        type: Object,
        default() {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          };
        }
      },
      selectType:{
        type: Number
      },
      onlyContent: {
        type: Boolean
      }
    },
    data() {
      return {
        Type: this.selectType,
        Content: this.onlyContent
      };
    },
    methods: {
      select(type,event) {
        if(!event._constructed){
         return;
        }
        this.Type = type;
        this.$root.eventHub.$emit('changeType',this.Type);
      },
      toggle(event) {
        if(!event._constructed){
          return;
        }
        this.Content = !this.Content;
        this.$root.eventHub.$emit('toggleContent',this.Content);
      }
    },
    computed: {
      positives() {
        return this.ratings.filter((rating)=>{
          return rating.rateType === POSITIVE;
        });
      },
      negatives() {
        return this.ratings.filter((rating)=>{
          return rating.rateType === NEGATIVE;
        });
      }
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'

  .ratingselect
    .rating-type
      padding: 18px 0
      margin: 0 18px
      border-1px(rgb(7,17,27,0.1))
      font-size: 0
      .block
        display: inline-block
        padding: 8px 12px
        border-radius: 1px
        margin-right: 8px
        line-height: 16px
        color:rgb(77,85,93)
        font-size: 12px
        &.active
          color: #fff
        .count
          margin-left: 2px
          font-size: 8px
        &.positive
          background: rgba(0,160,220,0.2)
          &.active
            background: rgb(0,160,220)
        &.negative
          background: rgba(77,85,93,0.2)
          &.active
            background: rgb(77,85,93)
    .switch
      padding: 12px 18px
      line-height: 24px
      border-bottom: 1px solid rgba(7,17,27,0.1)
      color:rgb(147,153,159)
      font-size: 0
      &.on
        .icon-check_circle
          color: #00c850
      .icon-check_circle
        display:inline-block
        vertical-align: top
        margin-right: 4px
        font-size: 24px
      .text
        font-size: 12px
        display:inline-block
        vertical-align: top
</style>
