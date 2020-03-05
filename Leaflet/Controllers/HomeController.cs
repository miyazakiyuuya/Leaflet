using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Leaflet.Models;
using Microsoft.AspNetCore.Http;
using Nancy.Json;
using System;

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

     
        public ActionResult Leaflet()
        {
            //var results = new List<string>();

            //if (searchTxt != null)
            //{
            //    // テキストの値を取得
            //    ViewData["searchTxt"] = searchTxt;

            //    // DB接続
            //    using (var con = new SqlConnection("Data Source=DESKTOP-UHLGPSV;Initial Catalog=sample;Integrated Security=True"))
            //    using (var cmd = new SqlCommand(@"SELECT latitude, longitude FROM m_leaflet WHERE area_name = @area_name", con))
            //    {
            //        cmd.Parameters.Add(new SqlParameter("@area_name", searchTxt));
            //        try
            //        {
            //            con.Open();

            //            using (var reader = cmd.ExecuteReader())
            //            {
            //                while (reader.Read())
            //                {
            //                    // 緯度と経度の値をセット
            //                    results.Add(reader["latitude"] as string);
            //                    results.Add(reader["longitude"] as string);
            //                }
            //            }
            //        }
            //        catch (Exception e)
            //        {
            //            Console.WriteLine(e);
            //            throw;
            //        }
            //        finally
            //        {
            //            con.Close();
            //        }
            //    }
            //}
            //else
            //{
            //    // 対象のカラムを取得(なければエラーメッセージ)
            //}
            //string rs = string.Empty;
            //foreach (var items in results) 
            //{
            //    rs += items + "\r\n";
            //}
            //ViewData["label1"] = rs;      
            return View();
        }

        [HttpPost]
        public ActionResult test(LeafletModel le)
        {
            System.Diagnostics.Trace.WriteLine(le.postData);

            var res = new LeafletModel()
            {
                postData = "t"
            };
            Console.WriteLine("sss" + res);
            return Json(res);
        }







        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
