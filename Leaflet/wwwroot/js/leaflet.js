﻿var map;
var latlngss = [];
var plys;
var polygonss;
var isDrawing = false;
var status = 0;
var xlist = [];
var ylist = [];
var areaname;
var areacolor;
var strx;
var stry;
var xhr = new XMLHttpRequest();
function displayleaflet() {
    //地図を表示するdiv要素のidを設定
    map = L.map('map');
    //地図の中心とズームレベルを指定 (経度 緯度)
    map.setView([35.6689, 139.4776], 20); //5

    //　標準地図タイルレイヤ
    var gsi = new L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png', {
        attribution: "<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'></a>"
    });

    //　オープンストリート地図タイル
    var osm = new L.tileLayer('https://tile.openstreetmap.jp/{z}/{x}/{y}.png',
        { attribution: "<a href='https://osm.org/copyright' target='_blank'></a> contributors" });

    // 地理院地図の淡色地図タイル
    var gsipale = new L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png',
        { attribution: "<a href='https://portal.cyberjapan.jp/help/termsofuse.html' target='_blank'></a>" });

    // ↑３つの地図を配列に格納
    var baseMaps = {
        "標準地図": gsi,
        "オープンストリート": osm,
        "淡色地図": gsipale,
    };

    // 格納したレイアウトを地図にset
    L.control.layers(baseMaps).addTo(map);
    osm.addTo(map);

    let mkpoint = L.marker([35.6689, 139.4776]).bindPopup("府中市役所").addTo(map);
    let mkpoint2 = L.marker([35.6789, 139.4776]).bindPopup("府中市2").addTo(map);

    // 府中の周りを三角で色をつける
    let latlngs = [[35.6689, 139.4776], [35.6756, 139.4480], [35.6789, 139.4480], [35.6794, 139.4480]];
    let polygon = L.polygon(latlngs, { color: 'green' }).addTo(map);

    let circlelatlngs = L.circle([35.6689, 139.4776], { radius: 700 }).addTo(map);

    // ポップアップのマーカー
    let mm = L.marker([35.6761, 139.4776]).bindPopup("Fuchu").addTo(map);

    // 経度、緯度の計算(マウスを動かす時)
    var options = {
        position: 'bottomleft',
        numDigits: 2
    }
    L.control.mousePosition(options).addTo(map);

    // GeoJSON形式
    var json = [{
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [139.4786, 35.6681]
        },
        "properties": { // ポップアップの設定
            "popupContent": "府中のどこか"  // ホップアップの内容
        }
    }];

    //L.geoJson(g).addTo(map);
    L.geoJson(json, {
        onEachFeature: function (feature, layer) {
            if (feature.properties && feature.properties.popupContent) {
                layer.bindPopup(feature.properties.popupContent);
            }
        }
    }).addTo(map);

    // 複数のマーカを表示する
    var geojson = [];
    var popupContents = ["東京", "大阪", "札幌", "那覇"];
    let lat = [35.69, 34.69, 43.06, 26.2125];  // 緯度              // 緯度
    let lon = [139.69, 135.5, 141.35, 127.6811];　// 経度

    for (var i = 0; i < 4; i++) {
        geojson.push({
            "type": "Feature",
            "properties": {
                "popupContent": popupContents[i]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [lon[i], lat[i]]
            }
        });
    }

    // 複数のマーカをポップアップ表示
    L.geoJson(geojson, {
        onEachFeature: function (feature, layer) {
            if (feature.properties && feature.properties.popupContent) {
                layer.bindPopup(feature.properties.popupContent);
            }
        }
    }).addTo(map);

    // 経度　緯度(横)
    var quadrangle = L.polygon([
        [35.66875823, 139.47722912], // A地点
        [35.669011, 139.4772023],    // B地点
        [35.66908072, 139.47792113], // C地点
        [35.66893255, 139.47794795]  // D地点
    ],
        {
            color: 'green',
            fillColor: '#25dc25',
            fillOpacity: 0.5,
        }).addTo(map);

    var targets = L.polygon([
        [35.66803043, 139.47853267],
        [35.66825705, 139.47854877],
        [35.66826141, 139.47867751],
        [35.66803043, 139.4786678]
    ],
        {
            color: 'red',
            fillColor: '#FF0000',
            fillOpacity: 0.5,
        }).addTo(map);

    var sss = [
        [37.6686, 139.4785],
        [37.6682, 140.4787]];
    var ply = L.polyline(sss, { color: 'red' }).addTo(map);


    // sessionStorageがあるかチェック
    //if(sessionStorage.getItem('1') == undefined)
    //if (localStorage.getItem('1') == undefined) {
    //    console.log("session空");
    //}
    //else {
    //    // ある場合
    //    console.log("session有り");
    //    var array = [];
    //    // sessionの値を取得
    //    var sessionValues = localStorage.getItem('1');
    //    console.log("セッション値:" + sessionValues);
    //    array = sessionValues.split(',');

    //    // sessionの値をx,yにそれぞれ振り分ける
    //    for (var index = 0; index < array.length; index++) {
    //        // 偶数のindexをx座標に格納
    //        if (index % 2 == 0) {
    //            xlist.push(array[index]);
    //        }
    //        else {
    //            // 奇数のindexをy座標に格納
    //            ylist.push(array[index]);
    //        }
    //    }

    //    // polygonにx,yの値をセットする
    //    for (var u = 0; u < xlist.length; u++) {
    //        var jj = L.polygon([[xlist[u], ylist[u]]], { color: 'red' }).addTo(map);
    //        // debug let mma = L.marker([xlist[u], ylist[u]]).bindPopup("x").addTo(map);
    //        //console.log("回数と値:" + u + " " + jj);
    //    }
    
    

    // ajaxを用いてc#側に文字列で値(緯度、経度、エリアの名前、color)を渡す(x,y配列で渡すとメモリが大きく入らない)
    
    var aaa = [];
    var aab = [];
    var aac = [];

    var data_str = {
        areaname: areaname
    };
    $.ajax({
        url: '/Home/Select',
        type: 'POST',
        dataType: 'JSON',
        contentType: 'application/json',
        data: JSON.stringify(data_str)  //JSON.stringify(leafletList)
    }).done(function (data) {
        //alert("test" + data);

        for (var i = 0; i < data.length; i++) {

            if (i % 3 == 0) {
                aab.push(data[i]);
            } else if (i % 3 == 1) {
                aac.push(data[i]);
            } else if (i % 3 == 2) {
                aaa.push(data[i]);
            }
            else {

            }
        }
        alert("test1"+ "エリアの名前: "+ aaa +" "+ "xlist: "+" " + aab + " " + "ylist: " + aac);
        
        //console.log("デー成功" + data);
    }).fail(function (error, status, data) {
        //alert(status + " " + error + " " + data + " " + JSON.stringify(leafletList));
        alert("失敗");
        //console.log("データ失敗" + " " + data);   
    });
    for (var u = 0; u < aab.length; u++) {
        var jj = L.polygon([[aab[u], aac[u]]], { color: 'red' }).addTo(map);
        console.log("ポリゴン:"+jj);
    }
}

