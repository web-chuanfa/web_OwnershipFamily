<template>
  <div class="info_detail_content">
    <div class="region_detail_tabs">
      <div class="region_substance">
        <div class="region_title">股权关系明细列表</div>
        <div class="region_content_modules">
          <div class="region_map_content region_table_content">
              <div class="region_table_content_modules">
                <el-table
                  :data="tableData3"
                  height="500"
                  @row-click="handle"
                  border
                  style="width: 100%">
                  <el-table-column
                    prop="entname"
                    label="公司名称"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="industry_name"
                    label="所属行业"
                    width="110"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="uniscid"
                    label="统一社会信用代码"
                    width="180"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="regcap"
                    label="注册资本(元)"
                    width="120"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="fr_name"
                    label="法定代表人"
                    width="100"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="esdate"
                    label="成立日期"
                    width="120"
                    align="center">
                  </el-table-column>
                </el-table>
              </div>
              <el-pagination
                  background
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page.sync="currentPageNum"
                  :page-size="pageSize"
                  layout="total, prev, pager, next, jumper"
                  :total="Total">
              </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props:['flage'],
    data() {
      return {
        tableData3: [],
        pageSize: 10,
        currentPageNum: 1,
        input: '',
        ProvinceName: "",
        Total: 0,
        detailType: "",
        schfilter: "",
        countryNam: "",
        continentName: "",
        entName: "",
        firmName:this.$route.query.firmName,
        enterpriseId: this.$route.params.id
      }
    },
    watch: {
      flage (){
        let that = this;
        //. 监听到当前每次调用 this.handler()变化
        this.handler();
      },
      schfilter: function(val, oldVal){
        this.tableData3 = this.tableData3.filter( item => (~item.entname.indexOf(val)));
      }
    },
    methods: {
      handleSizeChange(val) {
        
      },
      handleCurrentChange(val) {
        var filterParam = localStorage.getItem("region");
        filterParam = JSON.parse(filterParam);
        this.ProvinceName = this.$route.query.provinceName;
        let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        };
        var qs = require('qs');
        let reqParams = {
              'pageNumber': val,
              'pageSize': this.pageSize,
              "provinceName": this.ProvinceName,
              "areaName" : this.$route.query.areaName,
              "continentName": this.$route.query.continentName,
              "countryNam": this.$route.query.countryNam,
              "enterpriseId": this.enterpriseId,
              "cityName": this.$route.query.cityName,
              "industryName": filterParam.industry,
              "firstCompany" : filterParam.order
        }
        if(this.$route.query.getSearchResult ==1){
          let param = {
            'pageNumber': val,
            'pageSize': "10",
            "keyword": this.$route.query.firmName
          }
          let urls = this.$API.url +'/basicInfo/getEntSearchResult';
          this.axios.post(urls,qs.stringify(param),config)
            .then((res) => {
              this.tableData3 = res.data.rows;
              this.Total = res.data.total;
            }, (err) => {
              this.$message({
                message: '数据请求失败!',
                center: true
              });
          });
        }else{
          // getBasicByAllProvinceName  getBasicIndustryNameByAll
          if(!this.$route.query.continentName){
            let urls = this.$API.url +'/regionInfo/getBasicByAll';
            this.axios.post(urls,qs.stringify(reqParams),config)
              .then((res) => {
                this.tableData3 = res.data.rows;
                this.Total = res.data.total;
              }, (err) => {
                this.$message({
                  message: '数据请求失败!',
                  center: true
                });
            });
            }else{
              let urls = this.$API.url +'/regionInfo/getBasicCompanyByAll';
              this.axios.post(urls,qs.stringify(reqParams),config)
                .then((res) => {
                  this.tableData3 = res.data.rows;
                  this.Total = res.data.total;
                }, (err) => {
                  this.$message({
                    message: '数据请求失败!',
                    center: true
                  });
              });
          }
        }    
      },
      handle (row){
        //. 表格详情页--->没有传公司id   row.entname （公司名）
        this.detailType = this.$route.query.page;
        //. id取不到
        if(this.detailType == "2" || this.detailType == "1"){
          this.$router.push({
            path:"/infoDetail/basicInfo/"+row.entid,
            query:{
              page: this.detailType,
              firmName: row.entname,
              enterpriseId: row.entid,
              searchType: this.detailType
            }
          })
        }else if(this.detailType == "3"){
          //禁止左右滑动
          try {
              window.postMessage("close");
          } catch(e){
              // console.log(e);
          }
          this.$router.push({
            path:"/infoDetail/stockInfo/allLevel/"+row.entid,
            query:{
              page: this.detailType,
              enterpriseId: row.entid,
              searchType: this.detailType,
              firmName: row.entname
            }
          })
        }else if(this.detailType == "4"){
          // alert("分布")
          this.$router.push({
            path:"/infoDetail/regionSubstance/china/chinaL/"+row.entid,
            query:{
              page: this.detailType,
              firmName: row.entname,
              enterpriseId: row.entid,
              searchType: this.detailType
            }
          })
        }else{
          this.$router.push({
            path:"/infoDetail/basicInfo/"+row.entid,
            query:{
              page: this.detailType,
              firmName: row.entname,
              enterpriseId: row.entid,
              searchType: this.detailType
            }
          })
        }
      },
      handler (){
        let that = this;
        let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        };
        var filterParam = localStorage.getItem("region");
        filterParam = JSON.parse(filterParam);
        var qs = require('qs');
        if(!this.$route.query.flage){
          if(!this.$route.query.continentName){
            this.ProvinceName = this.$route.query.provinceName;
            let urls = this.$API.url +'/regionInfo/getBasicByAll';
            let reqParams = {
                "pageNumber" : this.currentPageNum,
                "pageSize" : this.pageSize,
                "areaName" : this.$route.query.areaName,
                "provinceName": this.ProvinceName,
                "enterpriseId": this.enterpriseId,
                "areaName": filterParam.region,
                "industryName": filterParam.industry,
                "firstCompany" : filterParam.order,
                "cityName": this.$route.query.cityName
            };
            this.axios.post(urls,qs.stringify(reqParams),config)
            .then((res) => {
              // console.log(res.data.rows);
              this.tableData3 = res.data.rows;
              this.Total = res.data.total;
            }, (err) => {
              this.$message({
                message: '数据请求失败!',
                center: true
              });
            });
          }else{
            // 世界--大洲
            this.entName = this.$route.query.firmName;
            this.countryNam = this.$route.query.countryNam;
            let urls = this.$API.url +'/regionInfo/getBasicCompanyByAll';
            let reqParams = {
                "pageNumber" : this.currentPageNum,
                "pageSize" : this.pageSize,
                "enterpriseId": this.enterpriseId,
                "countryNam": this.countryNam,
                "continentName": this.$route.query.continentName,
                "industryName": filterParam.industry,
                "firstCompany" : filterParam.order
            };
            this.axios.post(urls,qs.stringify(reqParams),config)
            .then((res) => {
              this.tableData3 = res.data.rows;
              this.Total = res.data.total;
            }, (err) => {
              this.$message({
                message: '数据请求失败!',
                center: true
              });
            });
          }
        }else{
          //不是地区筛选的 搜索
          if(!this.$route.query.addressName){
            let urls = this.$API.url +'/basicInfo/getEntSearchResult';
            let reqParams = {
                "pageNumber" : this.currentPageNum,
                "pageSize" : this.pageSize,
                "keyword" : this.$route.query.firmName,
                "searchType" : this.$route.query.page
            };
            this.axios.post(urls,qs.stringify(reqParams),config)
              .then((res) => {
                this.tableData3 = res.data.rows;
                this.Total = res.data.total;
              }, (err) => {
                this.$message({
                  message: '数据请求失败!',
                  center: true
                });
            });
          }else{
            let urls = this.$API.url +'/regionInfo/getBasicByAll';
            let reqParams = {
                "pageNumber" : this.currentPageNum,
                "pageSize" : this.pageSize,
                "flage": this.$route.query.flage,
                "cityName": this.$route.query.cityName,
                "enterpriseId": this.enterpriseId
            };
            this.axios.post(urls,qs.stringify(reqParams),config)
              .then((res) => {
                this.tableData3 = res.data.rows;
                this.Total = res.data.total;
              }, (err) => {
                this.$message({
                  message: '数据请求失败!',
                  center: true
                });
            });
          }
        }
      }
    },
    mounted() {
        // this.handler();
    },
    created (){
      this.handler();
    }
  }
</script>
<style lang="less">
@import '../../assets/css/table/vTable.less';
</style>