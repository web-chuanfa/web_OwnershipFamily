<template>
  <!-- 内容信息区 -->
  <div class="info_detail_content">
      <div class="info_detail_tabs">
        <div class="info_substance">
          <!-- 左侧股权 -->
          <div class="stock_left">
            <h3>股权</h3>
            <div class="process">
              <div class="company_type">{{ firmData }}</div>
              <div class="line"></div>
              <div class="company_type">{{ entname }}</div>
              <div class="line"></div>
              <div class="company_type">直属下级<span>({{ infoNavData }})</span></div>
            </div>
            <div class="detail">
              <router-link :to="'/infoDetail/stockInfo/allLevel/'+enterpriseId+'?page='+searchType+'&firmName='+firmName" @click.native="stockMessage();">查看详情</router-link>
            </div>
          </div>
          <!-- 右侧基本信息 -->
          <div class="basic_right">
            <div class="basic_title">基本信息</div>
            <div class="substance_content">
              <h3>
                <span>{{ entname }}</span>
              </h3>
              <div class="firmList clear">
                <ul class="clear">
                  <li class="col-20">
                    注册号：
                  </li>
                  <li class="col-30">
                    {{ regno }}
                  </li>
                  <li class="col-20">
                    原注册号：
                  </li>
                  <li class="col-30">
                    {{ oriregno }}
                  </li>
                </ul>
                <ul class="clear">
                  <li class="col-20">
                    成立时间：
                  </li>
                  <li class="col-30">
                    {{ esdate }}
                  </li>
                  <li class="col-20">
                    登记机关：
                  </li>
                  <li class="col-30">
                    {{ regorg }}
                  </li>
                </ul>
                <ul class="clear">
                  <li class="col-20">
                    注册资本币种：
                  </li>
                  <li class="col-30">
                    <span>人民币元</span>
                  </li>
                  <li class="col-20">
                    注册资本(元)：
                  </li>
                  <li class="col-30">
                    <span>{{ regcap }}</span>
                  </li>
                </ul>
                <ul class="clear">
                  <li class="col-20">
                    实收资本(元)：
                  </li>
                  <li class="col-30">
                    <span>{{ reccap }}</span>
                  </li>
                  <li class="col-20">
                    变更日期：
                  </li>
                  <li class="col-30">
                    <span>{{ apprdate }}</span>
                  </li>
                </ul>
                <ul class="clear">
                  <li class="col-20">
                    住所：
                  </li>
                  <li class="col-30">
                    <span>{{ dom }}</span>
                  </li>
                  <li class="col-20">
                    企业(机构)类型：
                  </li>
                  <li class="col-30">
                    <span>{{ enttype }}</span>
                  </li>
                </ul>
                <ul class="clear">
                  <li class="col-20">
                    法人代表：
                  </li>
                  <li class="col-30">
                    <span>{{ fr_name }}</span>
                  </li>
                  <li class="col-20">
                    组织机构代码：
                  </li>
                  <li class="col-30">
                    <span>{{ nacaoid }}</span>
                  </li>
                </ul>
                <ul class="clear">
                  <li class="col-20">
                    统一社会信用代码：
                  </li>
                  <li class="col-30">
                    <span>{{ uniscid }}</span>
                  </li>
                  <li class="col-20">
                    经营(驻在)期限：
                  </li>
                  <li class="col-30">
                    <span>{{ opfrom }} 至 {{ opto }}</span>
                  </li>
                </ul>
                <ul class="clear">
                  <li class="col-20">
                    联系电话：
                  </li>
                  <li class="col-30">
                    <span>{{ tel }}</span>
                  </li>
                  <li class="col-20">
                    电子邮箱：
                  </li>
                  <li class="col-30">
                    <span>{{ email }}</span>
                  </li>
                </ul>
                <ul class="clear">
                  <li class="col-20">
                    经营状态：
                  </li>
                  <li class="col-30">
                    <span>{{ entstatus }}</span>
                  </li>
                  <li class="col-20">
                    核准日期：
                  </li>
                  <li class="col-30">
                    <span>{{ apprdate }}</span>
                  </li>
                </ul>
              </div>
              <div class="licensedProject clear">
                <h6>许可经营项目:</h6>
                <p>{{ abuitem }}</p>
                <h6>一般经营项目:</h6>
                <p>{{ cbuitem }}</p>
                <h6>经营(业务)范围:</h6>
                <p>{{ opscope }}</p>
              </div>
              <div class="clear"></div>
              <div class="senior_content">
                <div class="senior_content_basic">
                    <div class="tcaption">
                      <h4 class="sub_title">高管信息:<span>{{ executivesTotal }}条</span></h4>
                    </div>
                    <div class="region_table_content_modules">
                      <el-table
                        :data="executives"
                        @row-click="handle"
                        style="width: 100%">
                        <el-table-column
                          prop="personname"
                          label="高管姓名"
                          align="center">
                        </el-table-column>
                        <el-table-column
                          prop="positionname"
                          label="职务"
                          align="center">
                        </el-table-column>
                      </el-table>
                    </div>
                </div>
              </div>
              <div class="clear"></div>
              <div class="senior_content">
                <div class="senior_content_basic">
                    <div class="tcaption">
                      <h4 class="sub_title">股东信息:<span>{{ shareholderTotal }}条</span></h4>
                    </div>
                    <div class="region_table_content_modules">
                      <el-table
                        :data="shareholder"
                        @row-click="handle"
                        style="width: 100%">
                        <el-table-column
                          prop="invname"
                          label="股东名称"
                          align="center">
                        </el-table-column>
                        <el-table-column
                          prop="conprop"
                          label="出资比例(%)"
                          width="130"
                          align="center">
                        </el-table-column>
                        <el-table-column
                          prop="inv_type_desc"
                          label="股东类型"
                          width="110"
                          align="center">
                        </el-table-column>
                        <el-table-column
                          prop="subconam"
                          label="认缴出资额(元)"
                          width="140"
                          align="center">
                        </el-table-column>
                        <el-table-column
                          prop="acconam"
                          label="实缴出资额(元)"
                          width="140"
                          align="center">
                        </el-table-column>
                      </el-table>
                    </div>
                </div>
              </div>
              <div class="clear"></div>
              <div class="senior_content">
                <div class="senior_content_basic">
                    <div class="tcaption">
                      <h4 class="sub_title">对外投资:<span>{{ investTotal }}条</span></h4>
                    </div>
                    <div class="region_table_content_modules">
                      <el-table
                        :data="invest"
                        @row-click="handle"
                        style="width: 100%">
                        <el-table-column
                          prop="inv_entname"
                          label="企业名称"
                          align="center">
                        </el-table-column>
                        <el-table-column
                          prop="regcap"
                          label="注册资金(元)"
                          width="120"
                          align="center">
                        </el-table-column>
                        <el-table-column
                          prop="entstatus"
                          label="企业状态"
                          align="center">
                        </el-table-column>
                        <el-table-column
                          prop="conprop"
                          label="出资比例(%)"
                          width="120"
                          align="center">
                        </el-table-column>
                        <el-table-column
                          prop="esdate"
                          label="成立日期"
                          width="110"
                          align="center">
                        </el-table-column>
                      </el-table>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
