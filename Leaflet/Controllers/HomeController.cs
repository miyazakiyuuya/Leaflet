﻿using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Leaflet.Models;
using Microsoft.AspNetCore.Http;
using Nancy.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Text;

namespace Leaflet.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        
        public IActionResult Leaflet(string searchTxt)
        {
            ViewBag.LeafletModel = new LeafletModel();
            var results = new List<string>();
            string lati = "";
            string lon = "";

            if (searchTxt != null)
            {
                // テキストの値を取得
                ViewData["searchTxt"] = searchTxt;

                // DB接続
                using (var con = new SqlConnection("Data Source=DESKTOP-UHLGPSV;Initial Catalog=sample;Integrated Security=True"))
                using (var cmd = new SqlCommand(@"SELECT latitude, longitude FROM m_leaflet WHERE area_name = @area_name", con))
                {
                    cmd.Parameters.Add(new SqlParameter("@area_name", searchTxt));
                    try
                    {
                        con.Open();

                        using (var reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                // 緯度と経度の値をセット
                                results.Add(reader["latitude"] as string);
                                results.Add(reader["longitude"] as string);
                            }
                        }
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine(e);
                        throw;
                    }
                    finally
                    {
                        con.Close();
                    }
                }
                
                // 緯度と経度をstring型で取得
                lati = results[0];
                lon = results[1];
                ViewData["m"] = lati + " " + lon;

                //javascriptを呼ぶメソッド
                //callJs(lat);
                HttpContext.Session.SetString("lati", lati);
                HttpContext.Session.SetString("lon", lon);

                // sessionの値 確認用
                var a = HttpContext.Session.GetString("lati");
                var b = HttpContext.Session.GetString("lon");
                ViewData["a"] = lati;
                ViewData["b"] = b;
            }
            else
            {
                // 対象のカラムを取得(なければエラーメッセージ)
                ViewData["searchTxt"] = "null";
            }
            return View();
        }

//        public void callJs(string lat)
//        {
//            var ss = lat;
//            Console.WriteLine(ss);
//            StringBuilder sb = new StringBuilder();
//            sb.Append("<script type = text/javascript>alert('hello');"); //alert('Hello World!');
           
//            sb.Append("</script>");

//}






[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
