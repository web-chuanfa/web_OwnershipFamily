<template>
  <div class="province_modules vState">
    <div class="provinceList" :class="className"  :style="{background: 'url('+ imgUrl +')'}" style="background-size: 100% 100%;">
      <div class="northWest" v-for="item in stateList" :style="{width:item.curWidth + 'px',height:item.curHeight + 'px'}" @click="stateDetail(item)" :class="{'leftL':stateList.length > 4}">
        <p class="name">{{ item.country_nam}}</p>
        <h3 class="number">{{ item.count}}</h3>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props:['flage','continent','industry','order','param'],
  data () {
    return {
      continentName: "",
      state: "",
      stateList: [],
      countryNam: "",
      entName: "",
      imgUrl: "",
      className: "",
      imgName: "",
      addressName: "",
      filterParam: {}
    }
  },
  watch: {
    flage (newVal,oldVal){
      let that = this;
      this.handler();
    },
    param (newVal,oldVal){
      this.handler();
    }
    // continent (newVal,oldVal){
    //   let that = this;
    //   that.continent = newVal;
    //   this.handler();
    // },
    // order (newVal,oldVal){
    //   let that = this;
    //   that.order = newVal;
    //   this.handler();
    // },
    // industry (newVal,oldVal){
    //   let that = this;
    //   that.industry = newVal;
    //   this.handler();
    // }
  },
  methods: {
    stateDetail (idx){
      this.state = idx.country_nam;
      localStorage.setItem('region', JSON.stringify(this.filterParam));
      this.$router.push({
          path:"/vTable/",
          query:{
            countryNam: this.state,
            continentName: this.$route.query.continentName
          }
        })
    },
    handler (){
      let that = this;
      this.filterParam = that.param;
      this.continentName = this.$route.query.continentName;
      this.addressName = this.$route.query.addressName;
      var qs = require('qs');
      let config = {
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          }
      };
      if(this.$route.query.flage == 3){
        //地区搜索--国家时调用的模块
        //统计大洲分布
        let urls = this.$API.url +'/basicInfo/getDomSearchInfoWorld';
        //向后台参数
        let reqParams = {
            "addressName": this.addressName,
            "flage": "3"
        };
        this.axios.post(urls,qs.stringify(reqParams),config)
          .then((res) => {
            this.stateList = res.data;
          }, (err) => {
            
        })
      }else{
        let urls = this.$API.url +'/basicInfo/getBasicCountCountryNamByAll';
        let reqParams = {
              "continentName" : this.continentName,
              "industryName" : this.filterParam.industry,
              "firstCompany" : this.filterParam.order
          };
          this.axios.post(urls,qs.stringify(reqParams),config)
          .then((res) => {
            this.stateList = res.data;
          }, (err) => {
            
          })
      }
      //判断是否进行过地区搜索
      if(this.$route.query.addressName != undefined){
         this.imgName = this.$route.query.addressName;
      }else{
        // 显示背景图--接口
        this.imgName = this.continentName;
      }
      let urlBgs = this.$API.url + '/entMenuInfo/getMapImgUrl';
        let Params = {
            "imgName" : this.imgName,
            "country": "world"
        };
      this.axios.post(urlBgs,qs.stringify(Params),config)
        .then((res) => {
          this.imgUrl =  this.$API.url + res.data[0].IMGURL;
          this.className = res.data[0].CLASSNAME
        }, (err) => {
          
      });
    }
  },
  mounted () {
    // this.handler();
  },
  created (){
    // eventBus.$on('todo', (params) => {
    //      this.filterParam = params;
    // });
    this.handler();
  }
}
</script>