import dataUrl  from  '../../../static/js/urls.json'
export default {
  data () {
    return {
      enterpriseId: this.$route.params.id,
      infoData:[],
      firmData: "",
      infoNavData: "",
      subFirmData: "",
      entname: "",
      regno: "",
      oriregno: "",
      esdate: "",
      regorg: "",
      regcap: "",
      reccap: "",
      apprdate: "",
      abuitem: "",
      cbuitem: "",
      firmName: this.$route.query.firmName,
      searchType: this.$route.query.page,
      pageSize: 5,
      currentPageNum: 1,
      input: '',
      Total: 0,
      schfilter: "",
      curPageSize: 5,
      executives: [],
      shareholder: [],
      invest: [],
      investTotal: "",
      dom: "",
      enttype: "",
      opscope: "",
      fr_name: "",
      nacaoid: "",
      opfrom: "",
      regcapcur: "",
      opfrom: "",
      opto: "",
      domdistrict: "",
      uniscid: "",
      tel: "",
      email: "",
      entstatus: "",
      apprdate: ""
    }
  },
  watch:{
    $route (nv,ol) {
      this.enterpriseId = nv.params.id;
      this.firmName = nv.query.firmName;
      this.handler();
    }
  },
  methods: {
    stockMessage (){
        //给iOS传参数
        try {
            window.postMessage("close");
        } catch(e){
            // console.log(e);
        }
    },
    handler (){
      //给iOS传参数，开启左右滑动
      try {
            window.postMessage("open");
        } catch(e){
            // console.log(e);
      }
      // 新增股东信息，高管
      let urls = dataUrl.url +'/basicInfo/getBasicInfo';
      var qs = require('qs');
      let reqParams = {
            "enterpriseId" : this.enterpriseId,
            "enterpriseName" : this.firmName
      };
      let config = {
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          }
      };
      this.axios.post(urls,qs.stringify(reqParams),config)
        .then((res) => {
          var reg = /(?=(\B)(\d{3})+$)/g;
          this.infoData = res.data;
          this.entname = res.data.basic[0].entname;
          this.regno = res.data.basic[0].regno;
          this.oriregno = res.data.basic[0].oriregno;
          this.esdate = res.data.basic[0].esdate;
          this.regorg = res.data.basic[0].regorg;
          this.regcap = res.data.basic[0].regcap;
          //数字每隔三位加一个逗号
          this.regcap = this.regcap.toString().replace(reg,',');
          this.reccap = res.data.basic[0].reccap;
          this.reccap = this.reccap.toString().replace(reg,',');
          this.apprdate = res.data.basic[0].apprdate;
          this.abuitem = res.data.basic[0].abuitem;
          this.cbuitem = res.data.basic[0].cbuitem;
          this.dom = res.data.basic[0].dom;
          this.enttype = res.data.basic[0].enttype;
          this.opscope = res.data.basic[0].opscope;
          this.fr_name = res.data.basic[0].fr_name;
          this.nacaoid = res.data.basic[0].nacaoid;
          this.regcapcur = res.data.basic[0].regcapcur;
          this.opfrom = res.data.basic[0].opfrom;
          this.opto = res.data.basic[0].opto;
          this.uniscid = res.data.basic[0].uniscid;
          this.domdistrict = res.data.basic[0].domdistrict;
          this.tel = res.data.basic[0].tel;
          this.email = res.data.basic[0].email;
          this.entstatus = res.data.basic[0].entstatus;
          this.apprdate = res.data.basic[0].apprdate;
          // 对外投资
          this.investList();
          // 高管信息条数
          this.entexecutives();
          // 股东信息
          this.entinSideShareholder();
        }, (err) => {
          //数据请求失败提示
          this.$message({
            message: '数据请求失败!',
            center: true
          });
      });
        //左边导航信息
        this.sideNav();
    },
    sideNav (){
      //左边导航信息
      var qs = require('qs');
      let url = dataUrl.url +'/EntinvInfo/getEntinvSuperiorAndSubordinateInfo';
        let param = {
            "enterpriseId" : this.enterpriseId
        };
        let configs = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        };
        this.axios.post(url,qs.stringify(param),configs)
        .then((res) => {
          this.infoNavData = res.data.subordinateData.subordinateInfototal;
          // 当前上级的公司
          if(res.data.superiorData.superiorInfototal === 0){
            this.firmData = "暂无信息"
          }else if(res.data.superiorData.superiorInfototal === 1){
            this.firmData = res.data.superiorData.superiorInfo[0].entname;
          }else{
            this.firmData = "上级投资公司("+ res.data.superiorData.superiorInfototal +")";
          }
        }, (err) => {
          //数据请求失败提示
          this.$message({
            message: '数据请求失败!',
            center: true
          });
      });
    },
    investList (){
      //对外投资列表
      var qs = require('qs');
      let url = dataUrl.url +'/basicInfo/getEntInvestmentInfo';
      let param = {
          "enterpriseId" : this.enterpriseId,
          "enterpriseName" : this.firmName
      };
      let configs = {
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          }
      };
      this.axios.post(url,qs.stringify(param),configs)
      .then((res) => {
        this.investTotal =res.data.investTotal;
        this.invest = res.data.invest;
      }, (err) => {
        //数据请求失败提示
        this.$message({
          message: '数据请求失败!',
          center: true
        });
      });
    },
    entexecutives (){
      //高管信息列表
      var qs = require('qs');
      let url = dataUrl.url +'/basicInfo/getEntexecutivesInfo';
      let param = {
          "enterpriseId" : this.enterpriseId,
          "enterpriseName" : this.firmName
      };
      let configs = {
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          }
      };
      this.axios.post(url,qs.stringify(param),configs)
      .then((res) => {
        this.executivesTotal =res.data.executivesTotal;
        this.executives = res.data.executives;
      }, (err) => {
        //数据请求失败提示
        this.$message({
          message: '数据请求失败!',
          center: true
        });
      });
    },
    entinSideShareholder (){
      //股东信息列表
      var qs = require('qs');
      let url = dataUrl.url +'/basicInfo/getEntinSideShareholderInfo';
      let param = {
          "enterpriseId" : this.enterpriseId,
          "enterpriseName" : this.firmName
      };
      let configs = {
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          }
      };
      this.axios.post(url,qs.stringify(param),configs)
      .then((res) => {
        this.shareholderTotal =res.data.shareholderTotal;
        this.shareholder = res.data.shareholder;
      }, (err) => {
        //数据请求失败提示
        this.$message({
          message: '数据请求失败!',
          center: true
        });
      });
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
    },
    handle (row){

    },
    viewAll (event){
      let el = event.currentTarget;
      if(el.innerText == "∨ 显示全部"){
        el.innerText = "∧ 部分隐藏";
        this.curPageSize = 10;
      }else if(el.innerText == "∧ 部分隐藏"){
        el.innerText = "∨ 显示全部";
        this.curPageSize = 5;
      }
    }
  },
  mounted () {
    this.handler();
  }
}
</script>
<style scoped>

</style>