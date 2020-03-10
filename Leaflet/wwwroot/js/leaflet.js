var map;

var latlngss = [];

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
    var osm = new L.tileLayer('http://tile.openstreetmap.jp/{z}/{x}/{y}.png',
        { attribution: "<a href='http://osm.org/copyright' target='_blank'></a> contributors" });

    // 地理院地図の淡色地図タイル
    var gsipale = new L.tileLayer('http://cyberjapandata.gsi.go.jp/xyz/pale/{z}/{x}/{y}.png',
        { attribution: "<a href='http://portal.cyberjapan.jp/help/termsofuse.html' target='_blank'></a>" });

    // ↑３つの地図を配列に格納
    var baseMaps = {
        "標準地図": gsi,
        "オープンストリート": osm,
        "淡色地図": gsipale,

    };

    // 格納したレイアウトを地図にset
    L.control.layers(baseMaps).addTo(map);
    gsi.addTo(map);

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
        numDigits: 8
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

    // マウスクリックで任意の図形を描く処理(マウスを押すごとに)
    map.on('mousedown', function (e) {
        // x,y座標取得
        let x = e.latlng.lat;
        let y = e.latlng.lng;

        //console.log("最初:"+latlngss.length);
        // 初期の場合
        if (latlngss.length === 0) {
            // 配列に緯度と経度をセット
            latlngss.push([x, y], [x, y]);
            var ply = L.polyline(latlngss, { color: 'black', "weight": 10 }).addTo(map);
        }
        else {
            latlngss.push([x, y]);
            var ply = L.polyline(latlngss, { color: 'black', "weight": 10 }).addTo(map);
        }
    });



    // フリーハンドでマップに
    // var mylayer = L.CanvasLayer.extend({
    //     render: function(){
    //         var canvas = this.getCanvas();
    //         var ctx = canvas.getContext('2d');
    //         ctx.stroke();  
    //     }
    // });
    // var layer = new mylayer();
    // layer.addTo(map);
}

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
