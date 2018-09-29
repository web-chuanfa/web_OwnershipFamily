<template>
  <div class="province_modules vProvince">
    <div class="provinceList" :class="className"  :style="{background: 'url('+ imgUrl +')'}" style="background-size: 100% 100%;">
      <div v-for="item in provinceList" @click="provinceDetail(item)" :style="{width:item.curWidth + 'px',height:item.curHeight + 'px'}" :class="{'leftL':provinceList.length > 4}">
        <p class="name">{{ item.province_name}}</p>
        <h3 class="number">{{ item.count}}</h3>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props:['industry','order','param'],
  data () {
    return {
      areaName: "",
      provinceName: "",
      provinceList: [],
      addressName: "",
      imgUrl: "",
      className: "",
      imgName: "",
      hideValue: false,
      filterParam: {}
    }
  },
  watch: {
    $route (nv,ol) {
      this.handler();
    },
    filterParam (newVal,oldVal){
      this.handler();
    },
    param (newVal,oldVal){
      this.handler();
    }
  },
  methods: {
    provinceDetail (idx){
      //点击当前的地区--把当前的省份传到下一页面
      this.provinceName = idx.province_name;
      //
      localStorage.setItem('region', JSON.stringify(this.filterParam));
      //隐藏按地区
      this.$emit('hideValue', this.hideValue);
      this.$router.push({
          path:"/allViewChina/vChina/vCity/",
          query:{
            provinceName: this.provinceName,
            areaName: this.$route.query.areaName,
            addressName:this.$route.query.addressName
          }
        })
    },
    handler (){
      let that = this;
      this.filterParam = that.param;
      this.areaName = this.$route.query.areaName;
      this.addressName = this.$route.query.addressName;
      var qs = require('qs');
        // 通过参数来限制数据的多少。"areaName": "华北"  industryName firstCompany.   flage ="2"
      let config = {
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          }
      };
      if(this.$route.query.flage == 3){
        //地区搜索--省份时调用的模块
        var qs = require('qs');
        // 通过参数来限制数据的多少。"areaName": "华北"  industryName firstCompany.   flage ="2"
        let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        };
        //统计大区分布
        let urls = this.$API.url +'/basicInfo/getDomSearchInfo';
        //向后台参数
        let reqParams = {
            "addressName": this.addressName,
            "flage": "3"
        };
        this.axios.post(urls,qs.stringify(reqParams),config)
          .then((res) => {
            this.provinceList = res.data;
          }, (err) => {
            
        })
      }else{
        //统计大区省份
        let urls = this.$API.url +'/basicInfo/getBasicByAllCountprovinceName';
        var qs = require('qs');
        //向后台参数
        let reqParams = {
              "areaName" : this.areaName,
              "addressName" : this.addressName,
              "industryName": that.param.industry,
              "firstCompany" : that.param.order
        };
        let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        };
        this.axios.post(urls,qs.stringify(reqParams),config)
          .then((res) => {
            this.provinceList = res.data;
          }, (err) => {
            // alert("error");
        });
      }
      //判断是否进行过地区搜索
      if(this.$route.query.addressName != undefined){
          this.imgName = this.$route.query.addressName
      }else{
        this.imgName = this.areaName;
      }
      //. 背景图。entMenuInfo/getMapImgUrl   imgName = "东北" country="china";
      let urlBgs = this.$API.url + '/entMenuInfo/getMapImgUrl';
      let Params = {
            "imgName" : this.imgName,
            "country": "china"
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
   
  },
  created (){
    this.handler();
  }
}
</script>