using Leaflet.Models;
using LeafLet.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Diagnostics;

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

        
        public IActionResult Leaflet()
        {
            return View();
        }

        // JSONに返す値
        [HttpPost]
        public ActionResult Select([FromBody] LeafLetModel le)
        {
            var area = le.AreaName;     

            List<string> results = new List<string>();
         
            if(area == null)
            {
                // DB接続
                using (var con = new SqlConnection("Data Source=DESKTOP-UHLGPSV;Initial Catalog=sample;Integrated Security=True"))
                using (var command = con.CreateCommand())
                {
                    try
                    {
                        con.Open();
                        command.CommandText = @"SELECT * FROM m_leafletInfo";

                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                    // 緯度と経度の値をセット
                                    results.Add(reader["latitude"] as string);
                                    results.Add(reader["longitude"] as string);
                                    results.Add(reader["area_name"] as string);
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
            }

            return Json(results);
        }

        // JSONに返す値
        [HttpPost]
        public ActionResult Insert([FromBody] LeafLetModel lea)
        {
            
            string area = lea.AreaName;
            string lat = lea.Latitude;
            string longi = lea.Longitude;

            if (area != null)
            {
                // DB接続
                using (var con = new SqlConnection("Data Source=DESKTOP-UHLGPSV;Initial Catalog=sample;Integrated Security=True"))
                using (var command = con.CreateCommand())
                {
                    try
                    {
                        con.Open();
                        command.CommandText = @"INSERT INTO m_leafletInfo(latitude, longitude, area_name)VALUES(@latitude, @longitude, @area_name)";

                        // 緯度と経度の値をセット
                        command.Parameters.Add(new SqlParameter("@latitude", lat));
                        command.Parameters.Add(new SqlParameter("@longitude", longi));
                        command.Parameters.Add(new SqlParameter("@area_name", area));
                        
                        command.ExecuteNonQuery();
                        
                        return Json("success"); 
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
            }
            return Json("error");
        }



        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
