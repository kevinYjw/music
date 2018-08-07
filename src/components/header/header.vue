<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 class="title">Chicken Music</h1>
    <router-link to="/user" tag="div" class="mine">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'MHeader'
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"

  .m-header
    position:relative
    height:.88rem
    text-align:center
    color:$color-theme
    font-size:0
    .icon
      display:inline-block
      width:.6rem
      height:.64rem
      background-size:.6rem .64rem
      margin-right:.18rem
      vertical-align: top
      margin-top: .12rem
      bg-image('logo')
    .title
      display:inline-block
      font-size:$font-size-large
      line-height:.88rem
      vertical-align: top
    .mine
      position: absolute
      top: 0
      right: 0
      .icon-mine
        display: block
        padding: 12px
        font-size: 20px
        color: $color-theme
</style>
