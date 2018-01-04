using System;
using System.Collections.Generic;
using System.Linq;

using System.Threading.Tasks;

namespace SQLQuerybuilder.Models
{
    public class Coloums
    {
      

        public string cname { set; get; }

        public string type { set; get; }

        public string constraints { set; get; }

        public string foreign_tnm { set; get; }

        public string foreign_cnm { set; get; }
    }
}
