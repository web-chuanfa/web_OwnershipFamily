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
      schfilter: function(val, oldVal){
        this.tableData3 = this.tableData3.filter( item => (~item.entname.indexOf(val)));
      }
    },
    methods: {
      handleSizeChange(val) {
        
      },
      handleCurrentChange(val) {
        let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        };
        var qs = require('qs');
        let reqParams = {
            "pageNumber" : val,
            "pageSize" : this.pageSize,
            "areaName" : this.$route.query.areaName,
            "provinceName": this.$route.query.provinceName,
            "enterpriseId": this.enterpriseId,
            "industryName": this.$route.query.industry,
            "firstCompany" : this.$route.query.order,
            "continentName": this.$route.query.continentName,
            "cityName": this.$route.query.cityName
        };
        //判断是否国内 与 世界
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
      },
      handle (row){
        //表格详情页--跳转到基本信息   row.entname （公司名）
        this.detailType = this.$route.query.page;
        this.$router.push({
            path:"/infoDetail/basicInfo/"+row.entid,
            query:{
              page: this.detailType,
              firmName: row.entname,
              enterpriseId: row.entid,
              searchType: this.detailType
            }
          })
      },
      handler (){
        let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        };
        var qs = require('qs');
        let urls = this.$API.url +'/regionInfo/getBasicByAll';
        let reqParams = {
            "pageNumber" : this.currentPageNum,
            "pageSize" : this.pageSize,
            "areaName" : this.$route.query.areaName,
            "provinceName": this.$route.query.provinceName,
            "enterpriseId": this.enterpriseId,
            "industryName": this.$route.query.industry,
            "firstCompany" : this.$route.query.order,
            "continentName": this.$route.query.continentName,
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