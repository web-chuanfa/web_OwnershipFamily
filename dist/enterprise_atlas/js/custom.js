function showDetail(keyNo, tupuUrl) {
    //公司信息弹窗
    $("#company-detail").hide();
    //请求数据详情
    var url = dataUrl + "/familyTree/EntinvInfo/getEntRelationBasicInfo";
    $.ajax({
        url: url,
        type: 'POST',
        data: {
            enterpriseId: keyNo
        },
        dataType: 'JSON',
        success: function(data) {
            if (data.Status != 200) {
                //数据校验规则
                return;
            }
            var companyDetail = $('#company-detail');
            companyDetail.find('.mao-company-name').text(data.Result.Name || '-');
            companyDetail.find('.mao-company-status').text(data.Result.ShortStatus || '-');
            if (data.Result.Oper && data.Result.Oper.Name) {
                companyDetail.find('.mao-oper').html(data.Result.Oper.Name);
            // companyDetail.find('.mao-oper').prev().html(data.Result.Oper.OperType);
            } else {
                companyDetail.find('.mao-oper').text('-');
            }

            companyDetail.find('.mao-ziben').text(data.Result.RegistCapi || '-');
            companyDetail.find('.mao-date').text((data.Result.StartDate || ''));
            // companyDetail.find('.mao-company-name').attr("href", "firm_" + keyNo + ".shtml");
            if (!tupuUrl) {
                tupuUrl = 'company_relation';
            }
            // companyDetail.find('.mao-tupu-link').attr("href", tupuUrl + "?keyNo=" + keyNo + "&name=" + encodeURIComponent(data.Result.Name));
            //查看图谱
            companyDetail.find('.mao-tupu-link').unbind("click");
            companyDetail.find('.mao-tupu-link').click(function(e) {
                e.stopPropagation();
                // e.preventDefault();
                //获取父页面传过来的id
                var Name = decodeURI(data.Result.Name);
                companyDetail.fadeOut();
                window.parent.location.href = dataUrl + '/familyTree/index.html#/infoDetail/stockInfo/allLevel/' + keyNo + '?page=1&firmName=' + Name;
                var url = dataUrl + "/familyTree/EntinvInfo/getEntinvAllexpandInfo";
                //重置echart图谱
                $(".container").html('<div id="main" style="width: 100%;height:100%;"></div>');
                myChart = echarts.init(document.getElementById('main'));
                $.ajax({
                    url: url,
                    type: 'POST',
                    data: {
                        enterpriseId: keyNo,
                        enterpriseName: Name
                    },
                    // contentType : "application/json;charset=utf-8",
                    dataType: 'JSON',
                    success: function(data) {
                        rootData = null;
                        touziData = null;
                        has_root = false;
                        has_touzi = false;
                        $('#load_data').hide();
                        if (data.Status === 200) {
                            $('#no_data').hide();
                            if (data.Result != "") {
                                rootData = data.Result;
                            } else {
                                rootData = [];
                                return;
                            }
                            if (rootData.DetailList && rootData.DetailList.length > 0)
                                has_root = true;
                            if (rootData.touzi && rootData.touzi.length > 0)
                                has_touzi = true;
                            idPre = rootData.KeyNo;
                            transTree(rootData, 1);
                            initTree(rootData);
                            transTouzi(rootData);
                            if (touziData) initTree(touziData);
                            drawGuquan(rootData);
                        } else {
                            $('#no_data').show();
                        }
                    }
                });
            });
            // 关闭
            companyDetail.find('.close').click(function() {
                companyDetail.fadeOut();
            });

            var noData = '<div class="mao-noresult"> <p ><img src="/familyTree/dome_new/img/nodata.png"></p>暂无信息</div>';

            //股东
            if (data.Result.Partners && data.Result.Partners.length > 0) {
                var html = '<table class="table table-bordered mao-table">';
                html += "<thead><tr><th>名称</th><th>类型</th></tr></thead>";
                for (var i = 0; i < data.Result.Partners.length; i++) {
                    html += "<tr>";
                    html += '<td>' + data.Result.Partners[i].StockName + '</td>';
                    html += "<td>" + (data.Result.Partners[i].StockType || "-") + "</td>";
                    html += "</tr>";
                }
                html += '</table>'

                companyDetail.find('.gudong-list').html(html);

            } else {
                companyDetail.find('.gudong-list').html(noData);
            }

            //投资
            if (data.Result.touziList && data.Result.touziList.length > 0) {

                var html = '<table class="table table-bordered mao-table">';
                html += "<thead><tr><th>名称</th><th>注册资本(元)</th></tr></thead>";
                for (var i = 0; i < data.Result.touziList.length; i++) {
                    html += "<tr>";
                    html += "<td>" + data.Result.touziList[i].Name + "</td>";
                    html += "<td>" + data.Result.touziList[i].RegistCapi + "</td>";
                    html += "</tr>";
                }
                html += '</table>';
                companyDetail.find('.touzi-list').html(html);
            } else {
                companyDetail.find('.touzi-list').html(noData);
            }

            //成员
            if (data.Result.Employees && data.Result.Employees.length > 0) {
                var html = '<table class="table table-bordered mao-table">';
                html += "<thead><tr><th>名称</th><th>类型</th></tr></thead>";
                for (var i = 0; i < data.Result.Employees.length; i++) {
                    html += "<tr>";
                    html += '<td>' + data.Result.Employees[i].Name + '</td>';
                    html += "<td>" + (data.Result.Employees[i].Job || "-") + "</td>";
                    html += "</tr>";
                }
                html += '</table>';
                companyDetail.find('.member-list').html(html);

            } else {
                companyDetail.find('.member-list').html(noData);
            }

            $("#company-detail").fadeIn();
            companyDetail.find('.mao-tab-content').slimScroll({
                wheelStep: 1
            });

        }
    });
}

