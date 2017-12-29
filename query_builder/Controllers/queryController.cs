using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Npgsql;



// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace query_builder.Controllers
{
    public class queryController : Controller
    {



        // GET: /<controller>/
        public IActionResult home()
        {
            using (var con = new NpgsqlConnection("Host=localhost; Port=5432; Database=college; Username=postgres; Password=raju@94; CommandTimeout=500;"))
            {
                DataTable dt = new DataTable();
                con.Open();
                //var cmd = new NpgsqlCommand("INSERT INTO student(stud_name,stud_id)VALUES('rajesh','001'", con);
                NpgsqlCommand cmd = new NpgsqlCommand(@"select A.column_name,A.data_type, B.table_name
                                        from information_schema.columns  A,information_schema.tables B
                                        where A.table_name = B.table_name
                                        AND B.table_schema='public'
                                        AND B.table_type='BASE TABLE'", con);
                
                NpgsqlDataAdapter adp = new NpgsqlDataAdapter(cmd);
                adp.Fill(dt);
                Console.WriteLine("connection established");
                foreach (DataRow dr in dt.Rows)
                {
                    string name = dr.ItemArray[2].ToString();
                }
                con.Close();
            }


            return View();

        }

    }
}


