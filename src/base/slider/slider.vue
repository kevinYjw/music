<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item,index) in dots" :class="{'active':currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
import {addClass} from 'common/js/dom'

//轮播图组件
export default {
  name: 'slider',
  data(){
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  props:{
    loop:{
      type: Boolean,
      default: true
    },
    autoPlay:{
      type: Boolean,
      default: true
    },
    interval:{
      type:Number,
      default:2000
    }
  },
  methods:{
    // 设置轮播图的宽度
    _setSliderWidth(isResize){
      this.children = this.$refs.sliderGroup.children
      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth
      for (let i=0; i<this.children.length; i++){
        let child = this.children[i]
        addClass(child,'slider-item')
        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      if (this.loop && !isResize) { //better-scroll组件中会多加两个元素保证滑动顺畅
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initSlider(){
      this.slider = new BScroll(this.$refs.slider,{
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        }
      })

      this.slider.on("scrollEnd",() => {
        let pageIndex = this.slider.getCurrentPage().pageX
        this.currentPageIndex = pageIndex
        if(this.autoPlay){
          this._play()
        }
      })
    },
    _initDots(){
      this.dots = new Array(this.children.length)
    },
    _play(){
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.slider.next()
      }, this.interval)
    }
  },
  mounted(){
    setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()

      if(this.autoPlay){
        this._play()
      }
    },20)

    window.addEventListener('resize',() => {
      if (!this.slider) {
        return
      }
      this._setSliderWidth(true)
      this.slider.refresh()
    })
  },
  destroyed(){
    clearTimeout(this.timer)
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"

  .slider
    min-height:.02rem
    .slider-group
      position:relative
      overflow:hidden
      white-space: nowrap
      .slider-item
        float:left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display:block
          width:100%
          overflow:hidden
          text-decoration:none
        img
          display:block
          width:100%
    .dots
      position:absolute
      left:0
      right:0
      bottom:.24rem
      text-align:center
      .dot
        display:inline-block
        margin:0 .08rem
        width:.16rem
        height:.16rem
        border-radius:50%
        background:$color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
