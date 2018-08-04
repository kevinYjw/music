<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show="showFlag">
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">{{text}}</p>
          <div class="operate">
            <div class="operate-btn left" @click="cancel">{{cancelBtnText}}</div>
            <div class="operate-btn" @click="confirm">{{confirmBtnText}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
//确认框页面
export default {
  name: 'confirm',
  data(){
    return {
      showFlag:false
    }
  },
  methods:{
    show(){
      this.showFlag = true
    },
    hide(){
      this.showFlag = false
    },
    // 取消
    cancel(){
      this.hide()
      this.$emit('cancel')
    },
    //清空
    confirm(){
      this.hide()
      this.$emit("confirm")
    }
  },
  props:{
    text: {
      type: String,
      default: ''
    },
    confirmBtnText: {
      type: String,
      default: '确定'
    },
    cancelBtnText: {
      type: String,
      default: '取消'
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  
  .confirm
    position:fixed
    top:0
    left:0
    bottom:0
    right:0
    z-index:998
    background-color:$color-background-d
    &.confirm-fade-enter-active
      animation: confirm-fadein 0.3s
      .confirm-content
        animation: confirm-zoom 0.3s
    .confirm-wrapper
      position:absolute
      top:50%
      left:50%
      transform: translate(-50%, -50%)
      z-index:999
      .confirm-content
        width:5.4rem
        border-radius:.26rem
        background-color:$color-highlight-background
        .text
          padding:.38rem .3rem
          text-align:center
          line-height:.44rem
          color:$color-text-l
          font-size:$font-size-large
        .operate
          display:flex
          align-items:center
          text-align:center
          font-size:$font-size-large
          .operate-btn
            flex:1
            line-height:.44rem
            padding:.2rem 0
            border-top:.02rem solid $color-background-d
            color:$color-text-d
            &.left
              border-right:.02rem solid $color-background-d


  @keyframes confirm-fadein
    0%
      opacity: 0
    100%
      opacity: 1

  @keyframes confirm-zoom
    0%
      transform: scale(0)
    50%
      transform: scale(1.1)
    100%
      transform: scale(1)
</style>