// フリーハンドボタンを押下した処理(偶数：drawing 中止, 奇数:drawing 始動)
function freeDrawing() {
    status++;
    console.log(status);
    if (status % 2 == 1) { // 奇数の場合 
        //map.on('click', function(e){
        document.getElementById('btn').style.backgroundColor = '#FF3300';
        console.log("奇数:" + status);
        map.addEventListener('mousedown', downmause, isDrawing); // クリックした場合
        map.addEventListener('mousemove', movemause, isDrawing); // 移動した場合
        map.addEventListener('mouseup', upmause, isDrawing); //マウスを離した場合
        //});
    } else {
        // イベントリスナーのイベントを中断
        document.getElementById('btn').style.backgroundColor = '#FFFFFF';
        console.log("偶数:" + status);
        map.removeEventListener('mousedown', downmause, isDrawing); // クリックした場合
        map.removeEventListener('mousemove', movemause, isDrawing); // 移動した場合
        map.removeEventListener('mouseup', upmause, isDrawing); //マウスを離した場合
    }
}

function downmause() {
    isDrawing = true;
};

// マウスクリックで任意の図形を描く処理(マウスを押すごとに)
//map.on('mousemove', function(e)
function movemause(e) {
    if (isDrawing === true) {
        // x,y座標取得
        let x = e.latlng.lat;
        let y = e.latlng.lng;
        //debug console.log("最初:"+latlngss.length);
        // 初期の場合
        if (latlngss.length === 0) {
            // 配列に緯度と経度をセット
            latlngss.push([x, y]);
            ply = L.polyline(latlngss, { color: 'black', weight: 10 }).addTo(map);
        }
        else {
            // マウスを動かすたびに配列に緯度と経度を格納
            latlngss.push([x, y]);
            ply = L.polyline(latlngss, { color: 'black', weight: 10 }).addTo(map);
            //console.log(x + " " + y);
        }
    }
};

