//初期   htmlが読み込みされてからスクリプトを動作させる。
window.onload = function(){

// HTML初回読み込み時
// キャンバスを設定


}

var img_grid
var motif = []
// モチーフの設定
var customMotif = function(m_img,m_array){
    let array = m_array;
     m_img.set({
       borderColor: '#19310B',
       cornerColor: '#19310B',
       cornerSize: 20,
       originX: "center",
       originY: "center",
       transparentCorners: true,
       lockScalingX:true,
       lockScalingY:true,
       lockMovementX:false,
       lockMovementY:false,
    }).setControlsVisibility({
      'bl': false,'br': false,
      'mb': false,'ml': false,'mr': false,'mt': false,
      'tl': false,'tr': false
      });
      m_img.setCoords();
      array.push(m_img);
      return array;
}
//キャンバスの全オブジェクトのカスタム設定
var customObjects = function(mycanvas){
  let objs = mycanvas.getObjects();
  // fabric.jsオブジェクトのカスタム属性を再付与
  $.each(objs,function(i,e){
    let objs_src = objs[i].getSrc();
    // 背景系画像は名称より判定：セレクト不可
    if(objs_src.indexOf('back') > -1){
      objs[i].set({ selectable:false });
      objs[i].setCoords();
      // 変数に格納:オンオフや切替のため
      if(objs_src.indexOf('grid') > -1){
         img_grid = objs[i];
      } else {
        img_back = objs[i];
      }
    } else {
      // モチーフ
      motif = customMotif(objs[i],motif);
    }
  });
}
//保存
var savemyMotif = function(mycanvas){
  // キャンバスの初期位置
  var originPoint = new fabric.Point(0,0)
  mycanvas.absolutePan(originPoint);
  // myMotif_img:表示用base64 ,myMotif:展開用JSON
  let json = JSON.stringify(mycanvas);
  let base64 = mycanvas.toDataURL("image/jpeg",0.1);
  // 履歴があれば最新のNOがnewMotifに格納されている（3件まで）
  let i = window.localStorage.getItem("newMotif");
    if(!i || i >= 3){
      i = 1;
    } else {
      i ++;
    }
  // LocalStorageに保存する
  window.localStorage.setItem("newMotif", i);
  window.localStorage.setItem("myMotif" + i, json);
  window.localStorage.setItem("myMotif_img" + i, base64);
}
// 履歴
var loadmyMotif = function(){
    let i = window.localStorage.getItem("newMotif");
  if (i) {
    $("#acdn-export").children('img').remove(); //履歴を一旦削除
    let myMotif_img;
    for (var j = 0; j <= 2; j++) {
      // 最新＋１（＝もっとも古い）履歴番号から順番に読み込む
      i = (i + 1) % 3;
      if( i == 0 ){ i = 3; } //はじめが何番でも123123と進むように
      //myMotif_img = base64を読み込む cx.myMotifは展開用JSON
      myMotif_img = window.localStorage.getItem("myMotif_img" + i);
      if (myMotif_img) {
        // $("#myMotif" + i).attr("src",myMotif_img)
        var image = new Image();
        image.src = myMotif_img;
        image.id = "myMotif" + i; //展開時の呼び出しキー
        image.width = 100;
        // 画像ロード後に履歴要素として表示
        image.onload = function(){
          this.className = "myMotifs";
          $("#acdn-export").get(0).appendChild(this);
        };
      }
    }
  }
}
// キャンバス状態の反映
var getNowCanvas = function(mycanvas,myobject){
  // サイズ
  // 縦横
  let o_width = myobject.width;
  let o_height = myobject.height;
  // gridオブジェクトのアングルで縦横を判定：キャンバスサイズの設定
  if(myobject.angle != 0){
      $('#vh_switch').prop('checked',true);
      mycanvas.setWidth(o_height);
      mycanvas.setHeight(o_width);
    } else {
      $('#vh_switch').prop('checked',false);
      mycanvas.setWidth(o_width);
      mycanvas.setHeight(o_height);
    }

    // gridオブジェクトのSrcでサイズを判定：
    let objs_src = myobject.getSrc();
    let size_range
    if(objs_src.indexOf('small') > -1){
      size_range = '0';
    }else if(objs_src.indexOf('A3') > -1){
      size_range = '2';
    }else{
      size_range = '1';
    }
    $('#size_range').val(size_range);
    switchSize(size_range);

  // グリッド
  if(myobject.visible){
    $('#grid_switch').prop('checked',true);
   } else {
    $('#grid_switch').prop('checked',false);
  }
  //囲みDIVにキャンバス幅を割り当て
  let c_width = mycanvas.getWidth();
  $('.c_container').width( mycanvas.width );
}
// 追加用画像の展開
var addPlusBox = function(array,elm){
  let addhtml = [];
   for (let i = 0; i < array.length; i++) {
     addhtml.push("<div class='plusbox'><img class='emb' src='./Photos1/" + array[i] + ".png'></div>");
     }
 $(elm).get(0).innerHTML = addhtml.join("");
}
//サイズ用のレンジ設定に連動
var switchSize = function(val){
  switch (val){
   case '0':
     $('#input_nickname').text("≒ はがき ");
     $('#input_height').val("140");
     $('#input_width').val("100");
     break;
   case '1':
     $('#input_nickname').text("≒ A4 ");
     $('#input_height').val("280");
     $('#input_width').val("200");
     break;
   case '2':
     $('#input_nickname').text("≒ A3 ");
     $('#input_height').val("420");
     $('#input_width').val("280");
     break;
   }
}
//背景画像の変更
var changeBackImage = function(val){
  let img_size
  switch (val){
   case '0':
    img_size = 'small'
     break;
   case '1':
    img_size = 'A4'
     break;
   case '2':
    img_size = 'A3'
     break;
   }
   let img_back_src = './Photos/back_'+img_size+'.png'
   let img_grid_src = './Photos/back_grid_'+img_size+'.png'
   img_back.setSrc(img_back_src, function() {
     img_grid.setSrc(img_grid_src, function() {
       getNowCanvas(canvas,img_grid);
       canvas.renderAll();
     });
   });
}
//  反転コピー
function flipPaste() {
  canvas.getActiveObject().clone(function(clonedObj) {
    canvas.discardActiveObject();
    clonedObj.set({
      left: clonedObj.left + clonedObj.width,
      // top: clonedObj.top - y,
      angle:clonedObj.angle*-1,
      flipX:!clonedObj.flipX
    });
    // キャンバス追加
    if (clonedObj.type === 'activeSelection') {
      // active selection needs a reference to the canvas.
      clonedObj.canvas = canvas;
      clonedObj.forEachObject(function(obj) {
        canvas.add(obj);
      });
      // this should solve the unselectability
      clonedObj.setCoords();
    } else {
      canvas.add(clonedObj);
    }
    customObjects(canvas);
    canvas.setActiveObject(clonedObj);
    canvas.requestRenderAll();
  });
}


