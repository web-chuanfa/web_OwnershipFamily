<template>
  <div class="worldPlat">
      <div class="info_map">
        <h6>在<span>全世界</span>共有<span>{{ total }}</span>家公司</h6>
        <div class="region_list">
          <div v-for="(item, index) in continentList" :class="item.englishname" @click="regionDetail(item.continent_name,item.count,$event)" :plain="true" :style="{width:item.curWidth + 'px',height:item.curHeight + 'px'}">
            <p class="name">{{ item.continent_name }}</p>
            <h3 class="number">{{ item.count }}</h3>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
export default {
  props:['filter','continent','industry','order'],
  data () {
    return {
      continentList: [],
      total: 0,
      entName: "",
      mapName: "世界",
      hideValue: false,
      resetAddress: false,
      filterParam: {}
    }
  },
  watch: {
    filterParam (newVal,oldVal){
      this.handler();
    },
    filter (newVal,oldVal){
      // 判断是否地区筛选 = 3， 还是按地区筛选 = 2，或者不筛选 = 1
    }
  },
  methods: {
    regionDetail (idx,count,event){
      this.entName = idx;
      //
      this.$emit('hideValue', this.hideValue);
      localStorage.setItem('region', JSON.stringify(this.filterParam));
      if(count == "0"){
        this.$message({
          message: '当前区域暂无数据!',
          center: true
        });
      }else{
        this.$router.push({
          path:"/allViewChina/vWorld/vState/",
          query:{
            continentName: this.entName
          }
        })
      }
    },
    handler (){
      let that = this;
      eventBus.$on('todo', (params) => {
        this.filterParam = params;
      });
      let urls = this.$API.url +'/basicInfo/getBasicByAllContinentName';
      var qs = require('qs');
      //. 通过参数来限制数据的多少
      let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
      };
      if(that.filter == 2){
        let reqParams = {
            "flage": "2",
            "mapName": this.mapName
        };
        this.axios.post(urls,qs.stringify(reqParams),config)
          .then((res) => {
            this.continentList = res.data;
            let totales = 0;
            //统计所有的公司总数
            for(let i =0; i< this.continentList.length;i++){
              totales +=parseInt(this.continentList[i].count);
            }
            this.total = totales;
          }, (err) => {
            
        })
      }else if(that.filter == 1){
        let reqParams = {
          "continentName": this.mapName,
          "flage": "1",
          "continentName": this.filterParam.continent,
          "industryName": this.filterParam.industry,
          "firstCompany" : this.filterParam.order
        };
        this.axios.post(urls,qs.stringify(reqParams),config)
        .then((res) => {
          this.continentList = res.data;
          let totales = 0;
          //统计所有的公司总数
          for(let i =0; i< this.continentList.length;i++){
            totales +=parseInt(this.continentList[i].count);
          }
          this.total = totales;
        }, (err) => {
          
        })
      }else{
        //统计大洲分布
        let urls = this.$API.url +'/basicInfo/getDomSearchInfoWorld';
        //向后台参数
        let reqParams = {
            "addressName": this.$route.query.addressName,
            "flage": "1"
        };
        this.axios.post(urls,qs.stringify(reqParams),config)
          .then((res) => {
            this.continentList = res.data;
            let totales = 0;
            //统计所有的公司总数
            for(let i =0; i< this.continentList.length;i++){
              totales +=parseInt(this.continentList[i].count);
            }
            this.total = totales;
            //监听地区搜索的值
            this.$emit('resetAddress', this.resetAddress);
          }, (err) => {
            
        })
      }
    }
  },
  mounted () {
    // this.handler();
  },
  created (){
    eventBus.$on('todo', (params) => {
         this.filterParam = params;
    });
    this.handler();
  }
}
</script>