// マウスクリックを再度クリック後の処理(mouseup) alertを出し、保存するかしないかを選択する
// yesならば、配列に格納orそのままマップに表示する。Noならば保存しない。
// map.on('mouseup', function(e)
function upmause() {
    if (isDrawing === true) {
        // 配列に何もない場合は処理は行わない
        if (latlngss.length == 0) {
            // nothing to do
        }
        else {
            var result = window.confirm("Do you want to save it???");
            // 一時保存処理
            if (result == true) {
                // 属性値を記載
                areaname = window.prompt("エリアの名前を入力してください。");
                areacolor = window.prompt("エリアの色を入力してください。");
                
                console.log("clear前:" + latlngss.length);
                // ポリゴンで地図と色を表示する。
                polygonss = L.polygon(latlngss, { color: areacolor }).addTo(map);
                // 属性項目:名前を付与
                polygonss.bindPopup(areaname);
                let h = latlngss.toString();
                let hh = [];
                hh = h.split(',');


                for (var j = 0; j <= hh.length; j++) {
                    // 偶数のindexをx座標に格納
                    if (j % 2 == 0) {
                        xlist.push(hh[j]);
                    }
                    else {
                        // 奇数のindexをy座標に格納
                        ylist.push(hh[j]);
                    }
                }

                strx = xlist.toString();
                stry = ylist.toString();

                //console.log("clear後:" + latlngss.length);
                console.log("保存完了");

                var data = {
                    //foo: "test"
                    latitude: strx,
                    longitude: stry,
                    areaname: areaname
                };
                $.ajax({
                    url: '/Home/Insert',
                    type: 'POST',
                    dataType: 'JSON',
                    contentType: 'application/json',
                    data: JSON.stringify(data)  //JSON.stringify(leafletList)
                }).done(function (data) {
                    alert("成功");
                }).fail(function (error, status, data) {
                    alert("失敗");                 
                });


                //if (('sessionStorage' in window) && (window.sessionStorage !== null)) {
                //    // セッションストレージが使える
                //    console.log("セッションが使える");
                //    //sessionStorage.setItem('1', latlngss);
                //    //window.sessionStorage.setItem('1', latlngss);
                //    localStorage.setItem('1', latlngss);
                //    console.log("セッション入れる前:" + latlngss);
                //    console.log("セッションに入れる後:" + localStorage.getItem('1'));
                //    //latlngss.length =0;
                   
                //}
                //else {
                //    console.log("sessionStorageはつかえない");
                //}
                isDrawing = false;
            }
            else // 保存しない
            {
                console.log("保存なし");
                isDrawing = false;
                // 配列をクリアする。これにより、描いた図形を連続で描かなくて済む(新しく図形が描ける)
                latlngss.length = 0;
            }
        }
    }
};

function searchAreabtn() {
    // get text value
    const searchTxt = document.getElementById('searchArea').value;
    var message = "検索した条件がありません。";
    if (searchTxt != null && searchTxt === undefined) {
        // 動確
        document.getElementById('msg').innerHTML = searchTxt;
        let test = L.marker([35.6769, 139.4890]).bindPopup("test").addTo(map);
        // find area↓

    }
    else {
        // 仮置き
        document.getElementById('msg').innerHTML = message;
    }
}

// they find my location
function findMyLocation() {
    if (navigator.geolocation == false) {
        alert("現在地を取得できませんでした。");
        return;
    }

    // if success find location, to display marker
    function success(e) {
        var lat = e.coords.latitude;
        var lng = e.coords.longitude;
        map.setView([lat, lng], 15);
        L.marker([lat, lng]).addTo(map).bindPopup("現在地").openPopup();
    };

    // if not success it, to display error message
    function error() {
        alert("現在地を取得できませんでした。");
    };
    navigator.geolocation.getCurrentPosition(success, error);
}

   






  // 座標調べる処理
// function mousemove(e){
//     // x,y座標を取得
//     var x = e.clientX;
//     var y = e.clientY;
//     // var str = "X座標" + e.clientX + "y座標" + e.clientY;
//     // document.getElementById('area').innerText=str;
// }
