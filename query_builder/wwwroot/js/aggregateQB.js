var SqlAggregate = function ()
{
    this.integer = ["SUM", "AVG", "MIN", "MAX", "COUNT"];
    this.date = ["COUNT", "MIN", "MAX"];
    this.real = ["SUM", "AVG", "MIN", "MAX", "COUNT"];
    this.text = ["COUNT"];
    this.time = ["MIN", "MAX"];
    this.AggregatePane = $(".AggregatePane");
    this.aggr_group = $(".aggr_group");
    this.IdCounters = {
        TableCount: 0
    }
    this.aggrfn = {
        value: "",
        colName: ""
    };
    this.makeDroppable = function ()
    {
        $(".dragables").draggable({
            revert: "invalid",
            helper: "clone",
            appendTo: "body"
        });
        $(".agrt_group").droppable({
            accept: ".dragables",
            drop: this.onaggregateDropFn.bind(this)
        });
    };
    this.onaggregateDropFn = function (event, ui)
    {
        this.droploc = $(event.target);
        this.dropObj = $(ui.draggable);

        this.columnName = $(ui.draggable).attr('colname');
        this.datatype = $(ui.draggable).attr('datatype')
        this.objId = this.columnName + this.IdCounters["TableCount"]++;

        this.droploc.append(`<form><div class="agrt_cond" id=${this.objId} style="left:8px;position:relative">
                                        <div class="col-sm-4">${this.columnName}</div>
                                         <div class="col-sm-5"><select class="form-control" id="aggr" aria-label="Aggregate"></select></div>
                                          <div class="col-sm-3 btn-group pull-right rule-actions" ><button type="button" class="btn btn-xs btn-danger" onclick="$('#${this.objId}').remove()"><i class="glyphicon glyphicon-remove"></i> Delete</button></div>
                                   </form></div>`);
        this.datatype_check(this.objId);
        this.aggrfn.value = $("#aggr option:selected").text();
        this.aggrfn.colName = this.columnName;

    };

    this.datatype_check = function ($id) {
        if (this.datatype == "text") {
            this.loopcheckaggr(this.text, $id);
        }
        else if (this.datatype == "date") {
            this.loopcheckaggr(this.date, $id);
        }
        else if (this.datatype == "real") {
            this.loopcheckaggr(this.real, $id);
        }
        else if (this.datatype == "integer") {
            this.loopcheckaggr(this.integer, $id);
        }
        else if (this.datatype == "time") {
            this.loopcheckaggr(this.time, $id);
        }
    }
    this.loopcheckaggr = function (arry, $id) {
        for (i = 0; i < arry.length; i++) {
            $("#" + $id + " select").append(`<option value="equal">${arry[i]}</option>`);
        }

    }
    this.init = function ()
    {
         this.makeDroppable();
    }
    this.init()
};