using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Npgsql;
//using query_builder.Models;
using SQLQuerybuilder.Models;



// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace query_builder.Controllers
{
    public class QBController : Controller
    {
        // GET: /<controller>/
        [HttpGet]
        public IActionResult QueryBuilder(int objid)
        {
            Dictionary<string, List<Coloums>> vals = new Dictionary<string, List<Coloums>>();
            DataTable dts = new DataTable();

            using (var con = new NpgsqlConnection("Host=localhost; Port=5432; Database=college; Username=postgres; Password=raju@94; CommandTimeout=500;"))
            {
                DataTable dt = new DataTable();
                con.Open();
                NpgsqlCommand cmd = new NpgsqlCommand(@"
               SELECT 
		            ACols.*,
    	            BCols.foreign_table_name,
                    BCols.foreign_column_name 
	           FROM
                    (SELECT 
                        TCols.*, CCols.constraint_type FROM
                            (SELECT
    	                        T.table_name, C.column_name, C.data_type
                            FROM 
                                information_schema.tables T,
	                            information_schema.columns C
                            WHERE
	                             T.table_name = C.table_name AND
                                 T.table_schema='public') TCols
                            LEFT JOIN
                            (SELECT 
 	                             TC.table_name,TC.constraint_type,KCU.column_name 
                             FROM
	                             information_schema.table_constraints TC,
 	                            information_schema.key_column_usage KCU
                             WHERE
 	                            TC.constraint_name=KCU.constraint_name AND
 	                            (TC.constraint_type = 'PRIMARY KEY' OR TC.constraint_type = 'FOREIGN KEY') AND
 	                            TC.table_schema='public') CCols
                             ON 
	                            CCols.table_name=TCols.table_name AND
                                CCols.column_name=TCols.column_name) ACols
	            LEFT JOIN
                        (SELECT
    	  		            tc.constraint_name, tc.table_name, kcu.column_name, 
    			            ccu.table_name AS foreign_table_name,
        		            ccu.column_name AS foreign_column_name 
			            FROM 
    					    information_schema.table_constraints AS tc 
        		        JOIN 
                 		    information_schema.key_column_usage AS kcu
                        ON 
                 		    tc.constraint_name = kcu.constraint_name
                    	JOIN  
                 		    information_schema.constraint_column_usage AS ccu
                        ON 
                 		    ccu.constraint_name = tc.constraint_name
                        WHERE 
                 		    constraint_type = 'FOREIGN KEY' AND tc.table_schema='public') BCols
	                    ON
    		                ACols.table_name=BCols.table_name AND  ACols.column_name=BCols.column_name
                ORDER BY
	                table_name, column_name", con);
                NpgsqlDataAdapter adp = new NpgsqlDataAdapter(cmd);
                adp.Fill(dt);
                Console.WriteLine("connection established");
                string key = "";
                foreach (DataRow dr in dt.Rows)
                {
                    key = dr["table_name"] as string;
                    if (!vals.ContainsKey(key))
                    {
                        key = dr["table_name"] as string;
                        var col = new Coloums()
                        {
                            cname = dr["column_name"] as string,
                            type = dr["data_type"] as string,
                            constraints = dr["constraint_type"] as string,
                            foreign_tnm = dr["foreign_table_name"] as string,
                            foreign_cnm = dr["foreign_column_name"] as string
                        };
                        List<Coloums> list = new List<Coloums>();
                        list.Add(col);
                        vals.Add(key, list);
                    }
                    else
                    {
                        var col = new Coloums()
                        {
                            cname = dr["column_name"] as string,
                            type = dr["data_type"] as string,
                            constraints = dr["constraint_type"] as string,
                            foreign_tnm = dr["foreign_table_name"] as string,
                            foreign_cnm = dr["foreign_column_name"] as string
                        };
                        vals[key].Add(col);
                    }

                }
                if (objid != 0)
                {
                    var sql = "select objects from save where id = @ids".Replace("@ids", objid.ToString());
                    NpgsqlCommand cmds = new NpgsqlCommand(sql, con);
                    NpgsqlDataAdapter adptr = new NpgsqlDataAdapter(cmds);
                    adptr.Fill(dts);
                }
                con.Close();
            }
            string json = JsonConvert.SerializeObject(vals, Formatting.Indented);
            if (objid != 0)
                ViewBag.text = dts.Rows[0]["objects"].ToString(); 
            else
                ViewBag.text =  "{}";
            ViewBag.dict = json;
            return View();
        }
        [HttpPost]
        public string selectClause(string Json, string Name)
        {
            //var req = HttpContext.Request.Form;
            //string name = req["Name"];
            //string json = req["Json"].ToString();
            using (var con = new NpgsqlConnection("Host=localhost; Port=5432; Database=college; Username=postgres; Password=raju@94; CommandTimeout=500;"))
            {
                con.Open();
                string sql = string.Format("INSERT INTO save(filename, date_created, objects)VALUES('{0}',now(),'{1}')", Name, Json);
                NpgsqlCommand cmd = new NpgsqlCommand(sql, con);
                var rsp =cmd.ExecuteNonQuery();

                con.Close();
            }

            return null;
        }
         [HttpGet]
        public IActionResult outerQueryBuilder()
        {
            List<saveClass> select = new List<saveClass>();
            using (var con = new NpgsqlConnection("Host=localhost; Port=5432; Database=college; Username=postgres; Password=raju@94; CommandTimeout=500;"))
            {
                DataTable dt = new DataTable();
                con.Open();
                NpgsqlCommand cmd = new NpgsqlCommand(@"SELECT * FROM save", con);
                NpgsqlDataAdapter adp = new NpgsqlDataAdapter(cmd);
                adp.Fill(dt);
              
                foreach (DataRow dr in dt.Rows)
                {
                    var save = new saveClass()
                    {
                        fid = Convert.ToInt32(dr["id"]),
                        fname = dr["filename"].ToString(),
                        fdate = Convert.ToDateTime(dr["date_created"]),
                    };
                   
                    select.Add(save);
                }
            }
            string json = JsonConvert.SerializeObject(select);
            ViewBag.savelist = json;
            return View();
        }

       
    }
}





