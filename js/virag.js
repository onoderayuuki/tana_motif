 window.onload = function(){

 // キャンバスを設定
  let canvas = new fabric.Canvas('test_canvas',{
      selection: false,
      height:	420,
      width:300
     });
  // var canvas = new fabric.CanvasWithViewport('mycanvas');
  // canvas.setBackgroundImage('./Photos/back_small.png', canvas.renderAll.bind(canvas));

  // グリッド
let customs = {color1 :'#E9E9E9',color2 :'#F7F8F6'}
let addGridLines = function(gridLines,lineLength,limitLine,gridInterval,whichVH){
  // グリッド用の縦もしくは横のラインの配列を返す。
  // （ラインと追加する配列 ,線長,繰り返し終端,ライン種類'vertical'or'horizontal'）
  let gridMax = limitLine / gridInterval;
  for (var i = 0; i < gridMax; i++) {
   let gridDistance   = i * gridInterval;// 開始の位置・距離をとる
   if(whichVH == 'vertical'){
      fromtoLine = [gridDistance, 0, gridDistance, lineLength]
    }else{
      fromtoLine = [ 0, gridDistance, lineLength, gridDistance]
    }// 縦の線か横の線かを決めてLineの引数配列をつくる
   let gridLine = new fabric.Line(fromtoLine,{
      stroke: customs.color1,
      strokeWidth: 1,
      selectable: false
    });// カスタムされた線を作成
   let gridMidd = gridMax/2
   if (i%5 === (gridMidd%5)) {
      gridLine.set({stroke: customs.color2,strokeWidth: 1.5})
    };// 中心軸を基準に5本ごとに色と太さを設定
    if (i === gridMidd) {
      gridLine.set({strokeWidth: 3})
    };// 中心軸に色と太さを設定
    gridLines.push(gridLine);// 配列に追加
  };
  return gridLines
}
var groupGrid = function(x,y){
  // グループ化されたグリッドの集合を返す
  let interval = 30
  let gridArray = [];
  gridArray = addGridLines(gridArray,x,y,interval,'horizontal');
  gridArray = addGridLines(gridArray,y,x,interval,'vertical');
  let scale = new fabric.Text('1cm',{fontSize:15,fill:customs.color2});
  gridArray.push(scale);
  let gridGroup = new fabric.Group(gridArray,{selectable: false});
  return gridGroup
}
  let grid = groupGrid(canvas.width,canvas.height)
  // canvas.add(grid);

// モチーフに共通プロパティを設定する。枠とか
fabric.customMotif = fabric.util.createClass(fabric.Image, {
  type: 'customMotif',
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
 initialize: function(src, options) {
   this.callSuper('initialize', options);
   options && this.set('name', options.name);
   this.image = new Image();
   this.top = options.top;
   this.left = options.left;
   this.price = 100;//値段　あとで。
   this.image.src = src;
   this.image.onload = (function() {
     this.width = this.image.width;
     this.height = this.image.height;
     this.loaded = true;
     this.setCoords();
     this.fire('image:loaded');
   }).bind(this);
 },

  toObject: function(options) {
       return fabric.util.object.extend(this.callSuper('toObject'), {
       });
  },
  _render: function(ctx) {
   if (this.loaded) {
      ctx.drawImage(this.image, -this.width / 2, -this.height / 2);
   }
  }
});
// カスタムしたモチーフクラスの再読み込み用
fabric.customMotif.fromObject = function(object, callback, forceAsync) {
  return fabric.Object._fromObject('customMotif', object, callback, forceAsync);
}

fabric.customMotif.async = true;

var createMotif = function(src){
  let motif = new fabric.customMotif(src, {
       top : canvas.height/3,
       left : canvas.width/2.5
     });
    motif.on('image:loaded', canvas.renderAll.bind(canvas));
    return motif
}
 //初期モチーフを追加
let firstMotif = createMotif('./Photos1/m5.png');
canvas.add(firstMotif);
// 追加用画像ボタン
 // プラスボックスの作成
var addPlusBox = function(arrayPhoto,id){
 let section = document.getElementById(id);
 let docfragment = document.createDocumentFragment();//ループ要素を保管しておく
 for (let i = 0; i < arrayPhoto.length; i++) {
   // div
   let plusbox = document.createElement('div');
   plusbox.className ='plusbox';
   //img タグ
   let image = document.createElement('img');
   image.className = 'emb';
   let  src = "./Photos1/" + arrayPhoto[i] + ".png"
   image.src = src
   plusbox.appendChild(image);
   docfragment.appendChild(plusbox);
   }
 section.appendChild(docfragment);
}
var array_tab1 = ['s1','s2','s3','s4','s5','s6','s7','s8','s9'];
 var array_tab2 = ['mm1-mi','mm1-sm','mm2-la','mm2-sm','mm2-mi','mm3-la','mm3-sm','mm4','mm4-p','mm5-la','mm5-sm-1','mm5-sm-2','mm6-1','mm6-2','mm6-3','mm7','mm8-la-1','mm8-la-2','mm8-sm-1','mm8-sm-2','mm8-sm-3'];
 var array_tab3 = ['vl1','vl2','vl3','vl4','vl5','vl6','vl7','vl8','vl9','vl10'];
 var array_tab4 = ['v1','v2','v3','v4','v5','v6','v7','v8','v9','v10','v11','v12','v13','v14','v15-1','v15-2','v15-3','v16'];
 var array_tab5 = ['o1-1','o1-2','o1-3','o1-4','o1-5','o1-6','o2','o3-1','o3-2','o4','o5','o6','o7','o8','o9','o10','o11','o12','o13','o14','o15'];
// 追加用画像の呼び出し
// document.getElementById('add').onclick = function(){
  addPlusBox(array_tab1,'tab1_content');
  addPlusBox(array_tab2,'tab2_content');
  addPlusBox(array_tab3,'tab3_content');
  addPlusBox(array_tab4,'tab4_content');
  addPlusBox(array_tab5,'tab5_content');
// }
// モチーフ追加
var Elements = document.getElementsByClassName("emb");
 for (var i = 0; i < Elements.length; i++) {
  Elements[i].onclick = function() {
   let src = this.src;
   let motif = createMotif(src);
   canvas.add(motif);
  };
 }

// モチーフ削除
// document.getElementById('remove').onclick = function(){
//   let activeObjects = canvas.getActiveObjects();
//   canvas.discardActiveObject()
//   if (activeObjects.length) {
//     canvas.remove.apply(canvas, activeObjects);
//   }
// }
// 保存
var originSave = function(){
  // キャンバスの初期位置
  var originPoint = new fabric.Point(0,0)
  canvas.absolutePan(originPoint);
  // myMotif_img:表示用base64 ,myMotif:展開用JSON
  let json = JSON.stringify(canvas);
  let base64 = canvas.toDataURL("image/jpeg",0.1);
  // 履歴があれば最新のNOがnewMotifに格納されている（5件まで）
  let i = window.localStorage.getItem("newMotif");
    if(!i || i >= 5){
      i = 1;
    } else {
      i ++;
    }
  // LocalStorageに保存する
  window.localStorage.setItem("newMotif", i);
  window.localStorage.setItem("myMotif" + i, json);
  window.localStorage.setItem("myMotif_img" + i, base64);
}
document.getElementById('ok').onclick = function(){
 saveCanvas();
}
//展開

//戻る進む
// 戻る用保存
let canvasState; // current unsaved state
let canvasUndo = []; // past states
var tempSave =  function () {
  // 配列に一つ前の状態を格納する
  if (canvasState) {
  canvasUndo.push(canvasState);
  // ボタンをオンにする
  // console.log(canvasState);
  }
  // 現在の状態を変数に保存する
  canvasState = JSON.stringify(canvas);
}
canvas.on('mouse:up',function(e){
  tempSave();
});
// undo
var tempReply = function(){
    // redo.push(state);
  let canvasState = canvasUndo.pop();
  if (canvasState) {
    // turn both buttons off for the moment to prevent rapid clicking
    canvas.clear();
    console.log(canvasState);
    canvas.loadFromJSON(canvasState);
    // canvas.loadFromJSON(canvasState, function(){});
   }
}
document.getElementById('undo').onclick = function(){
 tempReply();
}


}//windowsonloadここまで

