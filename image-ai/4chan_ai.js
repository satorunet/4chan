$(function(){
	$("[data-type=File]:eq(0)").before("<tr><Td>AI</td><td><input class=ai_button type=button value='AI Image Generator'></td></tr>");
})


//AIぼたん
$(function(){
	$(document).on("click",".closeAIImage",function(e){
		$(".ai_image_preview").fadeOut("fast",function(){
			$(this).remove();
			$("#postFile:eq(0)").attr("type","file");
			var text = $("[name=com]:eq(0)").val();
			text.replace()

			
		})
	
	})


	$(document).on("click",".ai_button",function(e){
		e.preventDefault();

		var overwrapHTML = "<div class='overwrap' style='z-index:1000;text-align:center;vertical-align:middle;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.2); display: flex; align-items: center; flex-flow: wrap;        justify-content: space-around;'></div>";

		$(".info_div").html("");

		var resnum = $(e.currentTarget).attr("resnum");

		var overwrap = $(overwrapHTML);
		
		
		//var len = $('#sketch').sketch().actions.length;

		var ank = $(
		"<div class='ai_win' style='display: flex; align-items: center; flex-flow: wrap; justify-content: space-around;'>" + 
		"<form resnum="+resnum+" method=POST class=aiFormValue>" +
		"<div style='display:inline-block;background:white;width:80%;min-width:250px;padding:10px'>" + 
		"<div style='background:#CDD;;padding:5px'>" + 
		"<div style='float:right'><a style='text-decoration:none;color:black;background:white;padding:3px' class=closeAnk href=# style='color:black'>×</a></div>" + 
		"AI Image Generator v0.1</div>" + 

			"<div align=center>" + 

		"<div style='background:rgba(100,100,100,.1);padding:2px'>" + 

			"<div class=debug style='font-size:10pt;text-align:center;min-height:20px;background:#FFF;margin-top:3px;padding:3px'>" +
				"<span style='padding:3px' class=timer_div></span>" + 
				"<span style='padding:3px' class=loading_div></span>" + 
				"<span style='padding:3px' class=info_div>what do you draw?</span>" + 
			"</div>" + 


			"<div style='margin-top:5px'>" + 
/*
			"<div class=ai_message>" + 
			"<select class=ai_mode>" + 
				"<option value=''>描写モード：ランダム</option>" + 
				"<option value='illust'>イラスト系 Anything</option>" + 
				"<option value='picture'>実写系 chilloutmix</option>" + 
				"<option value='rev'>リアル絵系 revAnimated</option>" + 
			"</select>" + 
			"</div>" + 
*/

			"<textarea class=ai_prompt style='padding:10px;width:90%;height:70px' placeholder='Prompt'></textarea>" + 
//			"<input class=ne_prompt style='padding:5px;width:90%' placeholder='（否定プロンプト）'>" + 
			"</div>" + 
	//		'<input type=button class=image_up value="画像"><input accept="image/*" class=fileSelect type=file multiple="multiple" style="display:none">' + 


				"<div style='padding:3px'>" + 
					"<input class=aiSubmit  type=submit value='Create' disabled>&nbsp;" +
					"<input class=aiDone type=button value='Done' disabled>" +
				"</div>" + 
			"</div>"+

			"<div class=image_info style='text-align:right;color:#999;font-size:8pt'></div>" + 
			"<div class=image_preview style='position:relative;padding:5px;display:none'><img style='width:90%'></div>"+

		"</div>" +
		"</form>"+
		"</div>"
		);

		$(ank).find("textarea").bind("keyup",function(){
			$(".aiSubmit").attr("disabled",$(this).val() ? false : true);
		})

		var CLOSE_LOCK = 0;


		$(ank).on("click",".aiDone",function(e){

				$("[name=com]:eq(0)").val(
					"AI:" + $(".ai_prompt").val()  
				);

				var data = $(".image_preview").find("img").attr("src");

				$("#postFile:eq(0)").attr("type","input").val(data);;
				$("#postFile:eq(0)").closest("td").append("<div class='ai_image_preview' style='position:absolute'><a style='color:black;text-decoration:none' title='Cancel' class=closeAIImage href=#><span style='position:absolute;right:0px;top:0px;background:white;padding:3px 5px' class='cancel'>X</span></a><img width=100 src="+data+"></div>");


				setTimeout(function(){
					$(e.currentTarget).parents(".overwrap").fadeOut("fast",function(){
						$(this).remove();
					});
				},100);


/*			
			var data = $(".image_preview").find("img").attr("src");
			uploadImgur([data],function(res){
				$("[name=MESSAGE]").trigger("uploadComplete", res); //ok
			},function(){
				;
			});
*/


		});


		$(ank).on("click",".seed",function(e){
		
			e.preventDefault();

		
			var tt = $(".ai_prompt");
			var prompt = $(tt).val();
		
			if( prompt.match(/\s*SEED:\d+/) ){
				prompt = prompt.replace(/\s*SEED:\d+/g,"");
			}
			prompt += " SEED:" + $(this).text();
			$(tt).val(prompt);
		
		});

		$(ank).on("submit",".aiFormValue",function(e){
			CLOSE_LOCK = 1;
				$(".aiSubmit").prop("disabled",true);
				
				$(".info_div").html("");
				
				$(".ai_loading").remove();
				
				$(".loading_div").html("<span class=ai_loading><font color=#999>Drawing..<img src=https://image.open2ch.net/image/loading.gif></font></span>");
				
				$(e.currentTarget).find("input,textarea").prop("disabled",true);

				AI_request({
					"prompt" : $(e.currentTarget).find(".ai_prompt").val(),
					"mode" : "4chan",
					"e" : e,
					"error" :  function(){
						$(".ai_loading").remove();
						console.log("error");
					},
					"done" :  function(res){
//						console.log("ok:" + res);
							var json = JSON.parse(res);
							var limit = json.wait;
							var sec = 0;

							$(".ai_loading").remove();
						
							var timer = setInterval(function(){
								console.log("timer");
							
								if(++sec >= limit){
									$(e.currentTarget).find("textarea,.aiSubmit").prop("disabled","");
									$(".timer_div").html("");
									$(".ai_error").remove();
									clearInterval(timer);
								} else {
									$(".timer_div").html(
									(json.status == "ok" ? "<font color=#999><font color=red>Done!!</font>" : "") + 
									
									" until resurrection:"+sec + "/"+limit + "</font>");
								}	
							},1000);

							if(json.status == "ok"){

								$(e.currentTarget).find(".aiDone").prop("disabled","");
								doneAIImage(json);
							} else {
								var error = {
									"ero" : "エロ",
									"over" : "連投",
								};
								var text = error[json.status] ? error[json.status] : json.status;
								$(".info_div").html("<span class=ai_error style='diaplay:inline-block'><b><font color=red>エラー：</font></b>"+text+"</span>");
							}
					}
				});

	//		$(this).parents(".overwrap").remove();
			e.preventDefault();
		})


		ank.click(function(e){
//		e.preventDefault();
			e.stopPropagation();
		})

		$(ank).on("click",".closeAnk",function(e){
			$(this).parents(".overwrap").remove();
			e.preventDefault();
		});

/*
		overwrap.click(function(){
			$(this).remove();
		});
*/


		
		overwrap.append(ank);
		$("body").append(overwrap);
	
		$(ank).find("textarea:eq(0)").focus();
	})
})


