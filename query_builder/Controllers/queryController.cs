using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Npgsql;
using query_builder.Models;
using SQLQuerybuilder.Models;



// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace query_builder.Controllers
{
    public class QueryController : Controller
    {
        // GET: /<controller>/
        public IActionResult Builder()
        {
            Dictionary<string, List<Coloums>> vals = new Dictionary<string, List<Coloums>>();

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
                //List<Condition> userList = new List<Condition>();
                //userList.Add(new Condition { ColumnName = "salary", Operator = "<", Value = "1000" });
                //userList.Add(new Condition { ColumnName = "rajz", Operator = "="});
                //userList.Add(new Condition { ColumnName = "salary", Operator = ">", Value = "4000" });

                ConditionGroup cg = new ConditionGroup();
                cg.Add(new Condition { ColumnName = "salary", Operator = "<", Value = "1000" });
                cg.Add(new Condition { ColumnName = "rajz", Operator = "=" });
                cg.Add(new Condition { ColumnName = "salary", Operator = ">", Value = "4000" });
                cg.InternalAndOrOr = "AND";
                cg.ExternalAndOrOr = "AND";

                ConditionGroup cg1 = new ConditionGroup();
                cg1.Add(new Condition { ColumnName = "salary", Operator = "<", Value = "1000" });
                cg1.Add(new Condition { ColumnName = "rajz", Operator = "=" });
                cg1.Add(new Condition { ColumnName = "salary", Operator = ">", Value = "4000" });
                cg1.InternalAndOrOr = "OR";
               
                WhereCollection where = new WhereCollection();
                where.Add(cg);
                where.Add(cg1);
                var x = where.GetWhereCondition();

                con.Close();
            }
            string json = JsonConvert.SerializeObject(vals, Formatting.Indented);
            ViewBag.text = "col";
            ViewBag.dict = json;
            return View();
        }
    }
}
 
    