function launchFullScreen(element) {
    //全屏
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

function exitFullScreen() {
    //退出全屏
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
    }
}
function isFullScreen() {
    //判定是否全屏
    if (document.fullscreen) {
        return true;
    } else if (document.mozFullScreen) {
        return true;
    } else if (document.webkitIsFullScreen) {
        return true;
    } else if (document.msFullscreenElement) {
        return true;
    } else {
        return false;
    }
}

function animatieChart(myChart, targetX, targetY) {
    //图表进入动画
    targetX = targetX || 0;
    targetY = targetY || 0;
    var centerX = myChart.getZrender().getWidth() / 2;
    var centerY = myChart.getZrender().getHeight() / 2;
    var layer = myChart.getZrender().painter._layers[1];
    var animation = myChart.getZrender().animation;
    layer.scale = [0.2, 0.2, centerX, centerY];
    layer.rotation = [0, centerX, centerY];
    layer.position = [targetX, targetY];
    myChart.getZrender().render();
    animation.animate(layer).when(400, {
        scale: [1, 1, centerX, centerY]
    }).start('spline').done(function() {
        layer.scale[2] = 0;
        layer.scale[3] = 0;
    }).during(function() {
        myChart.getZrender().render();
    });
}

function download(canvas, type) {
    //从canvas下载图片
    type = 'png';
    //设置保存图片的类型
    var imgdata = canvas.toDataURL(type);
    //将mime-type改为image/octet-stream,强制让浏览器下载
    var fixtype = function(type) {
        type = type.toLocaleLowerCase().replace(/jpg/i, 'jpeg');
        var r = type.match(/png|jpeg|bmp|gif/)[0];
        return 'image/' + r;
    }
    imgdata = imgdata.replace(fixtype(type), 'image/octet-stream')
    //将图片保存到本地
    var saveFile = function(data, filename) {
        var link = document.createElement('a');
        link.href = data;
        link.download = filename;
        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        link.dispatchEvent(event);
    }
    var filename = new Date().toLocaleDateString() + '.' + type;
    saveFile(imgdata, filename);
}