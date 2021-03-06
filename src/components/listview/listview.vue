<template>
  <scroll 
  :data="data" 
  class="listview" 
  ref="listview"
  :listenScroll="listenScroll"
  @scroll="scroll"
  :probe-type="probeType">
    <ul>
      <li class="list-group" v-for="group in data" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="select(item)" class="list-group-item" v-for="item in group.items">
            <img v-lazy="item.avatar" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div 
    class="list-shortcut" 
    @touchstart.stop.prevent="onShortcutTouchStart"
    @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li 
        class="item" 
        v-for="(item,index) in shortcutList" 
        :data-index="index"
        :class="{'active':currentIndex===index}">{{item}}</li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}} </div>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import {getData} from 'common/js/dom'
import loading from 'base/loading/loading'

const ANCHOR_HEIGHT = 18 //右侧列表每个元素的高度
const TITLE_HEIGHT = 30 //标题高度

//歌手页面
export default {
  name: 'listView',
  props:{
    data:{
      type:Array,
      default: []
    }
  },
  data(){
    return {
      scrollY: -1,
      currentIndex: 0, //右侧元素当前显示
      diff: -1
    }
  },
  methods:{
    refresh(){
      this.$refs.listview.refresh()
    },
    select(item){
      this.$emit('select',item)
    },
    onShortcutTouchStart(e){
      let anchorIndex = getData(e.target,'index')
      let firstTouch = e.touches[0] //刚触摸时的位置
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove(e){
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)
    },
    scroll(pos){
      this.scrollY = pos.y
    },
    _scrollTo(index){
      if (!index && index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.scrollY = -this.listHeight[index]
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index],400)
    },
    _calculateHeight(){
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i=0;i<list.length;i++){
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  components:{
    Scroll,
    loading
  },
  watch:{
    data(){
      setTimeout(() => {
        this._calculateHeight()
      },20)
    },
    scrollY(newY){
      const listHeight = this.listHeight
      // 当滚动到顶部newY大于0
      if(newY > 0){
        this.currentIndex = 0
        return
      }
      // 在中间部分滚动
      for (let i=0;i<listHeight.length - 1;i++){
        let height1 = listHeight[i]
        let height2 = listHeight[i+1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          this.diff = height2 + newY
          return
        }
      }
      // 滚动到底部
      this.currentIndex = listHeight.length - 2
    },
    diff(newVal){
      let fixedTop = (newVal>0 && newVal<TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop){
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  },
  computed:{
    //右侧导航栏
    shortcutList(){
      return this.data.map((group) => {
        return group.title.substr(0,1)
      })
    },
    fixedTitle(){
      if (this.scrollY > 0) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  created(){
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  
  .listview
    position:relative
    width:100%
    height:100%
    background-color:$color-background
    overflow:hidden
    .list-group
      padding-bottom:.6rem
      .list-group-title
        height:.6rem
        line-height:.6rem
        padding-left:.4rem
        color:$color-text-l
        font-size:$font-size-small
        background-color:$color-highlight-background
      .list-group-item
        display:flex
        align-items:center
        padding:.4rem 0 0 .6rem
        .avatar
          width:1rem
          height:1rem
          border-radius:50%
        .name
          margin-left:.4rem
          color:$color-text-l
          font-size:$font-size-medium
    .list-shortcut
      position:absolute
      z-index:30
      right:0
      top:50%
      transform: translateY(-50%)
      width:.4rem
      padding:.4rem 0
      border-radius:.2rem
      text-align:center
      background-color:$color-background-d
      font-family:Helvetica
      .item
        padding:.06rem
        line-height:1
        color:$color-text-l
        font-size:$font-size-small
        &.active
          color:$color-theme
    .list-fixed
      position: absolute
      top: -.02rem
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
       position:absolute
       width:100%
       top:50%
       transform: translateY(-50%)
</style>
