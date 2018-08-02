<template>
  <transition name="slide">
    <div class="disc">
      <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
    </div>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getSongList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'

//歌单详情页面
export default {
  name: 'disc',
  data(){
    return {
      songs: []
    }
  },
  computed:{
    ...mapGetters([
      'disc'
    ]),
    title(){
      return this.disc.dissname
    },
    bgImage(){
      return this.disc.imgurl
    }
  },
  methods:{
    _getSongList(){
      if(!this.disc.dissid){
        this.$router.push('/recommend')
      }
      getSongList(this.disc.dissid).then((res) => {
        if(res.code === ERR_OK){
          processSongsUrl(this._normalizeSongs(res.cdlist[0].songlist)).then((songs) => {
              this.songs = songs
          })
        }
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
    }
  },
  components:{
    MusicList
  },
  created(){
    this._getSongList()
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  
  .slide-enter-active,.slide-leave-active
    transition: all 0.4s
  .slide-enter,slide-leave-to
    transform:translate3d(100%,0,0)
</style>
