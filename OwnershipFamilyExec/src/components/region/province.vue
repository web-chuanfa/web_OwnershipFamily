<template>
  <div class="province_modules">
    <div class="provinceList" :class="className"  :style="{background: 'url('+ imgUrl +')'}" style="background-size: 100% 100%;">
      <div v-for="item in provinceList" @click="provinceDetail(item)" :class="{'lefts':provinceList.length > 3}">
        <p class="name">{{ item.province_name}}</p>
        <h3 class="number">{{ item.count}}</h3>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props:['filter','region','industry','order','flage','param'],
  data () {
    return {
      areaName: "",
      provinceName: "",
      provinceList: [],
      addressName: "",
      entName: this.$route.query.firmName,
      imgUrl: "",
      className: "",
      enterpriseId: this.$route.params.id,
      imgName: "",
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
  },
  methods: {
    provinceDetail (idx){
      this.provinceName = idx.province_name;
      localStorage.setItem('region', JSON.stringify(this.filterParam));
      this.$router.push({
          path:"/infoDetail/regionSubstance/china/city/"+this.enterpriseId,
          query:{
            provinceName: this.provinceName,
            page: this.$route.query.page,
            firmName: this.entName,
            areaName: this.$route.query.areaName
          }
        })
    },
    handler (){
      let that = this;
      this.filterParam = that.param;
      this.areaName = this.$route.query.areaName;
      this.addressName = this.$route.query.addressName;
      var qs = require('qs');
      let config = {
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          }
      };
      //判断是否点击地区搜索
      if(this.$route.query.flage == 2){
        let Url = this.$API.url +'/regionInfo/getDomSearchInfo';
        // flage  = 3
        let params = {
            "addressName": this.addressName,
            "flage": "3",
            "enterpriseId": this.enterpriseId
        };
        this.axios.post(Url,qs.stringify(params),config)
          .then((res) => {
            if(res.data.length == 0){
              this.provinceList = [{"count":"0","curHeight":"60","curWidth":"60","province_name":"暂无","city_name":"暂无"}];
            }else{
              this.provinceList = res.data;
            }
          }, (err) => {
            this.$message({
                message: '数据请求失败!',
                center: true
            });
        });
        }else{
          let urls = this.$API.url +'/regionInfo/getBasicCountProvinceNameByCompanyNameAndIndustryName';
          let reqParams = {
                "areaName" : this.areaName,
                "addressName" : this.addressName,
                "enterpriseId": this.enterpriseId,
                "areaName": this.$route.query.areaName,
                "industryName": that.param.industry,
                "firstCompany" : that.param.order
          };
          this.axios.post(urls,qs.stringify(reqParams),config)
            .then((res) => {
              this.provinceList = res.data;
            }, (err) => {
              this.$message({
                  message: '数据请求失败!',
                  center: true
              });
          });
      }
      // 背景图   imgName = "东北"
      let urlBgs = this.$API.url + '/entMenuInfo/getMapImgUrl';
      //判断是否进行过地区搜索
      if(this.$route.query.addressName != undefined){
          this.imgName = this.$route.query.addressName
      }else{
        this.imgName = this.areaName;
      }
      let Params = {
          "imgName" : this.imgName,
          "country": "china"
      };
      this.axios.post(urlBgs,qs.stringify(Params),config)
        .then((res) => {
          this.imgUrl =  this.$API.url + res.data[0].IMGURL;
          this.className = res.data[0].CLASSNAME
        }, (err) => {
          this.$message({
              message: '数据请求失败!',
              center: true
          });
      });
    }
  },
  mounted () {
    // this.handler();
  },
  created (){
    this.handler();
  }
}
</script>