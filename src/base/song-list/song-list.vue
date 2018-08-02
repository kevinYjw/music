<template>
  <div class="song-list">
    <ul>
      <li class="item" v-for="(song,index) in songs" @click="selectItem(song,index)">
        <div class="rank" v-show="rank">
          <span :class="getRankCls(index)">{{getRankText(index)}}</span>
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>

//歌曲详情列表页面
export default {
  name: 'songList',
  props:{
    songs:{
      type:Array,
      default:[]
    },
    rank:{
      type:Boolean,
      default:false
    }
  },
  methods:{
    getDesc(song){
      return `${song.singer}·${song.album}`
    },
    selectItem(item,index){
      this.$emit('select',item,index)
    },
    getRankCls(index){
      if(index <= 2){
        return `icon icon${index}`
      } else {
        return 'text'
      }
    },
    getRankText(index){
      if (index > 2) {
        return index + 1
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable" 
  @import "~common/stylus/mixin"
  
  .music-list
    .item
      display:flex
      align-items:center
      box-sizing: border-box
      height:1.28rem
      font-size:$font-size-medium
      .rank
        flex:0 0 .5rem
        width:.5rem
        margin-right:.6rem
        text-align:center
        .icon
          display:inline-block
          width:.5rem
          height:.48rem
          background-size:.5rem .48rem
          &.icon0
            bg-image('first')
          &.icon1
            bg-image('second')
          &.icon2
            bg-image('third')
        .text
          color: $color-theme
          font-size: $font-size-large
      .content
        flex:1
        line-height:.4rem
        overflow:hidden
        .name
          no-wrap()
          color:$color-text
        .desc
          no-wrap()
          margin-top: .08rem
          color: $color-text-d
</style>
