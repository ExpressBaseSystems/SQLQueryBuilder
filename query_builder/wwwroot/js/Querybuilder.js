var QueryBuilder = function (object) {
    this.TableSchema = object;

    this.appendTableNames = function () {
        for (var key in this.TableSchema) {
            $("#tables-cont").append(`<li>${key}</li>`);
        }
    }

    this.init = function () {
        this.appendTableNames();
    };
    this.init();
}