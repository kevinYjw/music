//vuex所有状态
import {playMode} from 'common/js/config'

const state = {
	singer: {},
	playing: false, //播放或停止
	fullScreen: false, //播放器展开或收起
	playlist: [], //播放列表
	sequenceList: [], //实际播放列表
	mode: playMode.sequence, //播放状态
	currentIndex: -1,  //当前播放的歌曲顺序
	disc: {},  //歌单详情
	toplist: {} //排行详情
}

export default state