<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i :class="iconMode" class="icon" @click="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click="showConfirm"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <scroll class="list-content" ref="listContent">
          <transition-group name="list" tag="ul">
            <li :key="item.id" v-for="(item,index) in sequenceList" class="item" @click="selectItem(item,index)" ref="listItem">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like" @click.stop="toggleFavorite(item)">
                <i :class="getFavoriteIcon(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="addSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
        <add-song ref="addSong"></add-song>
      </div>
    </div>
  </transition>
</template>

<script>
import {mapGetters,mapMutations,mapActions} from 'vuex'
import Scroll from 'base/scroll/scroll'
import {playMode} from 'common/js/config'
import {playerMixin} from 'common/js/mixin'
import AddSong from 'components/add-song/add-song'

//歌曲列表页面
export default {
  name: 'PlayList',
  mixins:[playerMixin],
  computed:{
    modeText() {
      return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
    }
  },
  data(){
    return {
      showFlag: false
    } 
  },
  methods:{
    addSong(){
      this.$refs.addSong.show()
    },
    show(){
      this.showFlag = true
      setTimeout(() => {
        this.$refs.listContent.refresh()
      },20)
    },
    hide(){
      this.showFlag = false
    },
    getCurrentIcon(item){
      if(this.currentSong.id === item.id){
        return 'icon-play'
      }
      return ''
    },
    selectItem(item,index){
      //随机播放
      if(this.mode === playMode.random){
        index = this.playlist.findIndex((song) => {
          return song.id === item.id
        })
      }
      this.setCurrentIndex(index)
      this.setPlaying(true)
    },
    scrollToCurrent(current){
      const index = this.sequenceList.findIndex((song) => {
        return current.id === song.id
      })
      this.$refs.listContent.scrollToElement(this.$refs.listItem[index],300)
    },
    deleteOne(item){
      this.deleteSong(item)
      if(!this.playlist.length){
        this.hide()
      }
    },
    showConfirm(){
      this.deleteSongList()
    },
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlaying: 'SET_PLAYING_STATE'
    }),
    ...mapActions([
      'deleteSong',
      'deleteSongList'
    ])
  },
  components:{
    Scroll,
    AddSong
  },
  watch:{
    currentSong(newSong,oldSong){
      if(!this.showFlag || newSong.id === oldSong.id){
        return
      }
      this.scrollToCurrent(newSong)
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  
  .playlist
    position:fixed
    top:0
    left:0
    right:0
    bottom:0
    z-index:200
    background-color:$color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position:absolute
      left:0
      bottom:0
      width:100%
      background-color:$color-highlight-background
      .list-header
        position:relative
        padding:.4rem .6rem .2rem .4rem
        .title
          display:flex
          align-items:center
          .icon
            margin-right:.2rem
            font-size:.6rem
            color:$color-theme-d
          .text
            flex:1
            font-size:$font-size-medium
            color:$color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height:4.8rem
        overflow:hidden
        .item
          display:flex
          align-items:center
          height:.8rem
          padding:0 .6rem 0 .4rem
          overflow:hidden
          &.list-enter-active,&.list-leave-active
            transition:all 0.1s
          &.list-enter,&.list-leave-to
            height:0
          .current
            flex:0 0 .4rem
            width:.4rem
            font-size:$font-size-small
            color:$color-theme-d
          .text
            flex:1
            no-wrap()
            font-size:$font-size-medium
            color:$color-text-d
          .like
            extend-click()
            margin-right:.3rem
            font-size:$font-size-small
            color:$color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size:$font-size-small
            color:$color-theme
      .list-operate
        width:2.8rem
        margin:.4rem auto .6rem auto
        .add
          display:flex
          align-items:center
          padding:.16rem .32rem
          border:.02rem solid $color-text-l
          border-radius:2rem
          color:$color-text-l
          .icon-add
            margin-right:.1rem
            font-size:$font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>
