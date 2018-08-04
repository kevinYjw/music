<template>
  <div class="search">
    <!-- 搜索框 -->
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <!-- 热门搜索 -->
    <div class="shortcut-wrapper" ref="shortcutWrapper" v-show="!query">
      <scroll class="shortcut" ref="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li v-for="item in hotKey" class="item" @click="addQuery(item.k)">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest :query="query" @select="saveSearch" ref="suggest"></suggest>
    </div>
    <confirm text="是否清空所有搜索历史" confirmBtnText="清空" ref="confirm" @confirm="clearSearchHistory"></confirm>
  </div>
</template>

<script>
import SearchBox from 'components/search-box/search-box'
import {getHotKey} from 'api/search'
import {ERR_OK} from 'api/config'
import Suggest from 'components/suggest/suggest'
import {mapActions,mapGetters} from 'vuex'
import SearchList from 'components/search-list/search-list'
import Confirm from 'base/confirm/confirm'
import Scroll from 'base/scroll/scroll'
import {playlistMixin} from 'common/js/mixin'

//搜索页面
export default {
  mixins:[playlistMixin],
  name: 'search',
  data(){
    return {
      hotKey: [],
      query: ''
    }
  },
  computed:{
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods:{
    _getHotKey(){
      getHotKey().then((res) => {
        if(res.code === ERR_OK){
          this.hotKey = res.data.hotkey.slice(0, 10)
        }
      })
    },
    addQuery(query){
      this.$refs.searchBox.setQuery(query)
    },
    onQueryChange(query){
      this.query = query
    },
    //储存在本地内存中
    saveSearch(){
      this.saveSearchHistory(this.query)
    },
    // 清空
    showConfirm(){
      this.$refs.confirm.show()
    },
    handlePlaylist(playlist){
      const bottom = playlist.length > 0 ? '1.2rem' : ''

      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggest.refresh()

      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'clearSearchHistory'
    ])
  },
  components:{
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll
  },
  watch:{
    query(newQuery){
      if(!newQuery){
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        },20)
      }
    }
  },
  created(){
    this._getHotKey()
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  
  .search
    .search-box-wrapper
      margin:.4rem
    .shortcut-wrapper
      position:fixed
      top:3.56rem
      bottom:0
      width:100%
      .shortcut
        height:100%
        overflow:hidden
        .hot-key
          margin:0 .4rem .4rem .4rem
          .title
            margin-bottom:.4rem
            font-size:$font-size-medium
            color:$color-text-l
          .item
            display:inline-block
            padding:.1rem .2rem
            margin:0 .4rem .2rem 0
            background-color:$color-highlight-background
            border-radius:.12rem
            color:$color-text-d
            font-size:$font-size-medium
        .search-history
          position:relative
          margin:0 .4rem
          .title
            display:flex
            align-items:center
            height:.8rem
            font-size:$font-size-medium
            color:$color-text-l
            .text
              flex:1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position:fixed
      top:3.56rem
      bottom:0
      width:100%
</style>
