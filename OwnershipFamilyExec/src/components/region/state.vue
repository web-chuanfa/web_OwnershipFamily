<template>
  <div class="province_modules">
    <div class="provinceList" :class="className"  :style="{background: 'url('+ imgUrl +')'}" style="background-size: 100% 100%;">
      <div class="northWest" v-for="item in stateList" @click="stateDetail(item)">
        <p class="name">{{ item.country_nam}}</p>
        <h3 class="number">{{ item.count}}</h3>
      </div>
    </div>
  </div>
</template>
<script>
import dataUrl  from  '../../../static/js/urls.json'
export default {
  props:['param','flage'],
  data () {
    return {
      continentName: "",
      state: "",
      stateList: [],
      countryNam: "",
      entName: "",
      imgUrl: "",
      className: "",
      enterpriseId: this.$route.params.id,
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
  },
  methods: {
    stateDetail (idx){
      //获取选中国家
      this.state = idx.country_nam;
      this.entName = this.$route.query.firmName;
      localStorage.setItem('region', JSON.stringify(this.filterParam));
      this.$router.push({
          path:"/infoDetail/table/"+this.enterpriseId,
          query:{
            countryNam: this.state,
            page: this.$route.query.page,
            firmName: this.entName,
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
        let urls = dataUrl.url +'/basicInfo/getDomSearchInfoWorld';
        //向后台参数
        let reqParams = {
            "addressName": this.addressName,
            "flage": "3"
        };
        this.axios.post(urls,qs.stringify(reqParams),config)
          .then((res) => {
            this.stateList = res.data;
          }, (err) => {
            this.$message({
                message: '数据请求失败!',
                center: true
            });
        })
      }else{
        let urls = dataUrl.url +'/regionInfo/getBasicCountCountryNamByEntNameAndContinentName';
        var qs = require('qs');
        let reqParams = {
              "continentName" : this.continentName,
              "enterpriseId": this.enterpriseId,
              "industryName" : this.filterParam.industry,
              "firstCompany" : this.filterParam.order
          };
        let config = {
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
              }
          };
          this.axios.post(urls,qs.stringify(reqParams),config)
          .then((res) => {
            this.stateList = res.data;
          }, (err) => {
            this.$message({
                message: '数据请求失败!',
                center: true
            });
          });
      }
      //判断是否进行过地区搜索
      if(this.$route.query.addressName != undefined){
         this.imgName = this.$route.query.addressName;
      }else{
        // 显示背景图--接口
        this.imgName = this.continentName;
      }
      let urlBgs = dataUrl.url + '/entMenuInfo/getMapImgUrl';
        let Params = {
            "imgName" : this.imgName,
            "country": "world"
        };
      this.axios.post(urlBgs,qs.stringify(Params),config)
        .then((res) => {
          this.imgUrl =  dataUrl.url + res.data[0].IMGURL;
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
    this.handler();
  }
}
</script>
<style scoped>
.province_modules .provinceList{
  background-size: 100% 100% !important;
  margin: 0px auto;
}
.province_modules .Yazhou{
  width: 5.98rem;
  height: 5.05rem;
}
.province_modules .China{
  width: 6.26rem;
  height: 5.05rem;
}
.province_modules .NorthAmerica{
  width: 9rem;
  height: 5.05rem;
}
.province_modules .Oceania{
  width: 5.8rem;
  height: 5.05rem;
}
.province_modules .Africa{
  width: 4.32rem;
  height: 5.05rem;
}
.province_modules .Africa{
  width: 4.32rem;
  height: 5.05rem;
}
.province_modules .SouthAmerica{
  width: 3.20rem;
  height: 5.05rem;
}
.province_modules .European{
  width: 7.1rem;
  height: 5.05rem;
}
.province_modules .Asia{
  width: 8.22rem;
  height: 5.05rem;
}
.provinceList{
  padding: 20px;
}
.provinceList div{
  width: 1rem;
  height: 1rem;
  display: inline-block;
  margin-right: 0.2rem;
  border-radius: 50%;
  color: #ffffff;
  text-align: center;
  background: #d7c86f;
  position: relative;
  left: 46%;
  top: 40%;
}
</style>
