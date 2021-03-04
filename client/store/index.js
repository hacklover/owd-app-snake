import Snake from '../core/Snake.class';

let timeoutInvisibility

export default {
  state: {
    instance: null,

    server: {
      baseUrl: 'https://hacklover-snake-server.herokuapp.com',
      connected: false
    },

    snake: {
      mode: 'default',
      direction: '',
      body: [],
      damaged: false,
      speed: 0
    },

    canvasContainerClasses: [],

    goodies: [],

    stats: {
      score: 0,
      goodies: 0,
      moves: 0,
      speed: 0
    }
  },

  getters: {
    instance(state) {
      return state.instance
    },
    server(state) {
      return {
        name: state.server.baseUrl.split('//')[1],
        connected: state.server.connected
      }
    },
    game(state) {
      return {
        snake: state.snake,
        goodies: state.goodies,
        stats: state.stats,
        canvas: {
          container: { classes: state.canvasContainerClasses }
        }
      }
    },
    serverApiUpdates(state) {
      return state.server.baseUrl + '/api/sse'
    },
    serverApiInput(state) {
      return state.server.baseUrl + '/api/input'
    }
  },

  mutations: {
    SET_INSTANCE(state, instance) {
      state.instance = instance
    },

    SET_CONNECTED(state, value) {
      state.server.connected = value;
    },

    SET_SNAKE_STATUS(state, data) {
      state.snake = data.snake
      state.goodies = data.goodies
      state.stats = data.stats
    },

    SET_BONUS_EATEN(state, type) {
      // add shake effect
      if (!state.canvasContainerClasses.includes('shake')) {
        state.canvasContainerClasses.push('shake');
      }

      setTimeout(function () {
        // special bonus effect
        switch (type) {
          case 5:
            if (!state.canvasContainerClasses.includes('invisible')) {
              state.canvasContainerClasses.push('invisible');
            }

            clearTimeout(timeoutInvisibility);
            timeoutInvisibility = setTimeout(function () {
              state.canvasContainerClasses.splice(state.canvasContainerClasses.indexOf('invisible'), 1);
            }, 10000);
            break;
        }

        // remove shake effect
        state.canvasContainerClasses.splice(state.canvasContainerClasses.indexOf('shake'), 1);
      }, 300);
    }
  },

  actions: {
    initialize({commit}, window) {
      const snake = new Snake(this, window)

      if (snake) {
        commit('SET_INSTANCE', snake)
      }
    },

    connect({getters}) {
      getters.instance.server.connect()
    },

    disconnect({getters}) {
      getters.instance.server.disconnect()
    },

    sendDirection({getters}, direction) {
      getters.instance.input.sendDirection(direction)
    }
  }
}