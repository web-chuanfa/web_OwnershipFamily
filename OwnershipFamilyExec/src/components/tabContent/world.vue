<template>
  <div class="region_map_content">
    <router-view :filter="filter" :flage="flage" :param="param" :continent="continent" :order="order" :industry="industry" v-on:resetAddress="resetAddress">
        <worldL :is="currentView"></worldL>
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
                          <el-checkbox-button :indeterminate="isContinent" v-model="continentCheckAll" @change="handleContinentCheckAllChange">全选</el-checkbox-button>
                          <el-checkbox-group v-model="continentItem" @change="handleCheckedContinentChange">
                            <el-checkbox-button v-for="item in continentList" :label="item" :key="item">{{item}}</el-checkbox-button>
                          </el-checkbox-group>
                          <p class="regionTotal" v-if="continentItem.length !=0">已选：<a v-for="(item, index) in continentTotal"><span>{{ item.continent_name }}({{ item.count }})</span></a></p>
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
                          <button class="filter_confirm handle_filter_active" @click="continentData">确认选择</button>
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
import worldL from './worldL';
const cityOptions = ['欧洲', '亚洲', '非洲','南美洲','大洋洲','北美洲'];
const industryOptions = ['金融','制造','工程承包','房地产','资源与能源','其他'];
const OrderOptions = ['中信控股有限责任公司','中信云网有限公司','中信银行股份有限公司'];
export default {
  data () {
    return {
      currentView: "worldL",
      mapName: "世界",
      total: 0,
      entName: "",
      enterpriseId: this.$route.params.id,
      firmName: this.$route.query.firmName,
      page: this.$route.query.page,
      isShow: false,
      activeName2: 'first',
      orderMenu: [''],
      industryMenuList: industryOptions,
      OrderMenuList: OrderOptions,
      continent: "",
      industry: "",
      order: "",
      addressName: "",
      flage: 1,
      filter: 2,
      isDisplay: false,
      isContinent: true,
      continentCheckAll: true,
      industryCheckAll: true,
      orderCheckAll: false,
      continentList: cityOptions,
      continentItem: cityOptions,
      industryMenu: industryOptions,
      isIndustry: true,
      isOrder: true,
      param: {
        continent: "",
        industry: "",
        order: "",
        filter: "2"
      },
      continentTotal: "",
      continentChange: "",
      industryChange: "",
      orderChange: "",
      industryMenuTotal: "",
      continentNameFlag: ""
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
    handleContinentCheckAllChange(val) {
      this.continentItem = val ? cityOptions : [];
      this.isContinent = false;
      if(val == false){
        this.continentTotal = [];
      }else{
        //监听大洲与行业
        this.continentListenChange();
        this.industryListenChange();
      }
    },
    continentListenChange (){
      //监听大洲的数据变化
      this.continentChange = (this.continentItem).join(",");
      this.industryChange = (this.industryMenu).join(",");
      this.orderChange = (this.orderMenu).join(",");
      let urls = this.$API.url +'/regionInfo/getBasicCountContinentNameByEntName';
      var qs = require('qs');
      let config = {
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          }
      };
      //判断是否进入国家页面
      if(this.$route.query.continentName != undefined){
        // 在国家页面的时候执行
          let reqParams = {
            "enterpriseId": this.enterpriseId,
            "flage": "1",
            "continentName": this.$route.query.continentName,
            "industryName": this.industryChange,
            "firstCompany" : this.orderChange
          };
          this.axios.post(urls,qs.stringify(reqParams),config)
            .then((res) => {
                this.continentTotal = res.data;
                console.log(this.continentTotal)
            }, (err) => {
              this.$message({
                  message: '数据请求失败!',
                  center: true
              });
          })
      }else{
        //在大洲页面传的参数
        let reqParams = {
            "enterpriseId": this.enterpriseId,
            "flage": "1",
            "continentName": this.continentChange,
            "industryName": this.industryChange,
            "firstCompany" : this.orderChange
        };
        this.axios.post(urls,qs.stringify(reqParams),config)
        .then((res) => {
            this.continentTotal = res.data;
        }, (err) => {
          this.$message({
              message: '数据请求失败!',
              center: true
          });
        })
      }
    },
    handleCheckedContinentChange(value) {
      let checkedCount = value.length;
      this.continentCheckAll = checkedCount === this.continentList.length;
      this.isContinent = checkedCount > 0 && checkedCount < this.continentList.length;
      //监听大洲，行业的数据变化
      this.continentListenChange();
      this.industryListenChange();
    },
    handleCheckAllIndustryMenuChange (val){
      this.industryMenu = val ? industryOptions : [];
      this.isIndustry = false;
      if(val == false){
        this.industryMenuTotal = [];
      }else{
        //监听大洲，行业的数据变化
        this.continentListenChange();
        this.industryListenChange();
      }
    },
    handleCheckedIndustryChange (value){
      let checkedCount = value.length;
      this.industryCheckAll = checkedCount === this.industryMenuList.length;
      this.isIndustry = checkedCount > 0 && checkedCount < this.industryMenuList.length;
      this.continentListenChange();
      this.industryListenChange();
    },
    handleCheckAllOrderMenuChange (val){
      this.orderMenu = val ? OrderOptions : [];
      this.isOrder = false;
    },
    industryListenChange (){
      //监听行业的数据变化
      this.continentChange = (this.continentItem).join(",");
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
      if(this.$route.query.continentName != undefined){
        // 在国家页面的时候执行
          let reqParams = {
            "enterpriseId": this.enterpriseId,
            "flage": "1",
            "continentName": this.$route.query.continentName,
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
          });
      }else{
        //在大洲页面传的参数
        let reqParams = {
            "enterpriseId": this.enterpriseId,
            "flage": "1",
            "continentName": this.continentChange,
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
        });
      }
    },
    handleCheckedOrderChange (value){
      let checkedCount = value.length;
      this.orderCheckAll = checkedCount === this.OrderMenuList.length;
      this.isOrder = checkedCount > 0 && checkedCount < this.OrderMenuList.length;
    },
    resetAddress: function (resetAddress) {
      // hideValue就是子组件传过来的值
      this.$route.query.addressName = "";
    },
    handleClick(tab, event) {
        // console.log(tab, event);
    },
    detailList (){
      let continentItem = (this.continentItem).join(","),
          industryMenu = (this.industryMenu).join(","),
          orderMenu = (this.orderMenu).join(",");
        this.continent = continentItem;
        this.industry = industryMenu;
        this.order = orderMenu;
      //判断是否大区进入省份，城市页面
      if(this.$route.query.continentName != undefined){
        this.continentNameFlag = this.$route.query.continentName;
      }else{
        this.continentNameFlag = this.continent;
      }
      this.$router.push({
          path:"/infoDetail/detailTable/"+this.enterpriseId,
          query:{
            page: this.page,
            firmName: this.firmName,
            continentName: this.continentNameFlag,
            industry: this.industry,
            order: this.order
          }
      })
    },
    showToggle (){
        this.isShow = !this.isShow;
        //判断是否存在 vChinaL 显示按地区
        if(this.$route.path.indexOf('worldL')>-1 === true){
          this.isDisplay = true;
        }else{
          this.isDisplay = false;
        }
        //调用筛选地区，行业的筛选内容
        this.continentListenChange();
        this.industryListenChange();
        let urls = this.$API.url +'/entMenuInfo/getMapEntMenuInfo';
        let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        };
        var qs = require('qs');
        let reqParams = {
            "mapName": "世界"
        };
        this.axios.post(urls,qs.stringify(reqParams),config)
        .then((res) => {
          this.continentList = res.data.reslutArealDistribution;
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
    continentData (){
      let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        };
        var qs = require('qs');
        let continentItem = (this.continentItem).join(","),
            industryMenu = (this.industryMenu).join(","),
            orderMenu = (this.orderMenu).join(",");
        //
        this.continent = continentItem;
        this.industry = industryMenu;
        this.order = orderMenu;
        //设置传参数到子页面
        this.param = {
          continent: this.continent,
          industry: this.industry,
          order: this.order,
          filter: "1"
        }
        // 世界地图
        let urls = this.$API.url +'/regionInfo/getBasicCountContinentNameByEntName';
        let params = {
          "continentName": this.continent,
          "industryName": this.industry,
          "firstCompany": this.order,
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
        //重置筛选向的数据绑定属性
        this.continentItem = this.continentList.slice(0,8);
        this.orderMenu = this.OrderMenuList.slice(0,0);
        this.industryMenu = this.industryMenuList.slice(0,6);
    },
    regionSearch (){
      this.filterReset();
      //判断搜索市国内，还是世界
      let Url = this.$API.url +'/regionInfo/getDomSearchInfoWorld';
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
          "enterpriseId" : this.enterpriseId
      };
      this.axios.post(Url,qs.stringify(params),config)
        .then((res) => {
          if(res.data.length != 0){
            this.filter = 3;
            //设置传参数到子页面
            this.param = {
              continent: "",
              industry: "",
              order: "",
              filter: "3"
            }
            // this.flag  = 3
            this.flage = res.data[0].flage;
            if(this.flage == 1){
            // 跳转到大洲 1
            this.$router.push({
              path:"/infoDetail/regionSubstance/world/worldL/"+this.enterpriseId,
              query:{
                addressName: this.addressName,
                page: this.$route.query.page,
                flage: this.flage,
                firmName: this.firmName
              }
            });
            }else if(this.flage == 2){
              // 跳转到国家    2
              this.$router.push({
                path:"/infoDetail/regionSubstance/world/state/"+this.enterpriseId,
                query:{
                  addressName: this.addressName,
                  page: this.$route.query.page,
                  flage: this.flage,
                  firmName: this.firmName
                }
              });
            }else{
              //跳转到行业 3
              this.$router.push({
                path:"/infoDetail/regionSubstance/world/trade/"+this.enterpriseId,
                query:{
                  addressName: this.addressName,
                  page: this.$route.query.page,
                  flage: this.flage,
                  firmName: this.firmName
                }
              });
            }
            this.hide();
          }else{
            this.$message({
              message: '当前区域暂无数据!',
              center: true
            });
          }
        }, (err) => {
          this.$message({
              message: '数据请求失败!',
              center: true
          });
      });
    }
  },
  mounted () {
    
  }
}
</script>
<style scoped>

</style>