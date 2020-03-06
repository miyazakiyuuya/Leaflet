using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Leaflet.Models
{
    public class LeafletModel
    {
        public string name { get; set; }
        public string latitude { get; set; }
        public string longitude { get; set; }

        public LeafletModel()
        {
            name = "sss";
            latitude = "緯度";
            longitude = "経度";
        }
    }
}
