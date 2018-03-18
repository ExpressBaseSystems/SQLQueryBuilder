using System;
using System.Collections.Generic;
using System.Linq;

using System.Threading.Tasks;

namespace SQLQuerybuilder.Models
{
    public class Coloums
    {
        public string cname { get; set; }

        public string type { get; set; }

        public string constraints { get; set; }

        public string foreign_tnm { get; set; }

        public string foreign_cnm { get; set; }
    }

    public class QueryObject 
    {
       public string FName { get; set; }
       public string Fdate { get; set; }
       public string QueryString { get; set; }
       public ConditionGroup Conditions { get; set; }
       public List<tables>  TableCollection { get; set; }

    };

    public class tables 
    {  
        public string id { get; set; }
        public string tableName { get; set; }
        public List<string> columns { get; set; }
        public string aliasName { get; set; }
    };

   public class ConditionGroup
   {  
        public string id { get; set; }
        public string noperator { get; set; }
        public List<ConditionGroup> ConditionGroup_Coll { get; set; }
        public List<Condition> Condition_Coll  { get; set; }
    };

    public class Condition 
        {
        public string id { get; set; }
        public string condTabName { get; set; }
        public string CName{ get; set; }
        public string Operator { get; set; }
        public string Value{ get; set; }
    };

    //public class whereClause
    //{
    //    ConditionGroup WHEREclouseQ { set; get; }
    //}

    public class saveClass
    {
        public int fid { get; set; }

        public string fname { get; set; }

        public DateTime fdate { get; set; }
    }

    //public class WhereCollection : List<ConditionGroup>
    //{
    //    public string GetWhereCondition()
    //    {
    //        string _whereClause = "(";
    //        int pos = 0;

    //        foreach (ConditionGroup cgroup in this)
    //        {
    //            _whereClause += cgroup.GetClause((pos == this.Count));
    //            pos++;
    //        }

    //        return _whereClause + ")";

    //    }
    //}

    //public class ConditionGroup : List<Condition>
    //{
    //    public string InternalAndOrOr { get; set; }

    //    public string ExternalAndOrOr { get; set; }

    //    public string GetClause(bool isLast)


    //    {
    //        string _clause = "(";
    //        int pos = 1;
    //        foreach (Condition c in this)
    //        {
    //            _clause += string.Format("{0} {1} {2}", c.ColumnName, c.Operator, c.Value) + ((pos != this.Count) ? this.InternalAndOrOr : ")");
    //            pos++;
    //        }

    //        return _clause + ((!isLast) ? this.ExternalAndOrOr : ")");
    //    }
    //}

    //public class Condition
    //{
    //    public string ColumnName { get; set; }
    //    public string Operator { get; set; }
    //    public string Value { get; set; }

    //}

}
