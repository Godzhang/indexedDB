window.onload = function(){
	window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
	window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

	function $(id){
		return document.getElementById(id);
	}

	const db_name = 'mydb';
	var db_version = 1;
	const db_store_name = 'dbstore';
	//按钮
	const add = $("add");
	const show = $("show");
	const find = $("find");
	const findValue = $("findValue");
	const findAsName = $("findAsName");
	const delbtn = $("delbtn");
	const clear = $("clear");
	const findRange = $("findRange");
	const createDatabase = $("createDatabase");
	const deleteDatabase = $("deleteDatabase");
	//输入框
	var name = $("name");
	var age = $("age");
	var delname = $("delname");
	var startId = $("startId");
	var findname = $("findname");
	var endId = $("endId");
	var note = $("note");
	var db;

	//数据库创建与删除方法
	function createIndexedDB(){
		note.innerHTML = "";
		var openRequest = indexedDB.open(db_name, db_version);
		openRequest.onerror = function(event){
			console.log("fail to open: " + event.target.errorCode);
		};
		openRequest.onsuccess = function(event){
			note.innerHTML = "indexedDB success created, version: " + db_version;
			db = this.result;
		};
		openRequest.onupgradeneeded = function(event){
			var store = event.target.result.createObjectStore(db_store_name, {keyPath: 'id', autoIncrement: true});
			//创建索引
			store.createIndex('name', 'name', {unique: false});
		}
	}
	// function deleteIndexedDB(){
	// 	note.innerHTML = "";
	// 	var deleteDbRequest = indexedDB.deleteDatabase(db_name);
	// 	deleteDbRequest.onerror = function(event){
	// 		note.innerHTML = "fail to deleteDatabase: " + event.target.errorCode;
	// 	}
	// 	deleteDbRequest.onsuccess = function(event){
	// 		note.innerHTML = "deleteDatabase successed";
	// 	}
	// }
	

	//初始化数据库
	createIndexedDB();

	//添加数据
	function addInfo(nameVal, ageVal){
		var transaction = db.transaction(db_store_name, 'readwrite');
		var store = transaction.objectStore(db_store_name);
		var req = store.add({name: nameVal, age: ageVal});
		req.onerror = function(event){
			console.log("fail to addInfo: " + event.target.errorCode);
		}
		req.onsuccess = function(event){
			note.innerHTML = "success add";
			name.value = "";
			age.value = "";
			name.focus();
		}
	}
	//信息展示,游标查询
	function showAll(){
		note.innerHTML = "";
		var transaction = db.transaction(db_store_name, 'readwrite');
		var store = transaction.objectStore(db_store_name);
		var req = store.openCursor();
		req.onerror = function(event){
			console.log("fail to showAll: " + event.target.errorCode);
		}
		req.onsuccess = function(event){
			var cursor = event.target.result;
			if(cursor){
				var elem = document.createElement("div");
				elem.appendChild(document.createTextNode(cursor.key + " : [" + cursor.value.name + "-" + cursor.value.age + "]"));
				note.appendChild(elem);
				cursor.continue();
			}else{
				console.log("done");
			}
		}
	}
	//更新个别记录
	function updateNewValue(value, password){

	}
	//查找
	function findInfo(id){
		note.innerHTML = "";
		var transaction = db.transaction(db_store_name, 'readwrite');
		var store = transaction.objectStore(db_store_name);
		var req = store.get(id);
		req.onerror = function(event){
			note.innerHTML = "fail to findKey: " + event.target.errorCode;
		}
		req.onsuccess = function(event){
			var result = event.target.result;
			if(!result){
				note.innerHTML = "not found " + id;
				return
			}
			var elem = document.createElement("div");
			elem.appendChild(document.createTextNode(id + " : " + result.name + "-" + result.age));
			note.appendChild(elem);
		}
	}
	//删除一项
	function deleteInfo(name){
		note.innerHTML = "";
		var transaction = db.transaction(db_store_name, 'readwrite');
		var store = transaction.objectStore(db_store_name);
		var getReq = store.get(name);
		getReq.onerror = function(event){
			note.innerHTML = "fail to findKey: " + event.target.errorCode;
		}
		getReq.onsuccess = function(event){
			var result = event.target.result;
			if(!result){
				note.innerHTML = "not found " + name;
				return
			}
			var delReq = store.delete(name);
			delReq.onerror = function(event){
				note.innerHTML = "fail to deleleInfo: " + event.target.errorCode;
			}
			delReq.onsuccess = function(event){
				note.innerHTML = "success delete";
			}
		}
		
	}
	//删除全部数据
	function clearAll(){
		note.innerHTML = "";
		var transaction = db.transaction(db_store_name, 'readwrite');
		var store = transaction.objectStore(db_store_name);
		var req = store.clear();
		req.onerror = function(event){
			note.innerHTML = "fail to clear: " + event.target.errorCode;
		}
		req.onsuccess = function(event){
			note.innerHTML = "success clear";
		}
	}
	//范围查找,键范围
	function findRangeInfo(start, end){
		note.innerHTML = "";
		var transaction = db.transaction(db_store_name, 'readwrite');
		var store = transaction.objectStore(db_store_name);
		var range = IDBKeyRange.bound(start, end, false, false);
		var req = store.openCursor(range);
		req.onerror = function(event){
			note.innerHTML = "fail to findRangeInfo" + event.target.errorCode;
		}
		req.onsuccess = function(event){
			var cursor = event.target.result;
			if(cursor){
				var elem = document.createElement("div");
				elem.appendChild(document.createTextNode(cursor.key + " : [" + cursor.value.name + "-" + cursor.value.age + "]"));
				note.appendChild(elem);
				cursor.continue();
			}else{
				console.log("done");
			}
		}
	}
	//索引查询
	function handleAsName(name){
		note.innerHTML = "";
		var transaction = db.transaction(db_store_name);
		var store = transaction.objectStore(db_store_name);
		var index = store.index("name");
		var range = IDBKeyRange.only(name);
		index.openCursor(range).onsuccess = function(event){
			var cursor = event.target.result;
			if(cursor){
				if(cursor.key == name){
					var elem = document.createElement("div");
					elem.appendChild(document.createTextNode(cursor.value.id + " : [" + cursor.key + "-" + cursor.value.age + "]"));
					note.appendChild(elem);
					cursor.continue();
				}
			}else{
				console.log("done");
			}
		}
	}

	findAsName.onclick = function(){
		var findnameVal = findname.value;
		if(!findnameVal) return;
		handleAsName(findnameVal);
	};
	findRange.onclick = function(){
		var startVal = Number(startId.value);
		var endVal = Number(endId.value);
		if(!startVal || !endVal) return;
		findRangeInfo(startVal, endVal);
	}

	clear.onclick = function(){
		var bol = confirm('确定要清空数据库吗？');
		if(bol){
			clearAll();
		}		
	}
	delbtn.onclick = function(){
		var delKey = Number(delname.value);
		if(!delKey) return;
		deleteInfo(delKey);
	}
	findValue.onclick = function(){
		var nameKey = Number(find.value);
		if(!name) return;
		findInfo(nameKey);
	}
	show.onclick = function(){
		showAll();
	}
	add.onclick = function(){
		var nameVal = name.value;
		var ageVal = age.value;

		if(!nameVal || !ageVal) return;
		addInfo(nameVal, ageVal);
	}
	// deleteDatabase.onclick = function(){
	// 	deleteIndexedDB();
	// }
	createDatabase.onclick = function(){
		db_version++;
		createIndexedDB();
	}
}
