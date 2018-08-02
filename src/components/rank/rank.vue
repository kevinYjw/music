<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" :data="topList" ref="toplist">
      <ul>
        <li class="item" v-for="item in topList" @click="selectItem(item)">
          <div class="icon">
            <img width="100" height="100" :src="item.picUrl">
          </div>
          <ul class="songList">
            <li class="song" v-for="(song,index) in item.songList">
              <span>{{index + 1}}</span>
              <span>{{song.songname}}-{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import {getTopList} from 'api/rank'
import {ERR_OK} from 'api/config'
import Loading from 'base/loading/loading'
import Scroll from 'base/scroll/scroll'
import {playlistMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'

//排行页面
export default {
  mixins: [playlistMixin],
  name: 'rank',
  data(){
    return {
      topList: []
    }
  },
  methods:{
    //获取排行详情数据
    _getTopList(){
      getTopList().then((res) => {
        if(res.code === ERR_OK){
          this.topList = res.data.topList
        }
      })
    },
    handlePlaylist(playlist){
      const bottom = playlist.length > 0 ? '1.2rem' : ''
      this.$refs.rank.style.bottom = bottom
      this.$refs.toplist.refresh()
    },
    selectItem(item){
      this.$router.push({
        path: `/rank/${item.id}`
      })
      this.setTopList(item)
    },
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    })
  },
  components:{
    Loading,
    Scroll
  },
  created(){
    this._getTopList()
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

  .rank
    position:fixed
    top:1.76rem
    width:100%
    bottom:0
    .toplist
      height:100%
      overflow:hidden
      .item
        display:flex
        margin:0 .4rem
        padding-top:.4rem
        height:2rem
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 2rem
          width:2rem
          height:2rem
        .songList
          flex:1
          display:flex
          flex-direction: column
          justify-content:center
          padding:0 .4rem
          height:2rem
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height:.52rem
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