// 初回読み込み
  // キャンバス
  var canvas = new fabric.Canvas('test_canvas');

// 戻る用
  var state; // current unsaved state
  var undo = []; // past states
  function save() {
    if (state) {
      undo.push(state);
      // ボタンをオンにする
    }
    state = JSON.stringify(canvas);
  }
  function replay() {
    // redo.push(state);
    state = undo.pop();
    if (state) {
      // turn both buttons off for the moment to prevent rapid clicking
      canvas.clear();
      canvas.loadFromJSON(state, function() {
        customObjects(canvas);
        getNowCanvas(canvas,img_grid);
      canvas.renderAll();
     });
   }else{
     // ボタンをオフにする
   }
  }

  // Image
  fabric.Image.fromURL('./Photos/back_small.png', function(img) {
    canvas.add(img); //背景
    fabric.Image.fromURL('./Photos/back_grid_small.png' , function(img) {
      canvas.add(img); //グリッド
      fabric.Image.fromURL('./Photos1/mm1-mi.png' , function(img) {
        canvas.add(img); //初期画像
        customObjects(canvas);
        getNowCanvas(canvas,img_grid);
        canvas.bringToFront(img_grid);
        canvas.bringToFront(motif[0]); //モチーフを一番前に出す(読み込み順になってしまうので)
        motif[0].set({top:200,left:img_back.width/2}); //真ん中位に置く
        motif[0].setCoords();
        canvas.setActiveObject(motif[0]);
        canvas.renderAll();
      });
    });
  });

  //メニュー内容を隠す
  $('.acdn_container').hide();
  // let containers = document.getElementsByClassName('acdn_container');
  // for (var i=0;i<containers.length;i++) {
  // containers[i].style.display = "none";
  // }
// メニューアコーディオン
$('.acdn_btn').on('click',function(){
  let thisId = '#acdn-'+$(this).attr('id');
  let $acdn = $(thisId); //対象となるメニュー内容
  if($acdn.siblings('div:visible').length){
    // メニューが既に表示されている場合
    // メニュー内容切り替え
    $acdn.show()
      .siblings().hide();
    // オンアイコンの切り替え
    $(this).addClass('active')
      .siblings().removeClass('active');
  } else {
    // メニューを初めて表示するとき
    // メニュー表示
    $acdn.slideToggle('fast')
      .siblings().hide();
    // オンアイコンの設定
    $(this).toggleClass('active');
    // メイン画面幅の切り替え
    $('main,aside,#down').toggleClass('min')
      .toggleClass('max');
    }
  });

