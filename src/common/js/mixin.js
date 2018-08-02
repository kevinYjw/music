import {mapGetters} from 'vuex'

export const playlistMixin = {
  computed:{
    ...mapGetters([
      'playlist'
    ])
  },
  watch:{
    playlist(newVal){
      this.handlePlaylist(newVal)
    }
  },
  methods:{
    handlePlaylist(){
      throw new Error('请添加 handlePlaylist 方法')
    }
  },
  mounted(){
    this.handlePlaylist(this.playlist)
  },
  activated(){
    this.handlePlaylist(this.playlist)
  }
}