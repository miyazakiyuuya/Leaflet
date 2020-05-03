using Leaflet.Models;
using LeafLet.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.SqlServer.Types;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Spatial;
using Test.Models;

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
                using (var con = new SqlConnection("Data Source =DESKTOP-9VE6279\\SQLEXPRESS; Initial Catalog=sample; Integrated Security=True"))
                //using (var con = new SqlConnection("Data Source=DESKTOP-UHLGPSV;Initial Catalog=sample;Integrated Security=True"))
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
            string color = lea.AreaColor;

            if (area != null)
            {
                // DB接続
                //using (var con = new SqlConnection("Data Source=DESKTOP-UHLGPSV;Initial Catalog=sample;Integrated Security=True"))
                using (var con = new SqlConnection("Data Source =DESKTOP-9VE6279\\SQLEXPRESS; Initial Catalog= sample; Integrated Security=True"))
                using (var command = con.CreateCommand())
                {
                    try
                    {
                        con.Open();
                        command.CommandText = @"INSERT INTO m_leafletInfo(latitude, longitude, area_name, color)VALUES(@latitude, @longitude, @area_name, @color)";

                        // 緯度と経度の値をセット
                        command.Parameters.Add(new SqlParameter("@latitude", lat));
                        command.Parameters.Add(new SqlParameter("@longitude", longi));
                        command.Parameters.Add(new SqlParameter("@area_name", area));
                        command.Parameters.Add(new SqlParameter("@color", color));

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

        //[HttpPost]
        //public ActionResult Test([FromBody] TestModel test)
        //{
        //    string latli = test.Latitude;
        //    string longits = test.Longitude;
        //    string arean = test.AreaName;
        //    string color = test.AreaColor;

        //    // insert文のpolygonの中の値を、=>スペースに変換する必要があるかもしれない
        //    string latl = latli.Replace(",", " ");
        //    string longit = longits.Replace(",", " ");

        //    if (arean != null)
        //    {
        //        // DB接続
        //        using (var con = new SqlConnection("Data Source=DESKTOP-UHLGPSV;Initial Catalog=sample;Integrated Security=True"))
        //        using (var command = con.CreateCommand())
        //        {
        //            try
        //            { 
        //                con.Open();
        //                //command.CommandText = @"INSERT INTO m_leaflet(latlngs, area_name, color)VALUES(geometry::STPolyFromText('POLYGON('+cast((@latlngs) as varchar)+''+ cast((@latlngss) as varchar)+')', 0), @area_name, @color)";
        //                command.CommandText = @"INSERT INTO m_leaflet(latlngs, area_name, color)VALUES(geometry::STPolyFromText('POLYGON ((35.6682750269396 139.4777575135231, 35.555 135.632, 35.6682750269396 139.4777575135231, 35.6682750269396 139.4777575135231))', 0), @area_name, @color)";
        //                // 緯度と経度の値をセット
        //                command.Parameters.Add(new SqlParameter("@latlngs", latl));
        //                command.Parameters.Add(new SqlParameter("@latlngss", longit));
        //                command.Parameters.Add(new SqlParameter("@area_name", arean));
        //                command.Parameters.Add(new SqlParameter("@color", color));

        //                command.ExecuteNonQuery();

        //                return Json("success");
        //            }
        //            catch (Exception e)
        //            {
        //                Console.WriteLine(e);
        //                throw;
        //            }
        //            finally
        //            {
        //                con.Close();
        //            }
        //        }
        //    }
        //    return Json("error");
        //}

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