//履歴描画
 $('#export').on('click',function(){
    loadmyMotif();
 });

// テスト
 // $('#copy').on('click',function(){
 //    // Copy();
 //    Paste();
 // });

 // 追加画像の一覧
   var array_tab1 = ['s1','s2','s3','s4','s5','s6','s7','s8','s9'];
   var array_tab2 = ['mm1-mi','mm1-sm','mm2-la','mm2-sm'
   ,'mm2-mi','mm3-la','mm3-sm'
   ,'mm4','mm4-p','mm5-la','mm5-sm-1','mm5-sm-2','mm6-1','mm6-2','mm6-3','mm7'
   ,'mm8-la-1','mm8-la-2','mm8-sm-1','mm8-sm-2','mm8-sm-3'];
   var array_tab3 = ['vl1','vl2','vl3','vl4','vl5','vl6','vl7','vl8','vl9','vl10'];
   var array_tab4 = ['v1','v2','v3','v4','v5','v6','v7','v8','v9','v10','v11','v12','v13','v14','v15-1','v15-2','v15-3','v16'];
   var array_tab5 = ['o1-1','o1-2','o1-3','o1-4','o1-5','o1-6','o2','o3-1','o3-2','o4','o5','o6','o7','o8','o9','o10','o11','o12','o13','o14','o15'];

  // 追加用画像の読み込み
  $('#add').on('click',function(){
     addPlusBox(array_tab1,'#tab1_content');
   });
  $('input[name="tab_item"]').on('click',function(){
    id = $(this).attr('id');
    myarray = eval('array_'+ id);
    mycontent = '#'+ id +'_content';
    addPlusBox(myarray,mycontent);
  });

// グリッドオンオフ
$('#grid_switch').on('change', function(){
   if($("#grid_switch:checked").val()){
     img_grid.visible = true;
   } else {
     img_grid.visible = false;
   }
   canvas.renderAll();
 });
 // 移動ボタンオンオフ
 $('#canvas_button_switch').on('change', function(){
    if($("#canvas_button_switch:checked").val()){
      $('.canvas_button').show();
    } else {
      $('.canvas_button').hide();
    }
  });
// 線画切り替え
$('#np_switch').on('change', function(){
  let folder1;
  let folder2;
  // チェック時は0(線画)→1(イメージ)
  if($("#np_switch:checked").val()) {
    folder1 = "Photos0";
    folder2 = "Photos1";
  } else {
    folder1 = "Photos1";
    folder2 = "Photos0";
  }
  //選択候補群を切り替え
  $('.emb').each(function(){
    let m_src =$(this).attr("src");
    m_src = m_src.replace(folder1, folder2)
    $(this).attr("src",m_src);
  });
  // キャンバス内を切り替え
  $.each(motif,function(i,e){
    let m_src = motif[i].getSrc();
    m_src = m_src.replace(folder1, folder2);
    motif[i].setSrc(m_src, function() {
      canvas.renderAll();
      });
    });
    // 背景画像のオンオフ
    if($("#np_switch:checked").val()){
      img_back.visible = true;
    } else {
      img_back.visible = false;
    }
    canvas.renderAll();
});

// 縦横切り替え
$('#vh_switch').on('change', function(){
  //キャンバスサイズの変更
  let c_height = canvas.getHeight();
  let c_width = canvas.getWidth();
    canvas.setHeight( c_width );
    canvas.setWidth( c_height );
    canvas.calcOffset();
    $('.c_container').width( c_height );
  //モチーフ変更
  let image = canvas.getObjects();
  if($("#vh_switch:checked").val()) {
    // 横:回転と移動
    $.each(image,function(i,e){
      image[i].set({
        angle: image[i].angle - 90,
        // top: image[i].width - image[i].top
        top: c_width - image[i].left,
        left: image[i].top
      } ).setCoords();
      canvas.requestRenderAll();
    });
  }else{
    // 縦：通常に戻す
    $.each(image,function(i,e){
      image[i].set({
        angle: image[i].angle + 90,
        top: image[i].left,
        left: c_height - image[i].top
      } ).setCoords();
      canvas.requestRenderAll();
    });
  }
});

//サイズ変更
$('#size_range').on('change', function () {
   let val = $(this).val();
   changeBackImage(val);
 });

//削除
$("#remove").on('click',function(){
  let activeObjects = canvas.getActiveObjects();
  canvas.discardActiveObject()
  if (activeObjects.length) {
    canvas.remove.apply(canvas, activeObjects);
  }
});

//反転
$("#flip").on('click',function(){
  flipPaste()
});

