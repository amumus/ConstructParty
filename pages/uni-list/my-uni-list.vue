<template>
	<view>
		<uni-list>
			<uni-list-item title="标题文字" show-arrow="false"></uni-list-item>
			<uni-list-item title="标题文字"></uni-list-item>
			<uni-list-item title="标题文字" show-badge="true" badge-text="12"></uni-list-item>
			<uni-list-item title="禁用状态" disabled="true" show-badge="true" badge-text="12"></uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	import {uniBadge} from '@dcloudio/uni-ui'
	import uniList from '@dcloudio/uni-ui/lib/uni-list/uni-list.vue'
	import uniListItem from '@dcloudio/uni-ui/lib/uni-list-item/uni-list-item.vue'
	
	export default {
		components: {
			uniList,
			uniListItem,
			// uniBadge,
		},
		data() {
			return {
				
			};
		}
	}
</script>

<style>

</style>
