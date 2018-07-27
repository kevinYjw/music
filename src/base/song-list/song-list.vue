<template>
  <div class="song-list">
    <ul>
      <li class="item" v-for="song in songs">
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
    }
  },
  methods:{
    getDesc(song){
      return `${song.singer}·${song.album}`
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
