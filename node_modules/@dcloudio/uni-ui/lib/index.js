
import * as uniBadge from './uni-badge/uni-badge.vue'
import * as uniCard from './uni-card/uni-card.vue'
import * as uniCollapseItem from './uni-collapse-item/uni-collapse-item.vue'
import * as uniCollapse from './uni-collapse/uni-collapse.vue'
import * as uniCountdown from './uni-countdown/uni-countdown.vue'
import * as uniDrawer from './uni-drawer/uni-drawer.vue'
import * as uniGrid from './uni-grid/uni-grid.vue'
import * as uniIcon from './uni-icon/uni-icon.vue'
import * as uniListItem from './uni-list-item/uni-list-item.vue'
import * as uniList from './uni-list/uni-list.vue'
import * as uniLoadMore from './uni-load-more/uni-load-more.vue'
import * as uniNavBar from './uni-nav-bar/uni-nav-bar.vue'
import * as uniNoticeBar from './uni-notice-bar/uni-notice-bar.vue'
import * as uniNumberBox from './uni-number-box/uni-number-box.vue'
import * as uniPagination from './uni-pagination/uni-pagination.vue'
import * as uniPopup from './uni-popup/uni-popup.vue'
import * as uniRate from './uni-rate/uni-rate.vue'
import * as uniSegmentedControl from './uni-segmented-control/uni-segmented-control.vue'
import * as uniStatusBar from './uni-status-bar/uni-status-bar.vue'
import * as uniSteps from './uni-steps/uni-steps.vue'
import * as uniTag from './uni-tag/uni-tag.vue'
export {
  uniBadge,
  uniCard,
  uniCollapseItem,
  uniCollapse,
  uniCountdown,
  uniDrawer,
  uniGrid,
  uniIcon,
  uniListItem,
  uniList,
  uniLoadMore,
  uniNavBar,
  uniNoticeBar,
  uniNumberBox,
  uniPagination,
  uniPopup,
  uniRate,
  uniSegmentedControl,
  uniStatusBar,
  uniSteps,
  uniTag
}
const install = function(Vue, options) {
  const components = require.context('./', true, /.vue$/)
  components.keys().forEach(fileName => {
    const componentConfig = components(fileName)['default']
    Vue.component(componentConfig.name, componentConfig)
  })
}
export default install
