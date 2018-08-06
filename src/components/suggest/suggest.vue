<template>
  <scroll 
  class="suggest" 
  :data="result"
  :pullup="pullup"
  @scrollToEnd="searchMore"
  ref="suggest">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in result" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore"></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<!-- 搜索框 -->
<script type="text/ecmascript-6">
import {search} from 'api/search'
import {ERR_OK} from 'api/config'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import Singer from 'common/js/singer'
import {mapMutations,mapActions} from 'vuex'
import NoResult from 'base/no-result/no-result'

const TYPE_SINGER = 'singer'
const perpage = 20

  export default {
    name: 'Suggest',
    props:{
      query: {
        type: String,
        default: ''
      },
      showSinger:{ //是否搜索歌手
        type:Boolean,
        default: true
      }
    },
    data(){
      return {
        page: 1, //页数
        result: [],
        pullup:true, //上拉刷新
        hasMore:true, //是否有更多数据
      }
    },
    methods:{
      selectItem(item){
        if(item.type === TYPE_SINGER){
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setsinger(singer)
        } else {
          this.insertSong(item)
        }
        this.$emit("select",item)
      },
      search(){
        this.page = 1
        this.hasMore = true
        this.$refs.suggest.scrollTo(0,0)
        search(this.query,this.page,this.showSinger,perpage).then((res) => {
          if(res.code === ERR_OK){
            this._genResult(res.data).then((result) => {
              this.result = result
            })
            this._checkMore(res.data)
          }
        })
      },
      searchMore(){
        if(!this.hasMore){
          return
        }
        this.page++
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this._genResult(res.data).then((result) => {
              this.result = this.result.concat(result)
            })
            this._checkMore(res.data)
          }
        })
      },
      _checkMore(data){
        const song = data.song
        if(!song.list.length || (song.curnum + song.curpage * perpage) >= song.totalnum){
          this.hasMore = false
        }
      },
      _genResult(data) {
        let ret = []
        if (data.zhida && data.zhida.singerid && this.page === 1) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        return processSongsUrl(this._normalizeSongs(data.song.list)).then((songs) => {
          ret = ret.concat(songs)
          return ret
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (isValidMusic(musicData)) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      getIconCls(item){
        if(item.type === TYPE_SINGER){
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getDisplayName(item){
        if(item.type === TYPE_SINGER){
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      refresh(){
        this.$refs.suggest.refresh()
      },
      ...mapMutations({
        setsinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    watch:{
      query(newQuery){
        this.search(newQuery)
      }
    },
    components:{
      Scroll,
      Loading,
      NoResult
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  
  .suggest
    height:100%
    overflow:hidden
    z-index:200
    .suggest-list
      padding:0 .6rem
      .suggest-item
        display:flex
        align-items:center
        padding-bottom:.4rem
        .icon
          flex: 0 0 .6rem
          width:.6rem
          [class^="icon-"]
            font-size: 14px
            color: $color-text-d
        .name
          flex:1
          font-size:$font-size-medium
          color:$color-text-d
          overflow:hidden
          .text
            no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>