<template>
  <div class="region_map_content">
    <router-view :filter="filter" :flage="flage" :param="param" :region="region" :order="order" :industry="industry" v-on:resetAddress="resetAddress">
        <chinaL :is="currentView"></chinaL>
    </router-view>
    <!-- 点击筛选 -->
    <div class="trigger_filter clear">
        <a href="javascript:;" @click="showToggle">
          <img src="../../assets/images/trigger_filter.png" alt="">
        </a>
    </div>
    <!-- 显示有导航筛选区域 -->
    <div class="region_search_module_dialog" v-show="isShow">
      <div class="region_search_module">
         <div class="pos_a" @click="hide" style="z-index:1000;">
           <img src="../../assets/images/close.png" alt="">
         </div>
         <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
            <el-tab-pane label="筛选" name="first">
              <div class="region_search_content clear">
                  <div class="region_search_filter">
                      <div class="checkbox-group-module" v-if="isDisplay==true">
                        <h6 style="margin-bottom: 0rem;">按地区</h6>
                        <el-checkbox-button :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox-button>
                        <el-checkbox-group v-model="regionItem" @change="handleCheckedRegionsChange">
                          <el-checkbox-button v-for="item in regionsList" :label="item" :key="item">{{item}}</el-checkbox-button>
                        </el-checkbox-group>
                        <p class="regionTotal" v-if="regionItem.length !=0">已选：<a v-for="(item, index) in regionTotal"><span>{{ item.area_name }}({{ item.count }})</span></a></p>
                      </div>
                      <div class="checkbox-group-module">
                        <h6 style="margin-bottom: 0rem;">按行业</h6>
                        <el-checkbox-button :indeterminate="isIndustry" v-model="industryCheckAll" @change="handleCheckAllIndustryMenuChange">全选</el-checkbox-button>
                        <el-checkbox-group v-model="industryMenu" @change="handleCheckedIndustryChange">
                          <el-checkbox-button v-for="item in industryMenuList" :label="item" :key="item">{{item}}</el-checkbox-button>
                        </el-checkbox-group>
                        <p class="regionTotal" v-if="industryMenu.length !=0">已选：<a v-for="(item, index) in industryMenuTotal"><span>{{ item.industry_name }}({{ item.count }})</span></a></p>
                      </div>
                      <div class="checkbox-group-module borderB0">
                        <h6 style="margin-bottom: 0rem;">第一级公司</h6>
                        <el-checkbox-button :indeterminate="isOrder" v-model="orderCheckAll" @change="handleCheckAllOrderMenuChange">全选</el-checkbox-button>
                        <el-checkbox-group v-model="orderMenu" @change="handleCheckedOrderChange">
                          <el-checkbox-button v-for="item in OrderMenuList" :label="item" :key="item">{{item.substring(0,4)}}</el-checkbox-button>
                        </el-checkbox-group>
                      </div>
                      <div class="handle clear">
                        <button class="filter_reset" @click="detailList">查看列表</button>
                        <button class="filter_confirm handle_filter_active" @click="commitData">确认选择</button>
                      </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="地区搜索" name="second">
               <div class="region_search_content clear">
                  <div class="region_search_place">
                    <div class="info_search">
                     <input type="text" placeholder="请输入您想搜索的地区" id="searchText" class="searchText" v-model="addressName">
                     <a href="javascript:void(0);" class="icon_search" @click='regionSearch'></a>
                   </div>
                  </div>
              </div>
            </el-tab-pane>
         </el-tabs>
      </div>
      <div class="mask"></div>
    </div>
  </div>
