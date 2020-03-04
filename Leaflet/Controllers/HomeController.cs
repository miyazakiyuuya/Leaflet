using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Leaflet.Models;
using System.Data.SqlClient;

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
            if (searchTxt != null)
            {
                // テキストの値を取得
                ViewData["searchTxt"] = searchTxt;

                // DB接続
                ViewBag.Users = new List<string>();
                using (var con = new SqlConnection("Data Source=DESKTOP-UHLGPSV;Initial Catalog=sample;Integrated Security=True"))
                using (var cmd = new SqlCommand(@"SELECT latitude, longitude FROM m_leaflet WHERE area_name = @area_name", con))
                {
                    cmd.Parameters.Add(new SqlParameter("@area_name", searchTxt));

                    con.Open();
                    using (var dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            // 緯度と経度の値をセット
                            ViewBag.Users.Add(dr["latitude"].ToString());
                            ViewBag.Users.Add(dr["longitude"].ToString());
                        }
                    }
                }
            }
            else
            {
                // 対象のカラムを取得(なければエラーメッセージ)
            }
            return View();
        }



        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
