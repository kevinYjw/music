<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input type="text" v-model="query" class="box" :placeholder="placeholder">
    <i v-show="query" class="icon-dismiss" @click="clear"></i>
  </div>
</template>

<script>
import {debounce} from 'common/js/util'

//搜索页面
export default {
  name: 'SearchBox',
  props:{
    placeholder:{
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data(){
    return {
      query: ''
    }
  },
  methods:{
    clear(){
      this.query = ''
    },
    setQuery(query){
      this.query = query
    }
  },
  created(){
    this.$watch('query', debounce((newQuery) => {
      this.$emit('query', newQuery)
    }, 200))
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  
  .search-box
    display:flex
    align-items:center
    box-sizing: border-box
    width:100%
    padding:0 .12rem
    height:.8rem
    background-color:$color-highlight-background
    border-radius:.12rem
    .icon-search
      font-size:.48rem
      color:$color-background
    .box
      flex:1
      margin:0 .1rem
      line-height:.36rem
      color:$color-text
      background-color:$color-highlight-background
      font-size:$font-size-medium
      border:none
      &::placeholder
        color:$color-text-d
    .icon-dismiss
      font-size:.32rem
      color:$color-background
</style>
