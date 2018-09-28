<template>
  <div class="firm_stockInfo_bg">
    <div class="firm_stockInfo_content">
      <router-view>
          <allLevel :is="currentView"></allLevel>
      </router-view>
    </div>
  </div>
</template>
<script>
import allLevel from '../stockInfo/allLevel';
export default {
  data () {
    return {
      currentView: 'allLevel',
      enterpriseId: this.$route.params.id,
      searchType: this.$route.query.page,
      firmName: this.$route.query.firmName
    }
  },
  components: { 
     allLevel
  },
  watch: {
    $route (nv,ol) {
      this.enterpriseId = nv.params.id;
      this.firmName = nv.query.firmName;
    }
  },
  methods: {

  },
  mounted () {
    
  }
}
</script>
<style scoped>

</style>
