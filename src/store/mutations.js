//vuex mutations(变话)

import * as types from './mutations-types'

const matutaions = {
	[types.SET_SINGER](state,singer) {
		state.singer = singer
	}
}

export default matutaions