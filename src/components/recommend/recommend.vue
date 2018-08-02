<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="disclist">
      <div>
        <!-- 轮播图 -->
        <div v-if="recommends.length" class="slider-wrapper">
          <slider>
            <div v-for="item in recommends">
              <a :href="item.linkUrl">
                <img @load="loadImage" :src="item.picUrl" class="needsclick">
              </a>
            </div>
          </slider>
        </div>
        <!-- 列表 -->
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in disclist" class="item" @click="selectItem(item)">
              <div class="icon">
                <img v-lazy="item.imgurl" width="60" height="60">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-wrapper" v-show="!disclist.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import {getRecommend,getDiscList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {playlistMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'

//推荐页面
export default {
  name: 'recommend',
  mixins: [playlistMixin],
  data(){
    return {
      recommends: [],
      disclist: []
    }
  },
  methods:{
    handlePlaylist(playlist){
      const bottom = playlist.length > 0 ? '1.2rem' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    //获取轮播图图片
    _getRecommend(){
      getRecommend().then((res) => {
        if(res.code === ERR_OK){
          this.recommends = res.data.slider
        }
      })
    },
    // 获取歌单列表
    _getDiscList(){
      getDiscList().then((res) => {
        if(res.code === ERR_OK){
          this.disclist = res.data.list
        }
      })
    },
    loadImage() {
      if (!this.checkloaded) {
        this.checkloaded = true
        setTimeout(() => {
          this.$refs.scroll.refresh()
        }, 20)
      }
    },
    selectItem(item){
      this.$router.push({
        path: `/recommend/${item.dissid}`
      })
      this.setDisc(item)
    },
    ...mapMutations({
      'setDisc': 'SET_DISC'
    })
  },
  components:{
    Slider,
    Scroll,
    Loading
  },
  created(){
    this._getRecommend()
    this._getDiscList()
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"

  .recommend
    position:fixed
    width:100%
    top:1.76rem
    bottom:0
    .recommend-content
      height:100%
      overflow:hidden
      .slider-wrapper
        position:relative
        width:100%
        overflow:hidden
      .recommend-list
        .list-title
          height:1.3rem
          line-height:1.3rem
          text-align:center
          font-size:$font-size-medium
          color:$color-theme
        .item
          display:flex
          align-items:center
          padding:0 .4rem .4rem .4rem
          .icon
            flex 0 0 1.2rem
            width:1.2rem
            padding-right:.4rem
          .text
            display:flex
            flex-direction: column
            justify-content: center
            flex:1
            line-height:.4rem
            overflow:hidden
            font-size:$font-size-medium
            .name
              margin-bottom:.2rem
              color:$color-text
            .desc
              color: $color-text-d
      .loading-wrapper
        position:absolute
        width:100%
        top:50%
        transform: translateY(-50%)
</style>
