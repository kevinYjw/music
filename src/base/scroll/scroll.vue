<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

//推荐页面
export default {
  props:{
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    listenScroll:{ //要不要监听滚动事件
      type:Boolean,
      default:false
    },
    pullup:{ //上拉刷新
      type:Boolean,
      default:false
    }
  },
  methods:{
    _initScroll(){
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper,{
        click: this.click,
        probeType: this.probeType
      })

      if(this.listenScroll){
        this.scroll.on("scroll", (pos) => {
          this.$emit('scroll', pos)
        })
      }

      if(this.pullup){
        this.scroll.on("scrollEnd", () => {
          if(this.scroll.y <= (this.scroll.maxScrollY + 50)){
            this.$emit('scrollToEnd')
          }
        })
      }
    },
    enable() {
      this.scroll && this.scroll.enable()
    },
    disable() {
      this.scroll && this.scroll.disable()
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll,arguments)
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll,arguments)
    }
  },
  watch:{
    data(){
      setTimeout(() => {
        this.refresh()
      },20)
    }
  },
  mounted(){
    setTimeout(() => {
      this._initScroll()
    },20)
  }
}
</script>

<style lang="stylus" scoped>

</style>
