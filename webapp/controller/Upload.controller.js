sap.ui.define([
	"sap/ui/core/mvc/Controller"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller) {
		"use strict";

		return Controller.extend("upload.controller.Upload", {
			onInit: function () {
				this.initialization();
			},

			initialization: function () {
				this.getView().byId("page").addContent(new sap.m.VBox({
					items: [new sap.m.Panel({
						id: "header", headerText: "uploader", content: [new sap.m.upload.UploadSet({
							afterItemAdded: function (oEvent) {
								let oFile = oEvent.getParameter("item").getFileObject();
								if (oFile) {
									var reader = new FileReader();
									reader.onload = function (evt) {
										this.csvJSON(evt.target.result);
									}.bind(this);
									reader.readAsText(oFile);
								}
							}.bind(this)
						})]
					}), new sap.m.Panel({ id: "body", content: [new sap.m.Table({ id: "idTable" })] })
					]
				}));
			},

			csvJSON: function (csv) {
				let lines = csv.split("\n");
				let result = [];
				let headers = lines[1].split(";");
				for (let i = 2; i < lines.length; i++) {
					let obj = {};
					let currentline = lines[i].split(";");
					for (let j = 0; j < headers.length; j++) {
						obj[headers[j]] = currentline[j];
					}
					result.push(obj);
				}
				let oStringResult = JSON.stringify(result);
				let oFinalResult = JSON.parse(oStringResult.replace(/\\r/g, ""));

				this.buildTable(lines[0].split(";")[0], oFinalResult);
			},

			buildTable: function (sSource, oModel) {
				sap.ui.getCore().byId("body").setHeaderText("Tabela: " + sSource);
				let oTable = sap.ui.getCore().byId("idTable");
				let aTemplate = [];

				for (let [key, value] of Object.entries(oModel[1])) {
					oTable.addColumn(new sap.m.Column({ header: new sap.m.Label({ text: key }) }));
					aTemplate.push(new sap.m.Text({ text: "{" + key + "}" }))
				}

				oTable.setModel(new sap.ui.model.json.JSONModel(oModel));
				oTable.bindAggregation("items", { path: "/", template: new sap.m.ColumnListItem({ cells: aTemplate }) });
			}
		});
	});
