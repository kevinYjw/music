<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bgImage" :style="bgStyle" ref="bgImg">
      <div class="play-wrapper">
        <div class="play" v-show="songs.length > 0" ref="playBtn" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
    </div>
    <div class="bg-layer" ref="layer"></div> <!-- 特性层 -->
    <scroll 
    :data="songs" 
    class="list" 
    ref="list" 
    :listenScroll="listenScroll" 
    :probeType="probeType"
    @scroll="scroll">
      <div class="song-list-wrapper">
        <song-list :rank="rank" :songs="songs" @select="selectItem"></song-list>
      </div>
      <div class="loading-wrapper" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import songList from 'base/song-list/song-list'
import {prefixStyle} from 'common/js/dom'
import Loading from 'base/loading/loading'
import {mapActions} from 'vuex'
import {playlistMixin} from 'common/js/mixin'

const RESERVED_HEIGHT = 40
const transform = prefixStyle('transform')

//歌曲列表页面
export default {
  name: 'MusicList',
  mixins: [playlistMixin],
  props:{
    songs:{
      type:Array,
      default:[]
    },
    bgImage:{
      type:String,
      default:''
    },
    title:{
      type:String,
      default:''
    },
    rank:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return {
      scrollY: 0
    }
  },
  methods:{
    handlePlaylist(playlist){
      const bottom = playlist.length > 0 ? '1.2rem' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
    scroll(pos){
      this.scrollY = pos.y
    },
    back(){
      this.$router.back()
    },
    selectItem(item,index){
      this.selectPlay({
        list: this.songs,
        index
      })
    },
    random(){
      this.randomPlay({
        list: this.songs
      })
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  },
  watch:{
    scrollY(ney){
      let translateY = Math.max(this.minTransalteY,ney)
      let zIndex = 0
      let scale = 1
      this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`
      const percent = Math.abs(ney / this.imageHeight)
      if(ney > 0){
        scale = 1 + percent
        zIndex = 10
      }
      if (ney < this.minTransalteY){
        zIndex = 10
        this.$refs.bgImg.style.paddingBottom = 0
        this.$refs.bgImg.style.height = `${RESERVED_HEIGHT}px`
        this.$refs.playBtn.style.display = 'none'
      } else {
        this.$refs.bgImg.style.paddingBottom = '70%'
        this.$refs.bgImg.style.height = 0
        this.$refs.playBtn.style.display = 'block'
      }
      this.$refs.bgImg.style.zIndex = zIndex
      this.$refs.bgImg.style[transform] = `scale(${scale})`
    }
  },
  components:{
    Scroll,
    songList,
    Loading
  },
  computed:{
    bgStyle(){
      return `background-image:url(${this.bgImage})`
    }
  },
  created(){
    this.probeType = 3
    this.listenScroll = true
  },
  mounted(){
    this.imageHeight = this.$refs.bgImg.clientHeight
    this.minTransalteY = -this.imageHeight + RESERVED_HEIGHT
    this.$refs.list.$el.style.top = `${this.imageHeight}px`
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable" 
  @import "~common/stylus/mixin"
  
  .music-list
    position:fixed
    top:0
    left:0
    bottom:0
    right:0
    z-index:100
    background-color:$color-background
    .back
      position:absolute
      top:0
      left:.12rem
      z-index:50
      .icon-back
        display:block
        padding:.2rem
        font-size:$font-size-large-x
        color: $color-theme
    .title
      position:absolute
      top:0
      left:10%
      width:80%
      z-index:40
      no-wrap()
      text-align:center
      line-height:.8rem
      color:$color-text
      font-size:$font-size-large
    .bgImage
      position:relative
      width:100%
      height:0
      padding-bottom:70%
      transform-origin:top
      background-size: cover
      .play-wrapper
        position:absolute
        bottom:.4rem
        z-index:50
        width:100%
        .play
          box-sizing: border-box
          width:2.7rem
          padding:.14rem 0
          margin:0 auto
          border: .02rem solid $color-theme
          text-align:center
          border-radius:2rem
          color:$color-theme
          font-size:0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: .12rem
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
    .bg-layer
      position:relative
      height:100%
      background-color:$color-background
    .list
      position:fixed
      top:0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding:.4rem .6rem
      .loading-wrapper
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
