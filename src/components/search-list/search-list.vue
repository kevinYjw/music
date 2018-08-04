<template>
  <div class="search-list">
    <ul>
      <li class="search-item" @click="selectItem(item)" v-for="item in searches">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteItem(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>

//搜索页面
export default {
  name: 'SearchList',
  props:{
    searches:{
      types: Array,
      default:[]
    }
  },
  methods:{
    selectItem(item){
      this.$emit('select',item)
    },
    deleteItem(item){
      this.$emit('delete',item)
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  
  .search-list
    .search-item
      display:flex
      align-items:center
      height:.8rem
      .text
        flex:1
        color: $color-text-l
      .icon
        extend-click()
        .icon-delete
          font-size: $font-size-small
          color: $color-text-d
</style>