</template>
<script>
import chinaL from './chinaL';
const cityOptions = ['东北', '华东', '西北','华中','华南','西南','华北','港澳台'];
const industryOptions = ['金融','制造','工程承包','房地产','资源与能源','其他'];
const OrderOptions = ['中信控股有限责任公司','中信云网有限公司','中信银行股份有限公司'];
export default {
  data () {
    return {
      currentView: "chinaL",
      mapName: "中国",
      areaName: "",
      regionList: [],
      firmName: this.$route.query.firmName,
      total: 0,
      enterpriseId: this.$route.params.id,
      page: this.$route.query.page,
      isShow: false,
      activeName2: 'first',
      orderMenu: [''],
      industryMenuList: industryOptions,
      OrderMenuList: OrderOptions,
      region: "",
      industry: "",
      order: "",
      addressName: "",
      flage: 1,
      filter: 2,
      isDisplay: false,
      isIndeterminate: true,
      checkAll: true,
      industryCheckAll: true,
      orderCheckAll: false,
      regionsList: cityOptions,
      regionItem: cityOptions,
      industryMenu: industryOptions,
      isIndustry: true,
      isOrder: true,
      param: {
        region: "",
        industry: "",
        order: "",
        filter: "2"
      },
      regionTotal: "",
      RegionsChange: "",
      industryChange: "",
      orderChange: "",
      industryMenuTotal: "",
      areaNameFlag: ""
    }
  },
  watch: {
    $route (nv,ol) {
      if(nv.path.indexOf('chinaL')>-1 === true){
        this.isDisplay = true;
      }
    },
    isDisplay (newVal,oldVal){
      this.isDisplay = newVal;
    },
    param (newVal,oldVal){

    }
  },
  methods: {
    handleCheckAllChange(val) {
      this.regionItem = val ? cityOptions : [];
      this.isIndeterminate = false;
      if(val == false){
        this.regionTotal = [];
      }else{
        //监听大区,行业的数据变化
        this.regionsChange();
        this.IndustryChange();
      }
    },
    regionsChange (){
      //监听大区的数据变化
      this.RegionsChange = (this.regionItem).join(",");
      this.industryChange = (this.industryMenu).join(",");
      this.orderChange = (this.orderMenu).join(",");
      //需要 点击选择的时候与中国地图同一个接口，用不同的参数来设置的显示的条件
      let urls = this.$API.url +'/regionInfo/getBasicCountAreaNameByCompanyName';
      var qs = require('qs');
      //. 通过参数来限制数据的多少。"areaName": "华北"  industryName firstCompany.   flage ="2"
      let config = {
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          }
      };
      //判断是否进入省份页面
      if(this.$route.query.areaName != undefined){
        // 在城市页面的时候执行
        if(this.$route.query.provinceName != undefined){
          let reqParams = {
            "countryNam" : this.mapName,
            "enterpriseId": this.enterpriseId,
            "flage": "1",
            "areaName": this.$route.query.areaName,
            "provinceName": this.$route.query.provinceName,
            "industryName": this.industryChange,
            "firstCompany" : this.orderChange
          };
          this.axios.post(urls,qs.stringify(reqParams),config)
            .then((res) => {
                this.regionTotal = res.data;
            }, (err) => {
              this.$message({
                  message: '数据请求失败!',
                  center: true
              });
            })
        }else{
          // 在省份页面的时候执行
          let reqParams = {
            "countryNam" : this.mapName,
            "enterpriseId": this.enterpriseId,
            "flage": "1",
            "areaName": this.$route.query.areaName,
            "industryName": this.industryChange,
            "firstCompany" : this.orderChange
          };
          this.axios.post(urls,qs.stringify(reqParams),config)
            .then((res) => {
                this.regionTotal = res.data;
            }, (err) => {
              this.$message({
                  message: '数据请求失败!',
                  center: true
              });
          })
        }
      }else{
        //在大区页面传的参数
        let reqParams = {
            "countryNam" : this.mapName,
            "enterpriseId": this.enterpriseId,
            "flage": "1",
            "areaName": this.RegionsChange,
            "industryName": this.industryChange,
            "firstCompany" : this.orderChange
        };
        this.axios.post(urls,qs.stringify(reqParams),config)
        .then((res) => {
            this.regionTotal = res.data;
        }, (err) => {
          this.$message({
              message: '数据请求失败!',
              center: true
          });
        })
      }
    },
    handleCheckedRegionsChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.regionsList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.regionsList.length;
      this.regionsChange();
      this.IndustryChange();
    },
    handleCheckAllIndustryMenuChange (val){
      this.industryMenu = val ? industryOptions : [];
      this.isIndustry = false;
      if(val == false){
        this.industryMenuTotal = [];
      }else{
        //监听大区,行业的数据变化
        this.regionsChange();
        this.IndustryChange();
      }
    },
    IndustryChange (){
      //监听行业的数据变化
      this.RegionsChange = (this.regionItem).join(",");
      this.industryChange = (this.industryMenu).join(",");
      this.orderChange = (this.orderMenu).join(",");
      //需要 点击选择的时候与中国地图同一个接口，用不同的参数来设置的显示的条件
      let urls = this.$API.url +'/regionInfo/getBasicCountIndustryNameByEntNameAndContinentNameAndCountryNam';
      var qs = require('qs');
      let config = {
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          }
      };
      //判断是否进入省份页面
      if(this.$route.query.areaName != undefined){
        if(this.$route.query.provinceName != undefined){
          // 在城市页面的时候执行
          let reqParams = {
            "countryNam" : this.mapName,
            "enterpriseId": this.enterpriseId,
            "flage": "1",
            "areaName": this.$route.query.areaName,
            "provinceName": this.$route.query.provinceName,
            "industryName": this.industryChange,
            "firstCompany" : this.orderChange
          };
          this.axios.post(urls,qs.stringify(reqParams),config)
            .then((res) => {
                this.industryMenuTotal = res.data;
            }, (err) => {
              this.$message({
                  message: '数据请求失败!',
                  center: true
              });
          })
        }else{
          // 在省份页面的时候执行
          let reqParams = {
            "countryNam" : this.mapName,
            "enterpriseId": this.enterpriseId,
            "flage": "1",
            "areaName": this.$route.query.areaName,
            "industryName": this.industryChange,
            "firstCompany" : this.orderChange
          };
          this.axios.post(urls,qs.stringify(reqParams),config)
            .then((res) => {
                this.industryMenuTotal = res.data;
            }, (err) => {
              this.$message({
                  message: '数据请求失败!',
                  center: true
              });
          })
        }
      }else{
        // 在大区页面的时候执行
        let reqParams = {
            "countryNam" : this.mapName,
            "enterpriseId": this.enterpriseId,
            "flage": "1",
            "areaName": this.RegionsChange,
            "industryName": this.industryChange,
            "firstCompany" : this.orderChange
        };
        this.axios.post(urls,qs.stringify(reqParams),config)
          .then((res) => {
              this.industryMenuTotal = res.data;
          }, (err) => {
            this.$message({
                message: '数据请求失败!',
                center: true
            });
        })
      }
    },
    handleCheckedIndustryChange (value){
      let checkedCount = value.length;
      this.industryCheckAll = checkedCount === this.industryMenuList.length;
      this.isIndustry = checkedCount > 0 && checkedCount < this.industryMenuList.length;
      this.regionsChange();
      this.IndustryChange();
    },
    handleCheckAllOrderMenuChange (val){
      this.orderMenu = val ? OrderOptions : [];
      this.isOrder = false;
    },
    handleCheckedOrderChange (value){
      let checkedCount = value.length;
      this.orderCheckAll = checkedCount === this.OrderMenuList.length;
      this.isOrder = checkedCount > 0 && checkedCount < this.OrderMenuList.length;
    },
    detailList (){
      let regionItem = (this.regionItem).join(","),
          industryMenu = (this.industryMenu).join(","),
          orderMenu = (this.orderMenu).join(",");
        this.region = regionItem;
        this.industry = industryMenu;
        this.order = orderMenu;
      //判断是否大区进入省份，城市页面
      if(this.$route.query.areaName != undefined){
        this.areaNameFlag = this.$route.query.areaName;
      }else{
        this.areaNameFlag = this.region;
      }
      this.$router.push({
          path:"/infoDetail/detailTable/"+this.enterpriseId,
          query:{
            page: this.page,
            firmName: this.firmName,
            provinceName: this.$route.query.provinceName,
            areaName: this.areaNameFlag,
            industry: this.industry,
            order: this.order
          }
      })
    },
    resetAddress: function (resetAddress) {
      // hideValue就是子组件传过来的值
      this.$route.query.addressName = "";
    },
    handleClick(tab, event) {
        // console.log(tab, event);
    },
    showToggle (){
        this.isShow = !this.isShow;
        //判断是否存在 vChinaL 显示按地区
        if(this.$route.path.indexOf('chinaL')>-1 === true){
          this.isDisplay = true;
        }else{
          this.isDisplay = false;
        }
        //调用筛选地区，行业的筛选内容
        this.regionsChange();
        this.IndustryChange();
        let urls = this.$API.url +'/entMenuInfo/getMapEntMenuInfo';
        let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        };
        var qs = require('qs');
        //  getBasicCountContinentNameByEntName 世界
        let reqParams = {
            "mapName": "中国"
          };
        this.axios.post(urls,qs.stringify(reqParams),config)
          .then((res) => {
            this.regionList = res.data.reslutArealDistribution;
            this.OrderMenuList = res.data.reslutFirstOrder;
            this.industryMenuList = res.data.reslutIndustry;
          }, (err) => {
            this.$message({
                message: '数据请求失败!',
                center: true
            });
        });
    },
    hide (){
      this.isShow = false;
    },
    commitData (){
        let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        };
        var qs = require('qs');
        let regionItem = (this.regionItem).join(","),
            industryMenu = (this.industryMenu).join(","),
            orderMenu = (this.orderMenu).join(",");
        this.region = regionItem;
        this.industry = industryMenu;
        this.order = orderMenu;
        //设置传参数到子页面
        this.param = {
          region: this.region,
          industry: this.industry,
          order: this.order,
          filter: "1"
        };
        // flage = 1 ---> 右导航栏，否则 flage为2
        // 国内地图
        let urls = this.$API.url +'/regionInfo/getBasicCountAreaNameByCompanyName';
        let params = {
          "areaName": regionItem,
          "industryName": industryMenu,
          "firstCompany": orderMenu,
          "flage": "1",
          "enterpriseId": this.enterpriseId
        };
        this.axios.post(urls,qs.stringify(params),config)
          .then((res) => {
            this.filter = 1;
            localStorage.setItem('region', JSON.stringify(this.param));
            eventBus.$emit('todo', this.param)
            this.resetAddress();
            this.hide();
          }, (err) => {
            this.$message({
                message: '数据请求失败!',
                center: true
            });
        }); 
    },
    filterReset (){
      this.regionItem = this.regionList.slice(0,8);
      this.orderMenu = this.OrderMenuList.slice(0,0);
      this.industryMenu = this.industryMenuList.slice(0,6);
    },
    regionSearch (){
      this.filterReset();
      let Url = this.$API.url +'/regionInfo/getDomSearchInfo';
      let config = {
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          }
      };
      var qs = require('qs');
      // flage  = 3
      let params = {
          "addressName": this.addressName,
          "flage": "3",
          "enterpriseId": this.enterpriseId
      };
      this.axios.post(Url,qs.stringify(params),config)
        .then((res) => {
          if(res.data.length != 0){
            this.filter = 3;
            //设置传参数到子页面
            this.param = {
              region: "",
              industry: "",
              order: "",
              filter: "3"
            }
            //
            this.flage = res.data[0].flage;
            if(this.flage == 1){
              // 跳转到区 
              this.$router.push({
                path:"/infoDetail/regionSubstance/china/chinaL/"+this.enterpriseId,
                query:{
                  addressName: this.addressName,
                  page: this.$route.query.page,
                  flage: this.flage,
                  firmName: this.firmName
                }
              });
            }else if(this.flage == 2){
              // 跳转到省    2
              this.$router.push({
                path:"/infoDetail/regionSubstance/china/province/"+this.enterpriseId,
                query:{
                  addressName: this.addressName,
                  page: this.$route.query.page,
                  flage: this.flage,
                  firmName: this.firmName
                }
              });
            }else{
              // 跳转到市    3
              this.$router.push({
                path:"/infoDetail/regionSubstance/china/city/"+this.enterpriseId,
                query:{
                  addressName: this.addressName,
                  page: this.$route.query.page,
                  flage: this.flage,
                  firmName: this.firmName
                }
              });
            }
            //隐藏筛选区域，以及遮罩层
            this.hide();
          }else{
            this.$message({
              message: '当前区域暂无数据!',
              center: true
            });
          }
        }, (err) => {
          this.$message({
              message: '请求数据失败!',
              center: true
          });
      });
    }
  },
  mounted () {
    
  }
}
</script>