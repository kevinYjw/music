import Vue from 'vue'
import Router from 'vue-router'

// 组件
// import Recommend from 'components/recommend/recommend'
// import Search from 'components/search/search'
// import Rank from 'components/rank/rank'
// import Singer from 'components/singer/singer'
// import SingerDetail from 'components/singer-detail/singer-detail'
// import Disc from 'components/disc/disc'
// import TopList from 'components/top-list/top-list'
// import UserCenter from 'components/user-center/user-center'

Vue.use(Router)

//异步加载，优化
const Recommend = () => import('components/recommend/recommend')
const Search = () => import('components/search/search')
const Rank = () => import('components/rank/rank')
const Singer = () => import('components/singer/singer')
const SingerDetail = () => import('components/singer-detail/singer-detail')
const Disc = () => import('components/disc/disc')
const TopList = () => import('components/top-list/top-list')
const UserCenter = () => import('components/user-center/user-center')

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children:[
        {
          path: ':id',
          component:Disc
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children:[
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children:[
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/user',
      component: UserCenter
    }
  ]
})
