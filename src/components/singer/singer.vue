<template>
  <div class="singer">
    <list-view :data="singers" @select="selectSinger"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import {getSingerList} from "api/singer"
import {ERR_OK} from 'api/config'
import Singer from 'common/js/singer'
import ListView from 'components/listview/listview'
import {mapMutations} from 'vuex' //语法糖

const HOT_SINGER_LEN = 10 //热门数据的总数
const HOT_NAME = '热门'

//歌手页面
export default {
  name: 'singer',
  data(){
    return {
      singers: []
    }
  },
  methods:{
    selectSinger(singer){
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setsinger(singer)
    },
    // 获取歌手列表
    _getSingerList(){
      getSingerList().then((res) => {
        if(res.code === ERR_OK){
          this.singers = this._normalizeSinger(res.data.list)
        }
      })
    },
    // 对歌手列表进行排序
    _normalizeSinger(list){
      let map = {
        hot:{
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item,index) => {
        if(index < HOT_SINGER_LEN){
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
        const key = item.Findex
        if(!map[key]){
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })

      // 有序列表排序
      let ret = []
      let hot = []
      for (let key in map){
        let val = map[key]
        if(val.title === HOT_NAME){
          hot.push(val)
        } else if(val.title.match(/[a-zA-z]/)){
          ret.push(val)
        }
      }
      ret.sort((a,b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    },
    ...mapMutations({
      setsinger: 'SET_SINGER'
    })
  },
  components:{
    ListView
  },
  created(){
    this._getSingerList()
  }
}
</script>

<style lang="stylus" scoped>
  .singer
    position:fixed
    top:1.76rem
    bottom:0
    width:100%
</style>
