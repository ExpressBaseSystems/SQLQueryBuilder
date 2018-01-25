var SqlWhereCondition = function () {

    this.numeric = ["<", ">", "<=", ">=", "=", "!=", "BETWEEN"];
    this.date = ["=", "!="];
    this.integer = ["<", ">", "<=", ">=", "=", "!=", "BETWEEN"];
    this.real = ["<", ">", "<=", ">=", "=", "!="];
    this.text = ["=", "!="];
    this.boolean = ["=", "=!"];
    this.time = ["=", "=!"];
    this.ConditionPane = $(".ConditionPane");
    this.where_cond_grp = $(".where_cond_grp")
    this.IdCounters = {
        TableCount: 0
    }
    this.MlayerDrop = {
        state: {
            dropAction: function () { },
            dropTimer: null
        },
        registerDrop: function (cb) {
            this.MlayerDrop.state.dropAction = cb;
            if (this.MlayerDrop.state.dropTimer) {
                clearTimeout(this.MlayerDrop.state.dropTimer);
            }
            this.MlayerDrop.state.dropTimer = setTimeout(function () {
                this.MlayerDrop.state.dropAction();
            }.bind(this), 2);
        }.bind(this)
    };
    this.makeDroppable = function ()
    {
        $(".dragables").draggable({
            revert: "invalid",
            helper: "clone",
            appendTo: "body"
        });
        this.ConditionPane.droppable({
            accept: ".dragables",
            drop: this.onwhereDropFn.bind(this)
        });
    };
    this.onwhereDropFn = function (event, ui)
    {
        this.droploc = $(event.target);
        this.dropObj = $(ui.draggable);
        this.left = event.pageX - this.droploc.offset().left;
        this.top = event.pageY - this.droploc.offset().top;       
            this.MlayerDrop.registerDrop(function () {             
                if (this.droploc.hasClass("ConditionPane")) {
                    this.columnName = $(ui.draggable).attr('colname');
                    this.datatype = $(ui.draggable).attr('dtp')
                    this.objId = this.columnName + this.IdCounters["TableCount"]++;
                    this.conditionGroup();
                }
                else {
                    this.columnName = $(ui.draggable).attr('colname');
                    this.datatype = $(ui.draggable).attr('dtp')
                    this.condition();
                }                
            }.bind(this)); 
    };
    this.conditionGroup = function ()
    {
        if (this.datatype == "text") {
            this.droploc.append(`<div class="where_cond_grp" id="${this.objId}"><div class="where_cond" style="position:relative">${this.columnName}<select id="achu1" aria-label="Aggregate"></select><input id="myText" type="text" /></div></div>`);
            for (i = 0; i < this.text.length; i++) {
                $(".where_cond select").append(`<option value="equal">${this.text[i]}</option>`);
            }
      
        }
        else if (this.datatype == "integer") {
            this.droploc.append(`<div class="where_cond_grp" id="${this.objId}"><div class="where_cond" style="position:relative">${this.columnName}<select id="achu1" aria-label="Aggregate"></select><input id="myText" type="text" /></div></div>`);
            for (i = 0; i < this.integer.length; i++) {
                $(".where_cond select").append(`<option value="equal">${this.integer[i]}</option>`);
            }
        }
        else if (this.datatype == "numeric") {
            this.droploc.append(`<div class="where_cond_grp" id="${this.objId}"><div class="where_cond" style="position:relative">${this.columnName}<select id="achu1" aria-label="Aggregate"></select><input id="myText" type="text" /></div></div>`);
            for (i = 0; i < this.numeric.length; i++) {
                $(".where_cond select").append(`<option value="equal">${this.numeric[i]}</option>`);
            }
        }
        else if (this.datatype == "date") {
            this.droploc.append(`<div class="where_cond_grp" id="${this.objId}"><div class="where_cond" style="position:relative">${this.columnName}<select id="achu1" aria-label="Aggregate"></select><input id="myText" type="text" /></div></div>`);
            for (i = 0; i < this.date.length; i++) {
                $(".where_cond select").append(`<option value="equal">${this.date[i]}</option>`);
            }
        }

        else if (this.datatype == "serial") {
            this.droploc.append(`<div class="where_cond_grp" id="${this.objId}"><div class="where_cond" style="position:relative">${this.columnName}<select id="achu1" aria-label="Aggregate"></select><input id="myText" type="text" /></div></div>`);
            for (i = 0; i < this.serial.length; i++) {
                $(".where_cond select").append(`<option value="equal">${this.serial[i]}</option>`);
            }
        }
        else if (this.datatype == "real") {
            this.droploc.append(`<div class="where_cond_grp" id="${this.objId}"><div class="where_cond" style="position:relative">${this.columnName}<select id="achu1" aria-label="Aggregate"></select><input id="myText" type="text" /></div></div>`);
            for (i = 0; i < this.real.length; i++) {
                $(".where_cond select").append(`<option value="equal">${this.real[i]}</option>`);
            }
        }
        else if (this.datatype == "boolean") {
            this.droploc.append(`<div class="where_cond_grp" id="${this.objId}"><div class="where_cond" style="position:relative">${this.columnName}<select id="achu1" aria-label="Aggregate"></select><input id="myText" type="text" /></div></div>`);
            for (i = 0; i < this.boolean.length; i++) {
                $(".where_cond select").append(`<option value="equal">${this.boolean[i]}</option>`);
            }
        }
        else if (this.datatype == "time") {
            this.droploc.append(`<div class="where_cond_grp" id="${this.objId}"><div class="where_cond" style="position:relative">${this.columnName}<select id="achu1" aria-label="Aggregate"></select><input id="myText" type="text" /></div></div>`);
            for (i = 0; i < this.time.length; i++) {
                $(".where_cond select").append(`<option value="equal">${this.time[i]}</option>`);
            }
        }
        $(".where_cond").draggable();
        $("#" + this.objId).droppable({accept: ".dragables", drop: this.onwhereDropFn.bind(this) });

    }
    this.condition = function ()
    {
        if (this.datatype == "text") {
            this.droploc.append(`<div class="where_cond_cond" style="position:relative">${this.columnName}<select id="achu1" aria-label="Aggregate"></select><input id="myText" type="text" /></div>`);
            for (i = 0; i < this.text.length; i++) {
                $(".where_cond_cond select").append(`<option value="equal">${this.text[i]}</option>`);
            }

        }
        else if (this.datatype == "integer") {
            this.droploc.append(`<div class="where_cond_cond" style="position:relative">${this.columnName}<select id="achu1" aria-label="Aggregate"></select><input id="myText" type="text" /></div>`);
            for (i = 0; i < this.integer.length; i++) {
                $(".where_cond_cond select").append(`<option value="equal">${this.integer[i]}</option>`);
            }
        }
        else if (this.datatype == "numeric") {
            this.droploc.append(`<div class="where_cond_cond" style="position:relative">${this.columnName}<select id="achu1" aria-label="Aggregate"></select><input id="myText" type="text" /></div>`);
            for (i = 0; i < this.numeric.length; i++) {
                $(".where_cond_cond select").append(`<option value="equal">${this.numeric[i]}</option>`);
            }
        }
        else if (this.datatype == "date") {
            this.droploc.append(`<div class="where_cond_cond" style="position:relative">${this.columnName}<select id="achu1" aria-label="Aggregate"></select><input id="myText" type="text" /></div>`);
            for (i = 0; i < this.date.length; i++) {
                $(".where_cond_cond select").append(`<option value="equal">${this.date[i]}</option>`);
            }
        }

        else if (this.datatype == "serial") {
            this.droploc.append(`<div class="where_cond_cond" style="position:relative">${this.columnName}<select id="achu1" aria-label="Aggregate"></select><input id="myText" type="text" /></div>`);
            for (i = 0; i < this.serial.length; i++) {
                $(".where_cond_cond select").append(`<option value="equal">${this.serial[i]}</option>`);
            }
        }
        else if (this.datatype == "real") {
            this.droploc.append(`<div class="where_cond_cond" style="position:relative">${this.columnName}<select id="achu1" aria-label="Aggregate"></select><input id="myText" type="text" /></div>`);
            for (i = 0; i < this.real.length; i++) {
                $(".where_cond_cond select").append(`<option value="equal">${this.real[i]}</option>`);
            }
        }
        else if (this.datatype == "boolean") {
            this.droploc.append(`<div class="where_cond_cond" style="position:relative">${this.columnName}<select id="achu1" aria-label="Aggregate"></select><input id="myText" type="text" /></div>`);
            for (i = 0; i < this.boolean.length; i++) {
                $(".where_cond_cond select").append(`<option value="equal">${this.boolean[i]}</option>`);
            }
        }
        else if (this.datatype == "time") {
            this.droploc.append(`<div class="where_cond_cond" style="position:relative">${this.columnName}<select id="achu1" aria-label="Aggregate"></select><input id="myText" type="text" /></div>`);
            for (i = 0; i < this.time.length; i++) {
                $(".where_cond_cond select").append(`<option value="equal">${this.time[i]}</option>`);
            }
        }

    }
    this.init = function () {
        //this.makeDroppable();
    };
    this.init()
};