import Vue from 'vue'

// 需要处理的页面生命周期
const PAGE_LIFECYCLE_HOOKS = [
    // 'onReady', uni-app 已支持
    'onLoad',
    'onUnload',
    'onShow',
    'onHide',
    'onPullDownRefresh',
    'onReachBottom',
    'onPageScroll'
]

// 在子组件 mounted 时将其页面生命周期挂载至其页面组件，在beforeDestroy 时再卸载
// PS：子组件 mixins 中的钩子函数，已经被挂载至 options，因此不需要额外处理
Vue.mixin({
    mounted() {
        if (this.$mp && this.$mp.component) {
            const pageRoot = this.$root
            for (let hook of PAGE_LIFECYCLE_HOOKS) {
                if (this.$options[hook]) {
                    const callbacks = this.$options[hook].map(item => {
                        let cb = item.bind(this)
                        cb._uid = this._uid
                        return cb
                    })
                    // onShow、onLoad 特殊处理，直接执行
                    if (['onShow', 'onLoad'].includes(hook)) {
                        callbacks.forEach(func => func())
                    }
                    if (pageRoot.$options[hook]) {
                        pageRoot.$options[hook].push(...callbacks)
                    } else {
                        pageRoot.$options[hook] = callbacks
                    }
                }
            }
        }
    },
    beforeDestroy() {
        if (this.$mp && this.$mp.component) {
            const pageRoot = this.$root
            for (let hook of PAGE_LIFECYCLE_HOOKS) {
                if (Array.isArray(pageRoot.$options[hook])) {
                    pageRoot.$options[hook] = pageRoot.$options[hook].filter(item => item._uid !== this._uid)
                }
            }
        }
    },
    onLoad() {},
    onUnload() {},
    onShow() {},
    onHide() {},
    onPullDownRefresh() {},
    onReachBottom() {},
    onPageScroll() {},
})
