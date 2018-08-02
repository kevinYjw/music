<template>
  <div class="top-list">
    <music-list :title="title" :songs="songs" :bgImage="bgImage" :rank="rank"></music-list>
  </div>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getMusicList} from 'api/rank'
import {ERR_OK} from 'api/config'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'

//排行页面
export default {
  name: 'TopList',
  data(){
    return {
      songs: [],
      rank: true
    }
  },
  computed:{
    ...mapGetters([
      'toplist'
    ]),
    title(){
      return this.toplist.topTitle
    },
    bgImage(){
      return this.toplist.picUrl
    }
  },
  components:{
    MusicList
  },
  methods:{
    _getMusicList(){
      getMusicList(this.toplist.id).then((res) => {
        if(res.code === ERR_OK){
          processSongsUrl(this._normalizeSongs(res.songlist)).then((songs) => {
              this.songs = songs
          })
        }
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((item) => {
        const musicData = item.data
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  created(){
    this._getMusicList()
  }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

</style>
