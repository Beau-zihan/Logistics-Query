$(function(){
    var orderDval=$(".wl-search>input").val();
    $(".wl-search>input").bind({
        focus:function(){
            if($(this).val()==orderDval){
                $(this).val("").addClass("orderid");
            }
        },
        blur:function(){
            if($(this).val()==""){
                $(this).val(orderDval).removeClass("orderid");
            }
        },
        click:function(){
            $(this).select();
        }
    })
    $(".wl-s").hover(function(){
        $(".wl-selectcom").fadeIn(200);
        $(".wl-selectcom-top a").click(function(){
            $(".wl-selectcom").fadeOut(200);
        });
        $(".wl-selectcom dd").click(function(){
            $(".wl-selectcom dd").removeClass("current");
            $(this).addClass("current");
            $(".scom").text($(this).text()).attr("com",$(this).attr("com"));
            $(".wl-contact").show().find("i").html("查询电话："+$(this).attr("info"));
            $(".wl-search>input").css({width:382-$(".scom").width(),paddingLeft:$(".scom").width()+36});
            $(".wl-selectcom,.wl-info").hide();
        });
        $(".wl-selectcom dd").hover(function(){
            $(this).addClass("current");
        },function(){
            $(this).removeClass("current");
        });
    },function(){
        $(".wl-selectcom").hide();
    });
    $(".scha").click(function(){
        if($(".wl-search>input").val()!=orderDval&&$(".scom").attr("com")&&$(".wl-search>input").val()!=""){
            $(".wl-contact b").attr("class","loading").html("正在查询中，请稍后......").show();
            $(".wl-result").remove();
            $(".wl-body").append('<table class="wl-result" style="display: none;"><thead><tr><th width="140">时间</th><th>地点和跟踪进度</th></tr></thead><tbody></tbody></table>');
            $.ajax({url:"http://api.kuaidi100.com/api?id=e6284a5bc11ddb8d&com="+$('.scom').attr('com')+"&nu="+$('.wl-search>input').val()+"&order=asc",dataType:"jsonp",success:function(json){
                if(json.message=="ok"&&json.status==1){
                    if(json.status==1){
                        $(".wl-info").hide();
                        for(var i=0;i<json.data.length;i++){
                            $(".wl-result tbody").append("<tr><td valign='top'>"+json.data[i].time+"</td><td class='s-do'>"+json.data[i].context+"</td></tr>").parent().show();
                        }
                        $(".wl-result tbody tr:eq(0) td:eq(1)").attr("class","s-start");
                        if(json.state==0){
                            wlStatus("在途中");
                            $(".wl-result tbody tr:last td:eq(1)").attr("class","s-next");
                        }
                        else if(json.state==1){
                            wlStatus("已发货");
                        }
                        else if(json.state==2){
                            wlStatus("疑难件");
                        }
                        else if(json.state==3){
                            wlStatus("已签收");
                            $(".wl-result tbody tr:last td:eq(1)").attr("class","s-end");
                        }
                        else if(json.state==4){
                            wlStatus("已退货");
                            $(".wl-result tbody tr:last td:eq(1)").attr("class","s-end");
                        }
                    }
                    else if(json.status==0){
                        tipinfo("您所查询的运单暂无结果！");
                    }
                    else if(json.status==2){
                        tipinfo("查询接口出现异常，请联系客服人员。");
                    }
                }
                else{
                    $(".wl-contact b").hide();
                    tipinfo(json.message);
                }

            },error:function(){
                tipinfo("查询出现异常，请刷新后重试！");
            }});
        }
        else if(!$(".scom").attr("com")){
            tipinfo("请选择物流公司！ <a href='javascript:;' class='opencom'>选择快递公司</a>");
            $(".opencom").click(function(){
                $(".wl-info").hide();
                $(".wl-selectcom").fadeIn(200);
            })
        }else{
            tipinfo("请输入您要查询的订单号！ <a href='javascript:;'>从哪里能找到订单号？</a>");
        }
        return false;
    });
    $(".wl-info a.close").click(function(){
        $(this).parent().fadeOut(200);
    });
    $(".wl-selectcom-top li").click(function(){
        $(this).addClass("current").siblings("li").removeClass("current");
        $(".wl-selectcom-box").eq($(this).index()).show().siblings(".wl-selectcom-box").hide();
    });
    function wlStatus(m){
        $(".wl-contact b").removeClass("loading").html("状态："+m+" <a href='#' class='wl-refresh'>[重新查询]</a>");
        $(".wl-refresh").click(function(){
            $(".scha").click();
            return false;
        });
    }
    function tipinfo(m){
        $(".wl-info span").html(m);
        $(".wl-info").fadeIn(200);
    }
});