// // グリッドオンオフ
//
// // 線画切り替え
//   // 画像参照フォルダを0(線画)←→1(イメージ)
//   //選択候補群を切り替え
//   // キャンバスサイズ変更
//   // キャンバス内を切り替え
//   // 背景画像を非表示にする
//
// // 縦横切り替え
//   //キャンバスサイズの変更
//   //モチーフ変更
//     // 横のとき:回転と移動
//     // 縦のとき：通常に戻す
//
// //サイズ変更
//   背景画像の変更＊
//
// // モチーフ削除
//   キャンバスから削除
//   存在するときだけなんかやってる？remove.apply
//
// // モチーフ反転＊
//

// //ダウンロード
//   // Canvasからbase64エンコーディングされた画像データを取得する
//   // ダウンロードに設定
//
// //ダウンロード2
//     // CanvasからJSON形式のデータを取得しURLに変換（アップロード用）
//        // ダウンロードに設定
//
// // 保存
//   //save
//   //load
//
// // 展開
//     // クリックしたID(myMotif?)の内容をlocalstrageから読み込み
//   // myMotif:展開用JSON を読み込み
//   // 各種状態取得 *
//
// //選択固定
//   クリック対象があれば、ロックを外す
//   　※ひとつ前の選択オブジェクトがあればロックする
// 　今回のオブジェクトを待ち行列にいれておく
//
// // ズーム
// 　ユーザーの倍率を取得
// 　中心点を取得
// 　中心点からズームする(zoomToPoint)
// // ズームを戻す
// 　レンジボタンの位置を１に戻す
//   中心点から縮尺1倍でズームする
//
// // 調整ズーム
//
//
// // キャンバス移動
// 押下したボタンの名称を取得
// 　ボタン名称によって上下左右に10移動する（押下している60ミリ秒ごとに）
// 　relativePan???
// 　preventDefault??
//
// // 戻る用保存
//   キャンバス内の移動のたびに保存＊
//     // current unsaved state
//     // past states
//
// //戻る
//
// //カスタムモチーフ
// 　枠線等を設定する
// 　モチーフのみの配列に入れる
//
// //キャンバスの全オブジェクトのカスタム設定
// 　//全オブジェクトを取得
//   // fabric.jsオブジェクトのカスタム属性を再付与
//   背景画像　
//   　・全て選択不可
//   　・グリッドと背景をそれぞれ変数に格納
//   モチーフ→カスタムモチーフ
//
// 保存
//   キャンバスを初期位置に戻す
//   // myMotif_img:表示用base64 ,myMotif:展開用JSON
//   // 履歴があれば最新のNOがnewMotifに格納されている（3件まで）
//   // LocalStorageに保存する
//   　newMotif:最新番号
//   　myMotif[i]:JSON
//    myMotif_img[i]:base64
//
//   履歴展開
//   　//履歴を一旦削除
//     // 最新＋１（＝もっとも古い）履歴番号から順番に読み込む
//     //myMotif_img = base64を読み込む cx.myMotifは展開用JSON
//     // 画像ロード後に履歴要素として表示
//
// // キャンバス状態の反映
//
//   // gridオブジェクトのアングルで縦横を判定：キャンバスサイズの設定
//   // gridオブジェクトのSrcでサイズを判定：
//     // グリッド
//     //囲みDIVにキャンバス幅を割り当て
////
// //サイズ用のレンジ設定に連動
//
// //背景画像の変更
//   渡された値から名称を算出
//   名称に当てはまる画像を取得
//   設定
//
// //  反転コピー
//   アクティブなオブジェクトのコピー
//   アクティブを解除
//   クローンに位置設定
//   キャンバスに追加


// キャンバスのズーム
// canvas.on('touch:gesture',function(event){
//   isGestureEvent = true;
//   var lPinchScale = event.self.scale;
//   var scaleDiff = (lPinchScale -1)/10 + 1;  // Slow down zoom speed
//   canvas.setZoom(canvas.viewport.zoom*scaleDiff);
// });