//要素追加
$(document).on('click','.plusbox',function(){
   let m_src = $(this).children('img').attr('src');
   fabric.Image.fromURL(m_src, function(m) {
     canvas.add(m);
     motif = customMotif(m,motif);
     let mlen = motif.length - 1;
     canvas.setActiveObject(motif[mlen]);
     m.set({top:img_back.height/2,left:img_back.width/2});
     m.setCoords();
     canvas.renderAll();
   });
  });

//ダウンロード
$("#download").on('click',function(){
  // Canvasからbase64エンコーディングされた画像データを取得する
  let base64 = canvas.toDataURL("image/jpeg",0.1);
  // ダウンロードに設定
  $('#a_download').attr('href', base64);
  $('#a_download')[0].click();
 });

 //ダウンロード2
 $("#download2").on('click',function(){
   // CanvasからJSON形式のデータを取得しURLに変換（アップロード用）
   let json = JSON.stringify(canvas);
   let href = "data:application/octet-stream," + encodeURIComponent(json);
   // ダウンロードに設定
   $('#dl_JSON').attr('href', href);
 });

// 保存
$("#clip").on('click',function(){
    if(!window.localStorage){alert("一時保存機能はブラウザがサポートしていません。"); return;}
  savemyMotif(canvas);
  loadmyMotif();
});

// 展開
$(document).on('click','.myMotifs', function(){
  // クリックしたID(myMotif?)の内容をlocalstrageから読み込み
  let id = $(this).attr('id');
  let tmp = window.localStorage.getItem(id);
  canvas.clear();
  // myMotif:展開用JSON を読み込み
  canvas.loadFromJSON(tmp,function(){
    customObjects(canvas);
    canvas.renderAll();
    // 各種状態取得
    getNowCanvas(canvas,img_grid); //ここがだめ 横の時オブジェクトの位置がおかしい

    });
});

//選択固定
var selectedObject;
canvas.on('mouse:up', function(options) {
  if (options.target) {
    // console.log('select ', selectedObject);
    if(selectedObject){
      selectedObject.set({
        lockMovementX:true,
        lockMovementY:true
      });
    }
    options.target.set({
      lockMovementX:false,
      lockMovementY:false,
    });
    selectedObject = options.target;
  }
});
// ズーム
$('#zoom_range').on('change',function () {
    let zoom = $('#zoom_range').val();
    // canvas.setZoom(zoom) ;
    let point = {
              x: img_back.width/2,
              y: img_back.height/2
           };
    canvas.zoomToPoint(point,zoom) ;
}) ;
$('#re_zoom').on('click',function () {
    $('#zoom_range').val(1);
    let point = {
              x: img_back.width/2,
              y: img_back.height/2
           };
    canvas.zoomToPoint(point,1) ;
}) ;
$('#adjust_zoom').on('click',function () {
  // let point = {x: img_back.width/2, y: img_back.height/2};
  // 画面幅と縦横で最も低い倍率（＝全体の入る倍率）を求める
  let w_mag = window.innerWidth/img_back.width;
  let h_mag = (window.innerHeight-50)/img_back.height;
  console.log("inW"+window.innerWidth)
  console.log("inH"+window.innerHeight)
  let point = {x: (window.innerWidth-10)/2, y: (window.innerHeight-0)/2};
  mag = Math.min(w_mag,h_mag);
  if(mag > 1) {
    mag = 1;
  }
  // 倍率を適用する
    $('#zoom_range').val(mag);
    canvas.zoomToPoint(point,mag);
    // canvas.zoomToPoint(0,mag);
}) ;
// キャンバス移動
  $(".canvas_button").bind({
    'touchstart mousedown': function(e) {
      let id = $(this).attr("id");
      document.interval = setInterval(function(){
        let delta;
        switch (id){
          case 'left':
            delta = new fabric.Point(10,0) ;
            break;
          case 'right':
            delta = new fabric.Point(-10,0) ;
            break;
          case 'down':
             delta = new fabric.Point(0,-10) ;
            break;
          case 'up':
            delta = new fabric.Point(0,10) ;
            break;
         }
        canvas.relativePan(delta) ;
      }, 60)
      e.preventDefault();
    },
    'touchend mouseup mouseout': function(e) { // マウスが領域外に出たかどうかも拾うと、より自然
      clearInterval(document.interval);
      e.preventDefault();
    }
  });

  // 戻る用保存
  $("canvas").bind({
    'touchend mouseup mouseout':function(e) {
      save();
    }
  });

  // 戻るボタン
  $('#back').click(function(){
    replay();
  });





  // // ここ見て作り直すべきだな
// https://jsfiddle.net/tazehale/q2mz23xb/

}