function AI_request(obj){
	var currentTarget = obj.e.currentTarget;
	var val = obj.prompt
	var ne_val = $(currentTarget).find(".ne_prompt").val();

	//$("body").append("<img src="+$("#sketch").get(0).toDataURL("image/png") +">");

		val = new String(val).replace(/　| /g,"、");
		ne_val = new String(ne_val).replace(/　| /g,"、");

	var param = {
			prompt:val,
			mode   : obj.mode,
	};
	


	$.ajax({
		type : "POST",
		url : "https://ai.satoru.net/img2img/img2img.v4.cgi",
		data : param
	})
	
	.fail(function(error){
		obj.error();
	})
	
	.done(function(res){
		obj.done(res)
	})
}


function doneAIImage(json){


		$(".image_preview").show();

		$(".image_info").html(
		"SEED:<span class=seed style='cursor:pointer;text-decoration:underline'>" + json.seed + "</span>"
			//"NSFW:" + json.score + "%"
		);

		$(".image_preview").find("img").hide().attr("src",json.data).fadeIn("slow");
		


/*
		$('#sketch').sketch().setBaseImageURL(res);
		OEKAKI.redrawHonban();
		OEKAKI.isOekakiDone = 1;
		$("[name=MESSAGE]").val(val);
		setTimeout(function(){
			$(currentTarget).parents(".overwrap").click();
		},100);
*/

}



