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

    public class WhereCollection : List<ConditionGroup>
    {
        public string GetWhereCondition()
        {
            string _whereClause = "(";
            int pos = 0;

            foreach (ConditionGroup cgroup in this)
            {
                _whereClause += cgroup.GetClause((pos == this.Count));
                pos++;
            }

            return _whereClause + ")";

        }
    }

    public class ConditionGroup : List<Condition>
    {
        public string InternalAndOrOr { get; set; }

        public string ExternalAndOrOr { get; set; }

        public string GetClause(bool isLast)


        {
            string _clause = "(";
            int pos = 1;
            foreach (Condition c in this)
            {
                _clause += string.Format("{0} {1} {2}", c.ColumnName, c.Operator, c.Value) + ((pos != this.Count) ? this.InternalAndOrOr : ")");
                pos++;
            }

            return _clause + ((!isLast) ? this.ExternalAndOrOr : ")");
        }
    }

    public class Condition
    {
        public string ColumnName { get; set; }
        public string Operator { get; set; }
        public string Value { get; set; }

    }

}
